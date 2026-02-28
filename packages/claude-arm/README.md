# @lotosui/claude-arm

> LotOS UI React arm for accessible, AI-aware product surfaces.
> 27 components, TypeScript, React 19, runtime-contract aligned.

## Features

- 27 real React components across forms, data, feedback, and layout
- WCAG 2.2 AAA-oriented accessibility defaults
- Shared contracts from `@lotosui/core`
- Executable showcase surface powered by Vite
- HTML snapshot visual baselines for CI-safe regression checks
- MCP-aware ecosystem integration

## Installation

```bash
npm install @lotosui/claude-arm
npm install react react-dom
```

## Usage

```tsx
import { Button, Card, Table } from "@lotosui/claude-arm";
```

## Local Review Surface

```bash
pnpm --filter @lotosui/claude-arm run showcase
pnpm --filter @lotosui/claude-arm run showcase:build
pnpm --filter @lotosui/claude-arm run test:coverage
pnpm --filter @lotosui/claude-arm run coverage:components
pnpm --filter @lotosui/claude-arm run visual:baseline
pnpm --filter @lotosui/claude-arm run visual:check
```

## Documentation

Project docs: `https://lotos-ui.vercel.app`

## License

MIT
