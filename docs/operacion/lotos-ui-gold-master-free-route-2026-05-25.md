# LotOS UI Gold Master Free Route - 2026-05-25

## Resumen ejecutivo

LotOS UI queda con una ruta freemium real y una frontera premium mas auditable. Foundation permite evaluar demos, componentes base y previews sin desbloquear descargas privadas. Los pases promocionales se reclaman server-side, se guardan como hash, pueden expirar, tienen limite de claims y pueden revocarse.

La promesa comercial queda centrada en: "De pantalla generada a producto vendible."

## Que cambio en producto

- Se agregaron `/free`, `/claim`, `/claim/[code]`, `/account/access` y `/team-access/free-grants`.
- Se agregaron `AccessBadge` y `AccessSummaryCard` para mostrar acceso actual sin exponer detalles sensibles del resolver.
- La home, pricing, demo hub, Student Control, Component Catalog y Operator Cockpit ahora apuntan mejor a Foundation, Pro Studio, Full Signature y pases promocionales.
- Se preparo `trackProductEvent` como helper no-op sin proveedor ni PII.

## Landing y pricing

- `/free` explica Foundation, Pro Studio, Full Signature y pases promocionales sin devaluar premium.
- `/pricing` agrega la ruta gratuita y un bloque "Have a promotional pass?".
- La home agrega un bloque "Free Foundation, Pro Studio, Full Signature" y copy de promotional passes.

## Demos

- `/demo/student-control` refuerza el header "Student Control: flagship product surface", el badge "Built with LotOS Product Surfaces" y el bloque "Why this matters".
- `/demo/components` agrega disponibilidad Free vs Pro y copy honesto de accesibilidad.
- `/demo/operator` agrega feed de actividad y navegacion comercial.
- Se retiro el claim `WCAG AAA` del demo CRM.

## Access resolver

`resolveCurrentAccess` sigue siendo la frontera central. El orden efectivo queda:

1. `owner_bypass`
2. paid access
3. `promo_grant`
4. `qa_phone`
5. `free_default` o `anonymous`

El resolver ahora devuelve `accessLevel`, `planLabel`, `capabilityList`, `isPromotional`, `isRevocable`, `upgradeRecommended` y conserva `tier`, `capabilities` y `allowed` para compatibilidad.

## Foundation gratis

Foundation incluye demos publicas, componentes base, previews de superficies, documentacion publica y catalogo de componentes. No desbloquea descargas premium, vault privado ni Full Signature.

## Promo grants

Modelo agregado:

- `access_grants`
- `access_grant_claims`

Tipos soportados:

- `FREE_FOUNDATION`
- `PRO_TRIAL`
- `PRO_GIFT`
- `FULL_GIFT`
- `QA_ACCESS`

Los codigos se normalizan y se guardan como SHA-256 (`code_hash`). El frontend publico no lista codigos activos.

## Crear o regalar un codigo

1. Entrar como owner/admin autorizado.
2. Abrir `/team-access/free-grants`.
3. Crear codigo, label, campana, tipo, plan, expiracion y max claims.
4. Compartir el codigo manualmente con la persona o campana.
5. El usuario entra a `/claim` o `/claim/[code]` y reclama con sesion.

## Revocar acceso

- Desde `/team-access/free-grants`, usar `Revocar`.
- La revocacion marca `revoked_at` en el grant. Los claims existentes dejan de desbloquear acceso porque el resolver vuelve a validar el grant.

## Rutas agregadas

- `/free`
- `/claim`
- `/claim/[code]`
- `/account/access`
- `/team-access/free-grants`
- `/api/promo/claim`
- `/api/promo/grants`

## Archivos principales

- `apps/web/lib/access-resolver.ts`
- `apps/web/lib/access-policy.ts`
- `apps/web/lib/promo-grants.ts`
- `apps/web/app/api/promo/claim/route.ts`
- `apps/web/app/api/promo/grants/route.ts`
- `apps/web/supabase/migrations/20260525_0003_promotional_access_grants.sql`
- `apps/web/app/free/page.tsx`
- `apps/web/app/claim/page.tsx`
- `apps/web/app/account/access/page.tsx`
- `apps/web/app/team-access/free-grants/page.tsx`
- `ONE/verify-free-access.mjs`

## Pruebas ejecutadas

- `pnpm --filter @lotosui/react build` OK
- `npm run lint` OK
- `npm run check-types` OK
- `npm run build` OK
- `npm run verify:routes` OK, con warnings conocidos de SVG publicos no clasificados.
- `npm run verify:web-smoke` OK
- `npm run verify:entitlement-boundary` OK
- `npm run verify:free-access` OK
- `npm run verify:supabase-migrations` OK
- `npm test` no existe como script raiz.

HTTP local con `next start`:

- `/` 200
- `/free` 200
- `/claim` 200
- `/pricing` 200
- `/demo` 200
- `/demo/student-control` 200
- `/demo/components` 200
- `/demo/operator` 200
- `/team-access` 200
- `/login` 200
- `/account/access` 200
- `/team-access/free-grants` 200

## Busquedas finales

- Selects nativos restantes: solo en admin owner form, playground baseline y demos `sin-lotos-*` usadas como comparativa raw.
- Secrets/env: hits restantes son server/API/config no renderizados como valores publicos. No se imprimieron secrets.
- Claims fuertes: sin hits para `AAA`, `enterprise-grade`, `perfect`, `guaranteed`, `unlimited` en `apps/web/app`.
- Correos publicos reales: sin hits para Gmail/Hotmail/example.com en `apps/web/app`.

## Riesgos residuales

- La migracion de promo grants debe aplicarse en Supabase staging/produccion antes de usar codigos reales.
- El contador de claims se valida leyendo claims activos y luego actualizando `claim_count`; para campanas masivas conviene moverlo a una funcion SQL transaccional.
- `/team-access/free-grants` requiere owner/admin por sesion Google. Si auth no esta configurado, la UI queda bloqueada de forma segura.
- Analytics sigue como no-op hasta conectar proveedor.

## Pendientes reales

- Aplicar y validar migracion en staging.
- Crear un codigo de prueba no publico y reclamarlo end-to-end con una cuenta de QA.
- Definir politica comercial final para gifts lifetime.
- Conectar analytics sin PII cuando haya proveedor aprobado.

## Recomendacion siguiente

Hacer un dry-run comercial: aplicar migracion en staging, crear un `PRO_TRIAL` de 7 dias, reclamarlo con cuenta QA, confirmar `/account/access`, confirmar bloqueo al expirar/revocar y despues desplegar a produccion.
