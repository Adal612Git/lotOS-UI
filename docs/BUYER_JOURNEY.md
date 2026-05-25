# Buyer Journey

1. Buyer lands on `/pricing`.
2. Buyer reviews free and paid tiers.
3. Buyer signs in with Google when checkout or vault access needs identity.
4. Buyer starts `/checkout/[plan]`.
5. Lemon checkout completes with the same email.
6. Webhook grants a Supabase entitlement.
7. Buyer opens `/vault`.
8. Protected downloads require Google session plus active entitlement.

Manual test access is separate from the buyer journey. Ricardo can grant temporary access from `/admin/entitlements` for QA, demos, or pilots without payment, but normal buyers should still use checkout and webhook unlock.

Paid recovery is also separate from normal buying. It is only for cases where a real payment exists and checkout, webhook, or email matching failed.

## Buyer States In Vault

- Paid purchase: entitlement source is automatic checkout/webhook.
- Paid recovery: entitlement source is `manual_owner_paid_recovery:<provider>` after evidence review.
- Manual test: entitlement source is `manual_owner_test:<provider>` and should show an expiration.
- Expired: entitlement record exists but no longer unlocks premium.
- Revoked: entitlement record exists for audit but no longer unlocks premium.
- Payment failed or subscription paused: premium access requires payment attention.
- Cancelled or expired subscription: buyer should return to pricing or support.

## Failure States

- Checkout missing: route returns to pricing with a configuration state.
- Entitlement lookup failed: route fails closed and returns to pricing or shows a safe degraded state.
- Expired or revoked entitlement: premium vaults and downloads should remain locked.
- Asset missing: download returns a generic private bundle staging error.

Buyer-facing copy must not imply that Google login alone unlocks premium assets.

## Staging Test Checklist

- Test a real purchase and confirm the vault shows active paid access.
- Test payment failed and confirm premium stays blocked.
- Test cancellation and expiration before wide sales.
- Test revocation from owner admin and confirm buyer gets a generic support message.
- Test paid recovery only after evidence review; do not use it as a normal buyer path.
- Complete `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md` before using buyer lifecycle behavior as sales evidence.
