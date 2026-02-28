# Storybook Base

This package now includes a Storybook scaffold plus an executable showcase layer.

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

1. `pnpm --filter @lotosui/claude-arm run showcase`
2. `pnpm --filter @lotosui/claude-arm run showcase:build`
3. `pnpm --filter @lotosui/claude-arm run coverage:components`
4. `pnpm --filter @lotosui/claude-arm run visual:baseline`
5. `pnpm --filter @lotosui/claude-arm run visual:check`

## Important

Full Storybook dependencies are still not added to the lockfile in this layer.
That is intentional to avoid breaking workspace installs in environments where
package resolution is restricted.

To activate the full Storybook runtime later:

1. install Storybook packages for React + Vite
2. add scripts such as `storybook` and `build-storybook`
3. run Storybook from `packages/claude-arm`

The stories are already written and aligned with current components.
The executable showcase and HTML baselines give us a real review surface and a
CI-safe regression checkpoint until the full Storybook runtime is activated.
