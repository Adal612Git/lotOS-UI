# Storybook Base

This package now includes a real Storybook package surface plus an executable showcase layer.

Current assets:

- `.storybook/main.ts`
- `.storybook/preview.ts`
- `stories/*.stories.tsx`
- `showcase/index.html`
- `showcase/main.tsx`
- `vite.showcase.config.ts`
- `scripts/visual-regression.mjs`

## What runs today

Without installing any extra Storybook packages, you can already run:

1. `pnpm --filter @lotosui/claude-arm run verify:storybook`
2. `pnpm --filter @lotosui/claude-arm run storybook`
3. `pnpm --filter @lotosui/claude-arm run build-storybook`
4. `pnpm --filter @lotosui/claude-arm run showcase`
5. `pnpm --filter @lotosui/claude-arm run showcase:build`
6. `pnpm --filter @lotosui/claude-arm run test:coverage`
7. `pnpm --filter @lotosui/claude-arm run coverage:components`
8. `pnpm --filter @lotosui/claude-arm run visual:baseline`
9. `pnpm --filter @lotosui/claude-arm run visual:check`

## Important

Storybook dependencies are now declared in the workspace and the lockfile.
If your local `node_modules` predates that lockfile, run `pnpm install` before using
the Storybook commands.

The stories are already written and aligned with current components.
The executable showcase and HTML baselines give us a real review surface and a
CI-safe regression checkpoint until the full Storybook runtime is activated.
