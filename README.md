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
  - `GET /desktop/templates?tier=<free|pro>`
  - `GET /desktop/templates/:id`
  - `GET /stacks?runtime=<runtime>&database=<none|mongodb>`
  - `GET /stacks/:id`
  - `POST /components/render` (react, web-component, laravel-blade preview)
- Adapter skeleton inicial:
  - `packages/lotos-laravel`

Objetivo: escalar de React-only a adapters para PHP, Python, Java, .NET, Go, C/C++, y Mojo con una base visual consistente.

## Desktop apps (Python, Rust, Java, C, C++)

`@lotosui/cli` ya incluye scaffolding para app desktop con UI LotOS y bridge JS:

```bash
pnpm --filter @lotosui/cli build
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center
```

Incluye:

- Plantillas `free` y `pro` para escritorio.
- Shell visual con componentes LotOS (`@lotosui/web-components`).
- Starter host por lenguaje:
  - Python (`pywebview`)
  - Rust (`wry`)
  - Java (JavaFX WebView)
  - C/C++ (webview)

### Stack starters (Java, PHP, .NET, Go, Mongo, Python, C, C++)

```bash
pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s java-spring-starter -d mongodb -o stack/java-spring
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s dotnet-razor-starter -d mongodb -o stack/dotnet
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s go-templ-starter -d mongodb -o stack/go-templ
```

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

## Publicacion npm sin OTP manual

Workflow listo: `.github/workflows/publish-npm.yml`

Requisitos:

1. Crear token npm tipo **Automation**.
2. Guardarlo en GitHub repo secrets como `NPM_TOKEN`.
3. Ejecutar workflow **Publish NPM Packages** desde Actions (manual).

Publica en orden:

1. `@lotosui/core`
2. `@lotosui/sentinel`
3. `@lotosui/cli`
4. `@lotosui/web-components`
