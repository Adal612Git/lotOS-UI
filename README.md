# LotOS UI

Monorepo oficial de LotOS UI.

Convierte pantallas y flujos generados por IA en superficies reutilizables,
documentadas y entregables mediante paquetes UI, CLI, MCP, demos y adaptadores
multi-runtime.

Estado verificado el 2026-07-23: operativo y desplegado. La instalación
congelada, lint, tipos, 455 pruebas, build web/docs, 45/45 controles de
consistencia y smokes de CLI/MCP pasaron; la producción pública respondió en
`https://lotos-ui.vercel.app`. Consulta [STATUS.md](STATUS.md) para distinguir
lo real de lo pendiente y [RUNBOOK.md](RUNBOOK.md) para operación reproducible.

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

1. Abrir `/free` para entender Foundation y ver el valor publico sin tocar assets premium.
2. Abrir `/demo/student-control` para ver la promesa central: de pantalla generada a producto vendible.
3. Usar `/claim` solo cuando exista un Creator Pass, Founder Pass, Pro Trial o Full Gift valido.
4. Instalar `@lotosui/claude-arm` si quiere UI de aplicacion en React.
5. Leer la ruta de onboarding en `apps/docs/content/docs/start-here.mdx`.
6. Usar `@lotosui/cli` solo cuando ya necesite scaffolding, stacks o shells desktop.
7. Tratar Excel y Calc como una linea separada de modernizacion de workflows, no como la ruta normal de npm.

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
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

El workspace fija `pnpm@9.0.0` mediante `packageManager`. El build y las demos
locales no requieren secretos. Las integraciones comerciales usan el contrato
vacío de `apps/web/.env.example`; nunca copies credenciales al repositorio.

## AI-native operation

LotOS UI now includes a machine-readable operating layer for Codex, Claude Code, Gemini, and other agents:

- `AGENTS.md` - shared rules for agents
- `CLAUDE.md` - Claude Code orientation
- `GEMINI.md` - Gemini orientation
- `.codex/config.toml` - Codex local profile defaults
- `.ai/lotos.project-map.json` - project map, packages, safety, validation
- `.ai/lotos.components.json` - free/pro component split
- `.ai/lotos.runtimes.json` - runtime maturity map
- `.ai/lotos.commercial.json` - buyer login, entitlement, plans, and private surfaces
- `packages/registry/src/lotos.manifest.ts` - TypeScript manifest source of truth

Agents should read the manifest and `.ai/` files before scanning huge pages. The long-term direction is to generate docs, pricing, CLI catalogs, MCP facts, and playground metadata from this registry.

## Build y test

```bash
corepack pnpm test
corepack pnpm build
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

Verificacion de la capa AI-native:

```bash
pnpm verify:ai
```

## Despliegue

Los proyectos Vercel vinculados son `lotos-ui` y `docs`. Valida primero con
`corepack pnpm build`, despliega una preview y ejecuta smoke tests antes de
promover. El procedimiento y rollback están en [RUNBOOK.md](RUNBOOK.md).

## Limitaciones y próximos pasos

- Login, checkout, entitlement, webhooks y persistencia Supabase necesitan
  credenciales externas rotadas; el modo local sin ellas demuestra las
  superficies públicas y los contratos, no una compra real.
- Los contratos MCP marcan React, Web Components y Laravel Blade como
  soportados; Django templates y Spring Thymeleaf siguen planeados en ese
  contrato concreto.
- La validación visual manual y los flujos de proveedor deben repetirse en una
  preview con variables seguras antes de producción.
- Node.js 24 emite una advertencia deprecada desde pnpm 9; el build pasa, pero
  CI debe conservar también una versión LTS soportada para comparación.

## Release candidate

LotOS UI now has explicit private-workspace and public-release gates.

Private workspace mode is allowed to contain premium source for development, but it must say that public release is unsafe while premium is present:

```bash
pnpm run verify:private-workspace
pnpm run verify:release-candidate
```

Public release mode is now backed by the Phase 6 clean-room gate. It must fail if premium source/assets, generated private bundles, sensitive local files, unsafe public docs, unsafe AI/MCP context, or contaminated npm tarballs are present:

```bash
pnpm run verify:public-clean-room
pnpm run verify:public-release
```

New RC gates:

- `verify:drift`
- `verify:packages`
- `verify:package-exports`
- `verify:routes`
- `verify:web-smoke`
- `verify:mcp-smoke`
- `verify:cli-smoke`
- `verify:generated-ai`
- `verify:registry-consumers`
- `verify:ci`
- `verify:public-clean-room`
- `verify:public-docs`
- `verify:public-ai-context`
- `verify:npm-tarballs`
- `verify:premium-stubs`

Human blockers before public release:

- rotate local and CI secrets
- move premium source/assets to private repo, private registry, or private storage
- approve final pricing and legal/support copy
- configure real domain, support email, and provider legal data

Mapa visual de arquitectura:

- Fuente canonica: `LOTOSdiagrama.html`
- Publico web: `apps/web/public/architecture-map.html`
- Publico docs: `apps/docs/public/architecture-map.html`

## Publicacion npm sin OTP manual

Workflow listo: `.github/workflows/publish-npm.yml`

Requisitos:

1. Crear token npm tipo **Automation**.
2. Guardarlo en GitHub repo secrets como `NPM_PUBLISH_TOKEN`.
3. Ejecutar workflow **Publish NPM Packages** desde Actions (manual).

Publica en orden:

1. `@lotosui/registry`
2. `@lotosui/core`
3. `@lotosui/sentinel`
4. `@lotosui/cli`
5. `@lotosui/claude-arm`
6. `@lotosui/web-components`

El workflow corre `verify:public-release` antes de publicar. Mientras `packages/pro` o `packages/claude-arm-pro` sigan en el repo, ese gate debe fallar.

Antes de publicar paquetes, revisar tambien:

```bash
pnpm run verify:npm-tarballs
pnpm run verify:package-exports
```

## Licenciamiento

La capa publica del monorepo usa MIT.

La capa privada en `packages/pro` no usa MIT y mantiene su propia licencia en `packages/pro/LICENSE.proprietary.txt`.

## Estado comercial real

Hoy el flujo tecnico de venta existe:

- `apps/web` tiene pricing, checkout, webhook Lemon, entitlements y vault
- `pnpm.cmd run verify:go-live` pasa en este repo
- `pnpm.cmd run verify:commercial` pasa en este repo

Pero hay una condicion no negociable:

- si este repositorio sigue publico y contiene `packages/claude-arm-pro` o assets premium reales, cualquiera puede descargar esa capa sin pagar

Para que la venta sea realmente self-service y protegida:

1. deja este repo privado, o
2. mueve `packages/claude-arm-pro` y cualquier asset premium a un repo o registry privado separado

La proteccion de `vault` solo protege entregas runtime. No protege codigo premium que siga versionado en un repo publico.

