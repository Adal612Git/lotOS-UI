-- LotOS UI entitlement lifecycle migration.
-- Local migration only. Review, back up, and test in staging before remote execution.

create table if not exists public.entitlements (
  id bigserial primary key,
  user_email text not null,
  plan text not null check (plan in ('free', 'solo', 'pro', 'launch_pack')),
  granted_at timestamptz not null default timezone('utc', now()),
  source text not null,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.entitlements
  add column if not exists email_normalized text,
  add column if not exists provider text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_subscription_id text,
  add column if not exists provider_order_id text,
  add column if not exists provider_event_id_last text,
  add column if not exists status text,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists revoked_by text,
  add column if not exists revoke_reason text,
  add column if not exists internal_note text,
  add column if not exists created_by_owner_email text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- Defensive backfill from the legacy metadata model. Timestamp casts are guarded
-- by a basic ISO prefix check so malformed metadata does not abort migration.
with normalized as (
  select
    id,
    lower(trim(user_email)) as normalized_email,
    nullif(metadata->>'provider', '') as metadata_provider,
    nullif(metadata->>'paymentProvider', '') as metadata_payment_provider,
    case
      when nullif(metadata->>'trialEndsAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (metadata->>'trialEndsAt')::timestamptz
      else null
    end as metadata_trial_ends_at,
    case
      when nullif(metadata->>'expiresAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (metadata->>'expiresAt')::timestamptz
      else null
    end as metadata_expires_at,
    case
      when nullif(metadata->>'revokedAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (metadata->>'revokedAt')::timestamptz
      else null
    end as metadata_revoked_at,
    case
      when nullif(metadata->>'createdAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (metadata->>'createdAt')::timestamptz
      else null
    end as metadata_created_at,
    case
      when nullif(metadata->>'updatedAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (metadata->>'updatedAt')::timestamptz
      else null
    end as metadata_updated_at
  from public.entitlements
)
update public.entitlements entitlements
set
  email_normalized = coalesce(entitlements.email_normalized, normalized.normalized_email),
  provider = coalesce(entitlements.provider, normalized.metadata_provider, normalized.metadata_payment_provider),
  provider_customer_id = coalesce(entitlements.provider_customer_id, nullif(entitlements.metadata->>'providerCustomerId', '')),
  provider_subscription_id = coalesce(entitlements.provider_subscription_id, nullif(entitlements.metadata->>'providerSubscriptionId', '')),
  provider_order_id = coalesce(entitlements.provider_order_id, nullif(entitlements.metadata->>'providerOrderId', '')),
  provider_event_id_last = coalesce(entitlements.provider_event_id_last, nullif(entitlements.metadata->>'providerEventId', '')),
  status = coalesce(
    entitlements.status,
    case
      when normalized.metadata_revoked_at is not null then 'revoked'
      when normalized.metadata_trial_ends_at is not null and normalized.metadata_trial_ends_at <= timezone('utc', now()) then 'expired'
      when normalized.metadata_expires_at is not null and normalized.metadata_expires_at <= timezone('utc', now()) then 'expired'
      when entitlements.source like 'manual_owner_test:%' then 'trialing'
      when entitlements.source like 'manual_owner_paid_recovery:%' then 'manual_recovery'
      else 'active'
    end
  ),
  trial_ends_at = coalesce(entitlements.trial_ends_at, normalized.metadata_trial_ends_at),
  expires_at = coalesce(entitlements.expires_at, normalized.metadata_expires_at),
  revoked_at = coalesce(entitlements.revoked_at, normalized.metadata_revoked_at),
  revoked_by = coalesce(entitlements.revoked_by, nullif(entitlements.metadata->>'revokedBy', '')),
  revoke_reason = coalesce(entitlements.revoke_reason, nullif(entitlements.metadata->>'revokeReason', '')),
  internal_note = coalesce(entitlements.internal_note, nullif(entitlements.metadata->>'internalNote', '')),
  created_by_owner_email = coalesce(entitlements.created_by_owner_email, nullif(entitlements.metadata->>'createdByOwnerEmail', '')),
  created_at = coalesce(entitlements.created_at, entitlements.granted_at, normalized.metadata_created_at, timezone('utc', now())),
  updated_at = coalesce(entitlements.updated_at, normalized.metadata_updated_at, entitlements.granted_at, timezone('utc', now()))
from normalized
where entitlements.id = normalized.id;

alter table public.entitlements
  alter column email_normalized set not null,
  alter column status set default 'active',
  alter column status set not null,
  alter column created_at set default timezone('utc', now()),
  alter column created_at set not null,
  alter column updated_at set default timezone('utc', now()),
  alter column updated_at set not null;

alter table public.entitlements
  drop constraint if exists entitlements_status_check;

alter table public.entitlements
  add constraint entitlements_status_check
  check (status in (
    'active',
    'trialing',
    'past_due',
    'paused',
    'cancelled',
    'expired',
    'revoked',
    'manual_recovery'
  ));

create unique index if not exists entitlements_user_email_plan_key
  on public.entitlements (user_email, plan);

create index if not exists entitlements_email_normalized_idx
  on public.entitlements (email_normalized);

create index if not exists entitlements_status_idx
  on public.entitlements (status);

create index if not exists entitlements_expires_at_idx
  on public.entitlements (expires_at)
  where expires_at is not null;

create index if not exists entitlements_revoked_at_idx
  on public.entitlements (revoked_at)
  where revoked_at is not null;

create index if not exists entitlements_provider_subscription_id_idx
  on public.entitlements (provider, provider_subscription_id)
  where provider_subscription_id is not null;

create index if not exists entitlements_provider_event_id_last_idx
  on public.entitlements (provider, provider_event_id_last)
  where provider_event_id_last is not null;

-- Create stronger unique provider indexes only when existing data is already clean.
do $$
begin
  if not exists (
    select 1
    from public.entitlements
    where provider is not null and provider_subscription_id is not null
    group by provider, provider_subscription_id
    having count(*) > 1
  ) then
    create unique index if not exists entitlements_provider_subscription_uidx
      on public.entitlements (provider, provider_subscription_id)
      where provider is not null and provider_subscription_id is not null;
  end if;

  if not exists (
    select 1
    from public.entitlements
    where provider is not null and provider_order_id is not null
    group by provider, provider_order_id
    having count(*) > 1
  ) then
    create unique index if not exists entitlements_provider_order_uidx
      on public.entitlements (provider, provider_order_id)
      where provider is not null and provider_order_id is not null;
  end if;
end $$;

create or replace function public.set_entitlements_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_entitlements_updated_at on public.entitlements;

create trigger set_entitlements_updated_at
before update on public.entitlements
for each row
execute function public.set_entitlements_updated_at();

comment on table public.entitlements is
  'Commercial entitlement lifecycle table for paid, manual test, recovery, subscription, revocation, and expiration states.';

comment on column public.entitlements.email_normalized is
  'Lowercase trimmed buyer email used for access checks and indexes.';

comment on column public.entitlements.status is
  'Internal lifecycle status: active, trialing, past_due, paused, cancelled, expired, revoked, manual_recovery.';

comment on column public.entitlements.provider_event_id_last is
  'Last processed provider event id for diagnostics only. Use audit events for full webhook dedupe.';

-- Rollback notes:
-- 1. Roll app code back to metadata-only access before dropping lifecycle columns.
-- 2. Drop trigger set_entitlements_updated_at and function public.set_entitlements_updated_at.
-- 3. Drop new indexes if needed. Preserve public.entitlements and metadata.
