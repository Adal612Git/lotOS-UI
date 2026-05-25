# GitHub Public Launch

Status: preparation only. Do not change repo visibility until the public clean-room gate passes.

## Hard Blockers

- `pnpm run verify:no-secrets` must pass.
- `pnpm run verify:public-clean-room` must pass.
- Premium source and bundles must be detached from the public branch.
- Public docs and AI/MCP context must be sanitized.
- License coverage for premium exclusions must be reviewed.
- npm package repository metadata must match the final public repo.

## Branch Strategy

- Public default branch: `main`.
- Feature branches: `feat/*`, `fix/*`, `docs/*`, `chore/*`.
- Release tags: `vX.Y.Z`.
- Premium code must live in a separate private repo/storage/channel, not a private branch inside the public repo.

## Required Checks

Use branch protection or rulesets requiring:

- PR before merge.
- Required CI checks.
- `verify:public-clean-room` before public release or npm publish.
- `verify:package-exports` and `verify:packages`.
- Review approval.
- Resolved conversations.
- No force push and no branch deletion.

## npm Provenance Checklist

- Prefer npm Trusted Publishing/OIDC when the npm organization supports it.
- If a token is used temporarily, keep it in GitHub secrets only and rotate it after migration.
- Use GitHub-hosted runners.
- Keep `--access public` for scoped public packages.
- Align `repository.url` in each package with the final public GitHub repo.
- Verify tarballs before publish.

## Security Policy

Use `SECURITY.md` for vulnerability reports. Security issues should not be filed as public issues.

## Rollback

If any leak is found after launch:

1. Make the repository private if needed.
2. Revoke or rotate exposed credentials.
3. Remove leaked artifacts from release/package channels.
4. Publish a corrected release only after gates pass.
