# LotOS UI NPM Publish Readiness - 2026-05-25

## Estado actual

Package revisado: `packages/react/package.json`.

- Nombre: `@lotosui/react`
- Version: `0.1.0`
- `private: true`
- `prepublishOnly` bloquea publicacion accidental
- `exports` apunta a `dist/index.js` y `dist/index.d.ts`
- `files` incluye `dist`, `src/styles.css`, `README.md`
- Peer dependencies: React y React DOM

## Componentes staged

- `LotOSSelect`
- `DataGridPro`
- `CommandShell`
- `ReportSurface`

`AccessBadge` y `AccessSummaryCard` viven hoy en `apps/web/app/access-ui.tsx`; no estan listos como exports de package sin separar dependencias de Next/Link.

## Comandos seguros

```bash
pnpm --filter @lotosui/react build
npm pack --dry-run
```

No ejecutar `npm publish` hasta tener autorizacion explicita y pipeline seguro.

## Checklist antes de publicar

- confirmar licencia final;
- decidir version prerelease;
- separar package publico de assets premium;
- revisar README publico;
- confirmar que no exporta rutas privadas;
- ejecutar `npm pack --dry-run`;
- probar instalacion en app limpia;
- quitar `private: true` solo en PR/release aprobado;
- mantener `prepublishOnly` bloqueante hasta el ultimo paso controlado.

## Naming recomendado

- `@lotosui/react`
- `@lotosui/core`
- `@lotosui/theme`

## Estrategia

1. Private beta con tarball o registry privado.
2. Prerelease publico limitado.
3. Stable cuando docs, screenshots y premium split esten probados.
