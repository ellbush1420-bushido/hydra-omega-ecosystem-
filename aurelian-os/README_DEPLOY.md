# AURELIAN Omega Sigma / Omega Hydra Master Connector

This folder is the completed JSON Schema and deployment connector artifact. It turns the finished Hydra/Aurelian package inventory into one master deployment brain.

## Files

| File | Purpose |
|---|---|
| `aurelian-os.schema.json` | JSON Schema contract for the master package registry. |
| `package-registry.json` | Canonical source of truth for every finished package, product tier, privacy level, owner agent, route, and launch phase. |
| `diploi.yaml` | Diploi-style deployment blueprint for the public hub, registry worker, API routes, product integrations, privacy gates, and release order. |
| `README_DEPLOY.md` | Human-readable deployment guide and operating notes. |

## Master Connector Role

The connector does four jobs:

1. Packages the inventory into canonical IDs.
2. Routes each package into product, content, app, academy, or internal operations.
3. Protects restricted material with privacy gates before anything public is generated.
4. Creates the deployment order for GitHub, Diploi, Notion, product pages, social platforms, and app builders.

## Launch Priority

The first launch product is:

```text
hydra_character_content_system_package
```

This maps to the entry Hydra Character Content System Pack and should drive the earliest monetization loop:

```text
Free social teaser -> entry prompt/content pack -> Omega Hydra Master Package -> consulting or academy gate
```

## Privacy Rule

Anything marked as:

```text
private_internal
restricted_professional
```

must stay out of public routes until a sanitized version is produced.

## Agent Heads

The registry defines these operating agents:

- grinning_python_command_head
- content_python_head
- product_python_head
- deployment_python_head
- academy_python_head
- affiliate_python_head
- compliance_python_head

## Recommended Commands

```bash
python scripts/validate_registry.py
python scripts/list_launch_order.py
```

## Deployment Acceptance

The artifact is complete when:

- package-registry.json validates against aurelian-os.schema.json.
- Every finished package has a canonical ID.
- Every package has a product tier, privacy level, owner agent, and deploy target.
- The deployment plan starts with the Hydra Character Content System Pack.
- Restricted material is gated from public output.

## Next Build Step

Render package-registry.json into a simple dashboard with these views:

1. Launch order
2. Product ladder
3. Content/social queue
4. Private archive
5. Deployment status
