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

## Pendiente despues del deploy

- Verificar HTTP de `/`, `/pricing`, `/demo/student-control`, `/demo/components` y `/team-access`.
- Revisar visualmente en produccion que la home ya no abre con inventario como mensaje principal.
- Mantener como trabajo futuro real:
  - publicar alias serio `@lotosui/react`
  - reemplazar selects nativos restantes
  - construir `DataGridPro`, `CommandShell` y `ReportSurface`
  - auditar fallbacks Pro contra componentes reales
