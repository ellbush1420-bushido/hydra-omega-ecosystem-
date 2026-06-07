-- Hydra Creator App Migration Pack v69.0
-- 002_rls_policies.sql
-- Security doctrine: persistent memory is protected; public surfaces are explicitly intentional.

alter table public.hydra_profiles enable row level security;
alter table public.hydra_events enable row level security;
alter table public.hydra_routes enable row level security;
alter table public.hydra_products enable row level security;
alter table public.hydra_deployments enable row level security;
alter table public.hydra_context_nodes enable row level security;
alter table public.hydra_context_edges enable row level security;

-- Profiles: users can read/update their own profile when user_id maps to auth.uid().
drop policy if exists hydra_profiles_select_own on public.hydra_profiles;
create policy hydra_profiles_select_own on public.hydra_profiles
for select using (user_id = auth.uid());

drop policy if exists hydra_profiles_update_own on public.hydra_profiles;
create policy hydra_profiles_update_own on public.hydra_profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Events: users can read events linked to their profile; service role handles writes from webhooks/workers.
drop policy if exists hydra_events_select_own on public.hydra_events;
create policy hydra_events_select_own on public.hydra_events
for select using (
  profile_id in (select id from public.hydra_profiles where user_id = auth.uid())
);

-- Public product catalog: only active products are visible to authenticated users.
drop policy if exists hydra_products_select_active on public.hydra_products;
create policy hydra_products_select_active on public.hydra_products
for select using (status in ('active','public'));

-- Routes are readable only when active; writes should be service-role/admin only.
drop policy if exists hydra_routes_select_active on public.hydra_routes;
create policy hydra_routes_select_active on public.hydra_routes
for select using (active = true);

-- Deployments are internal by default. No anonymous/authenticated policy is granted here.
-- Context nodes/edges are internal by default unless later filtered by privacy tier.

-- Service role bypasses RLS by Supabase design. All webhook, ManyChat, Warp, and worker writes should use service-side credentials only.
