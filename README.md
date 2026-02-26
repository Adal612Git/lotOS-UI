# LotOS UI

Monorepo oficial de LotOS UI.

## Paquetes npm oficiales

- `@lotosui/claude-arm` (publicado, producción)
- `@lotosui/core` (publicado)
- `@lotosui/cli` (paquete CLI del monorepo)

## Instalación rápida

```bash
npm install @lotosui/claude-arm
npm install react react-dom
```

```tsx
import '@lotosui/claude-arm/styles.css';
import { Button } from '@lotosui/claude-arm';
```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

## Build y test

```bash
pnpm build
pnpm test
```

Nota de entorno Windows con restriccion `spawn EPERM`:

- `pnpm build` detecta automaticamente ese modo y ejecuta pipeline degradado:
  - build de `@lotosui/core`
  - `pnpm verify:100`
  - `pnpm verify:degraded`
- En entornos sin esa restriccion, `pnpm build` corre `turbo run build` normal.

## Docs

- Sitio: https://lotos-ui.vercel.app
- App local: `apps/docs`

## CLI

Paquete objetivo: `@lotosui/cli`

```bash
pnpm --filter @lotosui/cli build
pnpm --filter @lotosui/cli test
```

## Expansion multi-runtime (v0)

`@lotosui/core` ahora expone contratos para runtimes y patrones de diseno:

- `@lotosui/core/runtime`
- `@lotosui/web-components` (prototipos activos: `lotos-button`, `lotos-input`)
- MCP endpoints nuevos:
  - `GET /frameworks`
  - `GET /runtimes`
  - `GET /patterns`
  - `GET /patterns/:id?runtime=<runtime>`
  - `POST /components/render` (react, web-component, laravel-blade preview)
- Adapter skeleton inicial:
  - `packages/lotos-laravel`

Objetivo: escalar de React-only a adapters para PHP, Python, Java, .NET, Go, C/C++, y Mojo con una base visual consistente.

## Ruta unica de operacion

Todo lo de arquitectura, estudios, patrones y operacion esta centralizado en `ONE/`.

- `ONE/PROJECT_ARCHITECTURE_STATE_2026-02-25.md`
- `ONE/MANUAL_OPERATIVO_VICTOR.md`
- `ONE/LOTOS_DESIGN_PATTERNS_MULTI_RUNTIME.md`
- `ONE/ESTUDIO_estrategiafinalventas.txt`
- `ONE/TEMPLATE_*`

Validacion rapida de orden:

```bash
pnpm verify:structure
```

Modo degradado (sin dependencias completas):

```bash
pnpm verify:degraded
```

Verificacion de consistencia web/docs/diagrama (objetivo 100%):

```bash
pnpm verify:100
```

Mapa visual de arquitectura:

- Fuente canonica: `LOTOSdiagrama.html`
- Publico web: `apps/web/public/architecture-map.html`
- Publico docs: `apps/docs/public/architecture-map.html`
