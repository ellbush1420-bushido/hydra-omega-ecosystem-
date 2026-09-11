# Owner Private Asset Studio — Deployment Gate

The Studio UI and access model are implemented in `omega-hydra-app`.

## Security boundary

- Supabase Auth authenticates the browser session.
- `owner_studio_access` is an administrator-managed allowlist.
- RLS is the authorization boundary for metadata and audit events.
- `owner-private-studio` is a private Storage bucket.
- Preview links are signed for 60 seconds.
- No service-role or secret key belongs in Vite/browser environment variables.
- Protected assets use non-public privacy tiers only.
- Release candidacy and release approval are separate owner actions.

## Required environment

Copy `.env.example` to `.env.local` and provide:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Use only the Supabase publishable key in the browser.

## Database/storage bootstrap

Review and apply:

```text
supabase/owner-private-studio.sql
```

After the owner's Supabase Auth user exists, an administrator must add exactly that user UUID to `public.owner_studio_access`.

Do not expose a browser action that inserts owner allowlist rows.

## Owner-only assertions

Run these checks after applying the schema:

```sql
select count(*) as public_protected_assets
from public.owner_studio_assets
where privacy_tier = 'public';

select id, public
from storage.buckets
where id = 'owner-private-studio';

select count(*) as owner_count
from public.owner_studio_access;
```

Expected:

- `public_protected_assets = 0`
- bucket `owner-private-studio` has `public = false`
- `owner_count = 1` for the single-owner deployment

Also verify a second authenticated test user receives no asset rows and cannot create a signed URL for the private bucket.

## Dependency gate

`@supabase/supabase-js` is pinned in `package.json`.

Before merge/deploy, regenerate and commit `package-lock.json` from `omega-hydra-app/` with the same pinned dependency, then prove:

```sh
npm ci
npm run build
npm run lint
```

Do not waive the lockfile gate.

## Release rule

A row with `review_state = 'release_candidate'` is still private. Only a separate explicit owner action may set `release_approved = true`. This flag is an approval signal; public publishing remains a separate downstream operation.
