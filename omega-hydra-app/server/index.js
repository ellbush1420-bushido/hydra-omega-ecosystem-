import express from 'express';

import { getServerConfig } from './config.js';
import { openDb, ensureSchema } from './db.js';
import { mapWhopProductToEntitlement } from './entitlements.js';
import { readManifest, computeS3Path, deliverToPrivateS3 } from './manifest.js';
import { normalizeWhopEvent, verifyWhopSignature } from './whop.js';

const config = getServerConfig();
const db = openDb(config.sqlitePath);
ensureSchema(db);

const app = express();

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/ledger/recent', (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, whop_event_id AS whopEventId, whop_member_id AS whopMemberId,
              whop_product_id AS whopProductId, tier, manifest_version AS manifestVersion,
              s3_path AS s3Path, status, error_message AS errorMessage, created_at AS createdAt
       FROM manifest_delivery_log
       ORDER BY id DESC
       LIMIT 50`
    )
    .all();
  res.json({ rows });
});

app.post(
  '/api/whop/webhook',
  express.raw({ type: '*/*', limit: '2mb' }),
  async (req, res) => {
    const rawBody = req.body?.toString('utf8') || '';
    const signature = req.header('x-whop-signature') || req.header('whop-signature');

    if (
      !verifyWhopSignature({ rawBody, signature, secret: config.whopWebhookSecret })
    ) {
      return res.status(401).json({ ok: false, error: 'invalid signature' });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ ok: false, error: 'invalid json' });
    }

    const event = normalizeWhopEvent(payload);
    if (!event?.userEmail) {
      return res.status(400).json({ ok: false, error: 'missing user email' });
    }

    const entitlement = mapWhopProductToEntitlement(event.whopProductId);
    if (!entitlement) {
      return res.status(400).json({ ok: false, error: 'missing product id' });
    }

    const now = new Date().toISOString();
    const metadata = {
      whop_event_id: event.eventId,
      whop_event_type: event.eventType,
      whop_member_id: event.whopMemberId,
      whop_product_id: event.whopProductId,
      tier: entitlement.tier,
      manifest_version: entitlement.manifestVersion,
    };

    const upsert = db.prepare(
      `INSERT INTO gate_entries
        (user_email, whop_member_id, whop_product_id, tier, manifest_version, metadata_json, created_at, updated_at)
       VALUES
        (@userEmail, @whopMemberId, @whopProductId, @tier, @manifestVersion, @metadataJson, @createdAt, @updatedAt)
       ON CONFLICT(user_email) DO UPDATE SET
        whop_member_id=excluded.whop_member_id,
        whop_product_id=excluded.whop_product_id,
        tier=excluded.tier,
        manifest_version=excluded.manifest_version,
        metadata_json=excluded.metadata_json,
        updated_at=excluded.updated_at
       RETURNING id`
    );

    const gateEntry = upsert.get({
      userEmail: event.userEmail,
      whopMemberId: event.whopMemberId,
      whopProductId: event.whopProductId,
      tier: entitlement.tier,
      manifestVersion: entitlement.manifestVersion,
      metadataJson: JSON.stringify(metadata),
      createdAt: now,
      updatedAt: now,
    });

    const delivery = {
      ok: false,
      s3Path: null,
      errorMessage: null,
    };

    try {
      const { json: manifest } = readManifest({
        manifestBasePath: config.manifestBasePath,
        manifestVersion: entitlement.manifestVersion,
      });
      const s3Path = computeS3Path({
        userEmail: event.userEmail,
        tier: entitlement.tier,
        manifestVersion: entitlement.manifestVersion,
      });
      await deliverToPrivateS3({ s3Path, manifest });
      delivery.ok = true;
      delivery.s3Path = s3Path;
    } catch (e) {
      delivery.errorMessage = e instanceof Error ? e.message : String(e);
    }

    db.prepare(
      `INSERT INTO manifest_delivery_log
        (gate_entry_id, whop_event_id, whop_member_id, whop_product_id, tier, manifest_version, s3_path, status, error_message, created_at)
       VALUES
        (@gateEntryId, @whopEventId, @whopMemberId, @whopProductId, @tier, @manifestVersion, @s3Path, @status, @errorMessage, @createdAt)`
    ).run({
      gateEntryId: gateEntry.id,
      whopEventId: event.eventId,
      whopMemberId: event.whopMemberId,
      whopProductId: event.whopProductId,
      tier: entitlement.tier,
      manifestVersion: entitlement.manifestVersion,
      s3Path: delivery.s3Path,
      status: delivery.ok ? 'success' : 'failure',
      errorMessage: delivery.errorMessage,
      createdAt: now,
    });

    res.json({
      ok: delivery.ok,
      gateEntryId: gateEntry.id,
      tier: entitlement.tier,
      manifestVersion: entitlement.manifestVersion,
      s3Path: delivery.s3Path,
      error: delivery.errorMessage,
    });
  }
);

app.listen(config.port, () => {
  console.log(`Hydra Whop bridge listening on :${config.port}`);
});
