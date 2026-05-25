-- CEO Dashboard seed data
-- Safe development defaults for the dashboard module registry.

insert into public.dashboard_modules (module_key, title, status, metadata)
values
  ('command', 'Command', 'active', '{"description":"Executive command screen and launch control."}'::jsonb),
  ('hydra-eyes', 'HydraEyes', 'active', '{"description":"Tracking, telemetry, and intelligence view."}'::jsonb),
  ('world', 'World', 'active', '{"description":"Realm, faction, and world-state overview."}'::jsonb),
  ('arena', 'Arena', 'active', '{"description":"Shadow Arena and scenario event layer."}'::jsonb),
  ('commerce', 'Commerce', 'active', '{"description":"Offers, products, fulfillment, and revenue routing."}'::jsonb),
  ('content', 'Content', 'active', '{"description":"Daily drops, campaigns, and media production."}'::jsonb),
  ('roster', 'Roster', 'active', '{"description":"Characters, agents, assets, and role registry."}'::jsonb),
  ('action', 'Action', 'active', '{"description":"Tasks, deployment actions, and operational checklist."}'::jsonb)
on conflict (module_key) do update set
  title = excluded.title,
  status = excluded.status,
  metadata = excluded.metadata,
  updated_at = now();
