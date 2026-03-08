# LotOS UI: Commercial and PROFECO Audit

Fecha: 2026-03-08

Alcance: validar si LotOS UI ya tiene algo real y defendible que vender, si el flujo de pago/entitlement aguanta trafico comercial, y que falta para acercarse a una postura sana ante PROFECO y clientes reales.

No es asesoria legal. Es una auditoria operativa y de producto basada en codigo, activos del repo y fuentes oficiales.

## Fuentes oficiales usadas

- Ley Federal de Proteccion al Consumidor, articulos 76 BIS y 76 BIS 1:
  - https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf
- PROFECO, Monitoreo de Tiendas Virtuales:
  - https://www.profeco.gob.mx/tiendasvirtuales/
- PROFECO Distintivo Digital, informacion del Codigo de Etica:
  - https://distintivodigital.profeco.gob.mx/info-codigo-de-etica.php
- PROFECO Distintivo Digital:
  - https://distintivodigital.profeco.gob.mx/

## Veredicto ejecutivo

LotOS UI si tiene producto real. No es solo CSS.

Lo que hoy existe y se puede defender:

- una capa MIT publica con `@lotosui/claude-arm`, `@lotosui/core`, `@lotosui/cli`, `@lotosui/web-components` y demos
- scaffolding multi-runtime para stacks y shells desktop
- contratos de runtime y MCP para equipos humanos y agentes
- una capa premium con vault, assets protegidos y tres niveles de acceso
- una ruta tecnica para unlock automatico via Lemon + webhook + Supabase

Pero hoy no esta listo para escalar marketing pagado sin friccion. Hay cuatro bloqueos serios:

1. El unlock automatico no esta realmente live con la configuracion actual.
2. Los assets premium siguen visibles en el repo publico.
3. Faltan superficies legales/comerciales basicas para venta digital en Mexico.
4. Las suscripciones mensuales no tienen una superficie visible de cancelacion/gestion.

## Estado actual: semaforo

### Verde

- Producto tecnico base real
- Capa gratuita con valor suficiente para evaluacion seria
- Vault y rutas protegidas por sesion/entitlements
- Webhook Lemon implementado
- Descarga protegida de assets implementada
- Planes y escalera comercial ya modelados

### Amarillo

- Copy comercial aun mezcla promesa de producto con promesa de activos futuros
- Full Signature vende mucho valor, pero parte de ese valor es mas fuerte como servicio/premium handoff que como simple suscripcion mensual
- Faltan politicas de cancelacion, devolucion, facturacion y soporte visibles

### Rojo

- `pnpm run verify:go-live` falla
- Los checkout activos no son Lemon y por eso no garantizan unlock automatico
- `LEMON_STORE_SLUG` no esta configurado
- `packages/pro/*` sigue en el repo publico, debilitando la exclusividad premium

## Evidencia tecnica revisada

### Lo que el cliente SI compra hoy

#### Free Surface

- `packages/core`
- `packages/claude-arm`
- `packages/cli`
- `packages/web-components`
- `apps/docs`
- demos desktop publicos

Evidencia:

- `packages/pro/distribution/free.manifest.json`

#### Solo Access

- `sales-preview.html`
- `license-matrix.html`
- previews HTML de Excel y OpenOffice
- acceso al vault privado de prueba/comparacion

Evidencia:

- `apps/web/lib/commercial-assets.ts`

#### Pro Studio

- `admin-starter`
- layouts reutilizables
- industry kits
- release manifest protegido

Evidencia:

- `packages/pro/distribution/pro.manifest.json`
- `packages/pro/industry-kits/manifest.json`

#### Full Signature

- todo Pro
- seis surfaces exclusivas:
  - Google Sheets
  - Microsoft 365 Excel Web
  - Outlook
  - Executive Boardroom
  - Power BI
  - Figma token sync

Evidencia:

- `packages/pro/launch-exclusive/manifest.json`

## Por que NO es solo CSS

Un cliente serio no esta pagando colores o botones. Esta pagando una combinacion de estas capas:

1. React arm estable
   - 27 componentes reales, tipados, accesibles y empaquetados
2. Runtime contracts
   - `@lotosui/core` define patrones, runtimes y contratos reutilizables
3. CLI de arranque
   - `stack-init`, `desktop-init`, `blueprint`, `add`
4. Multi-runtime path
   - Laravel, Django, Flask, Spring, Go, .NET y desktop
5. MCP/AI safety
   - contratos consultables por agentes y validacion para reducir alucinacion
6. Premium delivery layer
   - manifests, kits, layouts y surfaces cerradas
7. Commercial vault
   - auth, entitlements, gating y descarga protegida
8. Spreadsheet modernization lane
   - kits para Excel/OpenOffice y storytelling de modernizacion operativa

La venta defendible no es "te vendo un theme". Es:

"te vendo un sistema de entrega visual y operativa con componentes, contratos, starters, assets premium y gating comercial".

## Brechas comerciales reales

### 1. Unlock automatico incompleto

Prueba actual:

- `pnpm run verify:go-live` falla con:
  - `LOTOS_SOLO_CHECKOUT_URL must use a Lemon Squeezy checkout URL for automatic unlock.`
  - `LOTOS_PRO_CHECKOUT_URL must use a Lemon Squeezy checkout URL for automatic unlock.`
  - `LOTOS_LAUNCH_PACK_URL must use a Lemon Squeezy checkout URL for automatic unlock.`
  - warning: `LEMON_STORE_SLUG is missing.`

Conclusion:

- El webhook Lemon existe.
- El entitlement path existe.
- La automatizacion no queda garantizada mientras el cobro real siga en otro proveedor sin webhook/API equivalente.

### 2. La exclusividad premium esta debilitada

Problema:

- `apps/web/lib/commercial-assets.ts` permite servir assets desde `.private-dist`, pero tambien cae a `packages/pro/...`.
- `packages/pro` sigue dentro del repo publico.

Impacto:

- Si el repo es publico, el comprador puede sentir que esta pagando por algo ya inspeccionable.
- Eso no solo afecta valor percibido. Tambien afecta confianza.

Regla recomendada:

- Nada que se venda como "protegido", "premium" o "solo para compradores" debe existir accesible desde el repo publico.

### 3. Falta superficie legal minima

No encontre rutas publicas claras para:

- terminos y condiciones
- aviso de privacidad
- politica de cancelacion
- politica de reembolsos o revocacion
- facturacion
- soporte y aclaraciones
- datos del proveedor

Para una venta digital en Mexico esto no es decorativo. Es baseline.

### 4. Suscripciones mensuales sin gestion visible

Los planes dicen:

- `MX$59 / mes`
- `MX$129 / mes`
- `MX$249 / mes`

Entonces el cliente debe tener una forma clara de:

- saber que es recurrente
- cancelar
- saber cuando deja de cobrarse
- saber que conserva y que pierde al cancelar

Hoy eso no esta visible en la superficie publica.

## Checklist PROFECO aterrizado a LotOS UI

Basado en LFPC y en el Codigo de Etica/Distintivo Digital de PROFECO.

| Requisito | Estado actual | Accion requerida |
| --- | --- | --- |
| Identidad del proveedor, nombre comercial, razon social | Parcial | Mostrar proveedor legal y marca en pagina comercial |
| Domicilio en territorio nacional y medios de contacto | Ausente | Agregar pagina de contacto/aviso legal con domicilio, email y telefono |
| RFC | Ausente | Publicarlo en la superficie legal/facturacion |
| Procedimiento de compra en espanol | Parcial | Explicar compra -> login -> unlock -> descarga |
| Derecho de revocacion/cancelacion | Ausente | Publicar politica clara para ventas digitales y suscripciones |
| Devolucion/reposicion/cambio | Ausente | Definir politica de reembolso para activos digitales |
| Garantias | Ausente | Definir garantia comercial realista y su alcance |
| Mecanismos de aclaracion o reclamacion | Ausente | Agregar canal de soporte con tiempos de respuesta |
| Aviso de privacidad | Ausente | Publicar aviso de privacidad visible desde pricing y checkout |
| Terminos y condiciones | Ausente | Publicar TyC visibles antes de comprar |
| Metodos de pago y facturacion | Parcial | Explicar Lemon/PayPal, CFDI si aplica, y procedimiento |
| Medidas de seguridad | Parcial | Comunicar autenticacion, proveedor de pago y proteccion de datos |
| Costos totales en moneda nacional | Parcial | Aclarar si precio incluye IVA y si hay cargos adicionales |
| Comprobante de transaccion | Parcial | Definir correo/recibo y donde consultarlo |
| Forma, costos y plazos de entrega | Ausente | Explicar activacion inmediata y/o assets incluidos por plan |

## Lo que debes vender para que no huela a estafa

### Nunca vender

- exclusividad sobre paquetes MIT publicos
- "todo tu stack listo" si solo React esta realmente estable
- "automatizacion completa" mientras `verify:go-live` siga fallando
- "Full Signature" como si fuera solo una skin mas cara

### Si vender

- React arm estable para produccion
- CLI que genera starters multi-runtime
- desktop shells para operadores
- MCP/runtime contracts para equipos con IA o stacks mixtos
- premium vault para assets cerrados y delivery privado
- spreadsheet modernization kits como linea premium concreta

## Como darle al cliente mas de lo que pago

No inflando el copy. Agregando valor de handoff.

### Minimo por cada compra

1. Acceso inmediato al vault correcto
2. Correo de bienvenida con:
   - que incluye su plan
   - que no incluye
   - enlace al vault
   - forma de soporte
   - politica de cancelacion
3. Changelog privado para compradores
4. Un PDF o MD corto llamado `START_HERE_FOR_BUYERS`
5. Una matriz de licencias simple

### Valor agregado sano

- video privado de onboarding por plan
- recipes de implementacion por industria
- prompts/flows para usar el CLI y MCP
- plantillas de handoff para agencias
- small wins mensuales: nuevos kits, nuevas surfaces, mejores manifests

Esto si genera sensacion de "me dieron mas".

## Recomendacion de posicionamiento por plan

### Free Surface

Promesa:

- evaluar seriamente el sistema sin pagar

No prometer:

- exclusividad

### Solo Access

Promesa:

- prueba premium, confianza comercial y primeros assets cerrados

No prometer:

- bundle completo de implementacion

### Pro Studio

Promesa:

- velocidad de entrega, kits reutilizables y mayor leverage comercial

No prometer:

- que reemplaza un equipo entero

### Full Signature

Promesa:

- suite premium de handoff y operator surfaces de mas alto valor

Mejor modelo comercial sugerido:

- suscripcion + onboarding premium
- o licencia premium + add-on de implementacion

No venderlo como si fuera solo "otro tier mensual con mas brillo".

## Decisiones duras antes de meter mas marketing

### Obligatorio antes de trafico pagado

1. Migrar checkouts activos a Lemon o implementar webhook/API real del proveedor actual.
2. Configurar `LEMON_STORE_SLUG`.
3. Mover `packages/pro` fuera del repo publico o quitar todo fallback publico.
4. Publicar:
   - Terminos y condiciones
   - Aviso de privacidad
   - Politica de cancelacion y reembolso
   - Datos del proveedor y soporte
5. Agregar una pagina "What happens after purchase".

### Muy recomendable en la siguiente iteracion

1. Portal visible de gestion de suscripcion
2. Confirmacion por correo y pantalla post-compra
3. Matriz exacta de entregables por plan
4. SLA simple de soporte
5. FAQ comercial real

## Conclusiones francas

### Lo bueno

LotOS UI si tiene hueso tecnico. Si hay algo real que comprar.

### Lo peligroso

Hoy la mayor amenaza no es el producto. Es la capa comercial:

- checkout no homologado con unlock
- premium assets demasiado visibles
- falta de documentos legales y de postventa

### Mi criterio

No es estafa por producto inexistente.

Si seria riesgoso venderlo agresivamente hoy sin cerrar esos huecos, porque el cliente podria pagar por una experiencia de compra incompleta o por una exclusividad que todavia no esta bien cercada.

Cuando cierres esos huecos, ya no estaras vendiendo "CSS bonito". Estaras vendiendo:

- componentes
- contratos
- starters
- superficies premium
- workflows multi-runtime
- delivery privado con acceso controlado

Eso si es un producto.
