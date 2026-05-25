# Security Release Checklist

Run this before any release candidate, public repo push, npm publish, or production deploy.

## Gates

```bash
pnpm run verify:no-secrets
pnpm run verify:no-premium-leak
pnpm run verify:private-workspace
LOTOS_PUBLIC_RELEASE=1 pnpm run verify:public-release
```

## Required Human Actions

- Rotate npm token, Google OAuth secret, Auth secret, Supabase keys, Lemon webhook secret, and Vercel/OIDC credentials if they were ever stored locally.
- Remove `client_secret*.json`, `.env.local`, `.vercel/.env*`, private key files, and local auth scripts from release worktrees.
- Review CI secrets and deployment envs without printing values.
- Confirm logs do not include buyer email, Supabase errors, webhook payloads, or secret names plus values.
- Confirm protected downloads use entitlement checks and private no-store caching.

## Public Release Blocking Conditions

- Any premium source in the public repo.
- Any sensitive local file in or above the release worktree.
- Legal/support placeholders still presented as final.
- Pricing not marked as placeholder if it is not approved.
