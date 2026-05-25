# Supabase Local Dry-Run

This document describes the local static dry-run for entitlement lifecycle migrations.
It does not apply migrations and does not require secrets in CI.

## Scope

`pnpm run verify:supabase-migrations` validates migration files without touching
Supabase, Docker, `psql`, or a remote database.

It checks:

- migration filename order
- lifecycle columns
- lifecycle indexes
- status constraints
- audit table shape
- metadata `jsonb`
- `updated_at` trigger
- rollback notes
- destructive SQL patterns
- dry-run documentation

It does not validate:

- Postgres execution
- remote Supabase permissions
- live RLS behavior
- staging or production data quality
- Lemon webhook delivery

## Local Commands

```bash
pnpm run verify:supabase-migrations
pnpm run verify:webhook-lifecycle
pnpm run verify:entitlement-audit
pnpm run verify:commercial-lifecycle
pnpm --filter web check-types
```

Supabase CLI is optional for humans. Do not make it required in CI until the
team has a stable local database image and a non-secret seed workflow.

## Optional Local Supabase

If a human has Supabase CLI installed, use a disposable local project only:

```bash
supabase start
supabase db reset
```

Then inspect the resulting schema locally. Do not point these commands at a
remote project from an agent session.

## Staging First

Before any production migration:

1. Back up staging `public.entitlements`; the backup must be verified before migration.
2. Apply `20260519_0001_entitlements_lifecycle.sql`.
3. Apply `20260519_0002_entitlement_audit_events.sql`.
4. Verify columns, indexes, constraints, trigger, and audit table.
5. Verify no raw webhook payload, signature, token, cookie, or full email fields were added.
6. Run purchase, duplicate webhook, invalid signature, failure, pause, resume, cancel, expire, revoke, and paid recovery tests.

## Rollback

Rollback is human-only:

1. Roll app code back before changing schema.
2. Preserve `public.entitlements` and `metadata`.
3. Export audit rows if they have operational value.
4. Drop only the new trigger/function/indexes if needed.
5. Avoid dropping entitlement data.

Wide sales stay blocked until staging validation evidence exists.
