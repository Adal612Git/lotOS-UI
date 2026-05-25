# AI Onboarding

## Start Here

1. Work inside `lotos-ui/`.
2. Read `AGENTS.md`.
3. Read `.ai/lotos.project-map.json`, `.ai/lotos.components.json`, `.ai/lotos.templates.json`, `.ai/lotos.runtimes.json`, and `.ai/lotos.commercial.json`.
4. Use `packages/registry/src/lotos.manifest.ts` as the source of truth.
5. Use MCP facts before guessing.

## Safety Rules

- Never print `.env*`, `client_secret*.json`, tokens, keys, webhook secrets, or private payload values.
- Public package: 8 free React exports.
- Pro/private layer: 19 pro components and premium assets.
- Buyer login is not owner authorization.
- Entitlements unlock premium buyer access.
- Manual test access is temporary and separate from purchases.
- Paid recovery requires real payment evidence and an owner reason.
- Revoked or expired entitlements must not unlock premium assets.

## Minimum Validation

```bash
pnpm run verify:registry
pnpm run verify:mcp
pnpm run verify:ai
pnpm run verify:drift
pnpm run verify:no-secrets
pnpm run verify:no-premium-leak
pnpm run verify:entitlement-boundary
```
