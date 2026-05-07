-- Realm of 5 Crowns — Supabase Starter Schema
-- Run this in your Supabase SQL editor to bootstrap the live tracking tables.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PLAYER STATE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.player_state (
  id            uuid primary key default gen_random_uuid(),
  device_id     text not null unique,
  crown         text,
  realm         text,
  trial         text,
  faction_id    text,
  tiger_rank    text,
  level         integer not null default 1,
  xp            integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PLAYERS
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.players (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Identity
  device_id     text unique,              -- anonymous device fingerprint
  display_name  text,

  -- Faction
  faction_id    text,                     -- e.g. 'shadow_serpent'

  -- Progression
  xp            integer not null default 0,
  level         integer not null default 1,
  tiger_rank    text,                     -- null | 'black_tiger_I' | 'black_tiger_II' | 'white_tiger_I' | 'white_tiger_II'

  -- Stats (mock / live switchable)
  total_joins   integer not null default 0,
  total_sales   integer not null default 0,
  total_revenue numeric(10,2) not null default 0,
  scale_score   integer not null default 0
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger player_state_updated_at
  before update on public.player_state
  for each row execute procedure public.set_updated_at();

create trigger players_updated_at
  before update on public.players
  for each row execute procedure public.set_updated_at();

-- 3. LORE CODEX
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.codex_entries (
  id               uuid primary key default gen_random_uuid(),
  key              text unique not null,
  title            text not null,
  body             text not null,
  unlock_condition text not null
);

create table if not exists public.codex_unlocks (
  id          uuid primary key default gen_random_uuid(),
  player_id   text not null,
  codex_key   text not null,
  unlocked_at timestamptz not null default now(),
  unique(player_id, codex_key)
);

insert into public.codex_entries (key, title, body, unlock_condition)
values
  (
    'codex.obsidian_gate',
    'Obsidian Gate',
    'The first Realm opens beneath volcanic glass and iron fog. Its wardens test whether discipline or fear rules the hand that reaches for the Crown.',
    'First entry into Realm 1: Obsidian Gate.'
  ),
  (
    'codex.gate_warden',
    'Gate Warden',
    'The Gate Warden stands at the threshold between oath and ascent. Defeating it brands the victor as one who can bear the weight of deeper Realms.',
    'Win the Trial of Steel in Obsidian Gate.'
  ),
  (
    'codex.golden_arena',
    'Golden Arena',
    'The Arena bathes every challenger in merciless light. Here chains, echoes, and steel are displayed before the watching crowd of Crown spirits.',
    'Unlock Realm 2: Golden Arena.'
  ),
  (
    'codex.silver_labyrinth',
    'Silver Labyrinth',
    'Every corridor of the Labyrinth returns a different truth. Masks and void-signs split the unwary from the ascendant.',
    'Unlock Realm 3: Silver Labyrinth.'
  ),
  (
    'codex.crimson_wilds',
    'Crimson Wilds',
    'The Wilds answer only to force and nerve. Steel, chains, and the void hunt together beneath a red horizon.',
    'Unlock Realm 4: Crimson Wilds.'
  ),
  (
    'codex.azure_spire',
    'Azure Spire',
    'At the final height, every trial merges into one ascent. Those who endure the Spire are judged in the Ascension Encounter.',
    'Unlock Realm 5: Azure Spire.'
  ),
  (
    'codex.shadow_crown',
    'Shadow Crown',
    'The Shadow Crown sharpens Veil, Edge, Pulse, and Flux in deliberate stages. Each rank is a promise that power will answer to discipline.',
    'Reach Shadow Crown Rank 5.'
  )
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SCENARIO HISTORY
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.scenario_history (
  id              uuid primary key default gen_random_uuid(),
  player_id       uuid references public.players(id) on delete cascade,
  scenario_id     text not null,
  scenario_type   text not null,  -- realm id, e.g. 'obsidian_gate' | 'golden_arena'
  choice_id       text,
  outcome_text    text,
  xp_earned       integer default 0,
  scale_score     integer default 0,
  mock_revenue    numeric(10,2) default 0,
  mock_joins      integer default 0,
  mock_sales      integer default 0,
  chosen_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. HYDRA EVENTS  (Hydra Eyes tracking)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.hydra_events (
  id            text primary key,          -- client-generated evt_<ts>_<rand>
  player_id     uuid references public.players(id) on delete set null,
  event_type    text not null,             -- 'faction_select' | 'scenario_start' | 'scenario_choice' | 'codex_unlock' | 'join' | 'sale' | 'xp_gain' | 'tiger_promotion' | 'click'
  faction_id    text,
  scenario_id   text,
  scenario_type text,
  choice_id     text,
  codex_id      text,                  -- codex key, e.g. 'codex.obsidian_gate'
  element       text,
  context       text,
  amount        numeric(10,2),
  xp            integer,
  scale_score   integer,
  mock          boolean default false,
  session_ms    bigint,
  ts            timestamptz not null default now(),
  extra         jsonb
);

create index if not exists hydra_events_player_idx on public.hydra_events(player_id);
create index if not exists hydra_events_type_idx on public.hydra_events(event_type);
create index if not exists hydra_events_ts_idx on public.hydra_events(ts desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.player_state enable row level security;
alter table public.players enable row level security;
alter table public.codex_entries enable row level security;
alter table public.codex_unlocks enable row level security;
alter table public.scenario_history enable row level security;
alter table public.hydra_events enable row level security;

-- Allow anonymous inserts (device-scoped; tighten for production)
create policy "anon select player_state"
  on public.player_state for select to anon using (true);

create policy "anon insert player_state"
  on public.player_state for insert to anon with check (true);

create policy "anon update player_state"
  on public.player_state for update to anon using (true) with check (true);

create policy "anon insert players"
  on public.players for insert to anon with check (true);

create policy "anon select codex entries"
  on public.codex_entries for select to anon using (true);

create policy "anon select codex unlocks"
  on public.codex_unlocks for select to anon using (true);

create policy "anon insert events"
  on public.hydra_events for insert to anon with check (true);

create policy "anon insert codex"
  on public.codex_unlocks for insert to anon with check (true);

create policy "anon update codex"
  on public.codex_unlocks for update to anon using (true) with check (true);

create policy "anon insert scenarios"
  on public.scenario_history for insert to anon with check (true);

-- Service role (backend) can read everything
create policy "service select player_state"
  on public.player_state for select to service_role using (true);

create policy "service select players"
  on public.players for select to service_role using (true);

create policy "service select codex entries"
  on public.codex_entries for select to service_role using (true);

create policy "service select codex unlocks"
  on public.codex_unlocks for select to service_role using (true);

create policy "service select events"
  on public.hydra_events for select to service_role using (true);
