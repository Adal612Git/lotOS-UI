# LotOS UI Software Architecture Map

Fecha: 2026-03-08

Objetivo: entender la arquitectura del producto, la separacion entre capa publica y premium, y el flujo de pago -> entitlement -> vault.

## 1. Vista general

```mermaid
flowchart LR
  A[Public user] --> B[apps/web]
  B --> C[Pricing]
  B --> D[Login]
  B --> E[Vault]
  C --> F[Lemon checkout]
  F --> G[/api/webhooks/lemon]
  G --> H[Supabase entitlements]
  D --> I[NextAuth Google]
  I --> E
  E --> J[/api/download/:asset]
  J --> K[Protected assets]

  subgraph Public Layer
    L[@lotosui/claude-arm]
    M[@lotosui/core]
    N[@lotosui/cli]
    O[@lotosui/web-components]
  end

  subgraph Premium Layer
    P[packages/pro/previews]
    Q[packages/pro/layouts]
    R[packages/pro/industry-kits]
    S[packages/pro/launch-exclusive]
  end

  M --> N
  M --> O
  M --> L
  J --> P
  J --> Q
  J --> R
  J --> S
```

## 2. Boundaries

### Public layer

- docs
- demos
- MIT packages
- CLI
- runtime exploration

### Commercial layer

- pricing
- checkout
- entitlement issuance
- vault
- protected asset delivery

### Premium payload

- previews
- layouts
- industry kits
- launch-exclusive assets

## 3. Contract-first core

```mermaid
flowchart TD
  A[Design tokens] --> B[Component schemas]
  B --> C[Runtime catalog]
  C --> D[MCP contracts]
  D --> E[React arm]
  D --> F[Runtime adapters]
  D --> G[CLI scaffolding]
  D --> H[AI-safe generation]
```

## 4. Checkout and unlock sequence

```mermaid
sequenceDiagram
  participant U as User
  participant W as apps/web
  participant L as Lemon checkout
  participant H as Lemon webhook route
  participant S as Supabase
  participant V as Vault

  U->>W: Open /pricing
  W->>U: Show plans and CTA
  U->>W: Open /checkout/:plan
  W->>L: Redirect with email and custom fields
  U->>L: Complete payment
  L->>H: Send signed webhook
  H->>S: Upsert entitlement
  U->>W: Sign in with same email
  W->>S: Resolve plans
  W->>V: Allow tier access
```

## 5. Vault access state machine

```mermaid
stateDiagram-v2
  [*] --> Anonymous
  Anonymous --> SignedInNoPlan: login success
  SignedInNoPlan --> Solo: entitlement solo
  SignedInNoPlan --> Pro: entitlement pro
  SignedInNoPlan --> Full: entitlement launch_pack
  SignedInNoPlan --> Owner: owner email
  Solo --> Pro: upgrade
  Pro --> Full: upgrade
  Solo --> SignedInNoPlan: cancel or expire
  Pro --> SignedInNoPlan: cancel or expire
  Full --> SignedInNoPlan: cancel or expire
  Owner --> [*]
```

## 6. Download authorization state machine

```mermaid
stateDiagram-v2
  [*] --> RequestDownload
  RequestDownload --> Reject401: no session
  RequestDownload --> CheckAsset: session exists
  CheckAsset --> Reject404: unknown asset
  CheckAsset --> CheckEntitlement: asset exists
  CheckEntitlement --> Allow: owner or valid plan
  CheckEntitlement --> Reject403: missing plan
  Allow --> StreamFile
  StreamFile --> [*]
```

## 7. Entitlement lifecycle

```mermaid
stateDiagram-v2
  [*] --> NotGranted
  NotGranted --> PendingPayment: checkout started
  PendingPayment --> Granted: valid webhook persisted
  PendingPayment --> ManualRecovery: webhook failed
  ManualRecovery --> Granted: owner grant
  Granted --> Upgraded: higher tier purchased
  Granted --> Revoked: cancelation or admin revoke
  Upgraded --> Revoked: cancelation or admin revoke
```

## 8. Actual software modules

### Web commerce

- `apps/web/app/pricing/page.tsx`
- `apps/web/app/checkout/[plan]/page.tsx`
- `apps/web/app/api/webhooks/lemon/route.ts`
- `apps/web/app/api/download/[asset]/route.ts`
- `apps/web/app/vault/*`
- `apps/web/app/sales-config.ts`

### Entitlements and auth

- `apps/web/lib/entitlements.ts`
- `apps/web/lib/auth-server.ts`
- `apps/web/proxy.ts`
- `apps/web/supabase/entitlements.sql`

### Product assets

- `packages/pro/distribution/*.json`
- `packages/pro/previews/*`
- `packages/pro/layouts/*`
- `packages/pro/industry-kits/*`
- `packages/pro/launch-exclusive/*`

### Public product core

- `packages/claude-arm/*`
- `packages/core/*`
- `packages/cli/*`
- `packages/web-components/*`

## 9. Current architecture risks

### Risk A: checkout provider mismatch

Current state:

- automation coded for Lemon
- current active checkout URLs still fail go-live verification

Impact:

- payment can happen without guaranteed unlock

### Risk B: premium asset leakage

Current state:

- fallback download path still points to `packages/pro/...`

Impact:

- premium value is not as defensible while repo stays public

### Risk C: legal/commercial metadata gap

Current state:

- pricing exists
- legal surfaces are missing

Impact:

- purchase path is weaker than the software path

## 10. Target architecture for trustworthy commerce

```mermaid
flowchart TD
  A[Pricing] --> B[Legal pages]
  A --> C[Managed checkout]
  C --> D[Webhook]
  D --> E[Entitlements]
  E --> F[Vault]
  F --> G[Private asset storage]
  F --> H[Manage subscription]
  F --> I[Buyer onboarding docs]
```

Objetivo final:

- compra clara
- unlock automatico real
- activos realmente privados
- postventa visible
- cancelacion simple

Eso convierte una demo comercial en una plataforma vendible.
