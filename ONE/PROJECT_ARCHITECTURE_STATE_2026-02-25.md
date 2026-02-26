# LotOS UI - Arquitectura y Estado Actual (Dossier Tecnico)

Fecha de corte: 2026-02-25  
Repositorio: `lotos-ui`  
Branch: `phase1-stable`  
Commit base observado: `8c179266146716dca26d998189f8314d19051167`  
Estado de working tree al corte: 61 archivos con cambios/no trackeados.

## 1. Objetivo de este documento

Este documento sirve como fuente unica para:

1. Entender como esta organizado LotOS UI hoy.
2. Entender como funciona su arquitectura.
3. Localizar variables, contratos y puntos de entrada importantes.
4. Compartir contexto tecnico con otras IAs sin perder detalles.
5. Preparar modelado 3D de arquitectura (nodos, capas y flujos).

## 2. Resumen ejecutivo

LotOS UI esta en una transicion de:

- Estado previo: libreria React centrada en `@lotosui/claude-arm`.
- Estado actual: base multi-runtime iniciada en `@lotosui/core` con:
  - catalogo de runtimes (PHP, Python, Java, .NET, Go, C, C++, Mojo, etc.),
  - patrones de diseno por runtime,
  - endpoints MCP para consultar runtimes y patrones.

Adicionalmente, desde esta consolidacion, existe una ruta canonica unica:

- `ONE/`
- Dentro de `ONE/` viven arquitectura, manual operativo, estudios, templates y patrones.

## 3. Estructura del monorepo

Raiz:

- `apps/`
  - `docs/`: sitio de documentacion (Next + Fumadocs).
  - `web/`: sitio demo/marketing (Next).
  - `dropdown-demo/`: demo Vite React para componente dropdown.
  - `playground/`, `registry/`: reservados/infra local.
- `packages/`
  - `core/`: contratos y motores base framework-agnostic.
  - `claude-arm/`: arm React (componentes UI).
  - `sentinel/`: validacion de props y reglas de guardia.
  - `cli/`: CLI `lotos-ui`.
  - `ui/`: paquete de UI interno para apps del monorepo.
  - `typescript-config/`, `eslint-config/`: bases de tooling.
  - `deepseek-arm/`, `figma-plugin/`, `pro/`: presentes, no activos en esta iteracion.
- `ONE/`
  - ruta unica operacional (arquitectura + estrategia + templates + script de chequeo).

Workspace: `pnpm-workspace.yaml`

- `apps/*`
- `packages/*`

## 4. Arquitectura por capas

### 4.1 Capa Core (`packages/core`)

Responsabilidad: contrato universal de LotOS UI.

Modulos principales:

- `tokens/`: colores, tipografia, spacing, animaciones.
- `theme/`: generacion de CSS variables + apply theme.
- `rtl/`: logica LTR/RTL con propiedades logicas.
- `schemas/`: contratos Zod de componentes.
- `runtime/`: runtimes soportados, aliases y patrones de diseno.
- `mcp/server.ts`: servidor MCP HTTP.

Regla explicita del core: sin dependencia de framework UI.

### 4.2 Capa Arm React (`packages/claude-arm`)

Responsabilidad: implementacion React de componentes UI (15 componentes exportados actualmente).

Exporta:

- Componentes: `Button`, `Badge`, `Card`, `Input`, `Modal`, `Select`, `Checkbox`, `Switch`, `Textarea`, `Tooltip`, `Dropdown`, `RadioGroup`, `Combobox`, `Tabs`, `Accordion`.
- Cliente MCP:
  - `fetchComponentCatalog(baseUrl?)`
  - `fetchComponentSchema(componentName, baseUrl?)`

### 4.3 Capa Sentinel (`packages/sentinel`)

Responsabilidad: validacion runtime de props + warning rules.

API principal:

- `validateComponentProps(component, props)`
- `assertValidComponentProps(component, props)`
- `formatSentinelIssues(issues)`

### 4.4 Capa CLI (`packages/cli`)

Comandos actuales:

- `lotos-ui list`
- `lotos-ui add <component> --out-dir <dir> --force`

Flujo:

1. Normaliza nombre de componente.
2. Genera wrapper local React sobre `@lotosui/claude-arm`.

### 4.5 Capa Apps (`apps/docs`, `apps/web`, demos)

- `apps/docs`: docs estructurada via Fumadocs MDX.
- `apps/web`: demo/landing de alto impacto visual (incluye ruta `/estrategia`).
- `apps/dropdown-demo`: sandbox de componente puntual.

## 5. Flujo de datos principal (actual)

### 5.1 Flujo AI -> MCP -> UI

1. Agente (o cliente) consulta MCP en `@lotosui/core`.
2. MCP devuelve catalogo, schemas y reglas de uso.
3. Generacion de UI usa contratos de `@lotosui/core/schemas`.
4. Sentinel valida props y emite errores/warnings.
5. Arm React renderiza componentes finales.

### 5.2 Flujo de expansion multi-lenguaje (en progreso)

1. Runtime target se normaliza via `normalizeRuntimeId()`.
2. Se consulta patron con `listDesignPatterns()` / `getDesignPattern()`.
3. Se construye blueprint runtime-especifico con `createPatternBlueprint()`.
4. Este blueprint alimenta adapters por lenguaje (Laravel, Django, Spring, etc.).

## 6. Variables de entorno y runtime flags

Variables detectadas:

1. `MCP_PORT`
   - Declarada como global env en `turbo.json`.
   - Usada en `packages/core/src/mcp/server.ts` para puerto del servidor.
2. `NODE_ENV`
   - Usada en componentes React para warnings de desarrollo (`process.env.NODE_ENV !== 'production'`).

No se detectaron `NEXT_PUBLIC_*` ni `VITE_*` activos en codigo fuente actual.

## 7. Inventario de constantes y contratos clave

### 7.1 `@lotosui/core` - tokens

`colors`:

- Primarios: `deepNavy`, `electricRed`, `oceanBlue`, `pureWhite`, `softLavender`
- Semanticos:
  - `background.primary|secondary|card|overlay`
  - `foreground.primary|secondary|muted|inverse`
  - `accent.primary|hover|active|foreground`
  - `border.default|strong|focus`
  - `status.success|warning|error|info`
  - `light.background.*`, `light.foreground.*`, `light.border.*`

`typography`:

- `fontFamily.sans|mono`
- `fontSize.xs|sm|base|lg|xl|2xl|3xl|4xl|5xl`
- `fontWeight.normal|medium|semibold|bold|extrabold`
- `lineHeight.tight|snug|normal|relaxed|loose`
- `letterSpacing.tight|normal|wide|wider|widest`

`spacing`:

- escala: `0`, `px`, `0.5`, `1`, `1.5`, ..., `64`
- `borderRadius.none|sm|default|md|lg|xl|2xl|3xl|full`

`animation`:

- `duration.instant|fast|normal|slow|slower|slowest`
- `easing.linear|easeIn|easeOut|easeInOut|spring|bounce`
- `transition.fast|normal|slow|springNormal`
- helper: `prefersReducedMotion()`

### 7.2 `@lotosui/core` - runtime expansion

Runtime IDs:

- `react`, `vue`, `svelte`, `angular`
- `php-laravel`, `python-django`, `python-flask`
- `java-spring`, `dotnet-razor`, `go-templ`
- `c-ncurses`, `cpp-qt`, `cpp-imgui`, `mojo-experimental`

Aliases importantes:

- `php` -> `php-laravel`
- `django` -> `python-django`
- `blazor` / `.net` -> `dotnet-razor`
- `go` -> `go-templ`
- `cpp` -> `cpp-qt`
- `moho` -> `mojo-experimental`

Pattern IDs:

- `saas-control-center`
- `data-command-hub`
- `ops-incident-timeline`
- `workflow-kanban-studio`
- `executive-analytics-briefing`

### 7.3 `@lotosui/core` - schemas de componentes

Schemas Zod:

- `basePropsSchema`
- `buttonPropsSchema`
- `inputPropsSchema`
- `modalPropsSchema`
- `cardPropsSchema`
- `badgePropsSchema`

Registry:

- `componentSchemas = { button, input, modal, card, badge }`
- `ComponentName = keyof componentSchemas`

### 7.4 MCP server (`packages/core/src/mcp/server.ts`)

Constantes:

- `DEFAULT_PORT = 3100`
- `MCP_VERSION = '0.2.0'`

Endpoints activos:

1. `GET /health`
2. `GET /runtimes`
3. `GET /patterns`
4. `GET /patterns/:id?runtime=<runtime>`
5. `GET /components`
6. `GET /components/:name`
7. `GET /components/:name/examples`

### 7.5 Sentinel warning rules (`packages/sentinel/src/index.ts`)

Codigos de warning implementados:

1. `button-disabled-loading`
2. `input-missing-label`
3. `badge-dot-missing-label`

### 7.6 CLI constantes (`packages/cli/src/catalog.ts`)

`SUPPORTED_COMPONENTS`:

- `accordion`, `badge`, `button`, `card`, `checkbox`,
- `combobox`, `dropdown`, `input`, `modal`, `radio-group`,
- `select`, `switch`, `tabs`, `textarea`, `tooltip`

### 7.7 Estado UI local en `apps/web/app/page.tsx`

`useState` detectados:

1. `activeSection`
2. `modalOpen`
3. `switches`
4. `checks`
5. `radios`
6. `comboOpen`
7. `comboVal`
8. `comboQuery`
9. `activeTab`
10. `accordionOpen`
11. `dropdownOpen`

## 8. Dependencias internas entre paquetes (workspace)

Dependencias workspace detectadas:

1. `claude-arm` -> `@lotosui/core`
2. `sentinel` -> `@lotosui/core`
3. `cli` -> (dev) `@lotosui/core`
4. `core`, `cli`, `sentinel`, `ui` -> config compartida `@repo/typescript-config`
5. `ui` -> (dev) `@repo/eslint-config`

## 9. Cobertura de tests y estado de validacion

Archivos de test por paquete (fuente, sin node_modules):

- `claude-arm`: 17
- `core`: 5
- `cli`: 1
- `sentinel`: 1

Validaciones ejecutadas en esta iteracion:

1. `node ONE/check-structure.mjs` -> OK
2. `pnpm.cmd --filter @lotosui/core build` -> OK
3. `pnpm.cmd --filter @lotosui/core test` -> OK (71 tests passing)

## 10. Estado de orden y consistencia de carpetas

Gobernanza estructural vigente:

- ruta unica: `ONE/`
- documentos canonicos:
  - `ONE/PROJECT_ARCHITECTURE_STATE_2026-02-25.md`
  - `ONE/MANUAL_OPERATIVO_VICTOR.md`
  - `ONE/LOTOS_DESIGN_PATTERNS_MULTI_RUNTIME.md`
  - `ONE/ESTUDIO_estrategiafinalventas.txt`
  - `ONE/TEMPLATE_*`
- script de chequeo:
  - `ONE/check-structure.mjs`
  - comando: `pnpm verify:structure`

Observacion actual de limpieza:

- se detectan 15 carpetas de build/cache bajo `apps/packages` (advisory del script).

## 11. Riesgos tecnicos actuales (realistas)

1. Working tree muy cargado (61 cambios), riesgo de mezclar features no relacionadas.
2. Aun no hay adapters reales por lenguaje server-side; hoy hay base de contratos, no ejecucion productiva multi-lenguaje.
3. MCP cliente de `claude-arm` aun apunta solo al catalogo/components; no consume endpoints de patterns/runtimes.
4. Hay texto y metadata de marketing con claims grandes (multi-framework/global) que pueden ir mas rapido que la entrega tecnica real.

## 12. Roadmap tecnico recomendado inmediato (en orden)

1. Generar `lotos-laravel` (primer adapter real) usando blueprint `saas-control-center`.
2. Generar `lotos-django` como segundo adapter espejo.
3. Extender CLI con:
   - `lotos-ui runtimes`
   - `lotos-ui patterns --runtime <id>`
   - `lotos-ui blueprint --runtime <id> --pattern <id>`
4. Conectar `claude-arm` MCP client a `/runtimes` y `/patterns`.
5. Definir contrato de token bridge para C/C++/TUI (sin web components).

## 13. Mapa para modelado 3D de arquitectura

Sugerencia de nodos 3D (capas):

1. Capa 0 (base): `core.tokens`, `core.schemas`, `core.runtime`, `core.mcp`
2. Capa 1 (validacion): `sentinel`
3. Capa 2 (render/UI): `claude-arm`
4. Capa 3 (consumo): `apps.web`, `apps.docs`, `apps.dropdown-demo`
5. Capa 4 (gobierno producto): `ONE`

Aristas:

- `claude-arm -> core`
- `sentinel -> core.schemas`
- `cli -> core + claude-arm`
- `apps -> claude-arm/core/ui`
- `ONE (patterns/docs) -> core.runtime`

## 14. Bloque machine-readable para otras IAs

```yaml
project:
  name: lotos-ui
  date_snapshot: 2026-02-25
  branch: phase1-stable
  commit: 8c179266146716dca26d998189f8314d19051167
  workspace:
    apps: [docs, dropdown-demo, playground, registry, web]
    packages: [claude-arm, cli, core, deepseek-arm, eslint-config, figma-plugin, pro, sentinel, typescript-config, ui]
core:
  mcp_version: "0.2.0"
  runtimes:
    - react
    - vue
    - svelte
    - angular
    - php-laravel
    - python-django
    - python-flask
    - java-spring
    - dotnet-razor
    - go-templ
    - c-ncurses
    - cpp-qt
    - cpp-imgui
    - mojo-experimental
  patterns:
    - saas-control-center
    - data-command-hub
    - ops-incident-timeline
    - workflow-kanban-studio
    - executive-analytics-briefing
  endpoints:
    - GET /health
    - GET /runtimes
    - GET /patterns
    - GET /patterns/:id
    - GET /components
    - GET /components/:name
    - GET /components/:name/examples
env:
  - MCP_PORT
  - NODE_ENV
status:
  tests_core: "71 passing"
  dirty_files: 61
```

## 15. Ubicaciones clave (quick lookup)

1. Core barrel: `packages/core/src/index.ts`
2. Runtime catalog: `packages/core/src/runtime/runtimes.ts`
3. Runtime patterns: `packages/core/src/runtime/patterns.ts`
4. MCP server: `packages/core/src/mcp/server.ts`
5. Schemas: `packages/core/src/schemas/components.ts`
6. Sentinel rules: `packages/sentinel/src/index.ts`
7. CLI commands: `packages/cli/src/index.ts`
8. CLI catalog: `packages/cli/src/catalog.ts`
9. Web demo state: `apps/web/app/page.tsx`
10. Ruta canonica de gobierno: `ONE/README.md`

---

Si este dossier se comparte con otra IA, el mejor prompt de continuidad es:

"Usa ONE/PROJECT_ARCHITECTURE_STATE_2026-02-25.md como source of truth. Prioriza roadmap punto 12 en orden y manten compatibilidad con @lotosui/core contratos actuales."
