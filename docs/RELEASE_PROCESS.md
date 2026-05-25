# Release Process

## Private Release Candidate

Private RC means the product can be tested commercially inside the private workspace.
It does not mean the repo is safe to make public.

```bash
pnpm run verify:release-candidate
pnpm run verify:go-live
pnpm run verify:commercial
pnpm run verify:entitlement-boundary
pnpm run verify:webhook-lifecycle
pnpm run verify:supabase-migrations
pnpm run verify:entitlement-audit
pnpm run verify:commercial-lifecycle
pnpm --filter web build
```

## Public Repo Release

Public release is blocked until premium code/assets and local secrets are removed. Phase 6 adds a read-only clean-room gate that proves the public tree, docs, AI/MCP context, premium stubs, and npm tarballs are safe before a branch or package release.

```bash
pnpm run verify:public-clean-room
pnpm run verify:public-release
```

Expected current result: blocked.

Evidence:

- `.release/public-clean-room-report.json`
- `.release/public-tree-report.json`
- `.release/npm-tarball-report.json`
- `.release/public-ai-context-report.json`

## npm Publish

Do not publish manually from a dirty workspace.
Use `.github/workflows/publish-npm.yml` only after public release gates pass.

Public package allowlist:

- `@lotosui/registry`
- `@lotosui/core`
- `@lotosui/sentinel`
- `@lotosui/cli`
- `@lotosui/claude-arm`
- `@lotosui/web-components`

Premium packages are never published by the public workflow.

## Entitlement Boundary

Before a release candidate is used with real buyers, run:

```bash
pnpm run verify:entitlement-boundary
```

This gate confirms that manual test access, paid recovery, and revocation remain owner-only, documented, registry-backed, and reflected in generated AI artifacts.
It does not replace a live Supabase migration review or payment-provider configuration review.

## Phase 4 Lifecycle Release

Phase 4 remains local-only until staging validation is complete.

Before wide sales:

- run the Supabase lifecycle migration in staging
- run the audit events migration in staging
- verify purchase, payment failed, pause, resume, cancel, expiration, and revocation
- confirm Lemon event names against the live provider dashboard/docs
- confirm paid recovery policy and evidence review ownership

## Phase 5 Local Staging Harness

Phase 5 adds local provider fixtures, contract gates, state-machine checks,
RLS planning, and machine-readable lifecycle evidence.

```bash
pnpm run verify:webhook-contracts
pnpm run verify:entitlement-state-machine
pnpm run verify:admin-lifecycle
pnpm run verify:vault-lifecycle
pnpm run verify:rls-policy-plan
pnpm run verify:commercial-lifecycle
```

`.release/lifecycle-validation.json` must keep `wide_sales_ready` false until a
human completes `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md` against staging
Supabase and Lemon.

## Phase 6 Public Clean Room

Phase 6 is local-only preparation for a public branch. It does not delete secrets, move premium, change repo visibility, publish npm, or run external provider operations.

```bash
pnpm run release:public-tree:check
pnpm run verify:public-docs
pnpm run verify:public-ai-context
pnpm run verify:npm-tarballs
pnpm run verify:premium-stubs
pnpm run verify:public-clean-room
```

The public branch is not approved until the clean-room report has no blockers.
