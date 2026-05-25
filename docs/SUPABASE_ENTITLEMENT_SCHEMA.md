# Supabase Entitlement Schema

This document describes the local Phase 4 migrations. Do not run them against a remote Supabase project until the data has been backed up and reviewed.

## Local Migrations

- `apps/web/supabase/migrations/20260519_0001_entitlements_lifecycle.sql`
- `apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql`

The first migration upgrades `public.entitlements` from metadata-only lifecycle to real indexed columns while keeping `metadata` as a compatibility layer.

The second migration creates `public.entitlement_audit_events` for sanitized audit records and webhook idempotency.

## Entitlement Columns

- `email_normalized`
- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `provider_order_id`
- `provider_event_id_last`
- `plan`
- `status`
- `source`
- `trial_ends_at`
- `expires_at`
- `revoked_at`
- `revoked_by`
- `revoke_reason`
- `internal_note`
- `created_by_owner_email`
- `created_at`
- `updated_at`
- `metadata`

Allowed `status` values:

- `active`
- `trialing`
- `past_due`
- `paused`
- `cancelled`
- `expired`
- `revoked`
- `manual_recovery`

## Indexes

The local migration adds indexes for `email_normalized`, `status`, `expires_at`, `revoked_at`, `provider_subscription_id`, and `provider_event_id_last`.

Unique provider indexes are created only when existing data is clean enough to avoid migration failure.

## Backfill

The migration backfills from existing `metadata` keys and `source`:

- `manual_owner_test:*` becomes `trialing` unless already expired or revoked.
- `manual_owner_paid_recovery:*` becomes `manual_recovery`.
- legacy Lemon rows become `active`.
- malformed metadata timestamps are ignored rather than force-cast.

## Rollback Notes

Do not drop `public.entitlements`.

Safe rollback order:

1. Roll app code back to metadata-only access.
2. Drop `set_entitlements_updated_at` trigger and function.
3. Drop new indexes if needed.
4. Keep `metadata` and existing rows.

## Validation

Local only:

```bash
pnpm run verify:supabase-migrations
pnpm run verify:entitlement-boundary
pnpm run verify:rls-policy-plan
pnpm --filter web check-types
```

Remote validation must be done manually in staging first. Do not paste secret values into logs or tickets.

See:

- `docs/SUPABASE_LOCAL_DRY_RUN.md`
- `docs/SUPABASE_RLS_POLICY_PLAN.md`
- `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`
