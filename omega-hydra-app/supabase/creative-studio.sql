-- Hydra Sovereign Creative Studio
-- Owner-only Visualization Engine + Motion Studio orchestration records.

create table if not exists public.visualization_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brief text not null,
  visualization_type text not null default 'scene'
    check (visualization_type in ('character','scene','world','codex','product','environment')),
  style_preset text not null default 'hydra_sovereign',
  status text not null default 'draft'
    check (status in ('draft','queued','generating','review','approved','rejected','archived')),
  privacy_tier text not null default 'internal'
    check (privacy_tier in ('gated','internal','ephemeral','archive')),
  output_asset_id uuid references public.owner_studio_assets(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint visualization_not_public check (privacy_tier <> 'public')
);

alter table public.visualization_jobs enable row level security;

create policy "owner can manage visualization jobs"
on public.visualization_jobs
for all
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
)
with check (
  created_by = (select auth.uid())
  and privacy_tier <> 'public'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);

create table if not exists public.motion_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  shot_type text not null default 'cinematic'
    check (shot_type in ('cinematic','portrait_motion','action','environment','loop','trailer','sequence')),
  motion_directive text not null,
  duration_seconds numeric(8,2) not null default 5 check (duration_seconds > 0 and duration_seconds <= 600),
  status text not null default 'draft'
    check (status in ('draft','storyboard','queued','rendering','review','approved','rejected','archived')),
  privacy_tier text not null default 'internal'
    check (privacy_tier in ('gated','internal','ephemeral','archive')),
  source_asset_id uuid references public.owner_studio_assets(id) on delete set null,
  output_asset_id uuid references public.owner_studio_assets(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint motion_not_public check (privacy_tier <> 'public')
);

alter table public.motion_projects enable row level security;

create policy "owner can manage motion projects"
on public.motion_projects
for all
to authenticated
using (
  exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
)
with check (
  created_by = (select auth.uid())
  and privacy_tier <> 'public'
  and exists (
    select 1 from public.owner_studio_access access
    where access.user_id = (select auth.uid())
  )
);
