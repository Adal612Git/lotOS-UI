# Gemini Guide

Read `AGENTS.md` first. This file keeps Gemini oriented around the machine-readable context.

Primary context files:

- `.ai/lotos.project-map.json`
- `.ai/lotos.components.json`
- `.ai/lotos.runtimes.json`
- `.ai/lotos.commercial.json`
- `packages/registry/src/lotos.manifest.ts`

Rules:

- Never print secrets.
- Do not treat `LOTOS_OWNER_EMAILS` as the buyer login allowlist.
- Keep manual test, paid recovery, and revocation flows owner-only.
- Keep premium source private.
- Mark runtime support with explicit maturity.
- Prefer registry/MCP facts over broad codebase guesses.

Recommended validation:

```bash
pnpm run verify:ai
pnpm run verify:entitlement-boundary
pnpm run verify:100
pnpm --filter @lotosui/core test
pnpm --filter @lotosui/claude-arm test
```
