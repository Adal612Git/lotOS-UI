# First Revenue Runbook

This is the shortest technical path from "customer said yes" to "private payload delivered".

## Pre-flight before charging

```bat
pnpm.cmd run verify:go-live
```

Use this to confirm checkout links, webhook mapping, and unlock prerequisites are configured.

## One-command preparation

```bat
pnpm.cmd run prep:first-sale
```

This command does all of the following in order:

1. verifies operational readiness
2. exports `.commercial-dist/free`
3. exports `.commercial-dist/pro`
4. stages `packages/pro/.private-dist`
5. verifies the commercial bundle
6. verifies the private proprietary bundle
7. writes `.commercial-dist/first-sale-summary.json`

## What to deliver

- `.commercial-dist/pro`
- `packages/pro/.private-dist`
- optional customer-specific starter from:
  - `stack-init`
  - `desktop-init`

`packages/pro/.private-dist` includes:

- Pro assets (`admin-starter`, `layouts`, `industry-kits`, `previews`)
- Full Signature payload (`launch-exclusive`)

## Minimum delivery sequence

1. Take payment.
2. Run `pnpm.cmd run prep:first-sale`.
3. Zip `packages/pro/.private-dist`.
4. Add any customer-specific starter or custom files.
5. Deliver through a private link or private repository.

## What not to do

- Do not sell the MIT packages as exclusive assets.
- Do not publish `packages/pro/.private-dist` to npm.
- Do not send the proprietary payload through public channels.
