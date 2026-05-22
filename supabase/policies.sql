-- CEO Dashboard Supabase RLS scaffold
-- Review and customize before production deployment.
-- This file enables RLS and keeps write access closed until explicit app roles are defined.

alter table public.hydra_events enable row level security;
alter table public.dashboard_modules enable row level security;
alter table public.worker_routes enable row level security;

-- Read-only module registry access for signed-in dashboard users.
drop policy if exists dashboard_modules_read_authenticated on public.dashboard_modules;
create policy dashboard_modules_read_authenticated
  on public.dashboard_modules
  for select
  to authenticated
  using (true);

-- Read-only active route access for signed-in dashboard users.
drop policy if exists worker_routes_read_authenticated_active on public.worker_routes;
create policy worker_routes_read_authenticated_active
  on public.worker_routes
  for select
  to authenticated
  using (is_active = true);

-- hydra_events intentionally has no public select policy.
-- Event ingestion should be handled by a trusted server-side worker or restricted RPC.
-- Add insert policy only after the payload contract, rate limit, and validation layer are finalized.
