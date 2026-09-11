# Owner Private Asset Studio

## Purpose

The Owner Private Asset Studio is the review lane for Hydra assets that must not be publicly exposed.

It is intended for owner-only inspection, classification, approval, rejection, vaulting, and release decisions before an asset can enter any public-facing lane.

## Access invariant

```text
OWNER ONLY
    |
    v
PRIVATE STUDIO
    |
    +-- black-vault
    +-- proprietary
    +-- migration-sensitive
    +-- internal
    +-- gated candidates
    |
    v
OWNER REVIEW
    |
    +-- KEEP PRIVATE
    +-- VAULT
    +-- ARCHIVE
    +-- APPROVE FOR RELEASE
    +-- REJECT
```

No asset enters the studio because it is public. The studio is a protected review surface.

## Required controls

- Authentication is mandatory.
- Authorization is owner-only and enforced server-side.
- Default-deny access for every non-owner identity.
- Do not expose protected asset bodies through public client bundles, public storage buckets, anonymous APIs, or static routes.
- Signed/short-lived asset retrieval should be used where storage requires URLs.
- Review actions must be attributable and auditable.
- Asset privacy classification is preserved on entry.
- Viewing an asset does not change its privacy tier.
- Public release requires a separate explicit owner approval action.
- Black Vault, proprietary, and migration-sensitive assets can never be automatically promoted to public.

## Studio states

```text
UNREVIEWED
  -> OWNER_REVIEW
      -> PRIVATE_APPROVED
      -> VAULTED
      -> ARCHIVED
      -> RELEASE_CANDIDATE
      -> REJECTED

RELEASE_CANDIDATE
  -> explicit release gate
  -> PUBLIC
```

## Minimum asset record

```json
{
  "asset_id": "asset_<stable-id>",
  "source_path": "<repo-relative-path>",
  "privacy_tier": "internal",
  "studio_visibility": "owner_only",
  "review_state": "unreviewed",
  "release_approved": false,
  "reviewed_by": null,
  "reviewed_at": null
}
```

## Merge-pipeline routing

The Final Hydra merge pipeline should route any asset classified as `black-vault`, `proprietary`, migration-sensitive, or otherwise non-public into this studio's protected review queue.

The pipeline must fail validation if one of those protected assets is assigned to a public storage lane.

## Scope boundary

This document defines the studio contract only. Authentication implementation, storage implementation, UI implementation, and public release automation are separate changes and must pass their own review gates.
