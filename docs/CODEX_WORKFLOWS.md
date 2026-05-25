# Codex Workflows

## Investigation

- Prefer `rg` and focused file reads.
- Start from registry and `.ai/` before scanning pages.
- Do not revert unrelated dirty work.
- Report secret risks by path and risk type only.

## Implementation

- Update registry first when changing components, templates, runtimes, routes, env requirements, asset rules, pricing plans, or release readiness.
- Regenerate `.ai` artifacts with `pnpm --filter @lotosui/registry generate:ai`.
- Build CLI before judging CLI help or command availability.
- Keep premium imports out of public packages.

## Auth/Premium/Security Checklist

- Read `.ai/lotos.commercial.json` and `.ai/lotos.entitlements.json`.
- Confirm owner bypass is not buyer login.
- Confirm entitlement checks protect paid routes/downloads.
- Confirm manual test, paid recovery, and revocation stay owner-only.
- Confirm temporary tests expire and paid recovery requires evidence plus reason.
- Run `verify:no-secrets`, `verify:no-premium-leak`, and `verify:private-workspace`.
- Run `verify:entitlement-boundary` when touching auth, vault, checkout, entitlement, or admin code.
