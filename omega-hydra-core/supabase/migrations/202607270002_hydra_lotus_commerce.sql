create table if not exists hydra_commerce_partners (
  id uuid primary key default gen_random_uuid(),
  partner_key text unique not null,
  partner_name text not null,
  route text[] not null default '{}',
  risk_tier integer not null default 1 check (risk_tier between 0 and 5),
  review_required boolean not null default true,
  application_status text not null default 'not_started' check (application_status in ('not_started', 'researching', 'applied', 'approved', 'rejected', 'paused')),
  contact_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hydra_commerce_products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references hydra_commerce_partners(id) on delete set null,
  product_key text unique not null,
  product_name text not null,
  category text not null,
  source text not null default 'manual',
  risk_tier integer not null default 1 check (risk_tier between 0 and 5),
  status text not null default 'draft' check (status in ('draft', 'sample_ordered', 'qa_review', 'approved', 'blocked', 'retired')),
  affiliate_url text,
  storefront_url text,
  cost_basis numeric(12,2),
  target_price numeric(12,2),
  margin_percent numeric(8,4),
  compliance_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hydra_commerce_affiliates (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text,
  handle text,
  tier text not null default 'ambassador-circle',
  status text not null default 'pending' check (status in ('pending', 'approved', 'paused', 'removed')),
  disclosure_training_completed_at timestamptz,
  payout_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hydra_commerce_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references hydra_commerce_affiliates(id) on delete set null,
  product_id uuid references hydra_commerce_products(id) on delete set null,
  source_platform text,
  campaign_key text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  clicked_at timestamptz not null default now()
);

create table if not exists hydra_commerce_sales_events (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid references hydra_commerce_affiliates(id) on delete set null,
  product_id uuid references hydra_commerce_products(id) on delete set null,
  partner_id uuid references hydra_commerce_partners(id) on delete set null,
  external_order_id text,
  gross_amount numeric(12,2) not null default 0,
  commission_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'refunded', 'reversed', 'blocked')),
  compliance_flag boolean not null default false,
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists hydra_commerce_compliance_reviews (
  id uuid primary key default gen_random_uuid(),
  review_type text not null check (review_type in ('partner', 'product', 'affiliate', 'content', 'campaign', 'supplier')),
  related_table text,
  related_id uuid,
  risk_tier integer not null default 1 check (risk_tier between 0 and 5),
  decision text not null default 'pending' check (decision in ('pending', 'approved', 'blocked', 'needs_legal_review', 'needs_vendor_authorization')),
  findings text,
  reviewer text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_hydra_commerce_products_status on hydra_commerce_products(status);
create index if not exists idx_hydra_commerce_products_risk_tier on hydra_commerce_products(risk_tier);
create index if not exists idx_hydra_commerce_sales_events_status on hydra_commerce_sales_events(status);
create index if not exists idx_hydra_commerce_sales_events_occurred_at on hydra_commerce_sales_events(occurred_at);
create index if not exists idx_hydra_commerce_reviews_decision on hydra_commerce_compliance_reviews(decision);
