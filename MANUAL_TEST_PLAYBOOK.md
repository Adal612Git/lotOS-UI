# LotOS UI Manual Test Playbook

## 1. Que es este repo

Este repo no es una sola app. Tiene varias capas:

- `apps/web`: sitio principal, demos, pricing, vault y superficies comerciales.
- `apps/docs`: documentacion navegable.
- `packages/claude-arm`: libreria React principal.
- `packages/core`: tokens, contratos, runtime catalog y MCP.
- `packages/cli`: CLI para descubrir runtimes y generar starters.
- `packages/web-components`: custom elements en estado prototype.
- `packages/lotos-*`: adapters/stubs para Laravel, Django, Flask, Spring, Go y .NET.
- `apps/desktop-*`: demos desktop por tecnologia.
- `packages/pro/*`: previews y assets premium.
- `OLD/demo-video/*`: demos legacy de Excel y Calc.

## 2. Orden recomendado para probar todo

1. Probar estructura y estado general.
2. Probar `apps/docs`.
3. Probar `apps/web`.
4. Probar demos de `apps/web`.
5. Probar `packages/claude-arm`.
6. Probar `packages/cli`.
7. Probar `packages/core` y MCP.
8. Probar `packages/web-components`.
9. Probar adapters por framework.
10. Probar demos desktop.
11. Probar previews premium.
12. Probar Excel y Calc.

## 3. Comandos base

Desde la raiz `lotos-ui`:

```powershell
pnpm install
pnpm verify:structure
pnpm dev
```

Rutas esperadas al levantar desarrollo:

- web: `http://localhost:3000`
- docs: `http://localhost:3001`

Comprobacion rapida ya observada:

- `pnpm verify:structure` pasa.
- `node verify-all.cjs` hoy falla y no sirve como señal confiable de salud total.

## 4. Que probar por area

### A. Estructura general

Comando:

```powershell
pnpm verify:structure
```

Debes comprobar:

- que detecta directorios requeridos
- que `ONE/` contiene los documentos canonicos
- si sugiere mover o limpiar archivos

Antes:

- repo tal cual

Despues:

- confirmas si la estructura minima existe y si el repo esta ordenado o no

### B. Documentacion

App:

- `apps/docs`

Comando:

```powershell
pnpm --filter docs dev
```

Paginas clave:

- `/`
- `/docs/start-here`
- `/docs/installation`
- `/docs/use-cases`
- `/docs/multi-runtime`
- `/docs/architecture`
- `/docs/ai-integration`
- `/docs/mcp-spec`
- `/docs/components/button`
- `/docs/components/table`
- `/docs/components/modal`

Debes comprobar:

- que el sitio abre
- que la navegacion funciona
- que las paginas de componentes existen
- que la historia del producto coincide con lo que ves en el repo

Antes:

- solo promesa documental

Despues:

- evidencia de que hay onboarding, instalacion y docs por componente

### C. Sitio principal web

App:

- `apps/web`

Comando:

```powershell
pnpm --filter web dev
```

Paginas clave:

- `/`
- `/examples`
- `/multi-framework`
- `/pricing`
- `/demo`
- `/demo/operator`
- `/demo/components`
- `/demo/vault`
- `/vault`
- `/design-lab`
- `/support`

Debes comprobar:

- consistencia visual
- enlaces entre paginas
- si la narrativa comercial y tecnica tiene continuidad
- si `multi-framework` filtra, cambia vista y comunica estado por runtime

Antes:

- pagina vacia o propuesta

Despues:

- superficie real navegable con varias rutas

### D. Demos web

#### 1. `/demo/operator`

Comprueba:

- KPI cards
- tabla de incidentes
- panel derecho
- barras de progreso
- status strip

Antes:

- dashboard generico o inexistente

Despues:

- cockpit operativo con jerarquia visual clara

#### 2. `/demo/components`

Comprueba:

- botones
- badges
- stats
- cards
- progress
- forms
- alerts
- status strip

Antes:

- componentes aislados o sin cohesion

Despues:

- galeria visual coherente

#### 3. `/demo/vault`

Comprueba:

- ladder de tiers
- assets desbloqueados
- placeholders bloqueados
- diferencia entre Full Signature vs tiers inferiores

Antes:

- premium abstracto

Despues:

- premium visible y explicito

### E. Libreria React principal

Paquete:

- `packages/claude-arm`

Comandos:

```powershell
pnpm --filter @lotosui/claude-arm build
pnpm --filter @lotosui/claude-arm test
pnpm --filter @lotosui/claude-arm test:a11y
pnpm --filter @lotosui/claude-arm storybook
pnpm --filter @lotosui/claude-arm showcase
pnpm --filter @lotosui/claude-arm visual:check
```

Debes comprobar:

- que storybook abre
- que showcase abre
- que existen los 27 componentes
- que pasan tests basicos y de accesibilidad

Antes:

- afirmacion de libreria

Despues:

- evidencia de libreria con demos, stories y tests

### F. CLI

Paquete:

- `packages/cli`

Comandos:

```powershell
pnpm --filter @lotosui/cli build
pnpm --filter @lotosui/cli test
pnpm --filter @lotosui/cli exec lotos-ui list
pnpm --filter @lotosui/cli exec lotos-ui runtimes
pnpm --filter @lotosui/cli exec lotos-ui patterns
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui stacks
```

Pruebas de generacion:

```powershell
pnpm --filter @lotosui/cli exec lotos-ui add button -o tmp\components
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o tmp\desktop-python
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o tmp\php-laravel
```

Debes comprobar:

- que lista componentes
- que lista runtimes
- que lista patterns
- que genera archivos/carpetas en `tmp`

Antes:

- roadmap verbal

Despues:

- scaffolding tangible

### G. Core y MCP

Paquete:

- `packages/core`

Comandos:

```powershell
pnpm --filter @lotosui/core build
pnpm --filter @lotosui/core test
node packages/core/dist/mcp/server.js
```

Pruebas HTTP:

```powershell
curl http://localhost:3100/runtimes
curl http://localhost:3100/patterns
curl http://localhost:3100/desktop/templates
curl http://localhost:3100/stacks
curl http://localhost:3100/components/button
```

Debes comprobar:

- que el servidor levanta
- que responde JSON
- que contratos y catalogos existen

Antes:

- MCP solo en discurso

Despues:

- endpoints reales

### H. Web Components

Paquete:

- `packages/web-components`

Comando:

```powershell
pnpm --filter @lotosui/web-components build
```

Debes comprobar:

- que compila
- que existen al menos `lotos-button` y `lotos-input`
- si puedes montar una pagina simple de prueba con esos tags

Antes:

- idea de cross-framework

Despues:

- primitives reales, aunque aun prototype

### I. Adapters por framework

Revisar:

- `packages/lotos-laravel`
- `packages/lotos-django`
- `packages/lotos-flask`
- `packages/lotos-spring`
- `packages/lotos-go`
- `packages/lotos-dotnet`

Debes comprobar:

- existencia de README
- existencia de templates o examples
- si tienen validator/contracts
- si parecen ejecutables o solo skeleton

Antes:

- soporte multi-runtime reclamado

Despues:

- puedes clasificar cada adapter como usable, alpha o solo base

### J. Desktop demos

Apps:

- `apps/desktop-python-demo`
- `apps/desktop-dotnet-demo`
- `apps/desktop-rust-demo`
- `apps/desktop-java-demo`

Comandos:

```powershell
cd apps\desktop-python-demo; python app.py
cd apps\desktop-dotnet-demo; dotnet run
cd apps\desktop-rust-demo; cargo run
cd apps\desktop-java-demo; javac App.java; java App
```

Debes comprobar:

- si levantan
- si muestran KPI, tablas, paneles o modal
- si realmente son demos desktop y no solo placeholders

Antes:

- claim de desktop

Despues:

- evidencia por runtime desktop

### K. Premium previews

Abrir en navegador:

- `packages/pro/previews/sales-preview.html`
- `packages/pro/previews/excel-lotus-grid-preview.html`
- `packages/pro/previews/openoffice-calc-command-preview.html`
- `packages/pro/previews/license-matrix.html`
- `packages/pro/layouts/executive-briefing-layout.html`
- `packages/pro/layouts/operator-triad-layout.html`
- `packages/pro/admin-starter/dashboard-shell.html`

Debes comprobar:

- calidad visual
- si parecen previews seguros para venta
- si comunican valor premium sin entregar el asset completo

Antes:

- premium ambiguo

Despues:

- premium demostrable

### L. Excel y Calc

#### Excel

Archivos:

- `OLD/demo-video/excel-lotos/lotos_excel_demo.bas`
- `OLD/demo-video/excel-lotos/README.md`
- `packages/pro/industry-kits/excel-lotus-grid-kit.json`
- `packages/pro/previews/excel-lotus-grid-preview.html`

Pasos:

1. abre un workbook de prueba
2. guarda capturas del estado original
3. importa `lotos_excel_demo.bas` desde VBA
4. ejecuta `ApplyLotosTheme`
5. prueba `RefreshDashboard`
6. prueba `OpenDetailPanel`
7. prueba `ApplyStatusTheme`

Debes comprobar:

- creacion o uso de hoja `Dashboard`
- ribbon KPI
- command strip
- tabla operativa
- panel de detalle
- named ranges `LOTOS_*`

Antes:

- libro feo, plano o legacy

Despues:

- mismo libro con facelift estilo command surface

#### Calc / OpenOffice

Archivos:

- `OLD/demo-video/calc-lotos/lotos_calc_demo.bas`
- `OLD/demo-video/calc-lotos/README.md`
- `packages/pro/industry-kits/openoffice-calc-command-kit.json`
- `packages/pro/previews/openoffice-calc-command-preview.html`

Pasos:

1. crea y guarda un `.ods`
2. crea modulo Basic
3. pega `lotos_calc_demo.bas`
4. ejecuta `CreateBeforeSheet`
5. guarda capturas del "before"
6. ejecuta `ApplyLotosThemeCalc`
7. prueba `SyncControlRoom`
8. prueba `OpenAlertInspector`
9. prueba `ClearCompletedQueue`

Debes comprobar:

- que existe transformacion dentro del mismo workbook
- hoja `ControlRoom`
- KPI ribbon
- command strip
- colores de estados
- named ranges `LOTOS_*`

Antes:

- hoja intencionalmente simple o fea

Despues:

- hoja estilizada sin rehacer el sistema

## 5. Como comparar el antes y el despues

Usa siempre este metodo:

1. captura pantalla antes
2. ejecuta la accion
3. captura pantalla despues
4. compara visualmente layout, jerarquia, color, densidad y claridad
5. anota si la accion cambio solo estilo o tambien estructura

Para web:

- usa una tabla con columnas `ruta`, `antes`, `despues`, `fallos`, `notas`

Para Excel/Calc:

- compara misma hoja o libro antes y despues
- anota si aparecieron named ranges, macros auxiliares y paneles nuevos

Para CLI:

- compara arbol de archivos antes y despues de `tmp`

Para MCP:

- compara ausencia/presencia de JSON real y endpoints vivos

## 6. Matriz corta de evidencia

- Docs vivas: si `apps/docs` navega y carga contenido.
- Producto web vivo: si `apps/web` abre rutas reales.
- Libreria real: si `claude-arm` compila, prueba y muestra stories/showcase.
- CLI real: si genera archivos.
- MCP real: si responde endpoints.
- Premium real: si previews comunican valor concreto.
- Spreadsheet lane real: si Excel/Calc cambian visualmente el mismo archivo.

## 7. Prompt para ChatGPT durante tu prueba manual

Usa este prompt base:

```text
Estoy validando manualmente un repo llamado LotOS UI. Quiero que actues como auditor tecnico y de producto.

Tu trabajo en esta conversacion:
1. ayudarme a decidir que probar primero
2. convertir cada prueba en checklist manual
3. ayudarme a comparar antes vs despues
4. decirme si lo que estoy viendo demuestra producto real, demo, preview o solo skeleton
5. pedirme evidencia concreta: captura, comando, ruta, archivo, salida o video

Contexto del repo:
- apps/web = sitio principal, demos, pricing, vault
- apps/docs = documentacion
- packages/claude-arm = libreria React principal
- packages/core = tokens, contratos, MCP
- packages/cli = scaffolding
- packages/web-components = prototype
- packages/lotos-* = adapters multi-runtime
- apps/desktop-* = demos desktop
- packages/pro/* = previews premium
- OLD/demo-video/* = macros Excel y Calc

Reglas:
- no asumas que algo funciona si no te doy evidencia
- separa siempre entre "existe", "corre", "sirve", "demuestra valor"
- para cada prueba dame:
  - objetivo
  - pasos
  - evidencia esperada
  - como verificar antes y despues
  - criterio de aprobado o fallido

Cuando te comparta una captura o un resultado:
- dime exactamente que demuestra y que no demuestra
- dime si eso parece producto real, mockup, preview o experimento
- proponme la siguiente prueba mas util
```

## 8. Prompt corto para Excel/Calc

```text
Estoy probando manualmente macros de LotOS UI para Excel/Calc. Quiero que me ayudes a auditar el antes y despues.

Para cada macro que ejecute:
- dime que deberia cambiar visualmente
- dime que deberia cambiar estructuralmente
- dime como comprobar named ranges, hojas nuevas, paneles, botones o hooks
- si te paso capturas antes/despues, compara jerarquia visual, claridad operativa y percepcion premium
- no me digas "se ve bien" sin justificarlo
```

## 9. Nota importante

No todo aqui esta al mismo nivel de madurez.

Segun lo inspeccionado en este repo:

- React/docs/web/CLI/core son la parte mas real.
- web-components estan mas verdes.
- adapters multi-runtime existen pero varios son alpha o skeleton.
- previews premium sirven para venta o demo, no para probar funcionalidad completa.
- Excel/Calc son una linea separada y si se pueden validar manualmente como transformacion visual del mismo archivo.

## 10. Prueba comparativa: sin LotOS UI vs con LotOS UI

Usa esta comparacion cuando quieras demostrar valor rapido a un posible comprador o revisar si el producto realmente mejora algo.

### Caso A. Web sin LotOS UI

Haz una pantalla simple con HTML plano o componentes base del framework:

- un boton
- una card
- un input
- una tabla
- un panel lateral

Evalua:

- jerarquia visual
- claridad operativa
- consistencia entre estados
- tiempo para dejarlo presentable

### Caso B. Web con LotOS UI

Repite la misma pantalla usando:

- `@lotosui/claude-arm` si quieres la capa publica
- `@lotosui/claude-arm-pro` si quieres la comparacion premium real
- `/playground`
- `/demo/components`
- `/demo/operator`

Evalua lo mismo y compara:

- densidad util sin verse roto
- coherencia visual entre componentes
- rapidez para armar una superficie creible
- diferencia entre free y premium

### Caso C. Spreadsheet sin LotOS UI

Usa un libro simple de Excel o Calc sin macros LotOS:

- encabezados planos
- tabla sin estados
- sin command strip
- sin KPI ribbon

Guarda captura o video.

### Caso D. Spreadsheet con LotOS UI

Ejecuta las macros del repo:

- Excel: `OLD/demo-video/excel-lotos/lotos_excel_demo.bas`
- Calc: `OLD/demo-video/calc-lotos/lotos_calc_demo.bas`

Comprueba:

- hoja de comando
- KPI ribbon
- status colors
- panel de detalle
- apariencia de consola operativa

### Resultado esperado

Si la prueba sale bien, debes poder mostrar:

- mismo problema
- misma base funcional
- una version sin LotOS UI que se ve generica o manual
- una version con LotOS UI que ya parece producto o superficie operativa
