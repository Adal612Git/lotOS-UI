# Admin Journey

Owner status is only for administration, manual grants, paid recovery, and revocation.
It must not become the buyer login allowlist.

## Owner Flow

1. Owner signs in with Google.
2. Owner email must match `LOTOS_OWNER_EMAILS`.
3. Owner opens `/admin/entitlements`.
4. Owner chooses one action:
   - temporary test grant
   - paid recovery after confirmed payment evidence
   - revocation with a required reason
5. User still signs in with Google using the granted email.

## Temporary Test Grant

- Use only for QA, demos, pilots, or controlled validation.
- Source must be `manual_owner_test:<provider>`.
- Default duration is 14 days.
- Allowed durations are 7, 14, and 30 days.
- Metadata should include `trialEndsAt`, `expiresAt`, `createdByOwnerEmail`, `createdAt`, and `updatedAt`.
- It is not revenue and must not be described as a purchase.

## Paid Recovery

- Use only when there was a real payment and checkout, webhook, or email matching failed.
- Source must be `manual_owner_paid_recovery:<provider>`.
- `recoveryReason` is required.
- Owner must review payment evidence before granting access.
- Optional `paymentReference` and `internalNote` can help audit the recovery.

## Revocation

- Revocation is owner-only through `/api/entitlements/revoke`.
- `reason` is required.
- Metadata records `revokedAt`, `revokedBy`, `revokeReason`, and `updatedAt`.
- The user may still sign in with Google, but premium vaults and downloads stop opening if no active entitlement remains.

## Boundaries

- Do not grant access from client-only state.
- Do not let non-owner accounts create or revoke entitlements.
- Do not print owner emails, buyer emails, entitlement URLs, tokens, or webhook payloads in sensitive logs.
- Normal purchases should flow through `/pricing` -> `/checkout/[plan]` -> Lemon webhook -> Supabase entitlement -> `/vault`.

## Phase 4 Operations

- Use lookup in `/admin/entitlements` before granting recovery or revoking.
- Do not reactivate revoked access through the normal grant form.
- Paid recovery requires a recovery reason and an evidence-reviewed checkbox.
- Payment failed, paused, cancelled, and expired states should come from verified provider webhooks.
- If webhook lifecycle is uncertain, keep access blocked and investigate in Supabase/Lemon staging.
- Staging validation uses `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`; do not treat manual paid recovery as a substitute for webhook validation.
