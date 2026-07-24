# LotOS UI runbook

## Prerequisites

- Node.js 18 or newer; an active LTS release is preferred.
- Corepack.
- No provider credentials for the public/local validation path.

## Clean setup

```bash
corepack pnpm --version
corepack pnpm install --frozen-lockfile
```

The first command must report `9.0.0`, as pinned in `package.json`.

## Validation

```bash
corepack pnpm run verify:no-secrets
corepack pnpm run lint
corepack pnpm run check-types
corepack pnpm run test
corepack pnpm run verify:100
corepack pnpm run verify:packages
corepack pnpm run verify:no-premium-leak
corepack pnpm run verify:cli-smoke
corepack pnpm run verify:mcp-smoke
corepack pnpm run verify:web-smoke
corepack pnpm run verify:ci
corepack pnpm run build
```

Expected local evidence on 2026-07-23:

- `verify:100`: 45/45.
- Tests: 455 passing across 68 files and five packages.
- CLI smoke: 11 commands.
- MCP smoke: 29 endpoint specifications.
- Web smoke: 29 critical files.
- Build: 11 successful tasks, 52 web routes, and 42 docs routes.

Warnings about private packages are expected only in private-workspace mode.
They must remain hard failures in a public-release export.

## Development

```bash
corepack pnpm dev
```

The main web app defaults to `http://localhost:3000`.

## Production smoke

```bash
corepack pnpm run build
corepack pnpm --filter web exec next start -p 3210
```

In another terminal:

```bash
curl --fail http://127.0.0.1:3210/
curl --fail http://127.0.0.1:3210/design-lab
```

Stop the server with `Ctrl+C`.

## External integrations

Copy `apps/web/.env.example` to `apps/web/.env.local` only after affected
credentials have been rotated. Never use production payment, webhook, or
entitlement actions for a smoke test. Use provider sandbox/preview data.

## Vercel preview and rollback

1. Confirm the linked project is `lotos-ui`.
2. Run every local validation command above.
3. Deploy a preview without `--prod`.
4. Test `/`, `/design-lab`, `/free`, `/demo/student-control`, and `/pricing`.
5. Promote only a healthy saved preview.
6. Roll back by redeploying the previously healthy Vercel deployment; do not
   change domains or DNS as part of application rollback.

