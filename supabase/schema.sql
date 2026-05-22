-- CEO Dashboard Supabase schema
-- Apply through scripts/run-schema.js or the Supabase SQL editor after review.

create table if not exists public.hydra_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  source text,
  campaign text,
  sub_id text,
  user_ref text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists hydra_events_created_at_idx
  on public.hydra_events (created_at desc);

create index if not exists hydra_events_campaign_idx
  on public.hydra_events (campaign);

create table if not exists public.dashboard_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  title text not null,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worker_routes (
  id uuid primary key default gen_random_uuid(),
  route_key text not null unique,
  destination_url text not null,
  campaign text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
