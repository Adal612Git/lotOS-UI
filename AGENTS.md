# AGENTS.md

## Project

LotOS UI is an AI-native universal UI platform: components, templates, CLI, MCP, docs, commercial web app, and premium assets.

## Root

Use `lotos-ui/` as the real repo root. Do not modify files outside it unless explicitly asked.

## Package Manager

Use `pnpm`. Prefer focused workspace commands.

## Safety Rules

- Never print, copy, commit, or expose secrets.
- Treat `.env*`, `client_secret*.json`, premium assets, and private dist folders as sensitive.
- Buyer login must not depend on `LOTOS_OWNER_EMAILS`.
- Owner checks are only for administrative grants and premium bypass.
- Paid access is unlocked by entitlements from Lemon/Supabase.
- Manual test grants must be temporary and must not be described as purchases.
- Paid recovery requires reviewed payment evidence and a recorded reason.
- Revoked or expired entitlements must not unlock premium access.
- Do not move premium code into public packages.

## Source Of Truth

Prefer these sources before scanning large page files:

- `packages/registry/src/lotos.manifest.ts`
- `.ai/lotos.project-map.json`
- `.ai/lotos.components.json`
- `.ai/lotos.templates.json`
- `.ai/lotos.runtimes.json`
- `.ai/lotos.themes.json`
- `.ai/lotos.commercial.json`
- MCP server in `packages/core/src/mcp/server.ts`

Docs, pricing, MCP catalogs, CLI listings, and website copy should move toward manifest-driven generation.
Do not hardcode component, template, runtime, route, env, pricing, package, or MCP facts when the registry or MCP spec already owns them.

## Validation

Use focused commands:

```bash
pnpm run verify:structure
pnpm run verify:registry
pnpm run verify:mcp
pnpm run verify:templates
pnpm run verify:registry-runtimes
pnpm run verify:no-secrets
pnpm run verify:no-premium-leak
pnpm run verify:ai
pnpm run verify:drift
pnpm run verify:packages
pnpm run verify:routes
pnpm run verify:entitlement-boundary
pnpm run verify:private-workspace
pnpm run verify:100
pnpm --filter @lotosui/core test
pnpm --filter @lotosui/cli test
pnpm --filter @lotosui/claude-arm test
pnpm --filter @lotosui/claude-arm-pro test
pnpm --filter @lotosui/web-components check-types
pnpm --filter web check-types
pnpm --filter docs check-types
```

## Product Rules

- Say `8 free React exports + 19 pro components = 27 total contracts`.
- Every component needs tier, maturity, runtime support, docs status, tests status, and a11y notes.
- Every runtime needs maturity: `stable`, `alpha`, `prototype`, or `planned`.
- Every template needs runtime, industry, included components, tier, preview, install command, and validation notes.
- Avoid one-off CSS when tokens/components can carry the change.

## Editing Rules

- Keep edits small and tied to the requested outcome.
- Do not revert unrelated dirty work.
- Keep generated outputs separate from hand-written source in summaries.
- For commercial changes, mention auth, entitlement, owner, Lemon, Supabase, and vault impact.
- Before touching auth, premium, or security, read `.ai/lotos.commercial.json`, `.ai/lotos.entitlements.json`, registry routes/env/assets, and run the focused leak/secret/entitlement gates.
