# Team Access QA Fix - 2026-05-25

## Causa raiz encontrada

El flujo de QA estaba dividido entre varias fuentes de verdad:

- `/team-access` activaba una cookie QA, pero el estado visual no siempre demostraba que el servidor la aceptaria.
- `proxy.ts`, `auth-server.ts`, `entitlement-access.ts` y `/api/download/[asset]` resolvian acceso con reglas distintas.
- El intento anterior con Google agregaba una dependencia innecesaria: si NextAuth devolvia `?error=...` o recargaba el callback, el tester quedaba bloqueado aunque su telefono estuviera autorizado.
- Las descargas protegidas dependian de archivos fuera del bundle serverless de Vercel. Eso podia dar `404` aunque la autorizacion QA fuera correcta.

## Archivos modificados en esta correccion

- `apps/web/lib/tester-access-policy.ts`
- `apps/web/lib/tester-access.ts`
- `apps/web/lib/access-policy.ts`
- `apps/web/lib/access-resolver.ts`
- `apps/web/lib/auth-server.ts`
- `apps/web/proxy.ts`
- `apps/web/app/api/tester-access/route.ts`
- `apps/web/app/api/download/[asset]/route.ts`
- `apps/web/app/team-access/page.tsx`
- `apps/web/app/team-access/team-access-form.tsx`
- `ONE/verify-team-access-qa.mjs`
- `ONE/smoke-team-access-qa.mjs`
- `ONE/verify-vault-lifecycle.mjs`
- `package.json`
- `turbo.json`

## Archivos relacionados ya corregidos en commits previos

- `apps/web/lib/commercial-assets.ts`
- `apps/web/next.config.js`
- `apps/web/private-assets/**`

## Como probarlo como Victor

1. Abrir `https://lotos-ui.vercel.app/team-access`.
2. Escribir el telefono autorizado en cualquier formato razonable: con `+52`, `52`, espacios, guiones o parentesis.
3. Dar click en `Activar QA completo`.
4. La pagina debe recargar a `/team-access?activated=1` y mostrar:
   - `QA activo`
   - `Tier: launch_pack`
   - `Fuente: qa_phone`
   - vencimiento real
   - downloads y Full desbloqueados
5. Usar los botones del mapa:
   - `Abrir Vault`
   - `Abrir Full / Launch`
   - `Abrir Playground`
   - `Abrir Templates`
   - `Catalogo de Componentes`
   - `Descarga de prueba`

Google es opcional. Si Google falla con `?error=...`, `/team-access` debe mostrar una advertencia util y mantener disponible el flujo principal por telefono.

## Rutas desbloqueadas por QA launch_pack

- `/vault`
- `/vault/solo`
- `/vault/pro`
- `/vault/launch`
- `/playground`
- `/templates`
- `/demo/components`
- `/api/download/sales-preview`
- Downloads protegidas equivalentes definidas en `apps/web/lib/commercial-assets.ts`

## Seguridad

- No se commitearon telefonos en claro.
- La autorizacion usa hashes SHA-256 de telefonos normalizados.
- La cookie QA es `httpOnly`, `sameSite=lax`, `path=/`, `secure` en produccion y expira.
- No hay bypass universal: el middleware y las rutas server-side validan cookie firmada/HMAC o entitlement real.
- Los assets protegidos se incluyen fuera de `public` y se sirven por `/api/download` despues del resolver de acceso.

## Riesgos restantes

- Si `AUTH_SECRET` o `NEXTAUTH_SECRET` cambia, las cookies QA existentes dejan de validar y los testers deben reactivar con telefono.
- Si Vercel no recibe el bundle `apps/web/private-assets/**`, downloads vuelven a fallar. `outputFileTracingIncludes` fuerza su inclusion para `/api/download/[asset]`.
- El smoke de produccion requiere `LOTOS_QA_SMOKE_PHONE` en el entorno local; el numero no debe commitearse ni imprimirse.

## Comandos ejecutados

- `npm run verify:team-access-qa`
- `npm run lint`
- `npm run build`
- `LOTOS_QA_SMOKE_PHONE=<redacted> npm run smoke:team-access-qa`
- `vercel --prod --yes --token $env:VERCEL_TOKEN`

## Resultados

- `npm run verify:team-access-qa`: OK
- `npm run verify:vault-lifecycle`: OK
- `npm run lint`: OK
- `npm run build`: OK
- Smoke contra produccion: pendiente despues del deploy final.
- Deploy Vercel: pendiente despues del commit final.
