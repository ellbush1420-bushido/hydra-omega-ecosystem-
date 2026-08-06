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
- `docs/integrations/connected-sites.md` – Roles, security controls, verification states, environment-variable conventions, and implementation order.

The registry records user-reported connections only. Credentials, OAuth grants, webhook access, and production write permissions must be verified separately and must never be committed to the repository.

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

### Rust / Cargo

The repo contains a minimal Rust workspace so GitHub Actions `cargo build/test`
jobs succeed even when the primary code is non-Rust.

```sh
cargo test --workspace
```
