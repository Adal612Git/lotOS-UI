# LotOS UI AI Review Checklist

Use this before changing code.

- Confirm the real root is `lotos-ui/`.
- Check `git status --short --branch` and avoid reverting unrelated work.
- Do not print secrets from `.env*` or `client_secret*.json`.
- Keep buyer login separate from owner/admin authorization.
- Keep premium assets out of public packages.
- Prefer `packages/registry/src/lotos.manifest.ts` and MCP endpoints before guessing.
- For UI work, keep copy clear about `8 free + 19 pro = 27 total`.
- For runtime work, mark maturity as stable, alpha, prototype, or planned.
- For commercial work, run `pnpm run verify:go-live` and `pnpm run verify:100`.
- For component work, run focused tests and typechecks before broad builds.
