# Premium Entitlement Flow

Premium access is controlled by entitlement state, not by login eligibility.

## Runtime Flow

- Auth: Google session identifies the user email.
- Owner check: owners can administer and bypass paid gates for internal inspection.
- Entitlement check: Supabase rows grant Solo, Pro, or Full Signature access.
- Lifecycle check: revoked or expired rows must not unlock premium access.
- Download gate: protected assets are served only after session and active entitlement checks.

## Normal Paid Path

`/pricing` -> `/checkout/[plan]` -> Lemon checkout -> `/api/webhooks/lemon` -> Supabase entitlement -> `/vault`

The buyer must sign in with Google using the same email used for checkout.

## Manual Test Path

`/admin/entitlements` -> owner-only `/api/entitlements/grant` -> Supabase entitlement with `manual_owner_test:<provider>`

Manual tests are temporary. Current app code stores lifecycle fields in `metadata` for compatibility with the existing Supabase table:

- `grantMode`
- `provider`
- `createdByOwnerEmail`
- `createdAt`
- `updatedAt`
- `trialEndsAt`
- `expiresAt`
- `internalNote`

Allowed trial durations are 7, 14, and 30 days. Default is 14 days.

## Paid Recovery Path

`/admin/entitlements` -> owner-only `/api/entitlements/grant` -> Supabase entitlement with `manual_owner_paid_recovery:<provider>`

Paid recovery is only for confirmed payment exceptions. `recoveryReason` is required and the owner must review payment evidence before creating the entitlement.

## Revocation Path

`/admin/entitlements` -> owner-only `/api/entitlements/revoke` -> entitlement metadata update

Revocation stores:

- `revokedAt`
- `revokedBy`
- `revokeReason`
- `updatedAt`
- `revocationSource`

Revoked rows remain auditable but no longer unlock premium vaults or protected downloads.

## Supabase Migration TODO

The current table stores lifecycle fields inside `metadata` so production does not break without a schema change.
Before broad sales, decide whether to add indexed physical columns for reporting, cancellation automation, and faster lifecycle filtering:

- `expires_at timestamptz`
- `trial_ends_at timestamptz`
- `revoked_at timestamptz`
- `revoked_by text`
- `revoke_reason text`
- `internal_note text`
- `created_by_owner_email text`
- `updated_at timestamptz`

Do not remove metadata compatibility until deployed data has been migrated.

## Phase 4 Local Lifecycle

Local migrations now prepare real columns and audit events:

- `apps/web/supabase/migrations/20260519_0001_entitlements_lifecycle.sql`
- `apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql`

Access checks support both real columns and metadata fallback.

Subscription lifecycle states:

- `active`: can unlock premium.
- `trialing`: can unlock premium until `trial_ends_at`.
- `manual_recovery`: can unlock premium after owner-reviewed payment evidence.
- `past_due`: blocked by default after payment failed.
- `paused`: blocked by default.
- `cancelled`: blocked by default until a paid-period policy is approved.
- `expired`: blocked.
- `revoked`: blocked.

Run local validation before any commercial test:

```bash
pnpm run verify:supabase-migrations
pnpm run verify:webhook-lifecycle
pnpm run verify:webhook-contracts
pnpm run verify:entitlement-state-machine
pnpm run verify:entitlement-audit
pnpm run verify:commercial-lifecycle
```

Phase 5 adds sanitized Lemon fixtures, a local entitlement state machine, RLS
planning, and `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`. Wide sales remain
blocked until Supabase and Lemon are validated in staging with sanitized
evidence.
