# Commercial Delivery Model

This document defines what is free, what is paid, and how LotOS UI should be delivered.

## Free Surface

The free surface is the public, MIT-licensed layer:

- `packages/core`
- `packages/claude-arm`
- `packages/cli`
- `packages/web-components`
- `packages/sentinel`
- runtime adapters intended for public adoption
- public docs and demos

This layer is used for:

- developer adoption
- public npm distribution
- technical evaluation
- demo credibility

## Paid Surface

The paid surface is the proprietary asset layer:

- `packages/pro/admin-starter`
- `packages/pro/layouts`
- `packages/pro/industry-kits`
- private future exports of premium templates, industry packs, and guided starter bundles

This layer is used for:

- paid ZIP delivery
- private repository delivery
- premium customer onboarding
- custom implementation accelerators
- premium preview packs for pre-sale proof

## Delivery Rules

1. Never sell the public MIT packages as exclusive assets.
2. Sell implementation, guided setup, and proprietary packs.
3. Move `packages/pro` to a private distribution channel before public commercial launch.
4. Use `pnpm export:commercial` to stage deliverables for packaging.
5. Use `pnpm --filter @lotosui/pro-private run bundle` to stage the proprietary payload in its private workspace format.

## Paid Offer Payload

A paid customer can receive:

- a curated `pro` bundle from `.commercial-dist/pro`
- a customized generated starter
- a private repository or ZIP archive
- implementation notes and onboarding guidance

## Suggested Sellable Products

Start with four concrete offers:

1. `Premium Preview`
   - a controlled evaluation-only proof bundle
   - used before payment to demonstrate premium value
   - can include spreadsheet upgrade previews for Excel and OpenOffice
2. `Solo License`
   - private pro access for one operator
3. `Pro License`
   - team-oriented premium layer
4. `Full Signature`
   - private bundle plus customer-specific starter

## How To Test What A Paid Buyer Would Receive

Before selling:

1. run `pnpm prep:paid-preview`
2. inspect `.commercial-dist/pro-preview`
3. validate manifests and preview HTML
4. use the spreadsheet previews when selling spreadsheet modernization work:
   - `excel-lotus-grid-preview.html`
   - `openoffice-calc-command-preview.html`

After payment:

1. run `pnpm prep:first-sale`
2. inspect `packages/pro/.private-dist`
3. deliver the final private payload

## Free Offer Payload

A free user can receive:

- the public packages
- public docs
- public demos
- starter generation from the CLI

## Immediate Practical Model

If a customer wants to buy today:

1. take payment outside the repo
2. optionally run `pnpm prep:paid-preview` to prove the premium surface
3. run `pnpm export:commercial`
4. run `pnpm --filter @lotosui/pro-private run bundle`
5. zip `packages/pro/.private-dist`
6. add the customer-specific starter or custom files
7. deliver through a private link or private repository
