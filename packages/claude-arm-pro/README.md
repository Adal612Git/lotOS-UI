# @lotosui/claude-arm-pro

> LotOS UI protected React arm for premium, entitlement-gated product surfaces.
> This package is private workspace material and must not be published from the public repo.

## Features

- 27 React components across forms, data, feedback, and layout for private delivery
- WCAG 2.2 AAA-oriented accessibility defaults
- Shared contracts from `@lotosui/core`
- Executable showcase surface powered by Vite
- HTML snapshot visual baselines for CI-safe regression checks
- MCP-aware ecosystem integration

## Installation

Install only from the approved private workspace, private registry, or private customer bundle.
Do not add this package to a public repository or public npm workflow.

## Usage

```tsx
import { Button, Card, Table } from "@lotosui/claude-arm-pro";
```

## Local Review Surface

```bash
pnpm --filter @lotosui/claude-arm-pro run test
pnpm --filter @lotosui/claude-arm-pro run check-types
```

## Documentation

Project docs: `https://lotos-ui.vercel.app`

## Release Boundary

Pro source must move to a private repository or private registry before any public release of LotOS UI.
The public package is `@lotosui/claude-arm` and exports only the free evaluation layer.

## License

Proprietary. See the private commercial license file in the private workspace or delivery bundle.
