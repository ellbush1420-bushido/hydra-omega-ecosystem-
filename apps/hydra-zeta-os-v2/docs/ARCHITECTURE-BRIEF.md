# Hydra Zeta OS v2: immediate architecture brief

## North star

Ship the Guardian client journey first. Treat Alpha and Zeta as supporting lanes; do not block the audit/report/Watch workflow on broader automation, lore, or marketplace integrations.

## Deployment boundaries

1. **Public edge:** Vite site, catalog, consented audit UI, sanitized reports. No service keys, secrets, raw webhooks, or private registries.
2. **Private application boundary:** server endpoints validate input, calculate scores, create reports, and issue time-limited delivery access.
3. **Vault and workers:** Supabase service-role calls, delivery worker, n8n, Discord, and payment-provider adapters. Only this boundary can write ledger, fulfillment, or immutable telemetry rows.

## Immediate implementation checklist

- [ ] Create a fresh Supabase project; apply `supabase/schema.sql`; keep RLS enabled.
- [ ] Add server-only environment variables for Supabase service key, provider webhook secrets, n8n, and Discord.
- [ ] Build the Guardian audit as a versioned questionnaire with explicit consent timestamp.
- [ ] Implement a pure score function that returns category scores, prioritized findings, and remediation tasks.
- [ ] Generate a client-safe readiness report; preserve the assessment version and evidence references.
- [ ] Route checkout webhooks through a single gateway: raw-body signature → schema validation → allowlist → idempotency insert → async worker.
- [ ] Make delivery state append-only. A worker, never the client, performs retryable Discord/n8n actions.
- [ ] Emit `hydra_eyes_events` asynchronously with `event_id`, source, correlation ID, and minimal properties.
- [ ] Add dead-letter visibility, alerting, and a manual replay control restricted to administrators.
- [ ] Test tenant isolation, duplicate webhook handling, invalid signatures, provider outage, revoked access, and report authorization before launch.

## Acceptance metrics

Measure: audit completion rate, report delivery time, remediation adoption, paid audit conversion, Monthly Guardian Watch renewal, webhook replay rate, and unfulfilled ledger age. Do not collect unnecessary behavioral data.
