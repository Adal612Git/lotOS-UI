create table if not exists public.entitlements (
  id bigserial primary key,
  user_email text not null,
  plan text not null check (plan in ('free', 'solo', 'pro', 'launch_pack')),
  granted_at timestamptz not null default timezone('utc', now()),
  source text not null,
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists entitlements_user_email_plan_key
  on public.entitlements (user_email, plan);

create index if not exists entitlements_user_email_idx
  on public.entitlements (user_email);

-- Lifecycle compatibility:
-- The app currently stores trial/revocation audit fields in metadata so existing
-- deployments do not require an immediate destructive migration.
--
-- Metadata keys used by the app:
-- grantMode, provider, createdByOwnerEmail, createdAt, updatedAt, expiresAt,
-- trialEndsAt, revokedAt, revokedBy, revokeReason, internalNote,
-- paymentReference, recoveryReason.
--
-- TODO before broad sales:
-- decide whether to add indexed physical columns for expires_at, trial_ends_at,
-- revoked_at, revoked_by, revoke_reason, internal_note, created_by_owner_email,
-- and updated_at. Keep metadata compatibility until deployed rows are migrated.
