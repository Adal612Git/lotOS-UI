# Secret Evacuation Runbook

Status: human operation. Do not automate deletion from this repo.

## Rule

Do not print secret values. Do not commit secret files. Do not delete the only copy of a credential. Move local credential files outside the repo, then rotate the credentials in the provider console.

## Known Risk Classes

- Local env files: `.env`, `.env.local`, `.env.*.local`.
- Vercel local env files: `.vercel/.env.*`.
- OAuth client files: `client_secret*.json`.
- Local agent settings: `.claude/settings.local.json`, `ONE/.claude/settings.local.json`.
- npm tokens, webhook secrets, OAuth secrets, Supabase service keys, Lemon keys.

## Human Steps

1. Run `pnpm run verify:no-secrets`.
2. Record only file path and risk type in the release log.
3. Create a private location outside the repo for local credentials.
4. Move each local secret file manually after confirming it has a backup.
5. Rotate credentials in Google, Supabase, Lemon, npm, Vercel, and any other provider where a real value existed.
6. Update local env files from clean examples only after rotation.
7. Run `pnpm run verify:no-secrets` again.
8. Run `pnpm run verify:public-clean-room`.

## Suggested Local Move Pattern

These commands are examples only. Review paths first and do not run them blindly.

```powershell
New-Item -ItemType Directory -Force "$HOME\\LotosPrivateSecrets"
Move-Item -LiteralPath "apps/web/.env.local" -Destination "$HOME\\LotosPrivateSecrets\\apps-web.env.local"
Move-Item -LiteralPath "client_secret_PLACEHOLDER.json" -Destination "$HOME\\LotosPrivateSecrets\\client_secret_PLACEHOLDER.json"
```

## Clean Examples

Examples may name variables but must not include real values:

- `apps/web/.env.example`
- Optional future `apps/web/.env.staging.example`

Use placeholder strings such as `<set-in-provider-dashboard>` or `example.test`.

## Done Criteria

- `pnpm run verify:no-secrets` passes.
- No local credential file exists under the repo root.
- Provider credentials have been rotated.
- Public clean-room report no longer has a `no-secrets` blocker.
