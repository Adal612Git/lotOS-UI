# Storybook Base

This package now includes a real Storybook scaffold:

- `.storybook/main.ts`
- `.storybook/preview.ts`
- `stories/*.stories.tsx`

## Important

Storybook dependencies are not added to the lockfile in this commit.
That is intentional to avoid breaking workspace installs in environments where
package resolution is restricted.

To activate it locally:

1. install Storybook packages for React + Vite
2. add scripts such as `storybook` and `build-storybook`
3. run Storybook from `packages/claude-arm`

The stories are already written and aligned with current components.
