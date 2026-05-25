# Claude Code Guide

Read `AGENTS.md` first. This file only adds Claude-specific orientation.

- Use `lotos-ui/` as root.
- Start from `.ai/*.json` and `packages/registry/src/lotos.manifest.ts`.
- Use MCP facts from `packages/core/src/mcp/server.ts` before inferring component props or route gates.
- Do not expose `.env*`, `client_secret*.json`, premium assets, or private bundle paths beyond names.
- Keep owner/admin authorization separate from buyer login.
- Keep manual test, paid recovery, and revocation flows owner-only.
- Run `pnpm run verify:entitlement-boundary` when changing entitlement code.
- Prefer focused changes and focused pnpm commands.

Best starting commands:

```bash
pnpm run verify:structure
pnpm run verify:100
pnpm run verify:ai
pnpm --filter web check-types
pnpm --filter docs check-types
```
