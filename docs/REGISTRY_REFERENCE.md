# Registry Reference

Source of truth: `packages/registry/src/lotos.manifest.ts`.

The manifest owns:

- product identity
- tiers
- components
- templates
- themes
- runtimes
- plans
- routes
- entitlement flows
- env requirements
- asset permissions
- MCP tools
- release readiness
- validation commands
- AI rules

Generated artifacts live in `.ai/lotos.*.json` and must be reproducible.

```bash
pnpm --filter @lotosui/registry generate:ai
pnpm run verify:generated-ai
pnpm run verify:registry-consumers
```

Entitlement flows live in `lotosManifest.entitlementFlows`.
Generated AI files and MCP `/entitlement-flows` must reflect the same paid checkout, manual test, paid recovery, and revoke paths.
