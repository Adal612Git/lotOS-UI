# Lemon Squeezy Go-Live Checklist

Fecha: 2026-03-03
Objetivo: dejar LotOS UI listo para cobrar con Lemon Squeezy sin contradicciones entre el checkout, la entrega y la app.

## Regla clave antes de empezar

Lemon Squeezy ya aprobo la cuenta, pero mantiene esta condicion:

- Todo producto vendido debe quedar disponible inmediatamente despues del pago.
- No prometas un producto que dependa de trabajo manual tuyo posterior.

Esto afecta directamente a `Full Signature`.

- Si `Full Signature` requiere personalizacion manual despues de la compra, no lo publiques como producto directo en Lemon Squeezy.
- En ese caso, dejalo como `Contact Sales` o cierre manual fuera de checkout.

## Que debes preparar antes de abrir Lemon Squeezy

## 1. Definir moneda y precio real

Tus precios actuales en la app son:

- Solo: `$29`
- Pro: `$79`
- Full Signature: `$149`

Decide una sola cosa antes de cargar productos:

- Si vas a cobrar en USD, configura la moneda de la tienda y de los productos en USD.
- Si vas a cobrar en MXN, convierte esos montos de forma intencional y no pongas `29` MXN por error si en realidad querias `29 USD`.

## 2. Preparar archivos de entrega inmediata

Cada producto de pago debe tener un archivo listo para entregar al instante.

Archivos recomendados:

- `lotos-ui-solo-access-pack-v1.zip`
- `lotos-ui-pro-access-pack-v1.zip`
- `lotos-ui-launch-pack-starter-v1.zip` (solo si realmente es instantaneo)

Contenido minimo recomendado de cada ZIP:

- `README.txt`
- `LICENSE.txt`
- `quick-start.txt` o `quick-start.pdf`
- assets de preview o acceso que el comprador pueda usar de inmediato

No subas un ZIP vacio ni uno que diga que luego lo prepararas manualmente.

## 3. Preparar imagenes de checkout

Lemon Squeezy recomienda imagenes de `1600 x 1200`.

Haz 3 imagenes reutilizables por producto. Con eso basta para salir a produccion.

### Imagen 1: portada comercial

Nombre sugerido:

- `lemon-solo-cover-1600x1200.png`
- `lemon-pro-cover-1600x1200.png`
- `lemon-launch-cover-1600x1200.png`

Debe mostrar:

- nombre del plan
- logo o nombre `LotOS UI`
- una frase corta de valor

Texto sugerido:

- Solo: `Private buyer access for one operator`
- Pro: `Protected premium assets for teams`
- Full: `Fast private delivery starter`

### Imagen 2: captura de producto

Nombre sugerido:

- `lemon-solo-vault-1600x1200.png`
- `lemon-pro-vault-1600x1200.png`
- `lemon-launch-flow-1600x1200.png`

Debe mostrar:

- captura del `vault`, preview premium, o una vista clara del contenido privado
- no incluyas datos sensibles

### Imagen 3: matriz de lo incluido

Nombre sugerido:

- `lemon-solo-includes-1600x1200.png`
- `lemon-pro-includes-1600x1200.png`
- `lemon-launch-includes-1600x1200.png`

Debe mostrar, en formato simple:

- que incluye
- que no incluye
- que tipo de acceso recibe el comprador

Ejemplo de bloques:

- Includes
- Delivery
- Access model
- Not included

## Configuracion recomendada en Lemon Squeezy

## Producto 1: Solo

Usa este producto para salir primero. Es el mas simple.

### General

- Name: `LotOS UI Solo License`
- Description: `Private Solo access to LotOS UI premium previews, protected downloads, and buyer-only vault access for one operator.`

### Pricing

- Tipo: `Single payment`
- Pricing model: `Standard pricing`
- Price: tu precio real de `Solo`
- Tax category:
  - `Software` si entregas un bundle descargable
  - `Software as a service (SaaS) - personal use` si el valor principal es acceso alojado en el vault

Si dudas, para `Solo` y tu flujo actual, `Software` suele ser mas preciso si hay ZIP descargable inmediato.

### Media

Sube estas 3:

- portada
- captura del vault o preview
- matriz de incluidos

### Files

Sube:

- `lotos-ui-solo-access-pack-v1.zip`

### Confirmation / post-purchase

Si Lemon te deja personalizar pantalla o boton, usa:

- Confirmation title: `Your Solo access is ready`
- Confirmation message: `Sign in with the same email used during checkout to open your LotOS UI vault.`
- Button text: `Open LotOS UI Vault`
- Button link: `https://lotos-ui.vercel.app/vault`

## Producto 2: Pro

### General

- Name: `LotOS UI Pro License`
- Description: `Protected LotOS UI Pro bundle with premium previews, private assets, and team-ready delivery for fast implementation.`

### Pricing

- Tipo: `Single payment`
- Pricing model: `Standard pricing`
- Price: tu precio real de `Pro`
- Tax category:
  - `Software` en la mayoria de los casos

### Media

Sube:

- portada Pro
- captura del vault Pro o preview premium
- matriz de incluidos Pro

### Files

Sube:

- `lotos-ui-pro-access-pack-v1.zip`

### Confirmation / post-purchase

- Confirmation title: `Your Pro access is ready`
- Confirmation message: `Use the same checkout email to unlock your protected LotOS UI Pro vault access.`
- Button text: `Open LotOS UI Vault`
- Button link: `https://lotos-ui.vercel.app/vault`

## Producto 3: Full Signature

No publiques este producto en Lemon Squeezy hasta validar esto:

- El comprador recibe un archivo completamente listo al instante.
- No requiere que tu prepares nada manual despues del pago.

Si SI es instantaneo:

### General

- Name: `LotOS UI Full Signature`
- Description: `Fast-start private LotOS UI delivery pack with a ready-to-use premium starter and protected handoff assets.`

### Pricing

- Tipo: `Single payment`
- Pricing model: `Standard pricing`
- Price: tu precio real de `Full Signature`
- Tax category: `Software`

### Media

Sube:

- portada Full
- captura del flujo o starter
- matriz de incluidos Full

### Files

Sube:

- `lotos-ui-launch-pack-starter-v1.zip`

### Confirmation / post-purchase

- Confirmation title: `Your Full Signature access is ready`
- Confirmation message: `Your protected starter is ready for download and vault access.`
- Button text: `Open LotOS UI Vault`
- Button link: `https://lotos-ui.vercel.app/vault`

Si NO es instantaneo:

- no crees este producto en Lemon Squeezy
- mantenlo en tu sitio como `Contact Sales`
- el checkout directo debe existir solo para `Solo` y `Pro`

## Datos que debes capturar al crear cada producto

Despues de crear cada producto o variante, guarda estos datos:

- checkout URL compartible
- `variant_id`
- product name exacto
- precio final
- moneda

Necesitas al menos:

- `LOTOS_SOLO_CHECKOUT_URL`
- `LOTOS_PRO_CHECKOUT_URL`
- `LOTOS_LAUNCH_PACK_URL` (solo si Full vive en Lemon)
- `LEMON_SOLO_VARIANT_ID`
- `LEMON_PRO_VARIANT_ID`
- `LEMON_LAUNCH_VARIANT_ID` (solo si Full vive en Lemon)

## Webhook de Lemon Squeezy

Crea un webhook nuevo con esta base:

- URL: `https://tu-dominio/api/webhooks/lemon`
- Eventos:
  - `order_created`
  - `subscription_created`

Guarda el `signing secret`.

Ese valor se convierte en:

- `LEMON_WEBHOOK_SECRET`

## Variables que debes cargar en Vercel

Minimas para cobrar con Lemon:

- `LOTOS_SOLO_CHECKOUT_URL`
- `LOTOS_PRO_CHECKOUT_URL`
- `LOTOS_LAUNCH_PACK_URL` (solo si aplica)
- `LEMON_WEBHOOK_SECRET`
- `LEMON_SOLO_VARIANT_ID`
- `LEMON_PRO_VARIANT_ID`
- `LEMON_LAUNCH_VARIANT_ID` (solo si aplica)

Tambien deben seguir listas para que el acceso funcione:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` o `SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY`
- `LOTOS_OWNER_EMAILS`
- `LOTOS_PREMIUM_PREVIEW_URL`

## Prueba obligatoria antes de vender en vivo

Haz esta prueba completa:

1. Usa `Test mode` en Lemon Squeezy.
2. Compra `Solo`.
3. Verifica que el webhook llegue a `/api/webhooks/lemon`.
4. Verifica que se guarde el entitlement para el correo comprador.
5. Inicia sesion con ese mismo correo.
6. Abre `https://lotos-ui.vercel.app/vault`.
7. Confirma que el acceso correcto esta activo.

Luego repite con `Pro`.

## Que me tienes que pasar cuando termines esta parte

Cuando acabes la carga en Lemon Squeezy, mandame esto:

- checkout URL de `Solo`
- checkout URL de `Pro`
- checkout URL de `Full Signature` o confirmacion de que quedara fuera
- `LEMON_SOLO_VARIANT_ID`
- `LEMON_PRO_VARIANT_ID`
- `LEMON_LAUNCH_VARIANT_ID` o confirmacion de que no aplica
- confirmacion de si `Full Signature` es instantaneo o manual
- confirmacion de si usaras USD o MXN

Con eso yo puedo proceder a alinear el repo para que:

- el sitio diga `Lemon Squeezy` en vez de `Mercado Pago` y `PayPal`
- los botones usen tus links reales
- el flujo visual coincida con el webhook que ya existe
- no haya contradicciones publicas antes de abrir ventas

## Orden recomendado para no trabarte

1. Crear `Solo`
2. Crear `Pro`
3. Definir si `Full Signature` entra o se queda fuera
4. Configurar webhook
5. Cargar variables en Vercel
6. Hacer prueba en `Test mode`
7. Avisarme para ajustar el repo
