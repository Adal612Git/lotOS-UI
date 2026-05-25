# apps/docs

Documentation and trust surface for LotOS UI.

This app contains:

- public documentation
- component docs
- multi-runtime guides
- AI/MCP integration docs
- docs-domain login and vault proof surface

## Local Run

From the monorepo root:

```powershell
pnpm.cmd --filter docs dev
```

Open `http://localhost:3001` when the docs app is configured for its usual local port.

## Commercial Notes

- Docs login uses the same Google OAuth pattern as the web app.
- Buyer login should accept a valid Google email.
- Premium access should be based on entitlement rows, not owner emails.
- Owner accounts only provide administrative bypass.

## AI Context

Agents should read these before editing docs:

- `AGENTS.md`
- `.ai/lotos.project-map.json`
- `.ai/lotos.components.json`
- `.ai/lotos.runtimes.json`
- `packages/registry/src/lotos.manifest.ts`

When docs mention component counts, use this wording:

```txt
8 free React exports + 19 pro components = 27 total contracts.
```
