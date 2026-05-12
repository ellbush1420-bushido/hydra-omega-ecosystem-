import assert from 'node:assert/strict';
import test from 'node:test';
import { SAMPLE_BING_INGEST_URL } from '../src/constants/urlSamples.js';
import { ingestTrackingUrl } from '../src/utils/urlIngest.js';

test('ingestTrackingUrl resolves Bing base64 redirect payloads', () => {
  const result = ingestTrackingUrl(SAMPLE_BING_INGEST_URL);

  assert.equal(result.sourceHost, 'www.bing.com');
  assert.equal(result.destinationHost, 'www.genspark.ai');
  assert.equal(result.redirectDepth, 1);
  assert.equal(result.metadata.utm_source, 'bing');
  assert.equal(result.metadata.utm_medium, 'cpc-search');
  assert.equal(result.metadata.utm_campaign, 'us-competitor');
  assert.equal(result.metadata.utm_term, 'competitor');
  assert.equal(result.metadata.msclkid, 'b73629d959741e8f210743da304610c9');
});

test('ingestTrackingUrl rejects empty input', () => {
  assert.deepEqual(ingestTrackingUrl('   '), { error: 'URL input is empty.' });
});

test('ingestTrackingUrl rejects malformed urls', () => {
  assert.deepEqual(ingestTrackingUrl('not-a-url'), { error: 'Enter a valid absolute URL.' });
});

test('ingestTrackingUrl stops after the maximum redirect hop count', () => {
  let nestedUrl = 'https://final.example.com/path?utm_source=test';

  for (let index = 0; index < 6; index += 1) {
    nestedUrl = `https://redirect${index}.example.com/?url=${encodeURIComponent(nestedUrl)}`;
  }

  const result = ingestTrackingUrl(nestedUrl);

  assert.equal(result.redirectDepth, 5);
  assert.equal(result.destinationHost, 'redirect0.example.com');
});
