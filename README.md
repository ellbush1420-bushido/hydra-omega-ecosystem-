# Hydra Omega Ecosystem (Mono-repo)

This repository is the primary mono-repo for the Hydra/Omega ecosystem.

## Projects

- `omega-hydra-app/` – React + Vite app
- `automatic-adventure/` – Preserved content from the former standalone repository
- `realm-of-5-crowns/` – Launch module docs
- `aurelian-os/` – Aurelian OS docs
- `Shadow Monastery/` – Doctrine, orders, engine notes

## Connected platform registry

- `config/integrations/connected-sites.json` – Machine-readable registry for Fanvue, Tumblr, RM11, Instagram, TikTok, Telegram, CelebMakerAI, Candy.ai, and OurDream.ai.
- `docs/integrations/connected-sites.md` – Roles, current platform metadata, security controls, verification states, health gates, and implementation order.
- `scripts/integrations/verify-connected-sites.mjs` – Read-only credentialed health checks for supported providers; writes `artifacts/integration-health.json` locally.
- `.github/workflows/integration-health.yml` – Manual GitHub Actions gate for the core read-only integration checks.

The registry records user-reported connections and documented provider capabilities separately from live health. Credentials, OAuth grants, webhook delivery, and production write permissions must be verified independently and must never be committed to the repository.

PR #65 should remain draft until required authenticated reads and signed-webhook tests are recorded as successful.

## OpenAI developer workflow reference

- `docs/operations/openai-developer-workflows.md` – Codex CLI workflows, ChatGPT Apps SDK, Agentic Commerce Protocol, Ads, and developer-mode routing notes.

## Development

### omega-hydra-app

```sh
cd omega-hydra-app
npm ci
npm run lint
npm run build
```

### Connected-site health checks

Run the read-only verifier with credentials supplied through the environment, never source control:

```sh
node scripts/integrations/verify-connected-sites.mjs
```

The script does not publish, message, change pricing, or create media. Missing credentials are reported as skipped rather than healthy.

### Rust / Cargo

The repo contains a minimal Rust workspace so GitHub Actions `cargo build/test`
jobs succeed even when the primary code is non-Rust.

```sh
cargo test --workspace
```
