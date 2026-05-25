# MCP Reference

Source of truth: `packages/core/src/mcp/spec.ts`.

Validation:

```bash
pnpm run verify:mcp
pnpm run verify:mcp-smoke
pnpm run verify:registry-consumers
```

Use these endpoints before inferring project facts:

- `GET /manifest`
- `GET /ai/context`
- `GET /routes`
- `GET /component-tiers`
- `GET /pricing-plans`
- `GET /asset-permissions`
- `GET /env-requirements`
- `GET /templates`
- `GET /runtime-matrix`
- `GET /themes`
- `GET /release-readiness`
- `GET /entitlement-flows`
- `POST /components/render`

`GET /release-readiness` includes `lifecycleValidation` with
`wide_sales_ready`, `supabase_remote_validated`, and `lemon_remote_validated`.
Those flags must not be marked ready by an agent without human staging evidence.

The transport version is `1.1.0`. The server version and docs must match it.
