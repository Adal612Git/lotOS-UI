-- LotOS UI entitlement audit trail migration.
-- Local migration only. Review, back up, and test in staging before remote execution.

create table if not exists public.entitlement_audit_events (
  id bigserial primary key,
  entitlement_id bigint references public.entitlements(id) on delete set null,
  actor_type text not null check (actor_type in ('owner', 'webhook', 'system')),
  actor_ref_hash text,
  action text not null check (
    action in (
      'manual_test_granted',
      'paid_recovery_granted',
      'entitlement_revoked',
      'webhook_received',
      'webhook_ignored',
      'webhook_applied',
      'webhook_failed',
      'entitlement_expired',
      'entitlement_status_changed'
    )
  ),
  reason text,
  provider text,
  provider_event_id text,
  created_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb,
  constraint entitlement_audit_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists entitlement_audit_events_entitlement_id_idx
  on public.entitlement_audit_events (entitlement_id);

create index if not exists entitlement_audit_events_provider_event_id_idx
  on public.entitlement_audit_events (provider, provider_event_id)
  where provider_event_id is not null;

create unique index if not exists entitlement_audit_events_provider_event_final_uidx
  on public.entitlement_audit_events (provider, provider_event_id)
  where provider is not null
    and provider_event_id is not null
    and action in ('webhook_applied', 'webhook_ignored');

create index if not exists entitlement_audit_events_created_at_idx
  on public.entitlement_audit_events (created_at desc);

create index if not exists entitlement_audit_events_action_created_at_idx
  on public.entitlement_audit_events (action, created_at desc);

alter table public.entitlement_audit_events enable row level security;

comment on table public.entitlement_audit_events is
  'Append-only sanitized audit trail for entitlement grants, revocations, and provider webhook lifecycle.';

comment on column public.entitlement_audit_events.actor_ref_hash is
  'Hash of owner or system actor reference. Do not store raw emails or secrets here.';

comment on column public.entitlement_audit_events.provider_event_id is
  'Provider webhook event id used for idempotency. Only final webhook_applied/webhook_ignored rows are unique so webhook_received can coexist.';

-- Rollback notes:
-- 1. Disable app writes to audit events first.
-- 2. Export audit records if they have operational value.
-- 3. Drop public.entitlement_audit_events only after confirming no release process depends on it.
