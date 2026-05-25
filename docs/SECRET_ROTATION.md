# Secret Rotation

Never print current values while rotating. Record only provider, key type, owner, and completion date.

## Immediate Rotation Targets

- npm automation token found in local Claude settings.
- Google OAuth client secret files found in local workspace paths.
- `apps/web/.env.local` values: OAuth, Auth, Lemon, Supabase, Vercel/OIDC.
- `apps/docs/.vercel/.env.development.local` local Vercel/OIDC values.

## Rotation Steps

1. Revoke the old provider secret in the provider dashboard.
2. Create a replacement with the minimum required scope.
3. Store it only in the target secret manager or private deployment env.
4. Remove local files from the repo workspace.
5. Run `pnpm run verify:no-secrets`.
6. Commit only code/docs changes, never secret values.

## Provider Notes

- npm: prefer Automation token or trusted publishing. Do not store npm tokens in local shell commands.
- Google OAuth: regenerate client secret, update deployment env, remove `client_secret*.json` from repo folders.
- Auth secret: generate a new random value and rotate sessions intentionally.
- Supabase: rotate service role/server keys and verify webhook/admin flows.
- Lemon Squeezy: rotate webhook secret and confirm signature validation.
- Vercel/OIDC: refresh local credentials and keep `.vercel/.env*` out of release artifacts.
