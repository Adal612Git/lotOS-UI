# Contributing

## Setup

Use Node `>=18` and `pnpm@9`.

```bash
pnpm install
pnpm run verify:registry
pnpm run verify:mcp
```

## Rules

- Do not commit secrets.
- Do not move premium source or private bundles into public packages.
- Do not relax auth, owner checks, or entitlement checks.
- Keep generated `.ai` artifacts in sync with the registry.
- Use focused tests for the area changed.

## Public Release Work

Run:

```bash
pnpm run verify:public-clean-room
```

The gate must remain blocked until secrets are evacuated and premium is detached from the public tree.

## Pull Requests

Every PR should explain:

- What changed.
- What package/app/docs area is affected.
- Which validation commands were run.
- Whether auth, entitlements, premium, or security boundaries changed.
