# LotOS UI Buyer Self-Service Runbook

Objetivo: que una persona compre y use la capa pagada sin hablar contigo despues del pago.

## Condiciones minimas

1. Repositorio privado o separacion real entre capa publica y premium.
2. Checkout Lemon Squeezy activo por plan.
3. Webhook Lemon apuntando a `apps/web/app/api/webhooks/lemon`.
4. Tabla `entitlements` desplegada en Supabase.
5. Login Google activo.
6. Assets premium fuera del repo publico y servidos por `api/download/[asset]`.

## Flujo correcto

1. Buyer abre `/pricing`.
2. Buyer inicia sesion con Google.
3. Buyer entra a `/checkout/[plan]`.
4. Lemon cobra y envia webhook.
5. `api/webhooks/lemon` guarda entitlement en Supabase.
6. Buyer vuelve a `/after-purchase`.
7. Buyer entra a `/vault`.
8. Buyer descarga assets segun plan.

## Lo que debes revisar antes de cobrar

```powershell
pnpm.cmd run verify:go-live
pnpm.cmd run verify:commercial
pnpm.cmd --filter web build
```

## Riesgos que siguen abiertos si no los cambias

- Si el repo es publico, `packages/claude-arm-pro` sigue expuesto.
- Si el webhook falla, el buyer paga pero no desbloquea.
- Si el buyer paga con un correo y entra con otro, el vault no le abre.
- Si `packages/pro/.private-dist/` no esta staged en deploy, el vault mostrara assets pero la descarga fallara.

## Recomendacion operativa

- Publico: `@lotosui/core`, `@lotosui/cli`, `@lotosui/claude-arm`, `@lotosui/web-components`, docs y demos.
- Privado: `@lotosui/claude-arm-pro`, `packages/pro`, bundles cliente, kits comerciales.

## Lo que no se puede resolver desde este repo

- volver privado el repositorio en GitHub
- crear productos o variants en Lemon Squeezy
- configurar DNS, Vercel secrets o Supabase secrets
- contratar acceso a registry privado si decides vender el paquete premium como dependencia
