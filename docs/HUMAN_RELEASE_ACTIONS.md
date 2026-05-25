# Human Release Actions

This file tracks human-only actions. Do not invent real legal, payment, support, or domain values in code.

## Supabase

- Back up `public.entitlements`.
- Run lifecycle migration in staging only.
- Inspect malformed metadata timestamps before production migration.
- Run audit events migration in staging.
- Confirm `entitlement_audit_events` writes without storing raw emails or secrets.
- Test revocation, payment failed, pause, resume, cancel, expiration, and paid recovery.
- Complete `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`.
- Store sanitized evidence and update `.release/lifecycle-validation.json` only after staging validation.

## Lemon

- Validate exact webhook event names in the live Lemon dashboard/docs.
- Confirm webhook signature secret is configured only in private env.
- Test duplicate webhook delivery.
- Test invalid signature.
- Test purchase and subscription lifecycle events.
- Validate `subscription_payment_recovered` and resume/unpause names against the current dashboard/docs.

## Commercial Ops

- Define payment failed grace-period policy.
- Define cancelled access policy: immediate block vs paid-period access.
- Define audit retention.
- Define who can approve paid recovery evidence.
- Keep public release blocked until secrets and premium split are resolved.
- Keep wide sales blocked until `supabase_remote_validated` and `lemon_remote_validated` are both true in release evidence.
