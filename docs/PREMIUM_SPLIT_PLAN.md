# Premium Split Plan

Status: private workspace ready, public release blocked until premium leaves this repo.

## Current State

- Public source: `packages/registry`, `packages/core`, `packages/sentinel`, `packages/cli`, `packages/claude-arm`, `packages/web-components`.
- Premium source: `packages/claude-arm-pro`, `packages/pro`.
- Generated private bundles: `packages/pro/.private-dist`, `.commercial-dist`.
- Protected runtime downloads: `apps/web/app/api/download/[asset]/route.ts`.
- Private storage placeholder: `LOTOS_PRIVATE_ASSETS_ROOT`.

## Public Release Invariants

- Public repo must not contain `packages/claude-arm-pro`, `packages/pro`, `.commercial-dist`, or `.private-dist`.
- Public packages must not import or depend on `@lotosui/claude-arm-pro` or `@lotosui/pro-private`.
- Public routes may show locked cards, metadata, and placeholders, but not premium HTML, layouts, manifests, or source payloads.
- `LOTOS_PUBLIC_RELEASE=1 pnpm run verify:public-release` must fail until the split is complete.

## Private Workspace Mode

Private workspace mode may keep premium source locally for development, tests, and bundle preparation.
It must report that public release is unsafe when premium exists.

Use:

```bash
pnpm run verify:private-workspace
pnpm run verify:no-premium-leak
```

## Storage Rule

For production delivery, `LOTOS_PRIVATE_ASSETS_ROOT` must point to server-only private storage.
It should be outside the public repo, outside Vercel static assets, and readable only by the server process.

## Migration Checklist

1. Freeze public package exports and registry facts.
2. Rotate local and CI secrets.
3. Create a private repo or private registry for `@lotosui/claude-arm-pro`.
4. Move `packages/pro` private assets to private repo/storage.
5. Replace public app premium imports with locked placeholders or server-only metadata.
6. Regenerate a public `pnpm-lock.yaml` without premium workspaces.
7. Run `pnpm run verify:public-release`.
8. Publish public packages only after the public gate passes.
