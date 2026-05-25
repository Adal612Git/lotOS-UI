# Golden Prompts For Agents

## Architecture Audit

```txt
Work inside lotos-ui/. Do not print secrets.
Use AGENTS.md, .ai/*.json, packages/registry, and MCP endpoints first.
Map the change to apps, packages, routes, env vars, tests, and commercial risk.
Return findings with file paths, risk level, and validation commands.
```

## Component Change

```txt
Work inside lotos-ui/.
Before editing a component, inspect AGENTS.md, .ai/lotos.components.json, packages/core/src/schemas/components.ts, packages/registry/src/lotos.manifest.ts, component tests, and package exports.
Keep public/pro tier boundaries clear. The public React package exports only the free layer.
Update docs/tests/exports and run focused package checks plus verify:registry-consumers.
```

## Template Change

```txt
Work inside lotos-ui/.
Start from .ai/lotos.templates.json and packages/registry/src/lotos.manifest.ts.
Require tier, runtime, industry, included components, preview route, install command, deploy checklist, and AI prompt.
If a preview route is not implemented, set previewRoute to null instead of linking to a missing page.
Run pnpm run verify:templates, verify:routes, and verify:generated-ai.
```

## Runtime Change

```txt
Work inside lotos-ui/.
Read .ai/lotos.runtimes.json, packages/core/src/runtime, adapter packages, and docs.
Mark maturity explicitly as stable, alpha, prototype, or planned.
Never claim a planned runtime is a shipped package.
Run verify:registry-runtimes, verify:runtimes, verify:runtime-contracts, and verify:registry-consumers.
```

## Commercial/Auth Change

```txt
Work inside lotos-ui/. Do not print env values.
Buyer login may not depend on LOTOS_OWNER_EMAILS.
Owner checks are only for admin grants and bypass.
Entitlement checks gate paid routes and downloads.
Run web check-types and verify:go-live after edits.
```

## Premium Leak Review

```txt
Work inside lotos-ui/. Do not move premium assets.
Inspect assetPermissions, package dependencies, pnpm-lock, public package exports, apps/* imports, protected downloads, and LOTOS_PRIVATE_ASSETS_ROOT usage.
Run pnpm run verify:no-secrets, verify:no-premium-leak, verify:private-workspace, and LOTOS_PUBLIC_RELEASE=1 pnpm run verify:public-release when preparing public release.
```

## MCP/AI Change

```txt
Work inside lotos-ui/.
Expose machine-readable facts instead of prose-only docs.
Update packages/core/src/mcp/server.ts, packages/registry, and .ai manifests together when facts change.
Run pnpm run verify:ai and pnpm --filter @lotosui/core test.
```

## Release Preparation

```txt
Work inside lotos-ui/. Do not publish.
Check registry, MCP, generated AI manifests, routes, package exports, CI, go-live/commercial, no-secrets, no-premium-leak, and npm publish workflow.
Private workspace mode may warn. Public release mode must fail while premium or sensitive local files are present.
Run pnpm run verify:release-candidate and report any blocking command exactly.
```

## Drift Audit

```txt
Work inside lotos-ui/.
Compare registry -> .ai -> MCP spec/server -> CLI src/dist -> README/docs/web copy -> package exports -> env requirements.
If a fact is duplicated, either remove the duplicate or add a verifier.
Run pnpm run verify:drift, verify:generated-ai, verify:registry-consumers, verify:routes, and verify:cli-smoke.
```
