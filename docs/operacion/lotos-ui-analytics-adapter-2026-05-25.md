# LotOS UI Analytics Adapter - 2026-05-25

## Estado

`apps/web/lib/product-analytics.ts` expone `trackProductEvent(eventName, payload)` como adaptador local sin proveedor. En servidor es no-op. En cliente emite `window` event `lotos:product-event`.

## Eventos preparados

- `free_page_view`
- `free_start_clicked`
- `creator_pass_cta_clicked`
- `claim_started`
- `claim_code_submitted`
- `claim_code_success`
- `claim_code_failed`
- `claim_success`
- `claim_failed`
- `pricing_viewed`
- `pricing_upgrade_clicked`
- `upgrade_clicked`
- `demo_opened`
- `demo_student_control_opened`
- `export_clicked`
- `pro_surface_preview_clicked`
- `pro_surface_previewed`
- `grant_created`
- `grant_revoked`

## Sanitizacion

El helper descarta payload keys que parezcan PII o secretos:

- email
- phone
- code
- token
- secret
- cookie
- authorization

No enviar correos, telefonos, codigos completos, tokens, cookies ni valores de env.

## Como conectar proveedor

Agregar un listener client-side unico en layout o provider aprobado:

```ts
window.addEventListener('lotos:product-event', (event) => {
  // Enviar a Plausible, PostHog, GA o proveedor aprobado.
});
```

Antes de activar:

- documentar proveedor;
- revisar DPA/privacidad si aplica;
- bloquear PII;
- probar en staging;
- confirmar que no se envian codigos promocionales.
