# Final Hydra Asset Merge Tooling

This toolchain implements the approved merge plan for `m4552fz28w-stack/final-hydra`.

## Run

```sh
# From the repository root:
node tools/asset-merge/merge-final-hydra-assets.mjs
```

Set `SOURCE_DATE_EPOCH` to a Unix timestamp when the generated metadata should
carry a specific build time. It defaults to `0`, so repeated runs against the
same source tree produce byte-for-byte identical artifacts.

## Outputs

All generated outputs are written to:

- `launch-assets/final-hydra/source_inventory_manifest.json`
- `launch-assets/final-hydra/dedupe_report.json`
- `launch-assets/final-hydra/unified_asset_registry.json`
- `launch-assets/final-hydra/hydra_launch_asset_pack_v2.json`
- `launch-assets/final-hydra/validation_report.json`
- `launch-assets/final-hydra/rollback_manifest.json`
- `migration-packs/hydra-creator-app-v69/final-hydra/destination_integration_contract.json`

## Merge rules implemented

- Canonical metadata enforcement with lineage fields.
- Normalized naming convention:
  `/{loop_stage}/{campaign_id}/{asset_type}/{yyyy-mm-dd}/{slug}-{uuid}.{ext}`
- Generated outputs are excluded from source discovery.
- Deduplication by binary checksum and logical key using the same precedence rule.
- Deterministic precedence (`canonical > approved > draft`, then lexical path tie-breaker).
- Validation and rollback manifest generation.
- Compatibility-preserving extension of `hydra_launch_asset_pack_v1.json`.
