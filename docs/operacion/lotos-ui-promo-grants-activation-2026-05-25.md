# LotOS UI Promo Grants Activation - 2026-05-25

## Objetivo

Activar promo grants reales despues del Gold Master sin abrir una puerta premium publica. Este runbook cubre staging, QA, produccion, revocacion, expiracion y rollback seguro.

No regalar codigos reales antes de completar el flujo QA en staging.

## Migracion exacta

Archivo:

```text
apps/web/supabase/migrations/20260525_0003_promotional_access_grants.sql
```

Tablas:

- `public.access_grants`
- `public.access_grant_claims`

La migracion solo crea schema, indices, constraints, RLS y comments. No contiene codigos reales, hashes reales de campanas, emails, telefonos ni datos privados.

## Preflight local

Antes de tocar staging:

```bash
npm run verify:supabase-migrations
npm run verify:free-access
npm run verify:entitlement-boundary
```

Confirmar:

- `resolveCurrentAccess` sigue siendo la frontera central.
- `/api/download/[asset]` sigue delegando al resolver.
- `/api/promo/grants` es owner/admin only.
- `/api/promo/claim` requiere sesion para guardar el claim.

## Aplicar migracion en staging

1. Hacer backup del schema/tablas relevantes de staging antes de migrar.
2. Aplicar `20260525_0003_promotional_access_grants.sql` con el flujo aprobado para Supabase staging.
3. No pegar codigos promocionales reales en SQL.
4. Confirmar que las tablas existen:

```sql
select to_regclass('public.access_grants') as access_grants;
select to_regclass('public.access_grant_claims') as access_grant_claims;
```

Resultado esperado:

```text
public.access_grants
public.access_grant_claims
```

5. Confirmar columnas minimas:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('access_grants', 'access_grant_claims')
order by table_name, ordinal_position;
```

6. Confirmar RLS activo:

```sql
select relname, relrowsecurity
from pg_class
where relname in ('access_grants', 'access_grant_claims');
```

Resultado esperado: `relrowsecurity = true`.

## Crear un PRO_TRIAL QA no publico

Usar solo staging en la primera prueba.

1. Entrar como owner/admin autorizado.
2. Abrir `/team-access/free-grants`.
3. Crear un grant con:
   - Tipo: `PRO_TRIAL`
   - Plan: `Pro Studio`
   - Label: `QA Pro Trial`
   - Campana: `staging-qa`
   - Max claims: `1`
   - Expira: 7 dias desde la prueba
   - Codigo: valor secreto generado manualmente fuera del frontend publico
4. No guardar el codigo en docs, GitHub, tickets publicos, Slack publico ni screenshots.
5. Compartir el codigo solo con la cuenta QA que hara el claim.

Placeholder seguro para documentacion:

```text
<QA_PRO_TRIAL_CODE_CREATED_IN_STAGING_ADMIN>
```

## Hacer claim desde /claim

1. Abrir `/claim` en staging.
2. Iniciar sesion con la cuenta QA.
3. Pegar el codigo QA no publico.
4. Enviar el formulario.
5. Resultado esperado:
   - Estado success o already claimed si se repite la prueba con la misma cuenta.
   - El codigo no aparece listado en pantalla publica.
   - No se desbloquea nada si no hay sesion.

## Verificar /account/access

1. Abrir `/account/access` con la misma cuenta QA.
2. Confirmar:
   - Access level: Pro Studio o promotional access equivalente.
   - Source: `promo_grant`.
   - Expiration: fecha del trial.
   - Capabilities incluyen Pro, no Full.
3. Confirmar que Foundation sigue disponible cuando no hay grant valido.

## Verificar frontera premium

Con cuenta QA que reclamo `PRO_TRIAL`:

- Pro debe quedar disponible si el asset/ruta requiere Pro.
- Full Signature no debe quedar disponible salvo que el grant sea `FULL_GIFT`.
- Un usuario anonimo no debe descargar premium.
- Foundation no debe descargar premium.

Ejecutar:

```bash
npm run verify:free-access
npm run verify:entitlement-boundary
```

## Revocar

1. Entrar como owner/admin.
2. Abrir `/team-access/free-grants`.
3. Buscar `QA Pro Trial`.
4. Presionar `Revocar`.
5. Volver a `/account/access` con la cuenta QA.
6. Confirmar que el acceso Pro promocional ya no desbloquea premium.

Verificacion SQL opcional:

```sql
select id, label, grant_type, plan_key, revoked_at
from public.access_grants
where label = 'QA Pro Trial';
```

Resultado esperado: `revoked_at` no es null.

## Probar expiracion

Opcion segura en staging:

1. Crear otro `PRO_TRIAL` con expiracion muy corta.
2. Reclamarlo con cuenta QA.
3. Esperar expiracion o ajustar manualmente `expires_at` en staging para esa fila de prueba.
4. Abrir `/account/access`.
5. Confirmar que vuelve a Foundation/free default y no conserva Pro.

No hacer pruebas de expiracion manual en produccion con grants reales activos.

## Aplicar en produccion

Solo despues de staging QA:

1. Confirmar backup de produccion.
2. Aplicar `20260525_0003_promotional_access_grants.sql`.
3. Confirmar tablas, columnas y RLS igual que en staging.
4. Crear un unico `PRO_TRIAL` QA no publico.
5. Reclamarlo con cuenta QA.
6. Verificar `/account/access`, revocacion y premium boundary.
7. Despues de eso, crear codigos reales de campana.

## Rollback seguro

Rollback preferido:

- No borrar tablas.
- Revocar grants activos con `revoked_at`.
- Si un codigo se filtro, revocar ese grant y crear otro codigo.
- Si una campana se configuro mal, dejar los claims auditables y desactivar el grant.

Rollback SQL de emergencia para staging solamente:

```sql
update public.access_grants
set revoked_at = now(), updated_at = now()
where revoked_at is null;
```

Evitar `drop table` en produccion. Si se requiere remover schema, hacer backup y plan de migracion separado.

## Para campanas masivas

El flujo actual valida `maxClaims` leyendo claims activos y luego actualiza `claim_count`. Es suficiente para QA, gifts uno a uno y campanas pequenas.

Para campanas masivas, mover `claimCount` a una funcion SQL transaccional que:

- reciba `code_hash` y `email_normalized`;
- bloquee la fila del grant con `for update`;
- valide `starts_at`, `expires_at`, `revoked_at` y `max_claims`;
- inserte el claim de forma idempotente;
- incremente `claim_count` dentro de la misma transaccion;
- devuelva un estado controlado sin revelar detalles innecesarios.

No lanzar campanas de alto volumen hasta implementar esa funcion.

## Riesgos

- Si la migracion no esta aplicada, `/claim` responde con storage no disponible y no desbloquea premium.
- Si un codigo se comparte publicamente por error, debe revocarse de inmediato.
- `FULL_GIFT` debe ser bajo volumen y creado de forma explicita.
- Analytics sigue no-op; no existe tracking comercial hasta conectar proveedor aprobado.
- El primer deploy de produccion debe probarse con una cuenta QA antes de compartir codigos con usuarios reales.

## Checklist de primer PRO_TRIAL QA

- [ ] Backup staging listo.
- [ ] Migracion aplicada en staging.
- [ ] Tablas y RLS verificados.
- [ ] Owner abre `/team-access/free-grants`.
- [ ] Owner crea `PRO_TRIAL`, max claims `1`, expira en 7 dias.
- [ ] QA reclama desde `/claim`.
- [ ] QA revisa `/account/access`.
- [ ] QA confirma Pro autorizado y Full bloqueado.
- [ ] Owner revoca.
- [ ] QA confirma downgrade.
- [ ] Se repite el mismo flujo en produccion con un unico codigo QA no publico.
