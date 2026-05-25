# Entitlement Audit

This audit describes the commercial access boundary for paid, manual test, paid recovery, webhook lifecycle, and revocation flows.

## Sources

- `lemon`: automatic paid unlock from `/api/webhooks/lemon`.
- `manual_owner_test:<provider>`: temporary owner-created test access.
- `manual_owner_paid_recovery:<provider>`: owner-created recovery after confirmed payment evidence.
- `manual_owner_revoke`: metadata marker used when owner revokes an entitlement.

## Lifecycle Fields

Current implementation stores lifecycle data in Supabase `metadata` for compatibility with the existing table:

- `grantMode`
- `provider`
- `plan`
- `createdByOwnerEmail`
- `createdAt`
- `updatedAt`
- `expiresAt`
- `trialEndsAt`
- `revokedAt`
- `revokedBy`
- `revokeReason`
- `internalNote`
- `paymentReference`
- `recoveryReason`

The app treats `revokedAt` and expired `expiresAt` or `trialEndsAt` as inactive.

## Audit Table

Local migration: `apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql`.

Table: `public.entitlement_audit_events`.

Fields:

- `id`
- `entitlement_id`
- `actor_type`
- `actor_ref_hash`
- `action`
- `reason`
- `provider`
- `provider_event_id`
- `created_at`
- `metadata`

`actor_ref_hash` must not store raw owner or buyer email. Use `ENTITLEMENT_AUDIT_HASH_PEPPER` in deployment before relying on hash correlation.

Audit metadata is allowlisted. Do not store raw webhook body, signature, token, cookie, authorization header, secret, owner email, or buyer email.

Provider event id uniqueness is applied only to final webhook outcomes
(`webhook_applied` and `webhook_ignored`) so `webhook_received` can coexist
with the final event for the same provider event id.

## Owner-Only Boundary

- Grant route: `/api/entitlements/grant`
- Revoke route: `/api/entitlements/revoke`
- Admin UI: `/admin/entitlements`

Each route must require a Google session and `LOTOS_OWNER_EMAILS` authorization through `isOwnerEmail`.
Client-side UI is not an access boundary.

## Abuse Prevention

- Normalize buyer email before writes.
- Only allow paid plans for manual grants and revocation; web plan normalization is backed by the registry plan catalog.
- Only allow known providers: `lemon_squeezy`, `mercado_pago`, `paypal`, and `manual`.
- Require `recoveryReason` for paid recovery.
- Require `reason` for revocation.
- Keep manual test durations to 7, 14, or 30 days.
- Do not log entitlement URLs, buyer emails, owner emails, OAuth tokens, webhook secrets, or Supabase keys.

## Retention

Keep audit events long enough to resolve refunds, payment disputes, and entitlement incidents.
Define final retention with legal/support policy before wide sales.

## Release Gate

Run:

```bash
pnpm run verify:entitlement-boundary
pnpm run verify:entitlement-audit
pnpm run verify:webhook-contracts
pnpm run verify:entitlement-state-machine
```

The gate writes `.release/entitlement-audit-checklist.json` and checks that registry, generated AI files, docs, admin UI, grant/revoke APIs, and vault copy stay aligned.

## Human Decisions Before Broad Sales

- Decide whether lifecycle metadata is enough or whether Supabase needs physical indexed columns.
- Add subscription cancellation, failed payment, pause, resume, and expiration automation.
- Confirm refund and chargeback procedures.
- Confirm who can approve paid recovery evidence.

## Rollback

Before dropping `entitlement_audit_events`, disable app writes, export any operational audit records, and confirm no release checklist depends on the table.

Use `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md` for human evidence before wide sales.
