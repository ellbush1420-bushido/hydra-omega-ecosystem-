# Hydra Creator App Migration Pack v69.0
## 003_storage_bucket_plan.md

## Purpose
Define the storage architecture for the Hydra Creator App as a living ecosystem operating system.

The storage layer supports:

- identity assets,
- campaign media,
- product files,
- academy/certification artifacts,
- deployment exports,
- public-safe character content,
- private operational documents,
- and Context Orbit reference materials.

---

## Canonical Buckets

| Bucket | Visibility | Purpose |
|---|---:|---|
| `hydra-public-assets` | Public | public images, thumbnails, banners, static campaign art |
| `hydra-character-media` | Private by default | original fictional character assets, persona images, avatar packs |
| `hydra-campaign-drops` | Public/controlled | Daily Drops, campaign cards, short-form launch assets |
| `hydra-products` | Private/gated | prompt packs, founder packs, codex drops, paid downloads |
| `hydra-academy` | Private/gated | AI Operator Academy lessons, capstones, certificates |
| `hydra-deployments` | Internal | build exports, release bundles, validation reports |
| `hydra-context-orbit` | Internal | doctrine files, graph snapshots, agent memory exports |
| `hydra-temp-session` | Ephemeral | temporary files, staging uploads, disposable generation artifacts |

---

## Access Rules

### Public Buckets
Only intentionally public brand and campaign material belongs in public buckets.

Allowed examples:

- landing page hero images,
- non-sensitive campaign cards,
- public-safe fictional character previews,
- thumbnails,
- Open Graph images.

### Gated Buckets
Gated buckets require application authorization and product entitlement checks.

Examples:

- paid prompt packs,
- Founder Pack downloads,
- Academy modules,
- certificates,
- premium codex artifacts.

### Internal Buckets
Internal buckets are service-role only.

Examples:

- deployment logs,
- route validation reports,
- Context Orbit graph exports,
- private operating doctrine,
- worker payload archives.

### Ephemeral Bucket
`hydra-temp-session` should enforce lifecycle deletion.

Recommended default:

- delete temporary objects after 24-72 hours,
- never store paid products or persistent user memory here,
- never use temporary storage as canon archive.

---

## Naming Convention

```text
/{loop_stage}/{campaign_id}/{asset_type}/{yyyy-mm-dd}/{slug}-{uuid}.{ext}
```

Example:

```text
/engagement/campaign-001/daily-drop/2026-05-19/choose-your-crown-01.png
```

---

## Loop Stage Mapping

| Loop Stage | Storage Examples |
|---|---|
| Identity | avatars, crown cards, faction images |
| Automation | route maps, trigger exports, webhook payload samples |
| Engagement | posts, reels, story assets, Daily Drops |
| Retention | Discord role cards, challenge assets, community unlocks |
| Monetization | products, checkout assets, paid downloads |
| Expansion | deployment bundles, SaaS mocks, partner collateral |

---

## Privacy Doctrine

Persistent memory belongs in Supabase or Notion registries, not loose files.

Storage should hold files and artifacts. Context classification should live in:

- `hydra_context_nodes`,
- `hydra_context_edges`,
- object metadata,
- and route-level access controls.

---

## Required Metadata

Every stored object should include metadata when possible:

- `loop_stage`,
- `campaign_id`,
- `product_id`,
- `faction`,
- `privacy_tier`,
- `retention_class`,
- `source_system`,
- `created_by`,
- `canon_status`.

---

## Retention Classes

| Class | Meaning |
|---|---|
| `public` | safe public asset |
| `gated` | requires entitlement |
| `internal` | service/admin only |
| `ephemeral` | scheduled deletion |
| `archive` | durable canon or release artifact |

---

## Build Status

Status: canonical storage plan for Hydra Creator App v69.0.
