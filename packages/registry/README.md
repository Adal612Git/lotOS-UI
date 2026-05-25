# @lotosui/registry

Manifest layer for LotOS UI 2.0.

This package is the source-of-truth layer for agents and generators. It describes the product, components, templates, themes, tiers, routes, runtimes, env vars, commercial gates, MCP tools, validation commands, and AI operating rules without requiring an agent to scan the entire monorepo.

Use `pnpm --filter @lotosui/registry generate:ai` to regenerate `.ai/lotos.*.json` artifacts from the manifest. Use `pnpm run verify:registry`, `pnpm run verify:templates`, `pnpm run verify:registry-runtimes`, and `pnpm run verify:mcp` before changing docs, CLI, MCP, or web surfaces that consume registry data.
