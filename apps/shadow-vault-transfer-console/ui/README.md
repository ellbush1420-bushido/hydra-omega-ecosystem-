# Shadow Vault Transfer Console UI (Standalone)

Standalone command-center UI for the Shadow Vault Transfer Console spec, with an animated canvas “warp” background and a local encrypted **Black Lotus Vault** manager.

## Development

```sh
cd apps/shadow-vault-transfer-console/ui
npm install
npm run dev
```

## Build / Preview

```sh
cd apps/shadow-vault-transfer-console/ui
npm run lint
npm run build
npm run preview
```

## Notes

- The Black Lotus Vault is local-first and stored in this browser’s `localStorage` (encrypted via WebCrypto `AES-GCM` + `PBKDF2`).
- The passphrase is never persisted; if you lose it, the vault cannot be recovered.
