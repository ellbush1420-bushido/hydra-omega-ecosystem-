# Hydra Zeta OS v2

Deployable shell for the Guardian defensive-awareness product spine. It intentionally begins with one valuable journey: **consented audit → score and prioritized findings → readiness report → remediation tracking → Monthly Guardian Watch**.

## Run

```bash
npm install
npm run dev
npm run build
docker compose up --build
```

## Configuration

Copy the product, routing, and public-safe copy in `data/` and `config/`. Put all provider secrets in the deployment environment—not source control. Keep the Supabase service key server-only. Apply `supabase/schema.sql` in an isolated project before enabling a provider.

## Guardrails

- Public clients receive sanitized catalog and report output only.
- Webhooks must verify a raw-body signature and enforce idempotency.
- Telemetry uses the append-only `hydra_eyes_events` schema; do not block customer requests on telemetry.
- Providers are adapters: provider failure queues/retries work and never grants access without a ledger record.
- The product scope is defensive, lawful, consent-based education and account/device hygiene.

See `docs/ARCHITECTURE-BRIEF.md` for the implementation checklist.
