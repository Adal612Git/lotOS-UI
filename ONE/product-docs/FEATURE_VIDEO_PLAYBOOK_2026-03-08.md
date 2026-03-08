# LotOS UI Feature Video Playbook

Fecha: 2026-03-08

Objetivo: grabar videos cortos donde se vea uso real, no solo marketing. Cada video debe probar una sola idea fuerte.

## Regla de grabacion

Formato recomendado:

1. Comando
2. Archivo
3. Cambio visible
4. Resultado

No grabes:

- homepage estatica por 40 segundos
- discurso abstracto
- login largo
- explicaciones de arquitectura sin prueba visual

## Video 1: React arm en 30-45s

### Que demuestra

Que `@lotosui/claude-arm` no es CSS suelto. Te da componentes reales listos para producto.

### Comandos

```bash
pnpm --filter web dev
```

### Pantalla

- abrir `/demo/components`

### Archivo para tocar

- `apps/web/app/demo/components/page.tsx`

### Cambio rapido

- cambia un `Badge`
- cambia un `Button`
- cambia un `Stat`

### Mensaje de venta

"Esto no es una hoja de estilos. Es una capa completa de UI de aplicacion con componentes reales."

## Video 2: CLI stack scaffolding

### Que demuestra

Que LotOS no se queda en React. Tambien arranca estructura para otros runtimes.

### Comandos

```bash
pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o demo/stack/php-laravel
```

### Archivos a mostrar

- `demo/stack/php-laravel/routes/web.php`
- `demo/stack/php-laravel/resources/views/lotos/dashboard.blade.php`
- `demo/stack/php-laravel/.env.example`

### Cambio rapido

En `dashboard.blade.php` cambia:

```html
<x-lotos-ui::lotos-button variant="primary">Deploy</x-lotos-ui::lotos-button>
```

por:

```html
<x-lotos-ui::lotos-button variant="primary">Approve Order</x-lotos-ui::lotos-button>
```

### Mensaje de venta

"Arrancas una base visual y de backend mas rapido, sin inventar todo desde cero."

## Video 3: Desktop shell generado por comando

### Que demuestra

Que un equipo puede generar un shell de operador para desktop sin diseñar la base desde cero.

### Comandos

```bash
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o demo/desktop
start demo\desktop\ui\shell.html
```

### Archivo a tocar

- `demo/desktop/ui/shell.html`

### Cambio rapido

Cambia:

```html
<h2>Control Center Desktop</h2>
<p class="subtitle">Desktop starter with LotOS visual system + bridge contract</p>
<lotos-button variant="primary">Open Command Palette</lotos-button>
```

por:

```html
<h2>Fraud Ops Command Center</h2>
<p class="subtitle">Python desktop shell generated with LotOS UI</p>
<lotos-button variant="primary">Escalate incident</lotos-button>
```

### Mensaje de venta

"Generas un operador shell y lo marcas para tu caso en minutos."

## Video 4: MCP + contratos

### Que demuestra

Que el sistema tiene contratos consultables, no solo docs bonitas.

### Comandos

```bash
node packages/core/dist/mcp/server.js
curl http://localhost:3100/components/button
curl http://localhost:3100/patterns
```

### Cambio visual

- mostrar el JSON del contrato
- despues mostrar codigo generado o un componente valido

### Mensaje de venta

"Los agentes y equipos no adivinan props. Consultan contrato."

## Video 5: Sentinel anti-hallucination

### Que demuestra

Que LotOS reduce basura generada por IA y mantiene integridad del sistema.

### Flujo

1. Muestra un `Button size="xl"` invalido
2. Muestra el warning de Sentinel
3. Corrige a `size="lg"`

### Mensaje de venta

"No solo construyes UI. Tambien pones guardrails para que no se rompa."

## Video 6: Spreadsheet modernization

### Que demuestra

Que hay una linea premium enfocada a modernizar workflows operativos, no solo sitios web.

### Archivos a mostrar

- `packages/pro/industry-kits/excel-lotus-grid-kit.json`
- `packages/pro/industry-kits/openoffice-calc-command-kit.json`
- `packages/pro/previews/excel-lotus-grid-preview.html`

### Mensaje de venta

"No te vendo solo componentes. Tambien te vendo superficies para modernizar operaciones."

## Video 7: Vault + entitlement

### Que demuestra

Que hay una diferencia real entre lo publico y lo premium.

### Flujo

1. abrir `/pricing`
2. abrir `/vault`
3. mostrar tiers
4. mostrar que `api/download/[asset]` depende de plan

### Archivo a mencionar

- `apps/web/lib/commercial-assets.ts`

### Mensaje de venta

"Hay acceso controlado, assets por tier y entrega privada."

## Video 8: Full Signature

### Que demuestra

Que el tier alto existe para workflows premium concretos y no como humo.

### Archivos a mostrar

- `packages/pro/launch-exclusive/google-sheets-command-kit.json`
- `packages/pro/launch-exclusive/microsoft-365-excel-web-kit.json`
- `packages/pro/launch-exclusive/outlook-approval-console.json`
- `packages/pro/launch-exclusive/executive-boardroom-surface.json`
- `packages/pro/launch-exclusive/power-bi-executive-visual-pack.json`
- `packages/pro/launch-exclusive/figma-token-sync-plugin.json`

### Mensaje de venta

"El tier alto existe porque agrega superficies y handoff premium de verdad."

## Secuencia de contenido recomendada

### Semana 1

1. React components
2. CLI stack scaffold
3. Desktop shell

### Semana 2

1. MCP contracts
2. Sentinel
3. Vault + premium delivery

### Semana 3

1. Spreadsheet modernization
2. Full Signature
3. Caso de uso agencia o SaaS

## Frases sanas para vender

Usa:

- "contract-first UI system"
- "multi-runtime starter path"
- "premium delivery layer"
- "private vault and entitlement flow"
- "desktop and backend scaffolding"

Evita:

- "nadie mas puede hacer esto"
- "reemplaza cualquier framework"
- "full stack listo en un click"

## Formula de video corto

```txt
Problema -> comando -> archivo -> cambio -> resultado -> frase de valor
```

Ejemplo:

```txt
Need a desktop ops shell?
Run desktop-init.
Change one file.
Refresh.
Now you have a branded operator surface instead of a blank shell.
```
