# Final Hydra Asset Merge Tooling

This toolchain implements the approved merge plan for `m4552fz28w-stack/final-hydra`.

## Run

```sh
cd /home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-
node tools/asset-merge/merge-final-hydra-assets.mjs
```

## Outputs

All generated outputs are written to:

- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/source_inventory_manifest.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/dedupe_report.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/unified_asset_registry.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/hydra_launch_asset_pack_v2.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/validation_report.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/launch-assets/final-hydra/rollback_manifest.json`
- `/home/runner/work/hydra-omega-ecosystem-/hydra-omega-ecosystem-/migration-packs/hydra-creator-app-v69/final-hydra/destination_integration_contract.json`

## Merge rules implemented

- Canonical metadata enforcement with lineage fields.
- Normalized naming convention:
  `/{loop_stage}/{campaign_id}/{asset_type}/{yyyy-mm-dd}/{slug}-{uuid}.{ext}`
- Deduplication by binary checksum and logical key.
- Deterministic precedence (`canonical > approved > draft`, then lexical path tie-breaker).
- Validation and rollback manifest generation.
- Compatibility-preserving extension of `hydra_launch_asset_pack_v1.json`.
