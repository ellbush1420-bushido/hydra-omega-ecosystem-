create table if not exists hydra_reflection_reports (
  id uuid primary key default gen_random_uuid(),
  trainee_name text not null,
  current_gate text not null,
  scenario_domain text not null,
  resolution_outcome text not null,
  score numeric not null,
  rating text not null,
  reflection_notes text,
  next_action text,
  safety_notice text,
  created_at timestamptz default now()
);

create table if not exists hydra_trainee_progress (
  id uuid primary key default gen_random_uuid(),
  trainee_name text not null,
  current_gate_index int default 1,
  average_score numeric default 0,
  reports_generated int default 0,
  product_tier text default 'free',
  updated_at timestamptz default now()
);
