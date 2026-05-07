-- Realm of 5 Crowns — Supabase Starter Schema
-- Run this in your Supabase SQL editor to bootstrap player sync, realm unlocks,
-- codex progression, and Hydra Eyes tracking for the Expo app.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

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

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. REALM GATE PROGRESSION
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.realm_unlocks (
  id          uuid primary key default uuid_generate_v4(),
  player_id   text not null,
  realm_key   text not null,
  unlocked_at timestamptz not null default now(),
  unique(player_id, realm_key)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LORE CODEX
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.codex_entries (
  id               uuid primary key default uuid_generate_v4(),
  key              text unique,
  title            text,
  body             text,
  unlock_condition text
);

create table if not exists public.codex_unlocks (
  id          uuid primary key default uuid_generate_v4(),
  player_id   text not null,
  codex_key   text not null,
  unlocked_at timestamptz not null default now(),
  unique(player_id, codex_key)
);

insert into public.codex_entries (key, title, body, unlock_condition)
values
  ('codex.obsidian_gate', 'Obsidian Gate Field Notes', 'The first gate yields only when steel, echo, or mask can no longer deny the Crown.', 'First entry into Obsidian Gate'),
  ('codex.gate_warden', 'Gate Warden Dossier', 'The Gate Warden is the hinge of the first realm. One victory there alters every threshold after it.', 'First victory vs Gate Warden'),
  ('codex.shadow_crown', 'Shadow Crown Primer', 'Veil, Edge, Pulse, and Flux define the four measures of the Shadow Crown from Rank 1 through Rank 10.', 'Reach Shadow Crown Rank 1'),
  ('codex.deep_fade', 'Perk Record — Deep Fade', 'Deep Fade grants advantage on the first Veil roll of each encounter.', 'Reach Shadow Crown Rank 5'),
  ('codex.echo_step', 'Perk Record — Echo Step', 'Echo Step ignores one failed Veil test each encounter.', 'Reach Shadow Crown Rank 7'),
  ('codex.shadow_dominion', 'Perk Record — Shadow Dominion', 'Shadow Dominion stores one future Veil auto-win in the same realm after a victory.', 'Reach Shadow Crown Rank 9'),
  ('codex.azure_spire', 'Azure Spire Blueprint', 'The Spire is where every realm converges before Ascension answers back.', 'First entry into Azure Spire'),
  ('codex.ascension', 'Ascension Encounter Transcript', 'Ascension is the final exchange where the Crown stops asking and begins declaring.', 'Win the Azure Spire Ascension Encounter')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. HYDRA EYES EVENT STREAM
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.hydra_events (
  id            text primary key,
  player_id     text,
  event_type    text not null,
  faction_id    text,
  scenario_id   text,
  scenario_type text,
  choice_id     text,
  codex_id      text,
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
-- 5. RLS / ANON ACCESS FOR PROTOTYPING
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.player_state enable row level security;
alter table public.realm_unlocks enable row level security;
alter table public.codex_entries enable row level security;
alter table public.codex_unlocks enable row level security;
alter table public.hydra_events enable row level security;

create policy "anon select player_state"
  on public.player_state for select to anon using (true);

create policy "anon insert player_state"
  on public.player_state for insert to anon with check (true);

create policy "anon update player_state"
  on public.player_state for update to anon using (true) with check (true);

create policy "anon select codex entries"
  on public.codex_entries for select to anon using (true);

create policy "anon insert codex unlocks"
  on public.codex_unlocks for insert to anon with check (true);

create policy "anon select codex unlocks"
  on public.codex_unlocks for select to anon using (true);

create policy "anon insert realm unlocks"
  on public.realm_unlocks for insert to anon with check (true);

create policy "anon select realm unlocks"
  on public.realm_unlocks for select to anon using (true);

create policy "anon insert events"
  on public.hydra_events for insert to anon with check (true);

create policy "service select player_state"
  on public.player_state for select to service_role using (true);

create policy "service select realm_unlocks"
  on public.realm_unlocks for select to service_role using (true);

create policy "service select codex_entries"
  on public.codex_entries for select to service_role using (true);

create policy "service select codex_unlocks"
  on public.codex_unlocks for select to service_role using (true);

create policy "service select events"
  on public.hydra_events for select to service_role using (true);
