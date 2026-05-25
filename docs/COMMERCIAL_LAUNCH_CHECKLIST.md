# Commercial Launch Checklist

Do not treat this as legal advice or final legal text.

## Before Selling

- Set real `LOTOS_PROVIDER_*` values.
- Set real `LOTOS_SUPPORT_*` values.
- Approve final pricing and currency.
- Configure real domain and production callback URLs.
- Confirm Lemon live products and variant ids.
- Confirm Supabase entitlement table and RLS policy.
- Confirm `/admin/entitlements` owner list is limited to internal operators.
- Confirm paid recovery evidence review policy.
- Confirm revocation procedure and audit retention.
- Add subscription cancellation, failed payment, pause, resume, and expiration automation before relying on monthly access at scale.
- Apply and validate Supabase lifecycle/audit migrations in staging before production.
- Validate exact Lemon webhook event names before live subscription sales.
- Complete `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md` and store sanitized evidence before wide sales.
- Keep `.release/lifecycle-validation.json` with `wide_sales_ready: false` until Supabase and Lemon staging validation are complete.

## Buyer-Facing Copy

- Mark pricing as placeholder until approved.
- Keep legal pages as operational drafts until reviewed.
- Keep support/contact visible and real.
- Explain free, Solo, Pro, Full Signature, and Enterprise/Guided without implying all tiers deliver the same assets.
- Do not describe manual test access as a purchase.
- Do not describe paid recovery as a shortcut around checkout; it only applies after real payment evidence.

## Entitlement Launch Gates

- `pnpm run verify:entitlement-boundary`
- `pnpm run verify:web-smoke`
- `pnpm run verify:routes`
- `pnpm run verify:generated-ai`
- `pnpm run verify:release-readiness`
- `pnpm run verify:webhook-lifecycle`
- `pnpm run verify:supabase-migrations`
- `pnpm run verify:entitlement-audit`
- `pnpm run verify:commercial-lifecycle`
- `pnpm run verify:webhook-contracts`
- `pnpm run verify:entitlement-state-machine`
- `pnpm run verify:admin-lifecycle`
- `pnpm run verify:vault-lifecycle`
- `pnpm run verify:rls-policy-plan`

Selling broadly is blocked until revocation is tested against real Supabase data and recurring lifecycle events are handled.
