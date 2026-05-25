# Supabase RLS Policy Plan

This plan is intentionally conservative. The app currently writes and reads
entitlements through server-side service role calls. RLS is not treated as the
only access boundary until staging validates the final Supabase posture.

## Current Model

- Owner-only APIs require Google session plus `LOTOS_OWNER_EMAILS`.
- Buyer vault and downloads call server-side access helpers.
- `public.entitlement_audit_events` enables RLS in the local audit migration.
- `public.entitlements` must be reviewed in staging before broad access.

Service role bypasses RLS, so Owner-only APIs must keep their application-level
checks. RLS cannot replace `isOwnerEmail`.

## Target Model

- Base table `public.entitlements` remains private.
- Buyers must not select from public.entitlements directly.
- Buyers use only the server-rendered vault, protected download route, or a
  sanitized view or RPC if a future browser-readable surface is needed.
- Audit events are append-only through server/service-role paths.
- No `anon` grants should expose entitlement or audit rows.

## Buyer-Prohibited Columns

Buyer-facing surfaces must not expose:

- `metadata`
- `internal_note`
- `created_by_owner_email`
- `revoked_by`
- `revoke_reason`
- `provider_customer_id`
- `provider_subscription_id`
- `provider_order_id`
- `provider_event_id_last`

## Policy Work Before Wide Sales

1. Confirm whether `public.entitlements` has RLS enabled in staging.
2. Confirm no broad grants to `anon` or `authenticated` expose base rows.
3. If browser-readable status is required, create a sanitized view or RPC.
4. Keep owner lookup, grant, and revoke behind server-side owner checks.
5. Keep audit events service-role only unless a sanitized admin view is added.
6. Validate protected downloads call the central access engine.

## Idempotency Note

The audit migration uses a final-state unique index for provider event ids:
`webhook_applied` and `webhook_ignored` are unique per provider event. This
allows `webhook_received` and `webhook_applied` to coexist for one provider
event while still preventing duplicate final application.

## Remote Safety

- Stage first.
- Back up before migration.
- Do not add `using (true)` policies.
- Do not grant direct select on `public.entitlements` to buyers.
- Do not paste secrets or raw webhook payloads into SQL comments, tickets, or logs.

Public release remains blocked for unrelated secret/premium reasons. Wide sales
blocked until RLS, Supabase staging migrations, and Lemon lifecycle behavior are
validated with human evidence.

Wide sales blocked means `wide_sales_ready` must stay false in release evidence
until Supabase and Lemon staging validation are complete.
