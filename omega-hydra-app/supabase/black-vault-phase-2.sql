-- Black Vault Console Phase 2 persistence schema
-- Run in Supabase SQL Editor after reviewing access policies.

create extension if not exists pgcrypto;

create table if not exists public.black_vault_offers (
  id uuid primary key default gen_random_uuid(),
  tier text not null,
  title text not null,
  price text not null,
  purpose text not null default '',
  status text not null default 'active',
  access_tier text not null default 'age-gated',
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.black_vault_affiliate_matrix (
  id uuid primary key default gen_random_uuid(),
  lane text not null,
  source text not null default 'unknown',
  cta text not null default 'Tracked CTA',
  ctr text,
  ctr_value numeric,
  epc text,
  epc_value numeric,
  decision text not null default 'Monitor',
  tracking_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.black_vault_warp_runs (
  id uuid primary key default gen_random_uuid(),
  run text not null,
  task text not null,
  status text not null default 'Queued',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  external_ref text,
  event_source text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.black_vault_reviews (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'Vault Review',
  status text not null default 'Needs Review',
  risk text not null default 'Medium',
  owner text not null default 'Den Mother',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.black_vault_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'black-vault-console',
  metric_count integer not null default 0,
  metrics jsonb not null default '[]'::jsonb,
  offers_count integer not null default 0,
  matrix_count integer not null default 0,
  runs_count integer not null default 0,
  reviews_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_black_vault_offers_sort on public.black_vault_offers(sort_order, created_at);
create index if not exists idx_black_vault_matrix_created on public.black_vault_affiliate_matrix(created_at desc);
create index if not exists idx_black_vault_runs_updated on public.black_vault_warp_runs(updated_at desc);
create index if not exists idx_black_vault_reviews_updated on public.black_vault_reviews(updated_at desc);
create index if not exists idx_black_vault_metric_snapshots_created on public.black_vault_metric_snapshots(created_at desc);

-- Optional seed rows for the console offer ladder.
insert into public.black_vault_offers (tier, title, price, purpose, sort_order)
select seed.tier, seed.title, seed.price, seed.purpose, seed.sort_order
from (
  values
    ('Entry', 'Velvet Teaser Kit', 'Free', 'Audience warming, list capture, and first-touch curiosity.', 1),
    ('Starter', 'Black Vault Prompt Starter', '$9', 'Compact prompt pack for persona visuals, article angles, and CTA hooks.', 2),
    ('Core', 'Velvet Founder Pack', '$27', 'Persona bundle, funnel copy, landing-page blocks, and vault asset templates.', 3),
    ('Growth', 'Affiliate Matrix Kit', '$97', 'SEO cluster map, review templates, tracking logic, and refresh cadence.', 4),
    ('Premium', 'Black Vault Console System', '$197', 'Command deck templates, dashboards, governance rails, and workflow packs.', 5)
) as seed(tier, title, price, purpose, sort_order)
where not exists (
  select 1 from public.black_vault_offers existing where existing.title = seed.title
);

-- Optional seed rows for Den Mother review coverage.
insert into public.black_vault_reviews (title, type, status, risk, owner)
select seed.title, seed.type, seed.status, seed.risk, seed.owner
from (
  values
    ('Velrya Public Teaser', 'Character Spotlight', 'Approved', 'Low', 'Den Mother'),
    ('The Ninth Veil Review Item', 'Vault Review', 'Needs Review', 'Medium', 'Den Mother'),
    ('Hydra Boundary Check', 'Boundary Audit', 'Blocked', 'High', 'Den Mother')
) as seed(title, type, status, risk, owner)
where not exists (
  select 1 from public.black_vault_reviews existing where existing.title = seed.title
);

-- NOTE: Current API handlers use server-side SUPABASE_KEY access.
-- Add row-level security policies only after deciding whether these tables
-- should ever be queried directly from the browser.
