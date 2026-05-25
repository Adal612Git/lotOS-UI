# Landing Premium Refresh - 2026-05-25

## Objetivo

Reposicionar LotOS UI como un sistema de product surfaces para apps creadas con IA, no como una lista de componentes, rutas y assets.

## Cambios implementados

- Home reescrita alrededor de la promesa: "De pantalla generada a producto vendible."
- Nueva demo flagship publica: `/demo/student-control`.
- Demo wall reorganizado para priorizar Student Control, Operator Cockpit y Spreadsheet Ops.
- Pricing simplificado:
  - Sin variables de entorno publicas.
  - Sin texto interno tipo plan de implementacion.
  - Pro Studio queda como plan recomendado.
  - Full Signature se presenta como flagship suite.
- Component catalog reescrito con matriz honesta de calidad:
  - stable
  - needs polish
  - preview
  - roadmap
- Claims AAA retirados de superficies publicas hasta tener auditoria visible.
- Correos reales retirados de demos publicas.
- Login publico ya no lista nombres de variables de entorno.

## Rutas principales

- `/`
- `/pricing`
- `/demo`
- `/demo/student-control`
- `/demo/components`
- `/team-access`

## Resultados locales

- `npm run lint`: OK
- `npm run build`: OK

## Resultados produccion

- Deploy Vercel produccion: OK
  - Production deployment: `https://lotos-jyvk9bmhv-adal666s-projects.vercel.app`
  - Alias publico: `https://lotos-ui.vercel.app`
- HTTP `https://lotos-ui.vercel.app/`: `200 OK`
- HTTP `https://lotos-ui.vercel.app/pricing`: `200 OK`
- HTTP `https://lotos-ui.vercel.app/demo/student-control`: `200 OK`
- HTTP `https://lotos-ui.vercel.app/demo/components`: `200 OK`
- HTTP `https://lotos-ui.vercel.app/team-access`: `200 OK`
- Smoke QA por telefono contra produccion: OK
- La home desplegada contiene el nuevo posicionamiento: `De pantalla generada a producto vendible`.
- Pricing desplegado ya no muestra el bloque publico de variables de entorno.

## Pendiente real

- Publicar alias serio `@lotosui/react`.
- Reemplazar selects nativos restantes.
- Construir `DataGridPro`, `CommandShell` y `ReportSurface`.
- Auditar fallbacks Pro contra componentes reales.
