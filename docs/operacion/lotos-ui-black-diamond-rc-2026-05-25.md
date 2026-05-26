# LotOS UI Black Diamond RC - 2026-05-25

## Resumen ejecutivo

Black Diamond endurece LotOS UI para una primera campana controlada: promo grants transaccionales, eventos auditables, admin owner-only mas usable, launch readiness, feedback loop, docs comerciales, npm readiness y verificadores nuevos.

## Que se endurecio

- Nueva migracion `20260525_0004_promotional_claim_rpc.sql`.
- RPC transaccional `claim_promotional_access_grant`.
- Tabla `access_grant_events` para auditoria sanitizada.
- `/api/promo/claim` usa el helper central que llama RPC.
- `/team-access/free-grants` agrega filtros, estados, presets, riesgo y link one-time.
- `hasCapability` agregado como helper de politica.
- Security headers basicos en Next config.

## Migracion nueva

Archivo:

```text
apps/web/supabase/migrations/20260525_0004_promotional_claim_rpc.sql
```

Incluye:

- `access_grant_events`
- funcion RPC transaccional
- `for update` sobre la fila del grant
- validacion de revocacion, expiracion, start date, maxClaims y already claimed
- incremento atomico de `claim_count`
- `grant execute` limitado a `service_role`

## Admin grants

Presets disponibles:

- Creator Pass 14: `PRO_TRIAL`, Pro, 14 dias, maxClaims 1.
- Founder Pass 30: `PRO_TRIAL`, Pro, 30 dias, maxClaims 1.
- Studio Ally: `PRO_GIFT`, Pro, 180 dias, maxClaims 1.
- Full Signature Gift: `FULL_GIFT`, Full, manual only.

El codigo completo solo vive en la sesion de creacion del owner. Despues de recargar no se vuelve a mostrar.

## Launch kit

Docs creadas:

- `docs/marketing/lotos-ui-launch-kit-2026-05-25.md`
- `docs/marketing/lotos-ui-demo-script-2026-05-25.md`
- `docs/marketing/lotos-ui-feedback-form-questions.md`
- `docs/marketing/screenshots/README.md`

## NPM readiness

`@lotosui/react` sigue `private: true` y con `prepublishOnly` bloqueante. No se publico npm. Ver `docs/operacion/lotos-ui-npm-publish-readiness-2026-05-25.md`.

## Visual QA

No se instalo Playwright. Se agrego `npm run verify:visual-smoke` como smoke estatico y checklist manual en `docs/operacion/lotos-ui-visual-qa-checklist-2026-05-25.md`.

## Security headers

Agregados:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` minimo

No se agrego CSP agresiva para no romper assets/scripts sin una prueba dedicada.

## Analytics adapter

`trackProductEvent` tiene tipos ampliados y sanitiza keys sensibles. Sigue sin proveedor. Ver `docs/operacion/lotos-ui-analytics-adapter-2026-05-25.md`.

## Premium boundary

El premium boundary queda cubierto por resolver central, download gate y verificador dedicado.

Nuevo script `npm run verify:premium-boundary` revisa que descargas usen resolver central y que no haya bundles premium obvios bajo `public/`.

## Rutas nuevas

- `/feedback`
- `/team-access/launch-readiness`

## Scripts nuevos

- `npm run verify:promo-rpc`
- `npm run verify:premium-boundary`
- `npm run verify:visual-smoke`
- `npm run verify:launch-readiness`

## Riesgos residuales

Resumen de riesgos residuales:

- Migraciones 0003 y 0004 aun deben aplicarse en Supabase staging/produccion.
- Claim QA real con `PRO_TRIAL` no publico sigue pendiente hasta staging.
- Analytics sigue no-op.
- Visual QA automatizada real con screenshots queda pendiente si se decide instalar Playwright o usar infraestructura externa.
- No hay `npm test` raiz.

## Falta antes de campana publica

1. Backup staging.
2. Aplicar migraciones 0003 y 0004 en staging.
3. Crear `PRO_TRIAL` QA no publico.
4. Claim desde `/claim`.
5. Verificar `/account/access`.
6. Revocar y confirmar downgrade.
7. Repetir en produccion con un unico QA.
8. Capturar screenshots sin datos reales.
9. Conectar feedback operativo.

## Checklist 5 testers

- Crear 5 Creator Pass 14, uno por tester.
- `maxClaims: 1` por codigo.
- Expiracion 14 dias.
- Compartir codigo por canal privado.
- Pedir feedback con `/feedback`.
- Revisar eventos y claims en `/team-access/free-grants`.
- Revocar cualquier codigo filtrado.

## Checklist campana de 50 testers

- Confirmar RPC transaccional aplicada en produccion.
- Usar codigos de una sola persona o lotes pequenos.
- Monitorear `access_grant_events`.
- Preparar respuesta para `max_claims_reached`.
- Capturar conversion manual: Foundation -> Claim -> Pro interest.

## Checklist campana masiva

- No iniciar sin RPC aplicada y verificada.
- Considerar rate limit server-side dedicado.
- Considerar dashboard real de eventos.
- Definir limites de soporte.
- Definir expiracion estricta.
- Tener rollback por revocacion listo.
