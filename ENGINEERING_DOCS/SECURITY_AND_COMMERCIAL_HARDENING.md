# Security and Commercial Hardening

Use this checklist before making the repo public, publishing packages, or opening paid checkout.

## Secrets

- Keep real `.env*`, `client_secret*.json`, private keys, and provider tokens outside git.
- Run `pnpm run verify:no-secrets` before every release branch.
- If any secret touched git history, rotate it in the provider dashboard before launch.
- Agents may name required env vars, but must never print or infer values.

## Premium Assets

- Keep `packages/claude-arm-pro`, `packages/pro`, `.private-dist`, and `.commercial-dist` out of public repositories.
- Run `pnpm run verify:no-premium-leak` for private workspaces.
- Run `LOTOS_PUBLIC_RELEASE=1 pnpm run verify:no-premium-leak` before any public repository/package release.
- Public packages may mention paid tiers, but must not import protected source or ship protected assets.

## Auth and Entitlements

- Google login identifies a valid buyer account.
- Supabase/Lemon entitlements unlock Solo, Pro, and Full Signature access.
- `LOTOS_OWNER_EMAILS` is only an admin/bypass surface, not a buyer login allowlist.
- Do not loosen protected routes, download gates, or webhook signature checks for demos.

## Commercial Go-Live

- Set real `LOTOS_PROVIDER_LEGAL_NAME`, support email, refund/cancellation/support copy, and subscription portal URL.
- Require Lemon webhook secret plus store/variant IDs before claiming automatic unlock readiness.
- Keep direct Lemon checkout, webhook persistence, and vault access tested with the same buyer email.
- Run `pnpm run verify:go-live`, `pnpm run verify:registry`, `pnpm run verify:mcp`, and `pnpm run verify:100`.
