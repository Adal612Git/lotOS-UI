# Staging Lifecycle Test Runbook

This is a human-only staging runbook. Do not run it against production first.
Do not paste secrets, raw webhook payloads, full buyer emails, owner emails,
auth headers, cookies, Supabase keys, or webhook signatures into notes.

Validate exact Lemon Squeezy webhook event names against the current Lemon
dashboard/docs before treating local provider contracts as live-sales evidence.

## Prerequisites

- Dedicated staging Supabase project.
- Dedicated Lemon test or approved small live purchase setup.
- Staging deploy URL configured as Lemon webhook target: `/api/webhooks/lemon`.
- Owner account configured in staging only.
- Buyer account that is not an owner.
- Local checks pass before touching staging:

```bash
pnpm run verify:supabase-migrations
pnpm run verify:webhook-lifecycle
pnpm run verify:webhook-contracts
pnpm run verify:entitlement-state-machine
pnpm run verify:release-readiness
```

## Evidence Folder

Record only sanitized evidence:

- date/time, operator, staging deploy version or commit
- Supabase backup artifact id or storage location
- migration execution timestamp
- sanitized screenshots of dashboard status, vault state, admin lookup, and audit event counts
- Lemon event names and partially redacted event ids
- pass/fail table for every scenario

Do not store DB URLs, OAuth secrets, webhook secrets, raw request bodies, full
emails, cookies, or authorization headers.

## Supabase Backup

1. Export staging schema and entitlement data before migrations.
2. Confirm the backup restoration path exists.
3. Record the backup artifact id only.
4. Stop if backup cannot be verified.

## Apply Staging Migrations

Run in order:

1. `apps/web/supabase/migrations/20260519_0001_entitlements_lifecycle.sql`
2. `apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql`

Verify:

- `public.entitlements` has lifecycle columns and indexes.
- `public.entitlement_audit_events` exists.
- Final provider event id uniqueness applies only to `webhook_applied` and `webhook_ignored`.
- Existing entitlement rows still resolve to expected status.
- No raw payload, raw email, or signature columns were added.

## RLS Verification

- Confirm current RLS state for `public.entitlements`.
- Confirm `public.entitlement_audit_events` has RLS enabled.
- Verify app writes only through server/service-role paths.
- Verify anonymous/browser clients cannot read or mutate audit rows directly.
- Mark wide sales blocked if policies are absent or not intentionally documented.

## Staging Env Checklist

Confirm names and presence only, never values:

- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, publishable or anon key.
- Lemon: `LEMON_WEBHOOK_SECRET`, `LEMON_STORE_SLUG`, plan variant ids.
- Auth: Google OAuth staging client, `AUTH_SECRET`.
- App: `LOTOS_OWNER_EMAILS`, `ENTITLEMENT_AUDIT_HASH_PEPPER`, site URL, private assets root, subscription portal URL if used.

## Provider Contract Validation

In Lemon dashboard/docs, confirm exact event names for:

- order created
- subscription created and updated
- payment success
- payment failed
- payment recovered
- paused
- resumed or unpaused
- cancelled
- expired

Pass only if event names, ids, signature header, and payload locations match
staging behavior. Open a blocker for any drift.

## Test Matrix

### 1. Real Small Purchase

Buyer signs in, buys the smallest approved plan, and the webhook grants an
entitlement.

Pass: `/vault` unlocks, entitlement status is `active`, and sanitized audit has
`webhook_received` and `webhook_applied`.

### 2. Duplicate Webhook

Redeliver the same provider event.

Pass: no duplicate entitlement mutation; response indicates duplicate or audit
idempotency holds.

### 3. Invalid Signature

Send a same-shaped payload with an invalid signature.

Pass: HTTP 401; no entitlement mutation; no trusted audit application.

### 4. Payment Failed

Trigger only if Lemon allows it safely in the selected staging setup.

Pass: status becomes `past_due`; `/vault` blocks premium.

### 5. Pause, Resume, Cancel, Expire

Trigger each provider-supported state.

- Pause pass: `paused`, premium blocked.
- Resume pass: `active`, premium restored unless revoked.
- Cancel pass: `cancelled`, premium blocked unless the final policy changes.
- Expire pass: `expired`, premium blocked.

### 6. Owner Revocation

Owner revokes buyer entitlement from `/admin/entitlements`.

Pass: status `revoked`; buyer can sign in but premium remains blocked; audit
records owner action.

### 7. Paid Recovery With Evidence

Use only after real payment evidence and failed normal unlock.

Pass: owner lookup finds buyer/payment context; recovery requires reason and
evidence checkbox; source is `manual_owner_paid_recovery:<provider>`; vault
unlocks as `manual_recovery`.

### 8. Buyer Vault

Test buyer, owner, revoked buyer, and past_due buyer.

Pass: only `active`, `trialing`, `manual_recovery`, or owner bypass unlock.

### 9. Admin Lookup

Owner can lookup sanitized entitlement state. Non-owner cannot access lookup,
grant, or revoke APIs.

Pass: non-owner receives 403 and no sensitive values appear in UI or logs.

## Pass Criteria

Wide-sales staging validation passes only if:

- backup exists before migration
- migrations apply cleanly in staging
- RLS posture is verified or explicitly blocked for policy work
- Lemon event names are validated against live dashboard/docs
- lifecycle states match vault access rules
- duplicate and invalid-signature tests do not mutate access
- evidence is sanitized and stored

## Fail Criteria

Keep wide sales blocked if:

- backup is missing
- event names are unvalidated
- any secret, raw payload, or full email appears in logs or evidence
- non-owner can grant, revoke, or inspect entitlements
- revoked, paused, past_due, cancelled, or expired users retain premium access

## Rollback

1. Disable Lemon webhook delivery to staging.
2. Disable staging deploy or route traffic away if needed.
3. Restore Supabase from backup if entitlement data is corrupted.
4. If only audit migration fails, preserve exported audit records before dropping the audit table.
5. If lifecycle columns are bad, preserve `metadata` and follow schema rollback notes.
6. Re-run local verification after rollback.

## Follow-Up

- Update the launch checklist with final pass/fail date.
- Attach sanitized evidence to the release ticket.
- Open issues for unresolved RLS, Lemon event-name drift, provider limits, or policy decisions.
