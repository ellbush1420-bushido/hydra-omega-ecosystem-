-- Hydra Zeta OS v2 multi-model AI control plane
-- Stores provider registry, routing policy versions, bounded task runs, usage/cost telemetry, and approval decisions.
-- Prompt bodies and private source material belong in separately governed artifact storage, not telemetry rows.

create table if not exists hydra_ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text unique not null,
  adapter text not null,
  enabled boolean not null default false,
  allowed_sensitivity text[] not null default '{public}',
  capabilities text[] not null default '{}',
  secret_ref text,
  base_url_ref text,
  health_status text not null default 'unknown',
  last_health_check_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_ai_providers_health_check check (
    health_status in ('unknown', 'healthy', 'degraded', 'unavailable', 'disabled')
  )
);

create table if not exists hydra_ai_routing_policies (
  id uuid primary key default gen_random_uuid(),
  policy_key text not null,
  version text not null,
  policy_document jsonb not null,
  status text not null default 'draft',
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (policy_key, version),
  constraint hydra_ai_routing_policies_status_check check (
    status in ('draft', 'active', 'retired')
  )
);

create table if not exists hydra_ai_task_runs (
  id uuid primary key default gen_random_uuid(),
  trace_id uuid unique not null default gen_random_uuid(),
  owner_id uuid,
  task_type text not null,
  module text not null,
  sensitivity text not null,
  requested_provider text not null default 'auto',
  selected_provider_id uuid references hydra_ai_providers(id) on delete set null,
  selected_model text,
  policy_key text not null,
  policy_version text not null,
  input_artifact_ref text,
  output_artifact_ref text,
  output_schema text,
  approval_mode text not null,
  approval_state text not null default 'not_required',
  status text not null default 'queued',
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 1 check (max_attempts between 1 and 5),
  max_tokens integer check (max_tokens is null or max_tokens > 0),
  max_cost_usd numeric(12,6) check (max_cost_usd is null or max_cost_usd >= 0),
  stop_reason text,
  error_code text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_ai_task_runs_sensitivity_check check (
    sensitivity in ('public', 'internal', 'confidential', 'restricted_professional')
  ),
  constraint hydra_ai_task_runs_approval_state_check check (
    approval_state in ('not_required', 'pending', 'approved', 'rejected', 'expired', 'cancelled')
  ),
  constraint hydra_ai_task_runs_status_check check (
    status in ('queued', 'policy_check', 'running', 'awaiting_approval', 'succeeded', 'failed', 'stopped', 'cancelled')
  )
);

create table if not exists hydra_ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  task_run_id uuid not null references hydra_ai_task_runs(id) on delete cascade,
  provider_id uuid references hydra_ai_providers(id) on delete set null,
  model text,
  attempt_number integer not null default 1 check (attempt_number > 0),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  cached_input_tokens integer not null default 0 check (cached_input_tokens >= 0),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  estimated_cost_usd numeric(12,6) not null default 0 check (estimated_cost_usd >= 0),
  status text not null,
  provider_request_id text,
  created_at timestamptz not null default now(),
  constraint hydra_ai_usage_events_status_check check (
    status in ('succeeded', 'failed', 'timeout', 'rate_limited', 'budget_stopped', 'policy_blocked')
  )
);

create table if not exists hydra_ai_policy_events (
  id uuid primary key default gen_random_uuid(),
  task_run_id uuid references hydra_ai_task_runs(id) on delete cascade,
  event_type text not null,
  decision text not null,
  rule_key text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint hydra_ai_policy_events_decision_check check (
    decision in ('allow', 'block', 'require_approval', 'redact', 'stop', 'fallback')
  )
);

create index if not exists idx_hydra_ai_providers_health
  on hydra_ai_providers(enabled, health_status);

create index if not exists idx_hydra_ai_task_runs_owner_created
  on hydra_ai_task_runs(owner_id, created_at desc);

create index if not exists idx_hydra_ai_task_runs_status_created
  on hydra_ai_task_runs(status, created_at desc);

create index if not exists idx_hydra_ai_task_runs_module_type
  on hydra_ai_task_runs(module, task_type);

create index if not exists idx_hydra_ai_usage_events_task
  on hydra_ai_usage_events(task_run_id, attempt_number);

create index if not exists idx_hydra_ai_policy_events_task
  on hydra_ai_policy_events(task_run_id, created_at);

insert into hydra_ai_providers (
  provider_key,
  adapter,
  enabled,
  allowed_sensitivity,
  capabilities,
  secret_ref,
  health_status
)
values
  (
    'openai',
    'openai_responses',
    true,
    array['public', 'internal'],
    array['conversation', 'customer_support', 'structured_output', 'tool_orchestration', 'workflow_decision'],
    'OPENAI_API_KEY',
    'unknown'
  ),
  (
    'anthropic',
    'anthropic_messages',
    true,
    array['public', 'internal'],
    array['long_form_writing', 'documentation', 'architecture_review', 'technical_analysis', 'coding_assistance', 'large_context_synthesis'],
    'ANTHROPIC_API_KEY',
    'unknown'
  ),
  (
    'approved_open_model',
    'openai_compatible_self_hosted',
    false,
    array['public', 'internal', 'confidential', 'restricted_professional'],
    array['private_inference', 'offline_workflow', 'classification', 'experimentation'],
    'HYDRA_OPEN_MODEL_API_KEY',
    'disabled'
  )
on conflict (provider_key) do nothing;
