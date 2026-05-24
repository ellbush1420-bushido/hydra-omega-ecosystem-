#!/usr/bin/env node

const https = require('node:https');
const http = require('node:http');

const healthUrl = process.env.HEALTH_CHECK_URL || process.env.WORKER_ENDPOINT;

if (!healthUrl) {
  console.log('No HEALTH_CHECK_URL or WORKER_ENDPOINT set. Skipping health check.');
  process.exit(0);
}

let url;
try {
  url = new URL(healthUrl);
} catch (error) {
  console.error(`Invalid health check URL: ${healthUrl}`);
  process.exit(1);
}

const client = url.protocol === 'http:' ? http : https;

const request = client.get(url, { timeout: 10000 }, (response) => {
  const { statusCode } = response;
  response.resume();

  if (statusCode >= 200 && statusCode < 400) {
    console.log(`Health check passed: ${statusCode}`);
    process.exit(0);
  }

  console.error(`Health check failed: ${statusCode}`);
  process.exit(1);
});

request.on('timeout', () => {
  request.destroy(new Error('Health check timed out.'));
});

request.on('error', (error) => {
  console.error(`Health check error: ${error.message}`);
  process.exit(1);
});
