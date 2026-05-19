-- Hydra Creator App Migration Pack v69.0
-- 001_core_schema.sql
-- Canonical loop: Identity -> Automation -> Engagement -> Retention -> Monetization -> Expansion -> feedback

create extension if not exists pgcrypto;

create table if not exists public.hydra_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  handle text,
  display_name text,
  primary_identity text default 'unassigned',
  crown_path text default 'unassigned',
  faction text default 'unassigned',
  lifecycle_stage text default 'identity',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hydra_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.hydra_profiles(id) on delete set null,
  source text not null,
  event_type text not null,
  loop_stage text not null check (loop_stage in ('identity','automation','engagement','retention','monetization','expansion')),
  signal_strength numeric(8,4) default 0,
  campaign_id text,
  content_id text,
  product_id text,
  route_key text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.hydra_routes (
  id uuid primary key default gen_random_uuid(),
  route_key text unique not null,
  source_stage text not null,
  target_stage text not null,
  trigger_type text not null,
  trigger_value text,
  destination_type text not null,
  destination_ref text not null,
  active boolean not null default true,
  priority integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hydra_products (
  id uuid primary key default gen_random_uuid(),
  product_key text unique not null,
  name text not null,
  ladder_stage text not null,
  price_cents integer default 0,
  currency text default 'USD',
  platform text,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hydra_deployments (
  id uuid primary key default gen_random_uuid(),
  deployment_key text unique not null,
  service_name text not null,
  environment text not null default 'production',
  status text not null default 'planned',
  repo_ref text,
  commit_sha text,
  artifact_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hydra_context_nodes (
  id uuid primary key default gen_random_uuid(),
  node_key text unique not null,
  node_type text not null,
  title text not null,
  summary text,
  source_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hydra_context_edges (
  id uuid primary key default gen_random_uuid(),
  source_node_key text not null references public.hydra_context_nodes(node_key) on delete cascade,
  target_node_key text not null references public.hydra_context_nodes(node_key) on delete cascade,
  relation_type text not null,
  weight numeric(8,4) default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(source_node_key, target_node_key, relation_type)
);

create index if not exists idx_hydra_events_profile_id on public.hydra_events(profile_id);
create index if not exists idx_hydra_events_loop_stage on public.hydra_events(loop_stage);
create index if not exists idx_hydra_events_campaign_id on public.hydra_events(campaign_id);
create index if not exists idx_hydra_events_occurred_at on public.hydra_events(occurred_at desc);
create index if not exists idx_hydra_routes_active_priority on public.hydra_routes(active, priority);
create index if not exists idx_hydra_products_status on public.hydra_products(status);
create index if not exists idx_hydra_context_nodes_type on public.hydra_context_nodes(node_type);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_hydra_profiles_updated_at on public.hydra_profiles;
create trigger set_hydra_profiles_updated_at
before update on public.hydra_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_hydra_routes_updated_at on public.hydra_routes;
create trigger set_hydra_routes_updated_at
before update on public.hydra_routes
for each row execute function public.set_updated_at();

drop trigger if exists set_hydra_products_updated_at on public.hydra_products;
create trigger set_hydra_products_updated_at
before update on public.hydra_products
for each row execute function public.set_updated_at();

drop trigger if exists set_hydra_deployments_updated_at on public.hydra_deployments;
create trigger set_hydra_deployments_updated_at
before update on public.hydra_deployments
for each row execute function public.set_updated_at();

drop trigger if exists set_hydra_context_nodes_updated_at on public.hydra_context_nodes;
create trigger set_hydra_context_nodes_updated_at
before update on public.hydra_context_nodes
for each row execute function public.set_updated_at();
