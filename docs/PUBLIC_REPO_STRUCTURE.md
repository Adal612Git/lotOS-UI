# Public Repo Structure

Status: public clean-room plan. This document is a plan, not an executed split.

## Goal

Prepare a public-safe tree without deleting the private workspace. The public branch must contain free/product metadata, public packages, docs, AI context, and MCP contracts without shipping premium source, private bundles, local secrets, or real private storage paths.

## Keep In Public

- `apps/docs`, after public-doc sanitation.
- `packages/registry`.
- `packages/core`.
- `packages/sentinel`.
- `packages/cli`.
- `packages/web-components`.
- `packages/claude-arm`, limited to public free exports.
- Public examples and docs that do not expose premium assets or real credentials.
- `.ai` generated public context after it is sanitized.
- MCP spec and endpoints that return metadata without private paths.
- GitHub workflows, SECURITY, CONTRIBUTING, issue templates, and PR template.

## Remove From Public Export

- `packages/pro`.
- `packages/claude-arm-pro`.
- `packages/pro/.private-dist`.
- `.commercial-dist`.
- Any premium asset bundle or private generated archive.
- `.env`, `.env.local`, `.env.*.local`, `.vercel/.env.*`.
- `client_secret*.json`.
- `.claude/settings.local.json` and local agent settings.
- Local package tarballs such as `*.tgz`.
- Any real private storage URL or storage root.

## Stub In Public

Premium is represented only as metadata:

- Component/template id, name, tier, maturity, category, and entitlement gate.
- Message: "Premium components are distributed through private access after entitlement."
- No premium imports.
- No premium source paths.
- No package exports pointing to `@lotosui/claude-arm-pro`.
- No private bundle paths or download URLs.

## Public Workspace Shape

The public branch should use an explicit workspace list, not `packages/*`, after premium is detached:

```yaml
packages:
  - "apps/docs"
  - "packages/registry"
  - "packages/core"
  - "packages/sentinel"
  - "packages/cli"
  - "packages/claude-arm"
  - "packages/web-components"
```

The private workspace can continue to use broader globs while it remains private.

## Current Blockers

- Local secrets are present and intentionally blocked by `verify:no-secrets`.
- Premium source and private generated bundles are still in the private workspace.
- Public AI/MCP context still contains private path metadata until a sanitized projection is generated.
- Public npm packages still need tarball audit and dependency metadata cleanup.

## Validation

Run:

```bash
pnpm run verify:public-clean-room
```

Expected current result: blocked.
