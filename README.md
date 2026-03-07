# LotOS UI

Monorepo oficial de LotOS UI.

## Paquetes npm oficiales

- `@lotosui/claude-arm` (publicado, producción)
- `@lotosui/core` (publicado)
- `@lotosui/cli` (paquete CLI del monorepo)

## Adapters backend/server-side (runtime packages)

- `packages/lotos-laravel` (Blade adapter usable)
- `packages/lotos-django` (template adapter usable)
- `packages/lotos-flask` (Jinja adapter usable)
- `packages/lotos-spring` (Thymeleaf adapter usable)
- `packages/lotos-go` (html/template adapter usable)
- `packages/lotos-dotnet` (Razor adapter usable)

## Desktop demos

- `apps/desktop-python-demo` (native tkinter demo, runnable now, PyInstaller-ready)
- `apps/desktop-dotnet-demo` (WinForms demo, compilable now with `dotnet build`)

## Pro packs (separated asset layer)

- `packages/pro/admin-starter`
- `packages/pro/layouts`
- `packages/pro/industry-kits`

## Storybook scaffold

- `packages/claude-arm/.storybook`
- `packages/claude-arm/stories`
- `packages/claude-arm/STORYBOOK.md`

## Instalación rápida

```bash
npm install @lotosui/claude-arm
npm install react react-dom
```

```tsx
import '@lotosui/claude-arm/styles.css';
import { Button } from '@lotosui/claude-arm';
```

## Ruta de inicio recomendada

Si alguien llega nuevo al producto, el orden correcto es:

1. Instalar `@lotosui/claude-arm` si quiere UI de aplicacion en React.
2. Leer la ruta de onboarding en `apps/docs/content/docs/start-here.mdx`.
3. Usar `@lotosui/cli` solo cuando ya necesite scaffolding, stacks o shells desktop.
4. Tratar Excel y Calc como una linea separada de modernizacion de workflows, no como la ruta normal de npm.

## Excel y Calc

El caso de macros para spreadsheet si existe en el repo, pero no reemplaza la instalacion npm principal.

- Excel VBA demo: `OLD/demo-video/excel-lotos/lotos_excel_demo.bas`
- Excel guide: `OLD/demo-video/excel-lotos/README.md`
- Calc demo: `OLD/demo-video/calc-lotos/lotos_calc_demo.bas`
- Calc guide: `OLD/demo-video/calc-lotos/README.md`

Resumen rapido:

- `@lotosui/claude-arm` = paquete principal para UI web/producto
- macros Excel/Calc = superficie de modernizacion para hojas operativas

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
- `@lotosui/core/mcp` (server + cliente JS oficial)
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
  - demo local: `packages/core/examples/mcp-render-demo.mjs`
- Adapter packages iniciales:
  - `packages/lotos-laravel`
  - `packages/lotos-django`
  - `packages/lotos-flask`
  - `packages/lotos-spring`
  - `packages/lotos-go`
  - `packages/lotos-dotnet`

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

