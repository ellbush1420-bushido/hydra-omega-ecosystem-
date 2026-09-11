-- Owner Private Asset Studio
-- Apply through your normal Supabase change process after review.
-- One-time owner bootstrap must be executed by an administrator/service role,
-- never from the browser.

create table if not exists public.owner_studio_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.owner_studio_access enable row level security;

create policy "owner can read own studio access"
on public.owner_studio_access
for select
to authenticated
using ((select auth.uid()) = user_id);

create table if not exists public.owner_studio_assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null unique,
  title text,
  source_path text not null,
  storage_path text not null unique,
  asset_type text not null,
  privacy_tier text not null check (privacy_tier in ('gated','internal','ephemeral','archive')),
  review_state text not null default 'unreviewed'
    check (review_state in ('unreviewed','private_approved','vaulted','archived','release_candidate','rejected')),
  release_approved boolean not null default false,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint protected_assets_not_public check (privacy_tier <> 'public'),
  constraint release_requires_candidate check (
    release_approved = false or review_state = 'release_candidate'
  )
);

alter table public.owner_studio_assets enable row level security;

create policy "owner can read studio assets"
on public.owner_studio_assets
for select
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can update studio assets"
on public.owner_studio_assets
for update
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
  and privacy_tier <> 'public'
);

create table if not exists public.owner_studio_review_events (
  id bigint generated always as identity primary key,
  asset_id uuid not null references public.owner_studio_assets(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id),
  action text not null,
  from_state text,
  to_state text,
  created_at timestamptz not null default now()
);

alter table public.owner_studio_review_events enable row level security;

create policy "owner can read studio review events"
on public.owner_studio_review_events
for select
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can append studio review events"
on public.owner_studio_review_events
for insert
to authenticated
with check (
  actor_user_id = (select auth.uid())
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public)
values ('owner-private-studio', 'owner-private-studio', false)
on conflict (id) do update set public = false;

create policy "owner can read private studio objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'owner-private-studio'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can upload private studio objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'owner-private-studio'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can update private studio objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'owner-private-studio'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'owner-private-studio'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can delete private studio objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'owner-private-studio'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

-- Bootstrap example (run once as administrator after the owner's auth user exists):
-- insert into public.owner_studio_access (user_id)
-- values ('OWNER_AUTH_USER_UUID')
-- on conflict (user_id) do nothing;
