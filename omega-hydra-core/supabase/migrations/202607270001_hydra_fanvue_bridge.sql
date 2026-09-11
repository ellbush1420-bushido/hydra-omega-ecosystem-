-- Hydra Fanvue Commercial Bridge
-- Stores OAuth connection metadata, CRM sync state, analytics snapshots, and approval-gated automation records.
-- Do not store plaintext OAuth access tokens, refresh tokens, or client secrets.

create table if not exists hydra_fanvue_connections (
  id uuid primary key default gen_random_uuid(),
  hydra_profile_id uuid,
  fanvue_user_uuid uuid,
  fanvue_creator_uuid uuid,
  account_type text not null default 'creator',
  approved_scopes text[] not null default '{}',
  api_version text not null default '2025-06-26',
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  access_token_expires_at timestamptz,
  refresh_locked_until timestamptz,
  last_refresh_at timestamptz,
  last_sync_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_fanvue_connections_status_check check (status in ('pending', 'active', 'reauthorize_required', 'revoked', 'error')),
  constraint hydra_fanvue_connections_account_type_check check (account_type in ('creator', 'agency'))
);

create table if not exists hydra_fanvue_campaigns (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references hydra_fanvue_connections(id) on delete cascade,
  name text not null,
  source_platform text not null,
  source_url text,
  fanvue_tracking_link_uuid uuid,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_fanvue_campaigns_source_platform_check check (source_platform in ('tiktok', 'instagram', 'x', 'landing_page', 'discord', 'email', 'other')),
  constraint hydra_fanvue_campaigns_status_check check (status in ('draft', 'active', 'paused', 'archived'))
);

create table if not exists hydra_fanvue_fans (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references hydra_fanvue_connections(id) on delete cascade,
  fanvue_fan_uuid uuid,
  campaign_id uuid references hydra_fanvue_campaigns(id) on delete set null,
  display_name text,
  lifecycle_stage text not null default 'unknown',
  tags text[] not null default '{}',
  notes text,
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  last_purchase_at timestamptz,
  total_revenue_cents integer not null default 0,
  currency text not null default 'USD',
  consent_status text not null default 'platform_managed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (connection_id, fanvue_fan_uuid),
  constraint hydra_fanvue_fans_lifecycle_stage_check check (lifecycle_stage in ('unknown', 'follower', 'subscriber', 'purchaser', 'churned', 'blocked')),
  constraint hydra_fanvue_fans_consent_status_check check (consent_status in ('platform_managed', 'opted_in', 'opted_out', 'do_not_contact'))
);

create table if not exists hydra_fanvue_events (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references hydra_fanvue_connections(id) on delete cascade,
  fan_id uuid references hydra_fanvue_fans(id) on delete set null,
  campaign_id uuid references hydra_fanvue_campaigns(id) on delete set null,
  source text not null default 'fanvue',
  event_type text not null,
  event_uuid uuid,
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (connection_id, event_type, event_uuid)
);

create table if not exists hydra_fanvue_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references hydra_fanvue_connections(id) on delete cascade,
  metric_date date not null,
  gross_revenue_cents integer not null default 0,
  net_revenue_cents integer not null default 0,
  currency text not null default 'USD',
  subscribers_count integer not null default 0,
  followers_count integer not null default 0,
  purchases_count integer not null default 0,
  chat_unread_count integer not null default 0,
  campaign_breakdown jsonb not null default '{}'::jsonb,
  raw_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (connection_id, metric_date)
);

create table if not exists hydra_fanvue_approval_queue (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references hydra_fanvue_connections(id) on delete cascade,
  fan_id uuid references hydra_fanvue_fans(id) on delete set null,
  action_type text not null,
  draft_payload jsonb not null default '{}'::jsonb,
  ai_reason text,
  status text not null default 'pending_review',
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hydra_fanvue_approval_queue_status_check check (status in ('pending_review', 'approved', 'rejected', 'sent', 'cancelled')),
  constraint hydra_fanvue_approval_queue_action_type_check check (action_type in ('message_suggestion', 'mass_message', 'post_draft', 'media_action', 'promotion', 'profile_change', 'discord_action', 'export'))
);

create index if not exists idx_hydra_fanvue_connections_profile on hydra_fanvue_connections(hydra_profile_id);
create index if not exists idx_hydra_fanvue_events_connection_occurred on hydra_fanvue_events(connection_id, occurred_at desc);
create index if not exists idx_hydra_fanvue_fans_connection_stage on hydra_fanvue_fans(connection_id, lifecycle_stage);
create index if not exists idx_hydra_fanvue_daily_metrics_date on hydra_fanvue_daily_metrics(connection_id, metric_date desc);
create index if not exists idx_hydra_fanvue_approval_queue_status on hydra_fanvue_approval_queue(connection_id, status, created_at desc);
