# Webhook Lifecycle

LotOS UI handles Lemon webhooks only after signature validation. Webhook payloads must never be trusted before `X-Signature` passes HMAC validation.

## Supported Local Mapping

The local mapper lives in `apps/web/lib/webhooks/lemon-event-mapper.ts`.
The exact Lemon event names must be validated against current Lemon docs and a live test store before wide sales.

Local mapping:

- `order_created` -> `active`
- `subscription_created` -> `active`
- `subscription_updated` -> `active`
- `subscription_payment_success` -> `active`
- `subscription_payment_recovered` -> `active`
- `subscription_payment_failed` -> `past_due`
- `subscription_paused` -> `paused`
- `subscription_resumed` -> `active`
- `subscription_unpaused` -> `active`
- `subscription_cancelled` -> `cancelled`
- `subscription_expired` -> `expired`

`past_due`, `paused`, `cancelled`, `expired`, and `revoked` do not unlock premium access by default.

## Idempotency

The webhook route extracts a provider event id and checks `entitlement_audit_events` before applying a mutation.
After the audit migration is applied, `provider + provider_event_id` acts as the local idempotency boundary.

Without the audit migration, the app still works in private workspace mode, but idempotency is not production-grade.

## Audit Events

The webhook records sanitized audit events:

- `webhook_received`
- `webhook_ignored`
- `webhook_applied`
- `webhook_failed`

Do not store raw payloads, signatures, cookies, tokens, full emails, or authorization headers in audit metadata.

## Manual Paid Recovery

Paid recovery is not a substitute for the webhook normal path.
Use paid recovery only when:

- a real payment exists
- the buyer email was reviewed
- the webhook, checkout, or email match failed
- owner recorded a `recoveryReason`
- owner marked evidence as reviewed

Do not use paid recovery to bypass payment.

## Test Plan

Local checks:

```bash
pnpm run verify:webhook-lifecycle
pnpm run verify:webhook-contracts
pnpm run verify:entitlement-state-machine
pnpm run verify:entitlement-audit
pnpm run verify:supabase-migrations
pnpm --filter web check-types
```

Sanitized Lemon fixtures live in `apps/web/test/fixtures/lemon/` and are
documented in `docs/LEMON_FIXTURES.md`. They use fake ids, `example.test`
emails, and test signature placeholders only.

Manual staging checks before live sales:

1. Test purchase and confirm `active`.
2. Test payment failed and confirm `past_due` blocks premium.
3. Test payment recovered and confirm access returns only when not revoked.
4. Test pause and resume.
5. Test cancellation and expiration.
6. Test duplicate webhook delivery.
7. Test invalid signature and confirm no entitlement mutation.
8. Test paid recovery only after evidence review.

Do not run remote migrations from this repo session. Do not paste secrets or raw webhook bodies into logs.
Use `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md` before treating local contract
tests as wide-sales evidence.
