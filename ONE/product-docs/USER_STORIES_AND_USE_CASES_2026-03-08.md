# LotOS UI User Stories and Use Cases

Fecha: 2026-03-08

Objetivo: aterrizar para quien es el producto, que compra cada persona y que flujo de valor vive.

## Personas principales

### 1. Indie founder

Quiere:

- una base visual seria
- demos presentables
- acelerar validacion sin contratar un equipo completo

Compra natural:

- Solo Access

### 2. Agencia o studio

Quiere:

- acelerar delivery
- tener assets premium reutilizables
- presentar mejor a sus clientes

Compra natural:

- Pro Studio

### 3. Lider de operaciones

Quiere:

- modernizar flujos internos
- pasar de Excel a UI premium
- tener shells de operador o escritorio

Compra natural:

- Pro Studio o Full Signature

### 4. Equipo con IA

Quiere:

- reducir alucinacion
- usar contratos consultables
- no romper la UI al generar codigo

Compra natural:

- Free Surface + luego Pro Studio

### 5. Comprador premium/enterprise pequeño

Quiere:

- mejor presentacion
- activos listos para boardroom, M365, Sheets y Figma
- handoff mas completo

Compra natural:

- Full Signature

## Historias de usuario

### Free Surface

- Como ingeniero evaluador, quiero instalar y probar la capa publica sin pagar para validar si el sistema tiene sustancia tecnica real.
- Como founder tecnico, quiero ver docs, demos y CLI antes de comprar para sentir confianza.
- Como equipo con IA, quiero consultar contratos y patrones para generar UI valida sin adivinar props.

### Solo Access

- Como founder solitario, quiero entrar a una capa premium ligera para ver prueba privada y validar si vale subir a Pro.
- Como comprador curioso, quiero una experiencia privada inmediata despues del pago para sentir que si compre algo real.

### Pro Studio

- Como agencia, quiero kits, layouts y manifests reutilizables para entregar mas rapido.
- Como equipo de producto, quiero un vault con assets concretos por plan, no solo promesas.
- Como operador comercial, quiero previews y materiales premium para vender mejor a mis propios clientes.

### Full Signature

- Como comprador premium, quiero surfaces exclusivas que no existan en Pro para justificar el ticket mayor.
- Como consultor de transformacion, quiero kits para Sheets, Outlook y Power BI para vender modernizacion mas cara.
- Como lider de diseño/ops, quiero puente a Figma y handoff premium para que el paquete alto se sienta completo.

## Casos de uso

### Caso 1: SaaS dashboard en React

Actor:

- Startup tecnica

Objetivo:

- salir rapido con una UI seria

Entrada:

- `@lotosui/claude-arm`

Resultado:

- dashboard, forms, tablas, status, alerts

Plan mas probable:

- Free primero, luego Pro

### Caso 2: Operador interno tipo control room

Actor:

- equipo de operaciones

Objetivo:

- tener una shell visual densa y clara para monitoreo

Entrada:

- `desktop-init` o stack desktop

Resultado:

- shell desktop o web de operador

Plan mas probable:

- Pro

### Caso 3: Modernizacion Excel -> UI

Actor:

- empresa con workflows de hojas de calculo

Objetivo:

- conservar estructura mental del flujo, pero modernizar la experiencia

Entrada:

- industry kits + previews + React surface

Resultado:

- pitch premium de modernizacion y activos base

Plan mas probable:

- Pro o Full

### Caso 4: Frontend React + backend Laravel/Django

Actor:

- startup o agencia full-stack

Objetivo:

- evitar deriva entre frontend y backend

Entrada:

- CLI stacks + MCP contracts

Resultado:

- starter multi-runtime con lenguaje visual compartido

Plan mas probable:

- Pro

### Caso 5: Equipo que trabaja con IA

Actor:

- equipo que usa Claude/Cursor/Copilot

Objetivo:

- que la IA no invente props y combinaciones invalidas

Entrada:

- MCP + Sentinel

Resultado:

- flujo mas seguro de generacion UI

Plan mas probable:

- Free primero, luego Pro

## Use cases detallados

### UC-01 Compra y activacion

Precondiciones:

- pricing visible
- checkout configurado
- auth funcional

Flujo principal:

1. Usuario revisa planes.
2. Usuario elige tier.
3. Usuario paga.
4. Sistema registra entitlement.
5. Usuario inicia sesion con el mismo email.
6. Vault abre el tier correspondiente.

Resultado:

- acceso correcto al plan comprado

### UC-02 Descarga protegida

Precondiciones:

- usuario autenticado
- entitlement vigente

Flujo principal:

1. Usuario entra a vault.
2. Usuario selecciona asset.
3. API valida plan.
4. Sistema entrega archivo protegido.

Resultado:

- descarga del asset sin exponer otros tiers

### UC-03 Escalamiento de plan

Precondiciones:

- usuario ya tiene plan inferior

Flujo principal:

1. Usuario descubre limites del plan actual.
2. Pricing le muestra el valor incremental.
3. Compra plan superior.
4. Entitlement superior se registra.
5. Vault muestra superficie mas rica.

Resultado:

- el usuario percibe escalera real, no precios arbitrarios

### UC-04 Demo tecnica para cerrar venta

Precondiciones:

- CLI funcional
- demos locales o remotas

Flujo principal:

1. Vendedor corre `stacks` o `desktop-init`.
2. Muestra archivos generados.
3. Edita una vista.
4. Refresca resultado.

Resultado:

- comprador ve uso real y entiende que el valor no es solo visual

## Criterio de aceptacion comercial

Un cliente debe poder contestar estas preguntas en menos de 60 segundos:

1. Que recibo exactamente si pago este plan.
2. Que recibo hoy mismo.
3. Que diferencia hay frente a lo gratis.
4. Como cancelo.
5. A quien le escribo si algo falla.

Si no puede contestarlas, la compra no esta suficientemente madura.
