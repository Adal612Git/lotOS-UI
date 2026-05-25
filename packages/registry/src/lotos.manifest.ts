export type LotosTier = 'free' | 'solo' | 'pro' | 'launch_pack' | 'enterprise' | 'internal';
export type Maturity = 'stable' | 'beta' | 'alpha' | 'prototype' | 'planned' | 'internal';
export type RuntimeCategory = 'web' | 'server-rendered' | 'mobile' | 'desktop' | 'terminal' | 'agent';
export type DocsStatus = 'complete' | 'stub' | 'planned';
export type TestsStatus = 'passing' | 'partial' | 'planned' | 'not-applicable';

export interface ComponentManifestEntry {
  id: string;
  name: string;
  description: string;
  tier: 'free' | 'pro';
  maturity: Maturity;
  category: string;
  tags: readonly string[];
  runtimes: readonly string[];
  a11y: readonly string[];
  dependencies: readonly string[];
  docs: DocsStatus;
  tests: TestsStatus;
  examplePath: string;
  publicExport: boolean;
  aiUsageNotes: string;
}

export interface RuntimeManifestEntry {
  id: string;
  label: string;
  category: RuntimeCategory;
  language: string;
  maturity: Maturity;
  packageName: string | null;
  limitations: readonly string[];
  agentGuidance: string;
}

export interface TemplateManifestEntry {
  id: string;
  name: string;
  description: string;
  industry: readonly string[];
  tier: LotosTier;
  maturity: Maturity;
  runtimes: readonly string[];
  includedComponents: readonly string[];
  installCommand: string;
  previewRoute: string | null;
  screenshot: string | null;
  aiPrompt: string;
  deployChecklist: readonly string[];
  tags: readonly string[];
}

export interface ThemeManifestEntry {
  id: string;
  name: string;
  description: string;
  maturity: Maturity;
  bestFor: readonly string[];
  tokens: {
    bg: string;
    surface: string;
    text: string;
    accent: string;
    accentAlt: string;
  };
}

export interface McpToolManifestEntry {
  id: string;
  endpoint: string;
  purpose: string;
  maturity: Maturity;
}

export interface EntitlementFlowManifestEntry {
  id: string;
  name: string;
  route: string;
  source: string;
  ownerOnly: boolean;
  requiresGoogleLogin: boolean;
  defaultTrialDays: number | null;
  allowedTrialDays: readonly number[];
  lifecycle: readonly string[];
  humanRiskNotes: readonly string[];
}

export interface PremiumStubBoundaryManifestEntry {
  id: string;
  privateSurface: string;
  publicRepresentation: 'metadata-only';
  message: string;
  allowedPublicFields: readonly string[];
  forbiddenPublicFields: readonly string[];
}

const freeComponents = [
  'alert',
  'badge',
  'button',
  'card',
  'divider',
  'empty-state',
  'input',
  'spinner',
] as const;

const proComponents = [
  'accordion',
  'avatar',
  'breadcrumbs',
  'checkbox',
  'combobox',
  'dropdown',
  'form',
  'modal',
  'progress',
  'radio-group',
  'select',
  'skeleton',
  'stat',
  'switch',
  'table',
  'tabs',
  'textarea',
  'toast',
  'tooltip',
] as const;

function toName(id: string): string {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function component(id: string, tier: 'free' | 'pro', category: string, tags: readonly string[]): ComponentManifestEntry {
  const crossRuntime = ['button', 'input', 'badge', 'card'].includes(id);
  return {
    id,
    name: toName(id),
    description: `${toName(id)} contract for product-grade LotOS UI surfaces.`,
    tier,
    maturity: tier === 'free' ? 'stable' : 'alpha',
    category,
    tags,
    runtimes: crossRuntime ? ['react', 'web-components', 'laravel-blade'] : ['react'],
    a11y: ['keyboard', 'screen-reader-name', 'focus-visible'],
    dependencies: ['@lotosui/core'],
    docs: 'complete',
    tests: 'passing',
    examplePath: `apps/docs/content/docs/components/${id}.mdx`,
    publicExport: tier === 'free',
    aiUsageNotes: tier === 'free'
      ? 'Safe for public package examples and quickstarts.'
      : 'Protected tier. Do not imply public package export unless using the pro package.',
  };
}

export const lotosManifest = {
  product: {
    name: 'LotOS UI',
    versionName: 'Lotos UI 2.0',
    positioning: 'AI-native universal UI platform',
    tagline: 'Components, templates, themes, CLI, MCP, and agent-ready workflows.',
    locales: ['en', 'es'],
    realRoot: 'lotos-ui/',
  },

  tiers: ['free', 'solo', 'pro', 'launch_pack', 'enterprise', 'internal'] as const,

  components: [
    ...freeComponents.map((id) => component(id, 'free', 'core-ui', ['forms', 'surface', 'status'])),
    ...proComponents.map((id) => component(id, 'pro', 'advanced-ui', ['workflow', 'data', 'navigation'])),
  ] satisfies readonly ComponentManifestEntry[],

  templates: [
    template('saas-dashboard', 'SaaS Dashboard', ['saas', 'b2b'], 'pro', ['next', 'react'], ['card', 'table', 'stat', 'tabs', 'badge'], null),
    template('ai-agent-console', 'AI Agent Console', ['ai', 'agents'], 'pro', ['next', 'react'], ['card', 'table', 'tabs', 'toast', 'progress'], '/ai'),
    template('rag-knowledge-base', 'RAG Knowledge Base', ['ai', 'knowledge'], 'pro', ['next', 'react'], ['input', 'card', 'badge', 'table'], null),
    template('promptops-dashboard', 'PromptOps Dashboard', ['ai', 'ops'], 'pro', ['next', 'react'], ['textarea', 'tabs', 'stat', 'table'], null),
    template('evalops-dashboard', 'EvalOps Dashboard', ['ai', 'quality'], 'pro', ['next', 'react'], ['progress', 'table', 'stat', 'alert'], null),
    template('mcp-server-explorer', 'MCP Server Explorer', ['developer-tools', 'ai'], 'free', ['next', 'react'], ['input', 'card', 'badge', 'empty-state'], '/ai'),
    template('devtools-portal', 'DevTools Portal', ['developer-tools'], 'free', ['next', 'react'], ['button', 'card', 'divider', 'spinner'], null),
    template('internal-tools-dashboard', 'Internal Tools Dashboard', ['operations'], 'pro', ['react', 'laravel-blade', 'django-jinja'], ['form', 'table', 'alert', 'badge'], null),
    template('crm-mini', 'CRM Mini', ['sales', 'crm'], 'solo', ['next', 'react'], ['table', 'avatar', 'tabs', 'modal'], '/demo/con-lotos-web'),
    template('support-center', 'Support Center', ['support'], 'solo', ['next', 'react'], ['alert', 'table', 'badge', 'empty-state'], null),
    template('legal-compliance-portal', 'Legal Compliance Portal', ['legal', 'compliance'], 'enterprise', ['next', 'react', 'blazor-razor'], ['accordion', 'table', 'alert', 'breadcrumbs'], null),
    template('analytics-dashboard', 'Analytics Dashboard', ['analytics'], 'pro', ['next', 'react', 'go-templ'], ['stat', 'card', 'table', 'progress'], null),
    template('marketplace-starter', 'Marketplace Starter', ['commerce'], 'pro', ['next', 'react'], ['card', 'badge', 'modal', 'tabs'], null),
    template('docs-portal', 'Docs Portal', ['developer-tools', 'docs'], 'free', ['next', 'react'], ['button', 'card', 'breadcrumbs', 'divider'], '/docs'),
    template('billing-starter', 'Billing Starter', ['billing', 'saas'], 'pro', ['next', 'react'], ['card', 'table', 'badge', 'alert'], '/pricing'),
    template('auth-starter', 'Auth Starter', ['auth'], 'free', ['next', 'react'], ['input', 'button', 'alert', 'spinner'], '/login'),
    template('agency-landing', 'Agency Landing', ['agency', 'marketing'], 'solo', ['next', 'react', 'astro'], ['button', 'card', 'badge', 'divider'], null),
    template('startup-landing', 'Startup Landing', ['startup', 'marketing'], 'solo', ['next', 'react', 'astro'], ['button', 'card', 'badge', 'stat'], null),
    template('education-lms-mini', 'Education LMS Mini', ['education'], 'pro', ['next', 'react'], ['tabs', 'progress', 'card', 'table'], null),
    template('healthcare-admin-shell', 'Healthcare Admin Shell', ['healthcare'], 'enterprise', ['next', 'react', 'blazor-razor'], ['table', 'alert', 'badge', 'form'], null),
    template('fintech-dashboard-shell', 'Fintech Dashboard Shell', ['fintech'], 'enterprise', ['next', 'react', 'go-templ'], ['stat', 'table', 'alert', 'tabs'], null),
    template('monitoring-observability-console', 'Monitoring Observability Console', ['monitoring', 'ops'], 'pro', ['next', 'react', 'go-templ'], ['stat', 'progress', 'table', 'toast'], null),
    template('team-workspace', 'Team Workspace', ['collaboration'], 'pro', ['next', 'react'], ['avatar', 'tabs', 'card', 'toast'], null),
    template('booking-scheduling-shell', 'Booking Scheduling Shell', ['booking'], 'solo', ['next', 'react'], ['form', 'input', 'table', 'alert'], null),
    template('content-studio', 'Content Studio', ['content', 'marketing'], 'pro', ['next', 'react'], ['textarea', 'tabs', 'modal', 'toast'], null),
  ] satisfies readonly TemplateManifestEntry[],

  themes: [
    theme('operator-grid', 'Operator Grid', 'Dense control room UI for incident and support teams.', ['ops', 'monitoring'], '#f6faf8', '#ffffff', '#13201e', '#0b6b5b', '#f2b544', 'stable'),
    theme('executive-brief', 'Executive Brief', 'Board-ready metrics with stronger narrative hierarchy.', ['analytics', 'leadership'], '#f9f7f0', '#ffffff', '#1d2430', '#9a5b00', '#2f6f88', 'alpha'),
    theme('minimal-focus', 'Minimal Focus', 'Calm long-session workspace for docs, data review, and planning.', ['docs', 'planning'], '#f8fafc', '#ffffff', '#172033', '#335c81', '#5c7c5a', 'alpha'),
    theme('craft-studio', 'Craft Studio', 'Creative production surface for design labs and content studios.', ['design', 'content'], '#fbf7f2', '#ffffff', '#2c2430', '#7c3aed', '#d97706', 'prototype'),
    theme('terminal-ops', 'Terminal Ops', 'High-contrast operational style for technical users.', ['developer-tools', 'terminal'], '#08111d', '#111827', '#f8fafc', '#22c55e', '#38bdf8', 'prototype'),
    theme('clinical-light', 'Clinical Light', 'Quiet administrative healthcare shell with restrained semantic color.', ['healthcare', 'compliance'], '#f5faf9', '#ffffff', '#1f3430', '#0f766e', '#ca8a04', 'planned'),
  ] satisfies readonly ThemeManifestEntry[],

  runtimes: [
    runtime('react', 'React', 'web', 'TypeScript/JavaScript', 'stable', '@lotosui/claude-arm', [], 'Use first for production UI.'),
    runtime('next', 'Next.js', 'web', 'TypeScript/JavaScript', 'stable', 'apps/web', [], 'Primary app runtime for web, docs, pricing, and vault.'),
    runtime('web-components', 'Web Components', 'web', 'TypeScript', 'prototype', '@lotosui/web-components', ['Four custom elements are exported today.'], 'Use for cross-framework bridge work.'),
    runtime('vue', 'Vue', 'web', 'TypeScript/JavaScript', 'planned', null, ['No wrapper package implemented yet.'], 'Use web components until a wrapper exists.'),
    runtime('nuxt', 'Nuxt', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Nuxt module implemented yet.'], 'Track as planned SSR wrapper.'),
    runtime('svelte', 'Svelte', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Svelte wrapper implemented yet.'], 'Use web components for early experiments.'),
    runtime('sveltekit', 'SvelteKit', 'web', 'TypeScript/JavaScript', 'planned', null, ['No SvelteKit starter implemented yet.'], 'Track as planned adapter.'),
    runtime('astro', 'Astro', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Astro integration implemented yet.'], 'Good target for marketing/docs templates.'),
    runtime('solid', 'Solid', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Solid wrapper implemented yet.'], 'Use only as roadmap signal.'),
    runtime('qwik', 'Qwik', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Qwik wrapper implemented yet.'], 'Use only as roadmap signal.'),
    runtime('angular', 'Angular', 'web', 'TypeScript', 'planned', null, ['No Angular wrapper implemented yet.'], 'Prefer web components when experimenting.'),
    runtime('remix', 'Remix', 'web', 'TypeScript/JavaScript', 'planned', null, ['No Remix starter implemented yet.'], 'Track as planned React server route.'),
    runtime('lit', 'Lit', 'web', 'TypeScript', 'prototype', '@lotosui/web-components', ['Only base custom elements exist.'], 'Align with web component package.'),
    runtime('vanilla', 'Vanilla HTML/CSS/JS', 'web', 'TypeScript/JavaScript', 'prototype', '@lotosui/web-components', ['Requires manual registration.'], 'Use for universal demos.'),
    runtime('react-native-expo', 'React Native / Expo', 'mobile', 'TypeScript/JavaScript', 'planned', null, ['No native package implemented.'], 'Do not imply web components work here.'),
    runtime('flutter', 'Flutter', 'mobile', 'Dart', 'planned', null, ['No Flutter package implemented.'], 'Potential token export target.'),
    runtime('swiftui', 'SwiftUI', 'mobile', 'Swift', 'planned', null, ['No Swift package implemented.'], 'Potential token mapping target.'),
    runtime('kotlin-compose', 'Kotlin Compose', 'mobile', 'Kotlin', 'planned', null, ['No Kotlin package implemented.'], 'Potential token mapping target.'),
    runtime('tauri', 'Tauri', 'desktop', 'Rust/TypeScript', 'alpha', '@lotosui/cli', ['Starter only.'], 'Use desktop-init and keep shell HTML portable.'),
    runtime('electron', 'Electron', 'desktop', 'TypeScript/JavaScript', 'planned', null, ['No Electron starter implemented.'], 'Planned desktop shell target.'),
    runtime('laravel-blade', 'Laravel Blade', 'server-rendered', 'PHP', 'alpha', 'lotos-laravel', ['Adapter skeleton exists.'], 'Use for business admin panels.'),
    runtime('rails-erb', 'Rails ERB', 'server-rendered', 'Ruby', 'planned', null, ['No Rails package implemented.'], 'Roadmap only.'),
    runtime('django-jinja', 'Django/Jinja', 'server-rendered', 'Python', 'alpha', 'lotos-django', ['Adapter skeleton exists.'], 'Use for backoffice workflows.'),
    runtime('fastapi-htmx', 'FastAPI + Jinja/HTMX', 'server-rendered', 'Python', 'planned', null, ['No FastAPI starter implemented.'], 'Potential internal tools target.'),
    runtime('phoenix-liveview', 'Phoenix LiveView', 'server-rendered', 'Elixir', 'planned', null, ['No Phoenix package implemented.'], 'Roadmap only.'),
    runtime('go-templ', 'Go templ', 'server-rendered', 'Go', 'alpha', 'lotos-go', ['Adapter skeleton exists.'], 'Use for monitoring and low-overhead dashboards.'),
    runtime('rust-leptos', 'Rust Leptos', 'server-rendered', 'Rust', 'planned', null, ['No Leptos package implemented.'], 'Roadmap only.'),
    runtime('blazor-razor', 'Blazor/Razor', 'server-rendered', 'C#/.NET', 'alpha', 'lotos-dotnet', ['Razor adapter exists.'], 'Use for line-of-business apps.'),
    runtime('openai-apps-sdk', 'OpenAI Apps SDK', 'agent', 'TypeScript/JavaScript', 'planned', null, ['No Apps SDK package implemented.'], 'Use docs/MCP guidance first.'),
    runtime('mcp', 'Model Context Protocol', 'agent', 'JSON over HTTP', 'stable', '@lotosui/core', [], 'Use MCP endpoints before guessing props or routes.'),
    runtime('agents-sdk', 'Agents SDK Workflows', 'agent', 'TypeScript/Python', 'planned', null, ['No workflow integration implemented.'], 'Map to AI console templates first.'),
    runtime('langgraph-style-ui', 'LangGraph-style UI', 'agent', 'Python/TypeScript', 'planned', null, ['UI templates only.'], 'Use as pattern language, not package claim.'),
    runtime('crewai-dashboard', 'CrewAI-style Dashboard', 'agent', 'Python/TypeScript', 'planned', null, ['UI templates only.'], 'Use as pattern language, not package claim.'),
    runtime('n8n-workflow-ui', 'n8n-style Workflow UI', 'agent', 'TypeScript', 'planned', null, ['UI templates only.'], 'Use as workflow UX target.'),
  ] satisfies readonly RuntimeManifestEntry[],

  plans: [
    { id: 'free', tier: 'free', gate: 'public', unlocks: ['docs', 'examples', '8 free React exports', 'MCP facts'] },
    { id: 'solo', tier: 'solo', gate: 'entitlement:solo', unlocks: ['solo vault', 'starter commercial assets'] },
    { id: 'pro', tier: 'pro', gate: 'entitlement:pro', unlocks: ['pro vault', 'advanced assets', 'pro templates'] },
    { id: 'launch_pack', tier: 'launch_pack', gate: 'entitlement:launch_pack', unlocks: ['launch vault', 'full private bundle'] },
    { id: 'enterprise', tier: 'enterprise', gate: 'manual contract', unlocks: ['private deployment', 'custom runtime support'] },
  ],

  routes: {
    public: [
      '/',
      '/ai',
      '/templates',
      '/docs',
      '/examples',
      '/demo',
      '/design-lab',
      '/multi-framework',
      '/pricing',
      '/after-purchase',
      '/manage-subscription',
      '/cancellations',
      '/privacy',
      '/provider',
      '/refunds',
      '/support',
      '/terms',
      '/playground',
      '/estrategia',
      '/architecture-map.html',
    ],
    auth: ['/login', '/vault', '/checkout/[plan]', '/api/auth/[...nextauth]'],
    entitlementGated: ['/vault/solo', '/vault/pro', '/vault/launch', '/api/download/[asset]'],
    ownerOnly: ['/admin/entitlements', '/api/entitlements/grant', '/api/entitlements/revoke', '/api/entitlements/lookup'],
    webhook: ['/api/webhooks/lemon'],
  },

  entitlementFlows: [
    {
      id: 'paid_checkout',
      name: 'Normal paid checkout',
      route: '/checkout/[plan]',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: true,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Buyer signs in with Google.',
        'Lemon webhook grants Supabase entitlement metadata.',
        'Premium access remains active until cancelled, expired, or revoked by lifecycle handling.',
      ],
      humanRiskNotes: [
        'Buyer must use the same email in checkout and Google login.',
        'Recurring cancellation and failed payment handling must be verified before broad selling.',
      ],
    },
    {
      id: 'manual_owner_test',
      name: 'Owner manual test access',
      route: '/admin/entitlements',
      source: 'manual_owner_test:<provider>',
      ownerOnly: true,
      requiresGoogleLogin: true,
      defaultTrialDays: 14,
      allowedTrialDays: [7, 14, 30],
      lifecycle: [
        'Owner grants a temporary entitlement for QA, demos, pilots, or controlled validation.',
        'Metadata stores trialEndsAt/expiresAt and createdByOwnerEmail.',
        'Vault labels the record as a temporary manual test, not a paid purchase.',
      ],
      humanRiskNotes: [
        'Manual tests are not revenue and should expire.',
        'Do not use test grants to bypass payment for real buyers.',
      ],
    },
    {
      id: 'subscription_payment_failed',
      name: 'Subscription payment failed',
      route: '/api/webhooks/lemon',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Verified provider webhook maps payment failure to past_due.',
        'past_due blocks premium access until payment recovery is verified.',
        'Exact Lemon event names must be validated against provider docs before live sales.',
      ],
      humanRiskNotes: [
        'Do not grant premium from unverified webhooks.',
        'Decide grace-period policy before wide recurring sales.',
      ],
    },
    {
      id: 'subscription_payment_recovered',
      name: 'Subscription payment recovered',
      route: '/api/webhooks/lemon',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Verified provider webhook maps payment recovery to active.',
        'Recovery must not reactivate a revoked entitlement silently.',
        'Exact recovery/resume event names must be validated against provider docs before wide sales.',
      ],
      humanRiskNotes: [
        'Confirm whether provider uses subscription_payment_recovered, subscription_payment_success, resumed, or unpaused events.',
        'Run duplicate event and invalid signature tests before wide sales.',
      ],
    },
    {
      id: 'subscription_paused',
      name: 'Subscription paused',
      route: '/api/webhooks/lemon',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Verified provider webhook maps pause to paused.',
        'paused blocks premium access by default.',
      ],
      humanRiskNotes: ['Confirm provider pause semantics before live sales.'],
    },
    {
      id: 'subscription_cancelled',
      name: 'Subscription cancelled',
      route: '/api/webhooks/lemon',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Verified provider webhook maps cancellation to cancelled.',
        'cancelled blocks premium access unless a future paid period policy says otherwise.',
      ],
      humanRiskNotes: ['Confirm whether cancelled means immediate loss or end-of-period loss before live sales.'],
    },
    {
      id: 'subscription_expired',
      name: 'Subscription expired',
      route: '/api/webhooks/lemon',
      source: 'lemon',
      ownerOnly: false,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Verified provider webhook maps expiration to expired.',
        'expired blocks premium access.',
      ],
      humanRiskNotes: ['Run end-to-end expiration test before broad sales.'],
    },
    {
      id: 'manual_owner_paid_recovery',
      name: 'Owner paid recovery',
      route: '/admin/entitlements',
      source: 'manual_owner_paid_recovery:<provider>',
      ownerOnly: true,
      requiresGoogleLogin: true,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Owner reviews evidence of a real payment.',
        'Owner records recoveryReason and optional paymentReference/internalNote.',
        'Metadata separates paid recovery from automatic Lemon webhook unlock.',
      ],
      humanRiskNotes: [
        'Use only when checkout, webhook, or email matching failed after a real payment.',
        'Owner must verify payment evidence before granting recovery.',
      ],
    },
    {
      id: 'manual_owner_revoke',
      name: 'Owner revocation',
      route: '/api/entitlements/revoke',
      source: 'manual_owner_revoke',
      ownerOnly: true,
      requiresGoogleLogin: false,
      defaultTrialDays: null,
      allowedTrialDays: [],
      lifecycle: [
        'Owner submits buyer email and required reason.',
        'Entitlement metadata stores revokedAt, revokedBy, revokeReason, and updatedAt.',
        'Vault and download checks ignore revoked or expired entitlements.',
      ],
      humanRiskNotes: [
        'Reason is required for auditability.',
        'Revocation should be tested before selling recurring access broadly.',
      ],
    },
  ] satisfies readonly EntitlementFlowManifestEntry[],

  env: {
    auth: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'AUTH_SECRET'],
    entitlements: ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    lemon: ['LEMON_WEBHOOK_SECRET', 'LEMON_STORE_SLUG', 'LEMON_SOLO_VARIANT_ID', 'LEMON_PRO_VARIANT_ID', 'LEMON_LAUNCH_VARIANT_ID'],
    audit: ['ENTITLEMENT_AUDIT_HASH_PEPPER'],
    operators: ['LOTOS_OWNER_EMAILS'],
    checkout: [
      'LOTOS_CONTACT_SALES_URL',
      'LOTOS_BOOKING_URL',
      'LOTOS_SOLO_CHECKOUT_URL',
      'LOTOS_SOLO_PAYPAL_URL',
      'LOTOS_PRO_CHECKOUT_URL',
      'LOTOS_PRO_PAYPAL_URL',
      'LOTOS_LAUNCH_PACK_URL',
      'LOTOS_LAUNCH_PACK_PAYPAL_URL',
      'LOTOS_PREMIUM_PREVIEW_URL',
    ],
    legal: ['LOTOS_PROVIDER_LEGAL_NAME', 'LOTOS_PROVIDER_RFC', 'LOTOS_PROVIDER_ADDRESS', 'LOTOS_PROVIDER_EMAIL'],
    support: ['LOTOS_SUPPORT_EMAIL', 'LOTOS_SUPPORT_HOURS', 'LOTOS_SUBSCRIPTION_PORTAL_URL'],
    privateAssets: ['LOTOS_PRIVATE_ASSETS_ROOT'],
  },

  assetPermissions: [
    { id: 'public-packages', tier: 'free', paths: ['packages/registry', 'packages/core', 'packages/sentinel', 'packages/cli', 'packages/claude-arm', 'packages/web-components'], rule: 'May ship publicly when license, package files, exports, and dependency graph stay public-safe.' },
    { id: 'pro-source', tier: 'pro', paths: ['packages/claude-arm-pro', 'packages/pro'], rule: 'Keep private before public launch.' },
    { id: 'private-dist', tier: 'launch_pack', paths: ['packages/pro/.private-dist', '.commercial-dist'], rule: 'Serve only through entitlement checks or private release channels.' },
  ],

  premiumStubBoundaries: [
    {
      id: 'pro-components-metadata',
      privateSurface: 'packages/claude-arm-pro',
      publicRepresentation: 'metadata-only',
      message: 'Premium components are distributed through private access after entitlement.',
      allowedPublicFields: ['id', 'name', 'tier', 'maturity', 'category', 'tags', 'runtimes', 'docs', 'tests'],
      forbiddenPublicFields: ['sourcePath', 'assetPath', 'downloadUrl', 'privateImport', 'packageExport'],
    },
    {
      id: 'commercial-bundles-placeholder',
      privateSurface: '.commercial-dist',
      publicRepresentation: 'metadata-only',
      message: 'Premium components are distributed through private access after entitlement.',
      allowedPublicFields: ['plan', 'tier', 'entitlementGate', 'supportContactPlaceholder'],
      forbiddenPublicFields: ['bundlePath', 'signedUrl', 'storageBucket', 'privateAssetRoot'],
    },
  ] satisfies readonly PremiumStubBoundaryManifestEntry[],

  mcpTools: [
    mcpTool('project-map', 'GET /project-map', 'Project map for agents.', 'stable'),
    mcpTool('routes', 'GET /routes', 'Route gates and access boundaries.', 'stable'),
    mcpTool('component-tiers', 'GET /component-tiers', 'Free/pro component split.', 'stable'),
    mcpTool('pricing-plans', 'GET /pricing-plans', 'Commercial plan gates.', 'stable'),
    mcpTool('asset-permissions', 'GET /asset-permissions', 'Premium/public asset rules.', 'stable'),
    mcpTool('env-requirements', 'GET /env-requirements', 'Environment variable groups without values.', 'stable'),
    mcpTool('template-catalog', 'GET /templates', 'Template catalog by tier/runtime/industry.', 'alpha'),
    mcpTool('theme-catalog', 'GET /themes', 'Theme catalog and token intent.', 'alpha'),
    mcpTool('runtime-matrix', 'GET /runtime-matrix', 'Expanded runtime maturity matrix.', 'alpha'),
    mcpTool('release-readiness', 'GET /release-readiness', 'Go-live and release readiness score.', 'alpha'),
    mcpTool('entitlement-flows', 'GET /entitlement-flows', 'Entitlement grant, recovery, and revocation flows.', 'alpha'),
    mcpTool('generate-template-prompt', 'GET /templates/:id/prompt', 'AI prompt for generating a template.', 'alpha'),
  ] satisfies readonly McpToolManifestEntry[],

  releaseReadiness: {
    score: 74,
    status: 'private-rc-public-blocked',
    publicCleanRoom: {
      ready: false,
      status: 'public-clean-room-blocked',
      evidencePath: '.release/public-clean-room-report.json',
      validationCommand: 'pnpm run verify:public-clean-room',
      requiredBeforePublicRepo: [
        'Evacuate and rotate local secrets before any public branch or package release.',
        'Detach packages/claude-arm-pro, packages/pro, .commercial-dist, and private assets from the public worktree.',
        'Replace premium source/code references with metadata-only stubs.',
        'Regenerate public dependency graph, lockfile, AI context, and package tarball reports.',
      ],
      expectedCurrentBlockers: [
        'Local secrets are intentionally detected by verify:no-secrets.',
        'Premium source and commercial bundles are still present in the private workspace.',
        'Public AI/MCP context still exposes private path metadata until sanitized projection exists.',
      ],
    },
    lifecycleValidation: {
      wide_sales_ready: false,
      migrations_local_validated: true,
      webhook_contracts_validated: true,
      audit_validated: true,
      entitlement_boundary_validated: true,
      supabase_remote_validated: false,
      lemon_remote_validated: false,
      evidencePath: '.release/lifecycle-validation.json',
      runbook: 'docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md',
      validationCommands: [
        'pnpm run verify:entitlement-boundary',
        'pnpm run verify:webhook-lifecycle',
        'pnpm run verify:webhook-contracts',
        'pnpm run verify:supabase-migrations',
        'pnpm run verify:entitlement-audit',
        'pnpm run verify:commercial-lifecycle',
        'pnpm run verify:rls-policy-plan',
      ],
      requiredHumanTests: [
        'Back up staging public.entitlements before migration.',
        'Apply lifecycle and audit migrations in staging Supabase.',
        'Validate RLS posture for entitlement and audit tables.',
        'Confirm purchase creates active entitlement.',
        'Confirm duplicate webhook delivery is idempotent.',
        'Confirm invalid Lemon signature does not mutate entitlements.',
        'Confirm payment failed, pause, resume, cancellation, expiration, revocation, and paid recovery.',
        'Confirm audit rows do not store raw emails, secrets, raw payloads, cookies, or auth headers.',
      ],
    },
    blockers: [
      'Rotate/remove any local secrets before public sharing.',
      'Move premium source/assets to private repo or private registry before public launch.',
      'Set legal provider and support email env vars in deployment.',
      'Mark pricing as placeholder until final commercial approval.',
      'Add subscription cancellation/failed-payment automation and indexed lifecycle columns before selling recurring monthly access at scale.',
      'Validate Lemon event names and lifecycle semantics against live provider docs before broad sales.',
      'Keep wide sales blocked until Supabase and Lemon staging validation evidence exists.',
      'Keep public clean-room blocked until secrets are evacuated and premium source/assets are detached or replaced by metadata-only stubs.',
    ],
    passingSignals: [
      'verify:100 passes',
      'verify:ai passes',
      'core, cli, public React, pro React, web-components, web, and docs checks pass',
      'Buyer login is separated from owner/admin authorization',
      'Manual test, paid recovery, and revocation paths are owner-only and metadata-audited',
      'Local Supabase lifecycle and audit migrations exist but are not remotely executed',
      'Sanitized Lemon fixtures and local lifecycle contract gates exist',
      'Wide-sales evidence is machine-readable and intentionally blocked by remote validation flags',
      'Private workspace mode is allowed to warn when premium is present',
      'Public release mode is expected to fail until premium and local secrets are split',
      'Public clean-room simulator and machine-readable reports exist to explain blockers without deleting local private assets',
    ],
  },

  validation: [
    'pnpm run verify:structure',
    'pnpm run verify:registry',
    'pnpm run verify:mcp',
    'pnpm run verify:templates',
    'pnpm run verify:registry-runtimes',
    'pnpm run verify:no-secrets',
    'pnpm run verify:no-premium-leak',
    'pnpm run verify:ai',
    'pnpm run verify:drift',
    'pnpm run verify:packages',
    'pnpm run verify:routes',
    'pnpm run verify:entitlement-boundary',
    'pnpm run verify:webhook-lifecycle',
    'pnpm run verify:webhook-contracts',
    'pnpm run verify:entitlement-state-machine',
    'pnpm run verify:supabase-migrations',
    'pnpm run verify:entitlement-audit',
    'pnpm run verify:admin-lifecycle',
    'pnpm run verify:vault-lifecycle',
    'pnpm run verify:rls-policy-plan',
    'pnpm run verify:commercial-lifecycle',
    'pnpm run verify:public-clean-room',
    'pnpm run verify:public-docs',
    'pnpm run verify:public-ai-context',
    'pnpm run verify:npm-tarballs',
    'pnpm run verify:premium-stubs',
    'pnpm run verify:100',
    'pnpm --filter @lotosui/core test',
    'pnpm --filter @lotosui/cli test',
    'pnpm --filter @lotosui/claude-arm test',
    'pnpm --filter @lotosui/claude-arm-pro test',
    'pnpm --filter @lotosui/web-components check-types',
    'pnpm --filter web check-types',
    'pnpm --filter docs check-types',
  ],

  aiRules: [
    'Use lotos-ui/ as the real repo root.',
    'Never print or commit secrets.',
    'Do not treat owner emails as buyer login allowlists.',
    'Entitlements unlock premium buyer access.',
    'Do not copy premium source into public packages.',
    'Prefer manifest/MCP facts over scanning huge pages.',
    'Keep generated output separate from hand-written source.',
  ],
} as const;

function template(
  id: string,
  name: string,
  industry: readonly string[],
  tier: LotosTier,
  runtimes: readonly string[],
  includedComponents: readonly string[],
  previewRoute: string | null,
): TemplateManifestEntry {
  return {
    id,
    name,
    description: `${name} template governed by the LotOS registry with runtime, tier, deploy, and AI generation metadata.`,
    industry,
    tier,
    maturity: previewRoute ? 'prototype' : 'planned',
    runtimes,
    includedComponents,
    installCommand: `pnpm --filter @lotosui/cli exec lotos-ui templates --id ${id}`,
    previewRoute,
    screenshot: previewRoute ? `${previewRoute}/screenshot.png` : null,
    aiPrompt: `Generate a ${name} using LotOS UI contracts, semantic sections, explicit empty/loading/error states, and the ${runtimes.join(', ')} runtime path.`,
    deployChecklist: ['confirm runtime maturity', 'verify auth and entitlement needs', 'run focused typecheck', 'capture preview screenshot'],
    tags: [...industry, tier],
  };
}

function theme(
  id: string,
  name: string,
  description: string,
  bestFor: readonly string[],
  bg: string,
  surface: string,
  text: string,
  accent: string,
  accentAlt: string,
  maturity: Maturity,
): ThemeManifestEntry {
  return {
    id,
    name,
    description,
    maturity,
    bestFor,
    tokens: { bg, surface, text, accent, accentAlt },
  };
}

function runtime(
  id: string,
  label: string,
  category: RuntimeCategory,
  language: string,
  maturity: Maturity,
  packageName: string | null,
  limitations: readonly string[],
  agentGuidance: string,
): RuntimeManifestEntry {
  return {
    id,
    label,
    category,
    language,
    maturity,
    packageName,
    limitations,
    agentGuidance,
  };
}

function mcpTool(id: string, endpoint: string, purpose: string, maturity: Maturity): McpToolManifestEntry {
  return { id, endpoint, purpose, maturity };
}

export function listRegistryComponents(): readonly ComponentManifestEntry[] {
  return lotosManifest.components;
}

export function listRegistryTemplates(): readonly TemplateManifestEntry[] {
  return lotosManifest.templates;
}

export function listRegistryThemes(): readonly ThemeManifestEntry[] {
  return lotosManifest.themes;
}

export function listRegistryRuntimes(): readonly RuntimeManifestEntry[] {
  return lotosManifest.runtimes;
}

export type LotosManifest = typeof lotosManifest;
