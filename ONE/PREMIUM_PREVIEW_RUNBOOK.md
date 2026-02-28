# Premium Preview Runbook

Use this before a buyer pays when you want to prove the premium surface without delivering the full private payload.

## Goal

Generate a controlled, evaluation-only premium preview that is:

- attractive enough to justify payment
- safe enough to avoid shipping the full proprietary bundle
- usable for your own QA before delivery

## Command

```bat
pnpm.cmd run prep:paid-preview
pnpm.cmd run verify:paid-preview
```

## Output

- `.commercial-dist/pro-preview`
- `.commercial-dist/pro-preview/preview-manifest.json`
- `.commercial-dist/pro-preview/README.preview.txt`

## What to show the buyer

1. `previews/sales-preview.html`
2. `previews/license-matrix.html`
3. the included manifests for:
   - `admin-starter`
   - `layouts`
   - `industry-kits`

## What not to send before payment

- `packages/pro/.private-dist`
- customer-specific starter output
- the final private ZIP prepared for paid delivery

## After payment

Run:

```bat
pnpm.cmd run prep:first-sale
```

Then deliver:

- `.commercial-dist/pro`
- `packages/pro/.private-dist`
- optional customer-specific starter
