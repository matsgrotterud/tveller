-- ============================================================
-- TvellerOS – Postgres/Supabase-skjema
-- Kjør mot en tom database. Forberedt for Row Level Security.
-- Demo-appen bruker en lokal mock-datalag; dette skjemaet er
-- kontrakten som datalaget byttes mot ved produksjonssetting.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- tenants og organisasjoner ----------

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  org_number text,
  billing_email text,
  plan text not null default 'starter' check (plan in ('starter','pro','enterprise','portfolio')),
  status text not null default 'trial' check (status in ('active','trial','past_due','churned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organizations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  type text not null check (type in ('developer','supplier','marketplace_partner','sameie','platform')),
  org_number text,
  address text,
  contact_email text,
  contact_phone text,
  deleted_at timestamptz
);
create index idx_organizations_tenant on organizations(tenant_id);

create table users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  organization_id uuid references organizations(id),
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role text not null,
  status text not null default 'invited' check (status in ('invited','active','disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (tenant_id, email)
);
create index idx_users_tenant on users(tenant_id);

create table memberships (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  user_id uuid not null references users(id),
  organization_id uuid references organizations(id),
  role text not null,
  permissions jsonb not null default '[]',
  status text not null default 'active'
);
create index idx_memberships_tenant_user on memberships(tenant_id, user_id);

-- ---------- prosjekt, bygg, enheter ----------

create table projects (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  developer_org_id uuid references organizations(id),
  name text not null,
  address text,
  city text,
  postal_code text,
  status text not null default 'planning',
  start_date date,
  handover_date date,
  internal_deadline_days int not null default 5,
  claim_period_config jsonb not null default '{"years": 5}',
  branding jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_projects_tenant on projects(tenant_id);
create index idx_projects_status on projects(tenant_id, status);

create table buildings (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  name text not null,
  address text,
  floors int,
  created_at timestamptz not null default now()
);
create index idx_buildings_project on buildings(tenant_id, project_id);

create table units (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  building_id uuid references buildings(id),
  unit_number text not null,
  floor int,
  size_m2 numeric,
  bedrooms int,
  resident_user_id uuid references users(id),
  handover_status text not null default 'pending',
  takeover_date date,
  claim_period_start_date date,
  claim_period_end_date date,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_units_tenant on units(tenant_id);
create index idx_units_project on units(tenant_id, project_id);
create index idx_units_resident on units(resident_user_id);

create table rooms (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  unit_id uuid not null references units(id),
  name text not null,
  type text not null check (type in ('bad','kjøkken','stue','soverom','entré','balkong','bod','fellesareal','annet')),
  floor_plan_position jsonb
);
create index idx_rooms_unit on rooms(tenant_id, unit_id);

create table components (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  room_id uuid references rooms(id),
  supplier_org_id uuid references organizations(id),
  name text not null,
  category text,
  brand text,
  model text,
  material text,
  color text,
  installation_date date,
  warranty_info text,
  fdv_document_ids uuid[]
);
create index idx_components_room on components(tenant_id, room_id);

-- ---------- dokumenter ----------

create table fdv_documents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid references projects(id),
  unit_id uuid references units(id),
  room_id uuid references rooms(id),
  component_id uuid references components(id),
  title text not null,
  description text,
  category text not null,
  file_url text,
  file_type text,
  version text not null default '1.0',
  uploaded_by uuid references users(id),
  visibility text not null default 'resident' check (visibility in ('resident','developer','supplier','board','internal')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_documents_tenant on fdv_documents(tenant_id);
create index idx_documents_project on fdv_documents(tenant_id, project_id);
create index idx_documents_unit on fdv_documents(tenant_id, unit_id);

-- ---------- reklamasjon ----------

create table claims (
  id uuid primary key default uuid_generate_v4(),
  case_number text not null unique,
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  building_id uuid references buildings(id),
  unit_id uuid not null references units(id),
  room_id uuid references rooms(id),
  component_id uuid references components(id),
  resident_user_id uuid references users(id),
  title text not null,
  description text,
  category text,
  trade text,
  severity text not null default 'middels',
  status text not null default 'Utkast',
  source text not null default 'resident' check (source in ('resident','developer','handover','sameie','sensor','supplier')),
  legal_risk_level text not null default 'lav',
  deadline_risk_level text not null default 'lav',
  received_at timestamptz,
  due_at timestamptz,
  assigned_developer_user_id uuid references users(id),
  assigned_supplier_org_id uuid references organizations(id),
  decision text check (decision in ('approved','rejected','more_info_needed','inspection_needed','duplicate','outside_scope')),
  decision_reason text,
  closed_at timestamptz,
  reopened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_claims_tenant on claims(tenant_id);
create index idx_claims_project on claims(tenant_id, project_id);
create index idx_claims_unit on claims(tenant_id, unit_id);
create index idx_claims_status on claims(tenant_id, status);
create index idx_claims_due on claims(tenant_id, due_at);
create index idx_claims_created on claims(tenant_id, created_at);
create index idx_claims_supplier on claims(assigned_supplier_org_id);

create table claim_evidence (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  claim_id uuid not null references claims(id),
  type text not null check (type in ('photo','video','document','annotation','audio','note')),
  file_url text,
  thumbnail_url text,
  annotation_data jsonb,
  caption text,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_evidence_claim on claim_evidence(tenant_id, claim_id);

create table claim_comments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  claim_id uuid not null references claims(id),
  author_user_id uuid references users(id),
  visibility text not null default 'public' check (visibility in ('public','developer_internal','supplier_internal','legal_internal')),
  body text not null,
  attachments jsonb,
  created_at timestamptz not null default now()
);
create index idx_comments_claim on claim_comments(tenant_id, claim_id);

create table internal_notes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  claim_id uuid not null references claims(id),
  author_user_id uuid references users(id),
  note_type text,
  body text not null,
  created_at timestamptz not null default now()
);
create index idx_notes_claim on internal_notes(tenant_id, claim_id);

create table claim_decisions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  claim_id uuid not null references claims(id),
  decision text not null check (decision in ('approved','rejected','more_info_needed','inspection_needed','duplicate','outside_scope')),
  reason text,
  legal_basis_note text,
  decided_by uuid references users(id),
  decided_at timestamptz not null default now()
);
create index idx_decisions_claim on claim_decisions(tenant_id, claim_id);

-- ---------- arbeidsordre og avtaler ----------

create table work_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  claim_id uuid not null references claims(id),
  supplier_org_id uuid not null references organizations(id),
  assigned_technician_user_id uuid references users(id),
  title text not null,
  description text,
  status text not null default 'Ny',
  priority text not null default 'normal',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  estimated_hours numeric,
  actual_hours numeric,
  materials_used text,
  created_at timestamptz not null default now()
);
create index idx_work_orders_tenant on work_orders(tenant_id);
create index idx_work_orders_claim on work_orders(tenant_id, claim_id);
create index idx_work_orders_supplier on work_orders(supplier_org_id, status);

create table appointment_slots (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  work_order_id uuid not null references work_orders(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  proposed_by uuid references users(id),
  status text not null default 'proposed' check (status in ('proposed','selected','expired','cancelled'))
);
create index idx_slots_work_order on appointment_slots(tenant_id, work_order_id);

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  work_order_id uuid references work_orders(id),
  claim_id uuid references claims(id),
  resident_user_id uuid references users(id),
  supplier_org_id uuid references organizations(id),
  technician_user_id uuid references users(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'bekreftet',
  location text,
  notes text
);
create index idx_appointments_tenant on appointments(tenant_id, start_at);

create table completion_reports (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  work_order_id uuid not null references work_orders(id),
  claim_id uuid not null references claims(id),
  completed_by uuid references users(id),
  completed_at timestamptz not null default now(),
  work_summary text,
  materials text,
  hours numeric,
  before_photos jsonb,
  after_photos jsonb,
  resident_confirmation_status text not null default 'pending',
  developer_confirmation_status text not null default 'pending'
);
create index idx_completion_claim on completion_reports(tenant_id, claim_id);

create table signatures (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  entity_type text not null,
  entity_id uuid not null,
  signed_by uuid references users(id),
  signature_type text not null default 'digital',
  signed_at timestamptz not null default now(),
  ip_address inet,
  metadata jsonb
);
create index idx_signatures_entity on signatures(tenant_id, entity_type, entity_id);

-- ---------- leverandører ----------

create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  organization_id uuid not null references organizations(id),
  name text not null,
  trades text[] not null default '{}',
  rating numeric,
  avg_response_time_hours numeric,
  avg_resolution_time_hours numeric,
  reopened_rate numeric,
  cases_open int not null default 0,
  cases_closed int not null default 0,
  score int
);
create index idx_suppliers_tenant on suppliers(tenant_id);

create table supplier_project_assignments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  supplier_org_id uuid not null references organizations(id),
  trade text not null,
  contract_reference text,
  active boolean not null default true
);
create index idx_spa_project on supplier_project_assignments(tenant_id, project_id);

-- ---------- meldinger og varsler ----------

create table conversations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  entity_type text not null,
  entity_id uuid not null,
  title text,
  participants uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_conversations_entity on conversations(tenant_id, entity_type, entity_id);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  conversation_id uuid not null references conversations(id),
  sender_user_id uuid references users(id),
  body text not null,
  attachments jsonb,
  visibility text not null default 'public',
  read_by uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_messages_conversation on messages(tenant_id, conversation_id, created_at);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  user_id uuid references users(id),
  type text not null,
  channel text not null default 'in_app' check (channel in ('in_app','email','sms','push')),
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  status text not null default 'pending',
  scheduled_at timestamptz,
  sent_at timestamptz,
  read_at timestamptz
);
create index idx_notifications_user on notifications(tenant_id, user_id, read_at);

-- ---------- audit og GDPR ----------

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  actor_user_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  immutable_hash text not null
);
create index idx_audit_tenant on audit_logs(tenant_id, created_at);
create index idx_audit_action on audit_logs(tenant_id, action);
-- Uforanderlighet: nekt UPDATE/DELETE
revoke update, delete on audit_logs from public;

create table consents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  user_id uuid not null references users(id),
  type text not null,
  granted boolean not null,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  source text
);
create index idx_consents_user on consents(tenant_id, user_id);

create table processing_activities (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  purpose text,
  categories_of_data text[],
  categories_of_subjects text[],
  legal_basis text,
  retention_period text,
  subprocessors text[],
  security_measures text
);

create table retention_policies (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  entity_type text not null,
  retention_period_months int not null,
  action_after_period text not null check (action_after_period in ('archive','anonymize','delete')),
  active boolean not null default true
);

create table data_requests (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  user_id uuid not null references users(id),
  type text not null check (type in ('access','export','deletion','rectification')),
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  handled_by uuid references users(id)
);
create index idx_data_requests_tenant on data_requests(tenant_id, status);

-- ---------- tilvalg ----------

create table tilvalg_categories (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  name text not null,
  room_type text,
  deadline date
);

create table tilvalg_options (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  category_id uuid references tilvalg_categories(id),
  title text not null,
  description text,
  image_url text,
  price numeric not null default 0,
  price_type text not null default 'fixed' check (price_type in ('fixed','per_m2','per_unit')),
  supplier_org_id uuid references organizations(id),
  status text not null default 'draft'
);
create index idx_tilvalg_options_project on tilvalg_options(tenant_id, project_id);

create table tilvalg_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  project_id uuid not null references projects(id),
  unit_id uuid not null references units(id),
  resident_user_id uuid references users(id),
  status text not null default 'Utkast',
  subtotal numeric not null default 0,
  vat numeric not null default 0,
  total numeric not null default 0,
  submitted_at timestamptz,
  approved_at timestamptz
);
create index idx_tilvalg_orders_unit on tilvalg_orders(tenant_id, unit_id);

create table tilvalg_order_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  order_id uuid not null references tilvalg_orders(id),
  option_id uuid not null references tilvalg_options(id),
  quantity int not null default 1,
  unit_price numeric not null,
  total numeric not null
);

-- ---------- markedsplass ----------

create table marketplace_partners (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  organization_id uuid references organizations(id),
  name text not null,
  categories text[] not null default '{}',
  commission_rate numeric not null default 0.10,
  status text not null default 'onboarding'
);

create table marketplace_services (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  partner_id uuid not null references marketplace_partners(id),
  category text not null,
  title text not null,
  description text,
  price_type text not null default 'tilbud',
  starting_price numeric,
  image_url text,
  status text not null default 'active'
);
create index idx_marketplace_services_category on marketplace_services(tenant_id, category);

create table marketplace_orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  service_id uuid not null references marketplace_services(id),
  resident_user_id uuid references users(id),
  unit_id uuid references units(id),
  status text not null default 'requested',
  requested_at timestamptz not null default now(),
  price_estimate numeric,
  commission_amount numeric
);
create index idx_marketplace_orders_tenant on marketplace_orders(tenant_id, status);

-- ---------- fakturering og plattform ----------

create table billing_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  monthly_base_price numeric not null,
  unit_price numeric not null default 0,
  included_units int not null default 0,
  included_ai_credits int not null default 0,
  included_sms int not null default 0,
  features jsonb not null default '[]'
);

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id uuid references billing_plans(id),
  status text not null default 'trialing' check (status in ('trialing','active','past_due','canceled')),
  current_period_start timestamptz,
  current_period_end timestamptz
);

create table usage_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  type text not null check (type in ('sms','email','ai','storage','bankid','export','marketplace_order')),
  quantity numeric not null default 1,
  unit_cost numeric,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_usage_tenant_type on usage_events(tenant_id, type, created_at);

create table feature_flags (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  key text not null,
  enabled boolean not null default false,
  config jsonb,
  unique (tenant_id, key)
);

create table integrations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  provider text not null,
  status text not null default 'not_connected',
  config jsonb,
  last_sync_at timestamptz
);

create table webhook_endpoints (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  url text not null,
  events text[] not null default '{}',
  secret text not null,
  status text not null default 'active'
);

create table api_keys (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  hashed_key text not null,
  scopes text[] not null default '{}',
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- ============================================================
-- Row Level Security (Supabase)
-- Aktiver RLS på alle tenant-tabeller. Policy-mønster:
--   tenant_id må matche JWT-claimet 'tenant_id'.
-- ============================================================

do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename not in ('billing_plans')
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Eksempel-policy (gjenta per tabell, eller generer tilsvarende):
-- create policy tenant_isolation on claims
--   using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Beboere skal i tillegg begrenses til egne enheter/saker:
-- create policy resident_own_claims on claims for select
--   using (resident_user_id = auth.uid());
