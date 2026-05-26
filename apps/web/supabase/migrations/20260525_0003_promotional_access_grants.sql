create extension if not exists pgcrypto;

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text not null,
  campaign_name text,
  grant_type text not null check (
    grant_type in ('FREE_FOUNDATION', 'PRO_TRIAL', 'PRO_GIFT', 'FULL_GIFT', 'QA_ACCESS')
  ),
  plan_key text not null check (plan_key in ('free', 'solo', 'pro', 'launch_pack', 'full')),
  capabilities jsonb not null default '[]'::jsonb,
  max_claims integer check (max_claims is null or max_claims > 0),
  claim_count integer not null default 0 check (claim_count >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text
);

create table if not exists public.access_grant_claims (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.access_grants(id),
  email_normalized text not null,
  claimed_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  source_ip_hash text,
  user_agent_hash text,
  notes text,
  unique (grant_id, email_normalized)
);

create index if not exists access_grants_code_hash_idx on public.access_grants(code_hash);
create index if not exists access_grants_active_idx on public.access_grants(grant_type, plan_key, expires_at, revoked_at);
create index if not exists access_grant_claims_email_idx on public.access_grant_claims(email_normalized);
create index if not exists access_grant_claims_grant_idx on public.access_grant_claims(grant_id);

alter table public.access_grants enable row level security;
alter table public.access_grant_claims enable row level security;

comment on table public.access_grants is 'Promotional access codes stored as hashes. Service-role routes create, claim, and revoke grants.';
comment on table public.access_grant_claims is 'Claim records for promotional access grants. Raw promo codes are never stored.';
