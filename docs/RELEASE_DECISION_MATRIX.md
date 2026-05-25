# Release Decision Matrix

Status: draft. Decision owner: human/operator.

## Current Block

- Public release is blocked by local secrets and premium/private payloads in the private workspace.
- Wide sales are blocked because Supabase and Lemon lifecycle validation has not been executed against real staging.
- npm publish must stay behind public clean-room gates.

## Recommendation

Use option A only for a controlled private pilot. Use option B for the eventual public open-core model after secret rotation and premium split. Use option C only after public package gates pass. Use option D before wide sales.

## A. Private Repo Plus Pilot

Benefits:
- Fastest controlled validation.
- Premium source stays private.
- Matches the current private RC model.

Risks:
- Not public-release safe.
- Not wide-sales ready.
- Requires strict manual control of pilot users, support, and pricing copy.

Validation:

```bash
pnpm run verify:private-workspace
pnpm run verify:release-candidate
pnpm run verify:commercial-lifecycle
pnpm --filter web build
```

Human decision: approve a limited private pilot or wait.

## B. Public Repo Free Plus Private Premium

Benefits:
- Strong long-term public trust model.
- Public packages and docs can grow while premium stays private.

Risks:
- Leak risk if premium is not fully detached.
- Requires secret rotation and regenerated public lockfile.

Validation:

```bash
pnpm run verify:public-clean-room
pnpm run verify:public-release
```

Human decision: approve public repo strategy and private premium destination.

## C. Public npm Packages Only

Benefits:
- Allows adoption without opening the entire repo.
- Keeps package release limited to the allowlist.

Risks:
- Current publish workflow still depends on public-release gates.
- Support burden starts before broad staging evidence exists.

Validation:

```bash
pnpm run verify:npm-tarballs
pnpm run verify:packages
pnpm run verify:package-exports
pnpm run verify:public-clean-room
```

Human decision: decide whether npm-only can ship before full public repo launch.

## D. Wait For Real Staging

Benefits:
- Safest path before broad sales.
- Produces real Supabase/Lemon/RLS evidence.

Risks:
- Delays launch.
- Requires provider setup and human operator time.

Validation:

```bash
pnpm run verify:supabase-migrations
pnpm run verify:webhook-contracts
pnpm run verify:rls-policy-plan
pnpm run verify:commercial-lifecycle
```

Human decision: approve staging validation before wide sales.
