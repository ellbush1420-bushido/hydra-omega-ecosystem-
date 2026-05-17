# Hydra Omega Ecosystem (Mono-repo)

This repository is the primary mono-repo for the Hydra/Omega ecosystem.

## Projects

- `omega-hydra-app/` – React + Vite app
- `apps/react-router-app/` – React Router v7 app (SSR, file-based routing, Tailwind CSS)
- `automatic-adventure/` – Preserved content from the former standalone repository
- `realm-of-5-crowns/` – Launch module docs
- `aurelian-os/` – Aurelian OS docs
- `Shadow Monastery/` – Doctrine, orders, engine notes

## Development

### apps/react-router-app

```sh
cd apps/react-router-app
npm install
npm run dev        # development server
npm run build      # production build
npm run typecheck  # TypeScript type-check
```

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
