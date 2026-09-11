-- Hydra Zeta OS v2 n8n API control plane
-- Stores n8n instance references, governed workflow registry, normalized execution telemetry, cursors, and approval records.
-- Raw API keys, webhook secrets, credential payloads, and full execution payloads must not be stored here.

create table if not exists hydra_n8n_instances (
  id uuid primary key default gen_random_uuid(),
  instance_key text unique not null,
  display_name text not null,
  environment text not null,
  base_url_ref text not null default 'N8N_BASE_URL',
  api_key_ref text not null default 'N8N_API_KEY',
  project_id_ref text,
  enabled boolean not null default false,
  health_status text not null default 'unknown',
  api_key_fingerprint text,
  api_key_rotated_at timestamptz,
  last_health_check_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_n8n_instances_environment_check check (
    environment in ('development', 'staging', 'production')
  ),
  constraint hydra_n8n_instances_health_check check (
    health_status in ('unknown', 'healthy', 'degraded', 'unavailable', 'disabled')
  )
);

create table if not exists hydra_n8n_workflows (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references hydra_n8n_instances(id) on delete cascade,
  workflow_key text not null,
  n8n_workflow_id text not null,
  display_name text not null,
  module text not null,
  owner_id uuid,
  purpose text not null,
  trigger_type text not null,
  risk_tier integer not null default 1 check (risk_tier between 0 and 5),
  approval_mode text not null,
  idempotency_required boolean not null default true,
  active_expected boolean not null default false,
  active_observed boolean,
  timeout_seconds integer check (timeout_seconds is null or timeout_seconds > 0),
  max_attempts integer not null default 1 check (max_attempts between 1 and 5),
  source_hash text,
  last_synced_at timestamptz,
  last_success_at timestamptz,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (instance_id, workflow_key),
  unique (instance_id, n8n_workflow_id),
  constraint hydra_n8n_workflows_status_check check (
    status in ('registered', 'in_sync', 'drifted', 'paused', 'blocked', 'retired')
  )
);

create table if not exists hydra_n8n_executions (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references hydra_n8n_instances(id) on delete cascade,
  workflow_id uuid references hydra_n8n_workflows(id) on delete set null,
  n8n_execution_id text not null,
  trace_id uuid,
  source_status text not null,
  normalized_status text not null default 'unknown',
  mode text,
  retry_of_execution_id text,
  retry_success_execution_id text,
  started_at timestamptz,
  stopped_at timestamptz,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  raw_data_retained boolean not null default false,
  error_class text,
  error_summary text,
  synchronized_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (instance_id, n8n_execution_id),
  constraint hydra_n8n_executions_normalized_status_check check (
    normalized_status in ('queued', 'running', 'waiting', 'succeeded', 'failed', 'cancelled', 'unknown')
  )
);

create table if not exists hydra_n8n_sync_cursors (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references hydra_n8n_instances(id) on delete cascade,
  resource text not null,
  scope_key text not null default 'default',
  cursor_value text,
  page_count integer not null default 0 check (page_count >= 0),
  last_sync_started_at timestamptz,
  last_sync_completed_at timestamptz,
  status text not null default 'idle',
  error_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (instance_id, resource, scope_key),
  constraint hydra_n8n_sync_cursors_status_check check (
    status in ('idle', 'running', 'completed', 'failed', 'stopped')
  )
);

create table if not exists hydra_n8n_control_actions (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null references hydra_n8n_instances(id) on delete cascade,
  workflow_id uuid references hydra_n8n_workflows(id) on delete set null,
  execution_id uuid references hydra_n8n_executions(id) on delete set null,
  action_type text not null,
  requested_by uuid,
  approval_state text not null default 'pending',
  approved_by uuid,
  approved_at timestamptz,
  idempotency_key text,
  reason text,
  result_status text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint hydra_n8n_control_actions_action_check check (
    action_type in ('create_workflow', 'update_workflow', 'activate_workflow', 'deactivate_workflow', 'retry_execution', 'delete_execution', 'delete_workflow', 'security_audit', 'source_control_pull')
  ),
  constraint hydra_n8n_control_actions_approval_check check (
    approval_state in ('pending', 'approved', 'rejected', 'expired', 'cancelled')
  )
);

create index if not exists idx_hydra_n8n_instances_environment
  on hydra_n8n_instances(environment, enabled);

create index if not exists idx_hydra_n8n_workflows_module_status
  on hydra_n8n_workflows(module, status);

create index if not exists idx_hydra_n8n_executions_workflow_started
  on hydra_n8n_executions(workflow_id, started_at desc);

create index if not exists idx_hydra_n8n_executions_trace
  on hydra_n8n_executions(trace_id);

create index if not exists idx_hydra_n8n_executions_status
  on hydra_n8n_executions(normalized_status, synchronized_at desc);

create index if not exists idx_hydra_n8n_control_actions_approval
  on hydra_n8n_control_actions(approval_state, created_at);
