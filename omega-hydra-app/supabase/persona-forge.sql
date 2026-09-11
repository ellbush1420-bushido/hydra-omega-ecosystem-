-- Hydra Persona Forge Ω
-- Owner-only private character/persona registry.

create table if not exists public.persona_registry (
  id uuid primary key default gen_random_uuid(),
  persona_id text not null unique,
  canon_name text not null,
  collection_name text not null default 'Hydra Core',
  status text not null default 'draft'
    check (status in ('draft','canon_approved','release_candidate','archived')),
  privacy_tier text not null default 'internal'
    check (privacy_tier in ('gated','internal','ephemeral','archive')),
  release_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint persona_not_public check (privacy_tier <> 'public')
);

alter table public.persona_registry enable row level security;

create policy "owner can read persona registry"
on public.persona_registry
for select
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can insert persona registry"
on public.persona_registry
for insert
to authenticated
with check (
  privacy_tier <> 'public'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can update persona registry"
on public.persona_registry
for update
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
)
with check (
  privacy_tier <> 'public'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create table if not exists public.persona_assets (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references public.persona_registry(id) on delete cascade,
  studio_asset_id uuid references public.owner_studio_assets(id) on delete set null,
  role text not null default 'reference',
  created_at timestamptz not null default now()
);

alter table public.persona_assets enable row level security;

create policy "owner can read persona assets"
on public.persona_assets
for select
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create policy "owner can manage persona assets"
on public.persona_assets
for all
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
);
