# Public Docs Sanitization

Status: public clean-room checklist.

## Public Docs Must Not Contain

- Local machine paths.
- Real credentials or `KEY=value` examples.
- Real private asset URLs.
- Instructions to install or import private premium packages.
- Final legal, support, pricing, or domain claims while those values are placeholders.
- Claims that public release or wide sales are ready while gates are blocked.

## Premium Copy Rule

Public docs may describe the commercial plan, but they must use detached language:

> Premium components are distributed through private access after entitlement.

They must not expose source paths, bundle paths, or private package exports.

## Buyer Boundary

Docs must say that the buyer still signs in with Google using the entitled email. Owner-only access is for administration and manual grants, not a buyer bypass.

## Current Expected Result

`pnpm run verify:public-docs` may remain blocked until app/docs copy stops referencing private premium imports or private package installation.

## Validation

```bash
pnpm run verify:public-docs
pnpm run verify:public-clean-room
```
