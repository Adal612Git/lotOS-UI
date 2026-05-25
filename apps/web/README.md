# apps/web

Commercial web surface for LotOS UI.

This app contains:

- marketing pages
- public demos
- pricing and checkout routes
- Google sign-in
- paid vault routes
- owner-only entitlement admin for test grants, paid recovery, and revocation
- Lemon Squeezy webhook handling
- subscription lifecycle mapping for payment failed, pause, resume, cancel, and expiration
- protected asset downloads backed by entitlements

## Local run

From the monorepo root:

```powershell
pnpm.cmd --filter web dev
```

Open `http://localhost:3000`.

## Required env

Copy `apps/web/.env.example` into your private deployment environment and set:

- auth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`
- vault state: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- automatic Lemon unlock: `LEMON_WEBHOOK_SECRET`, `LEMON_STORE_SLUG`, `LEMON_*_VARIANT_ID`
- protected bundle location: `LOTOS_PRIVATE_ASSETS_ROOT` or stage files into `packages/pro/.private-dist/`

Important:

- `LOTOS_OWNER_EMAILS` should contain only internal operator accounts
- do not leave your personal email hardcoded in templates or deploy previews
- run `pnpm.cmd run verify:go-live` before production rollout

## Commercial routes

- `/pricing`
- `/checkout/[plan]`
- `/after-purchase`
- `/vault`
- `/vault/solo`
- `/vault/pro`
- `/vault/launch`
- `/admin/entitlements`
- `/api/entitlements/grant`
- `/api/entitlements/revoke`
- `/api/webhooks/lemon`
- `/api/download/[asset]`

## Two entitlement paths

1. Normal paid path: buyer signs in, starts `/checkout/[plan]`, Lemon sends `/api/webhooks/lemon`, and Supabase grants entitlement.
2. Ricardo/admin test path: owner opens `/admin/entitlements` and grants temporary access without payment for QA, demos, or pilots. This writes `manual_owner_test:*` source metadata and does not count as paid revenue.
3. Paid recovery path: owner grants access only after reviewing evidence of a real payment. This writes `manual_owner_paid_recovery:*` and requires a recovery reason.
4. Revocation path: owner records a required reason in `/admin/entitlements`; revoked rows stay auditable but stop unlocking premium access.

Temporary test access defaults to 14 days and can be set to 7, 14, or 30 days.
The user still needs to sign in with Google using the granted email.

## What makes self-service work

The buyer can pay and use the product without manual intervention only if all of this is true:

1. checkout URLs or managed Lemon store are configured
2. Lemon sends webhook events to `/api/webhooks/lemon`
3. Supabase `entitlements` table exists
4. the buyer signs in with the same email used at checkout
5. protected assets are staged outside the public repo or in a private deployment-only bundle

If any of those fail, the buyer can still pay, but unlock becomes manual.

## What this app does not solve by itself

- GitHub repo visibility
- npm organization billing or private package access policy
- staging private assets outside source control
- Lemon dashboard setup
- Supabase project provisioning
- executing Supabase migrations remotely
- validating exact Lemon event names in the live provider dashboard
- running the staging lifecycle runbook in `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`

If the premium React package source stays inside a public repository, paid code is still exposed even if the vault works.
