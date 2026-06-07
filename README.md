# Hydra Omega Ecosystem (Mono-repo)

This repository is the primary mono-repo for the Hydra/Omega ecosystem.

## Projects

- `omega-hydra-app/` – React + Vite app
- `automatic-adventure/` – Preserved content from the former standalone repository
- `realm-of-5-crowns/` – Launch module docs
- `aurelian-os/` – Aurelian OS docs
- `Shadow Monastery/` – Doctrine, orders, engine notes

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
