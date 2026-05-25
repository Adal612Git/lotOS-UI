# Package Publishing

Do not publish from a local shell.
Use the GitHub workflow after public release gates pass.

## Required Gates

```bash
pnpm run verify:no-secrets
pnpm run verify:public-clean-room
pnpm run verify:npm-tarballs
pnpm run verify:packages
pnpm run verify:package-exports
pnpm run verify:public-release
```

## Public Allowlist

- `@lotosui/registry`
- `@lotosui/core`
- `@lotosui/sentinel`
- `@lotosui/cli`
- `@lotosui/claude-arm`
- `@lotosui/web-components`

## Never Publish

- `@lotosui/claude-arm-pro`
- `@lotosui/pro-private`
- any `.commercial-dist` or `.private-dist` payload

## Current Blockers

Publishing is blocked while:

- local secrets remain in the workspace
- premium source/assets remain attached to the public tree
- package metadata still uses workspace-only dependency ranges
- public AI/MCP context has not been sanitized

Use `.release/npm-tarball-report.json` as the dry-run evidence. Do not publish from a local shell.
