# npm Tarball Audit

Status: dry-run only. Do not publish from this step.

## Public Package Allowlist

- `@lotosui/registry`
- `@lotosui/core`
- `@lotosui/sentinel`
- `@lotosui/cli`
- `@lotosui/claude-arm`
- `@lotosui/web-components`

## Checks

`pnpm run verify:npm-tarballs` runs `npm pack --dry-run --json --ignore-scripts` for each allowlisted package and writes `.release/npm-tarball-report.json`.

It blocks on:

- Premium package references.
- Local secret files.
- Private asset paths.
- `workspace:*` dependency metadata that must be rewritten or proven safe before publish.
- Missing files allowlist.
- Unexpected package names.

## Current Expected Result

Blocked until public package dependency metadata and public build artifacts are cleaned for publish.

## Publish Rule

Publishing is only allowed through the GitHub publish workflow after public gates pass. This repo step does not publish npm packages.
