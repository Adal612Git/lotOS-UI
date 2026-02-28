# ONE - Ruta Canonica Unica

Este directorio es el punto unico de referencia operativa para LotOS UI.

## Orden oficial

1. `PROJECT_ARCHITECTURE_STATE_2026-02-25.md`
2. `DEEPSEEK_FEEDBACK_VERIFIED_2026-02-25.md`
3. `MANUAL_OPERATIVO_VICTOR.md`
4. `LOTOS_DESIGN_PATTERNS_MULTI_RUNTIME.md`
5. `ESTUDIO_estrategiafinalventas.txt`
6. `COMMERCIAL_DELIVERY_MODEL.md`
7. `FIRST_REVENUE_RUNBOOK.md`
8. `TEMPLATE_*`
9. `README_STRATEGY.md`
10. `README_MARKET_INTEL.md`
11. `check-structure.mjs`
12. `degraded-mode.mjs`
13. `export-commercial-bundles.mjs`

## Regla

No crear nuevos documentos de estrategia fuera de `ONE/`.

Comandos utiles:

- `pnpm diagnose:local-env`
- `pnpm verify:structure`
- `pnpm verify:degraded`
- `pnpm verify:runtimes`
- `pnpm verify:runtime-examples`
- `pnpm verify:runtime-contracts`
- `pnpm verify:desktop`
- `pnpm verify:sales`
- `pnpm verify:commercial`
- `pnpm verify:ops`
- `pnpm verify:release-readiness`
- `pnpm verify:100`
- `pnpm export:commercial`
- `pnpm prep:first-sale`
