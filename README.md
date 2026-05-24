# Hydra Omega Ecosystem (Mono-repo)

This repository is the primary mono-repo for the Hydra/Omega ecosystem.

## Projects

- `omega-hydra-app/` – React + Vite app
- `automatic-adventure/` – Preserved content from the former standalone repository
- `realm-of-5-crowns/` – Launch module docs
- `aurelian-os/` – Aurelian OS docs
- `Shadow Monastery/` – Doctrine, orders, engine notes
- `docs/canon/` – Canon registry and strategic signal layers
- `supabase/` – CEO Dashboard schema, policies, and seed files
- `scripts/` – Deployment, schema, worker, and health-check automation

## CEO Dashboard Ecosystem

The CEO Dashboard bundle includes:

- React/Vite dashboard app in `omega-hydra-app/`
- Supabase schema scaffold in `supabase/schema.sql`
- RLS scaffold in `supabase/policies.sql`
- Seed data in `supabase/seed.sql`
- CI workflow in `.github/workflows/ci.yml`
- Production deployment workflow in `.github/workflows/deploy.yml`
- Contributor rules in `CONTRIBUTING.md`
- Pull request and issue templates in `.github/`

## Development

### Environment setup

```sh
cp .env.example .env
```

Add local secrets to `.env`. Never commit real credentials.

### omega-hydra-app

```sh
cd omega-hydra-app
npm install
npm run lint
npm run build
```

### Rust / Cargo

The repo contains a minimal Rust workspace so GitHub Actions `cargo build/test`
jobs succeed even when the primary code is non-Rust.

```sh
cargo test --workspace
```

## Supabase

Review SQL files before applying them to production.

```sh
node scripts/run-schema.js
```

If `SUPABASE_DB_URL` is not set, the script validates that the SQL files exist and exits without applying changes.

## Worker Deployment

Configure worker deployment through the `WORKER_DEPLOY_COMMAND` secret or environment variable.

```sh
node scripts/deploy-worker.js
```

Run a health check with:

```sh
node scripts/health-check.js
```

## CI/CD

- Pull requests into `dev` or `main` run CI.
- Pushes to `main` run production deployment.
- Deployment order: build app, apply Supabase schema, deploy worker, run health check.

## Branch Strategy

- `main` — protected production branch.
- `dev` — protected integration branch.
- `feature/*` — feature work.
- `fix/*` — bug fixes.
- `infra/*` — infrastructure and deployment work.

Feature, fix, and infra branches should be created from `dev` and merged back into `dev` by pull request.

See `CONTRIBUTING.md` for full rules.
