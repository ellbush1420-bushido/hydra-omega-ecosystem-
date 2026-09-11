#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const now = new Date().toISOString();
const results = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, status: 'healthy', checked_at: now, ...detail });
  } catch (error) {
    results.push({
      name,
      status: 'failed',
      checked_at: now,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function skipped(name, reason) {
  results.push({ name, status: 'skipped', checked_at: now, reason });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return { status_code: response.status, body };
}

// Public provider reachability. This is NOT account-auth verification.
await check('celebmaker_public_health', async () => {
  const { body, status_code } = await fetchJson('https://celebmakerai.com/api/v1/health', {
    headers: { 'content-type': 'application/json' },
  });
  return { status_code, provider_status: body?.status ?? 'unknown', provider_version: body?.version ?? null };
});

// Fanvue: actual authenticated read-only account test.
if (process.env.FANVUE_ACCESS_TOKEN) {
  await check('fanvue_authenticated_read', async () => {
    const { body, status_code } = await fetchJson('https://api.fanvue.com/users/me', {
      headers: {
        authorization: `Bearer ${process.env.FANVUE_ACCESS_TOKEN}`,
        'content-type': 'application/json',
        'x-fanvue-api-version': process.env.FANVUE_API_VERSION || '2025-06-26',
      },
    });
    return { status_code, principal_present: Boolean(body?.uuid || body?.id || body?.username) };
  });
} else {
  skipped('fanvue_authenticated_read', 'FANVUE_ACCESS_TOKEN is not available in this runtime');
}

// Telegram: authenticate the bot and inspect webhook configuration.
if (process.env.TELEGRAM_BOT_TOKEN) {
  const base = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  await check('telegram_getMe', async () => {
    const { body, status_code } = await fetchJson(`${base}/getMe`);
    if (!body?.ok) throw new Error('Telegram getMe returned ok=false');
    return { status_code, bot_id_present: Boolean(body?.result?.id), username: body?.result?.username ?? null };
  });
  await check('telegram_getWebhookInfo', async () => {
    const { body, status_code } = await fetchJson(`${base}/getWebhookInfo`);
    if (!body?.ok) throw new Error('Telegram getWebhookInfo returned ok=false');
    return {
      status_code,
      webhook_configured: Boolean(body?.result?.url),
      pending_update_count: body?.result?.pending_update_count ?? null,
      last_error_date: body?.result?.last_error_date ?? null,
    };
  });
} else {
  skipped('telegram_getMe', 'TELEGRAM_BOT_TOKEN is not available in this runtime');
  skipped('telegram_getWebhookInfo', 'TELEGRAM_BOT_TOKEN is not available in this runtime');
}

// TikTok: read creator and permission state; never publishes content.
if (process.env.TIKTOK_ACCESS_TOKEN) {
  await check('tiktok_creator_info', async () => {
    const { body, status_code } = await fetchJson('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
        'content-type': 'application/json; charset=UTF-8',
      },
      body: '{}',
    });
    if (body?.error?.code && body.error.code !== 'ok') {
      throw new Error(`TikTok error: ${body.error.code}: ${body.error.message ?? ''}`);
    }
    return {
      status_code,
      creator_present: Boolean(body?.data?.creator_username || body?.data?.creator_nickname),
      privacy_options: body?.data?.privacy_level_options ?? [],
    };
  });
} else {
  skipped('tiktok_creator_info', 'TIKTOK_ACCESS_TOKEN is not available in this runtime');
}

// CelebMakerAI: validate the bearer key without generating media.
if (process.env.CELEBMAKER_API_KEY) {
  await check('celebmaker_authenticated_read', async () => {
    const { body, status_code } = await fetchJson('https://celebmakerai.com/api/v1/me', {
      headers: {
        authorization: `Bearer ${process.env.CELEBMAKER_API_KEY}`,
        'content-type': 'application/json',
      },
    });
    return { status_code, principal_present: Boolean(body) };
  });
} else {
  skipped('celebmaker_authenticated_read', 'CELEBMAKER_API_KEY is not available in this runtime');
}

// Tumblr, Instagram, RM11, Candy.ai and OurDream.ai remain intentionally untested here
// until their exact authorized credentials and supported read-only endpoints are configured.
for (const name of ['tumblr_authenticated_read', 'instagram_authenticated_read', 'rm11_authenticated_read', 'candy_authenticated_read', 'ourdream_authenticated_read']) {
  skipped(name, 'No verified credential + read-only endpoint contract configured in this verifier');
}

const outDir = path.resolve('artifacts');
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, 'integration-health.json');
await fs.writeFile(outPath, `${JSON.stringify({ generated_at: now, results }, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ generated_at: now, results }, null, 2));

const failed = results.filter((item) => item.status === 'failed');
if (failed.length) process.exitCode = 1;
