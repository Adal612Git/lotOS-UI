/**
 * @lotos/core - MCP Server
 *
 * Exposes component contracts plus multi-runtime design blueprints.
 */

import * as http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { lotosManifest } from '@lotosui/registry';
import {
    componentSchemas,
    type ComponentName,
} from '../schemas/components.js';
import { lotosMcpTransportSpec } from './spec.js';
import {
    createPatternBlueprint,
    getDesignPattern,
    isPatternId,
    listDesignPatterns,
} from '../runtime/patterns.js';
import {
    getDesktopTemplate,
    isDesktopTemplateId,
    listDesktopTemplates,
} from '../runtime/desktop.js';
import {
    type DatabaseTarget,
    getStackTemplate,
    isDatabaseTarget,
    isStackTemplateId,
    listStackTemplates,
} from '../runtime/stacks.js';
import {
    listRuntimeProfiles,
    normalizeRuntimeId,
    runtimeIds,
} from '../runtime/runtimes.js';

const DEFAULT_PORT = 3100;
const MCP_VERSION = '1.1.0';
type FrameworkId = 'react' | 'web-component' | 'laravel-blade';
type RenderRequest = {
    framework?: string;
    component?: string;
    props?: unknown;
    children?: unknown;
};

interface ComponentExample {
    description: string;
    jsx: string;
}

const componentNames = Object.keys(componentSchemas) as ComponentName[];
const publicReactComponents = new Set(
    lotosManifest.components
        .filter((entry) => entry.tier === 'free' && entry.publicExport)
        .map((entry) => entry.id),
);

function getReactImportPath(component: ComponentName): string {
    return publicReactComponents.has(component)
        ? '@lotosui/claude-arm'
        : '@lotosui/claude-arm-pro';
}

const componentExamplesOverrides: Partial<Record<ComponentName, ComponentExample[]>> = {
    button: [
        {
            description: 'Primary call-to-action button',
            jsx: `<Button variant="primary" size="md">Get Started</Button>`,
        },
        {
            description: 'Destructive action (delete, remove)',
            jsx: `<Button variant="destructive" size="sm">Delete Account</Button>`,
        },
        {
            description: 'Loading state during async action',
            jsx: `<Button variant="primary" loading>Saving...</Button>`,
        },
        {
            description: 'Ghost button for secondary actions',
            jsx: `<Button variant="ghost" size="sm">Cancel</Button>`,
        },
        {
            description: 'Full-width submit button in a form',
            jsx: `<Button variant="primary" fullWidth type="submit">Sign in</Button>`,
        },
    ],
    input: [
        {
            description: 'Email field with label',
            jsx: `<Input type="email" label="Email address" placeholder="you@example.com" required />`,
        },
        {
            description: 'Password field',
            jsx: `<Input type="password" label="Password" required />`,
        },
        {
            description: 'Input with validation error',
            jsx: `<Input type="email" label="Email" value="bad-email" error="Invalid email address" />`,
        },
        {
            description: 'Search input with icon adornment',
            jsx: `<Input type="search" placeholder="Search components..." startAdornment={<SearchIcon />} />`,
        },
    ],
    modal: [
        {
            description: 'Confirmation modal',
            jsx: `<Modal open={isOpen} onClose={handleClose} title="Confirm action" description="This action cannot be undone." size="sm">
  <p>Are you sure you want to delete this item?</p>
  <Modal.Footer>
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
  </Modal.Footer>
</Modal>`,
        },
        {
            description: 'Large modal with form',
            jsx: `<Modal open={isOpen} onClose={handleClose} title="Edit profile" size="lg">
  <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
  <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
</Modal>`,
        },
    ],
    card: [
        {
            description: 'Basic content card',
            jsx: `<Card padding="md" shadow="sm">
  <h3>Card Title</h3>
  <p>Card description content here.</p>
</Card>`,
        },
        {
            description: 'Interactive card (clickable)',
            jsx: `<Card interactive onClick={handleClick} padding="lg">
  <h3>Click me</h3>
</Card>`,
        },
        {
            description: 'Glassmorphism card',
            jsx: `<Card glass padding="lg" shadow="lg">
  <h3>Glass card</h3>
</Card>`,
        },
    ],
    badge: [
        {
            description: 'Status badge',
            jsx: `<Badge variant="success">Active</Badge>`,
        },
        {
            description: 'Error / alert badge',
            jsx: `<Badge variant="error">Failed</Badge>`,
        },
        {
            description: 'Outline badge for neutral states',
            jsx: `<Badge variant="outline" size="sm">Beta</Badge>`,
        },
    ],
    form: [
        {
            description: 'Operational form with explicit title and submit action',
            jsx: `<Form title="Create deployment" description="Launch a new rollout" onSubmit={handleSubmit}>
  <Input label="Service" required />
  <Input label="Owner" type="email" required />
</Form>`,
        },
    ],
    table: [
        {
            description: 'Data table for operational queues',
            jsx: `<Table
  caption="Operations queue"
  columns={[
    { key: 'job', label: 'Job' },
    { key: 'state', label: 'State' },
  ]}
  rows={[
    { job: 'Deploy billing-api', state: 'Queued' },
    { job: 'Rotate secrets', state: 'Pending' },
  ]}
/>`,
        },
    ],
    alert: [
        {
            description: 'Inline warning message for degraded system state',
            jsx: `<Alert variant="warning" title="Delayed sync" description="The reporting queue is 4 minutes behind." />`,
        },
    ],
    progress: [
        {
            description: 'Deterministic progress indicator for long-running work',
            jsx: `<Progress value={72} max={100} label="Deployment progress" />`,
        },
    ],
    avatar: [
        {
            description: 'User identity marker with stable initials fallback',
            jsx: `<Avatar name="Mia Solis" size="lg" />`,
        },
    ],
    divider: [
        {
            description: 'Labeled content divider',
            jsx: `<Divider label="Incident timeline" />`,
        },
    ],
    'empty-state': [
        {
            description: 'Fallback state when no records are available',
            jsx: `<EmptyState title="No deployments" description="Create the first rollout to populate this view." />`,
        },
    ],
    stat: [
        {
            description: 'Compact metric card for dashboards',
            jsx: `<Stat label="Queue health" value="98.4%" change="+2.1%" tone="success" />`,
        },
    ],
    spinner: [
        {
            description: 'Compact loading indicator',
            jsx: `<Spinner size="md" label="Loading incidents" />`,
        },
    ],
    skeleton: [
        {
            description: 'Loading placeholder for deferred content',
            jsx: `<Skeleton width="100%" height="1rem" shape="line" />`,
        },
    ],
    breadcrumbs: [
        {
            description: 'Navigation trail for nested surfaces',
            jsx: `<Breadcrumbs items={[{ label: 'Ops' }, { label: 'Incidents', current: true }]} />`,
        },
    ],
    toast: [
        {
            description: 'Ephemeral notification surface',
            jsx: `<Toast variant="success" title="Deployment created" description="The rollout was queued successfully." />`,
        },
    ],
};

function buildDefaultExample(component: ComponentName): ComponentExample[] {
    const tag = toPascalCase(component);
    const jsx = component === 'input'
        ? `<${tag} label="Label" placeholder="Type here" />`
        : `<${tag}>Example</${tag}>`;

    return [
        {
            description: `Basic ${tag} example`,
            jsx,
        },
    ];
}

const componentExamples: Record<ComponentName, ComponentExample[]> = Object.fromEntries(
    componentNames.map((component) => [
        component,
        componentExamplesOverrides[component] ?? buildDefaultExample(component),
    ]),
) as Record<ComponentName, ComponentExample[]>;

const frameworkCatalog = {
    supported: ['react', 'web-component', 'laravel-blade'] as const,
    planned: ['django-template', 'spring-thymeleaf'] as const,
};

const projectMap = {
    product: {
        name: 'LotOS UI',
        positioning: 'AI-native universal UI platform',
        root: 'lotos-ui/',
    },
    apps: {
        web: 'Commercial Next app: landing, pricing, checkout, auth, vault, Lemon webhook, protected downloads.',
        docs: 'Fumadocs/Next documentation portal and commercial docs vault.',
        demos: 'Dropdown demo and desktop demos for Python, .NET, Java, and Rust.',
    },
    packages: {
        core: 'Pure TypeScript contracts: tokens, schemas, runtime catalogs, patterns, MCP.',
        'claude-arm': 'Public React package with 8 free exports and MCP-aware catalog.',
        'claude-arm-pro': 'Premium React package. Keep private before selling.',
        cli: 'Stack, desktop, blueprint, and pattern scaffolding.',
        'web-components': 'Framework-neutral custom elements prototype.',
        adapters: 'Laravel, Django, Flask, Spring, Go, .NET runtime adapters.',
        sentinel: 'Runtime guardrails for schema misuse.',
        registry: 'Manifest-driven source of truth for agents and generators.',
    },
    validation: [
        'pnpm run verify:structure',
        'pnpm run verify:100',
        'pnpm --filter @lotosui/core test',
        'pnpm --filter @lotosui/cli test',
        'pnpm --filter @lotosui/claude-arm test',
        'pnpm --filter web check-types',
        'pnpm --filter docs check-types',
    ],
    safety: [
        'Never print or commit .env files or client_secret*.json.',
        'Login eligibility is not ownership; owners only bypass admin/premium checks.',
        'Entitlements, not owner emails, unlock buyer vault access.',
        'Do not move pro assets into public packages.',
    ],
} as const;

const componentFrameworksOverrides: Partial<Record<ComponentName, readonly FrameworkId[]>> = {
    button: ['react', 'web-component', 'laravel-blade'],
    input: ['react', 'web-component', 'laravel-blade'],
    modal: ['react', 'laravel-blade'],
    card: ['react', 'laravel-blade'],
    badge: ['react', 'laravel-blade'],
    form: ['react', 'laravel-blade'],
    table: ['react', 'laravel-blade'],
};

const componentFrameworks: Record<ComponentName, readonly FrameworkId[]> = Object.fromEntries(
    componentNames.map((component) => [
        component,
        componentFrameworksOverrides[component] ?? ['react'],
    ]),
) as Record<ComponentName, readonly FrameworkId[]>;

function getImportPathByFramework(component: ComponentName): Record<FrameworkId, string | null> {
    const frameworks = componentFrameworks[component];
    return {
        react: frameworks.includes('react')
            ? getReactImportPath(component)
            : null,
        'web-component': frameworks.includes('web-component')
            ? `@lotosui/web-components/${component}`
            : null,
        'laravel-blade': frameworks.includes('laravel-blade')
            ? `x-lotos-ui::lotos-${component}`
            : null,
    };
}

function serializeSchema(schema: object): object {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zodSchema = schema as any;
        if (zodSchema._def?.shape) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shape = zodSchema._def.shape() as Record<string, any>;
            const props: Record<string, object> = {};

            for (const [key, value] of Object.entries(shape)) {
                const typeName = value?._def?.typeName ?? 'unknown';
                props[key] = {
                    type: typeName,
                    required: !String(typeName).includes('Optional'),
                    ...(value?._def?.defaultValue ? { default: value._def.defaultValue() } : {}),
                    ...(value?._def?.innerType?._def?.values
                        ? { enum: value._def.innerType._def.values }
                        : {}),
                };
            }

            return { type: 'object', properties: props };
        }
    } catch {
        // fall back to generic response
    }

    return {
        type: 'object',
        note: 'See TypeScript types in @lotosui/core for full schema details.',
    };
}

function sendJSON(res: http.ServerResponse, statusCode: number, data: unknown): void {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-LotOS-MCP-Version': MCP_VERSION,
    });
    res.end(JSON.stringify(data, null, 2));
}

function isFrameworkId(value: string): value is FrameworkId {
    return value === 'react' || value === 'web-component' || value === 'laravel-blade';
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toPascalCase(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function camelToKebab(value: string): string {
    return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function renderReactAttribute(key: string, value: unknown): string | null {
    if (value === undefined || value === null || value === false) {
        return null;
    }

    if (value === true) {
        return key;
    }

    if (typeof value === 'number') {
        return `${key}={${value}}`;
    }

    if (typeof value === 'string') {
        const escaped = value.replace(/"/g, '\\"');
        return `${key}="${escaped}"`;
    }

    return `${key}={${JSON.stringify(value)}}`;
}

function renderWebComponentAttribute(key: string, value: unknown): string | null {
    if (value === undefined || value === null || value === false) {
        return null;
    }

    const normalizedKey = key === 'fullWidth' ? 'full-width' : camelToKebab(key);
    if (value === true) {
        return normalizedKey;
    }

    if (typeof value === 'number') {
        return `${normalizedKey}="${value}"`;
    }

    if (typeof value === 'string') {
        const escaped = value.replace(/"/g, '&quot;');
        return `${normalizedKey}="${escaped}"`;
    }

    return `${normalizedKey}='${JSON.stringify(value)}'`;
}

function renderBladeAttribute(key: string, value: unknown): string | null {
    if (value === undefined || value === null || value === false) {
        return null;
    }

    const normalizedKey = key === 'fullWidth' ? 'full-width' : camelToKebab(key);
    if (value === true) {
        return normalizedKey;
    }

    if (typeof value === 'number') {
        return `${normalizedKey}="${value}"`;
    }

    if (typeof value === 'string') {
        const escaped = value.replace(/"/g, '&quot;');
        return `${normalizedKey}="${escaped}"`;
    }

    return `:${normalizedKey}='${JSON.stringify(value)}'`;
}

function buildReactSnippet({
    component,
    props,
    children,
}: {
    component: ComponentName;
    props: Record<string, unknown>;
    children?: string;
}): string {
    const tag = toPascalCase(component);
    const attributes = Object.entries(props)
        .map(([key, value]) => renderReactAttribute(key, value))
        .filter((entry): entry is string => Boolean(entry))
        .join(' ');
    const attrPart = attributes.length > 0 ? ` ${attributes}` : '';
    if (component === 'input') {
        return `import { ${tag} } from '${getReactImportPath(component)}';\n\n<${tag}${attrPart} />`;
    }

    const content = children ?? (component === 'button' ? 'Click me' : 'Content');
    return `import { ${tag} } from '${getReactImportPath(component)}';\n\n<${tag}${attrPart}>${content}</${tag}>`;
}

function buildWebComponentSnippet({
    component,
    props,
    children,
}: {
    component: ComponentName;
    props: Record<string, unknown>;
    children?: string;
}): string {
    const tag = `lotos-${component}`;
    const attributes = Object.entries(props)
        .map(([key, value]) => renderWebComponentAttribute(key, value))
        .filter((entry): entry is string => Boolean(entry))
        .join(' ');
    const attrPart = attributes.length > 0 ? ` ${attributes}` : '';
    if (component === 'input') {
        return `import { registerLotosWebComponents } from '@lotosui/web-components';\n\nregisterLotosWebComponents();\n\n<${tag}${attrPart}></${tag}>`;
    }

    const content = children ?? (component === 'button' ? 'Click me' : 'Content');
    return `import { registerLotosWebComponents } from '@lotosui/web-components';\n\nregisterLotosWebComponents();\n\n<${tag}${attrPart}>${content}</${tag}>`;
}

function buildLaravelBladeSnippet({
    component,
    props,
    children,
}: {
    component: ComponentName;
    props: Record<string, unknown>;
    children?: string;
}): string {
    const tag = `x-lotos-ui::lotos-${component}`;
    const attributes = Object.entries(props)
        .map(([key, value]) => renderBladeAttribute(key, value))
        .filter((entry): entry is string => Boolean(entry))
        .join(' ');
    const attrPart = attributes.length > 0 ? ` ${attributes}` : '';

    if (component === 'input') {
        return `<${tag}${attrPart} />`;
    }

    const content = children ?? (component === 'button' ? 'Click me' : 'Content');
    return `<${tag}${attrPart}>${content}</${tag}>`;
}

async function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    const rawBody = Buffer.concat(chunks).toString('utf8').trim();
    if (rawBody.length === 0) {
        return {};
    }

    return JSON.parse(rawBody);
}

function createMCPServer(port: number = DEFAULT_PORT): http.Server {
    return http.createServer(async (req, res) => {
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end();
            return;
        }

        const url = new URL(req.url ?? '/', `http://localhost:${port}`);
        const pathname = url.pathname;

        if (req.method === 'POST' && pathname === '/components/render') {
            let body: unknown;
            try {
                body = await readJsonBody(req);
            } catch {
                sendJSON(res, 400, {
                    error: 'Invalid JSON body.',
                });
                return;
            }

            if (!isRecord(body)) {
                sendJSON(res, 400, {
                    error: 'Request body must be an object.',
                });
                return;
            }

            const payload = body as RenderRequest;
            if (!payload.framework || !isFrameworkId(payload.framework)) {
                sendJSON(res, 400, {
                    error: 'framework is required.',
                    supported: frameworkCatalog.supported,
                });
                return;
            }

            if (typeof payload.component !== 'string') {
                sendJSON(res, 400, {
                    error: 'component is required.',
                    available: Object.keys(componentSchemas),
                });
                return;
            }

            const component = normalizeComponentName(payload.component);
            if (!component) {
                sendJSON(res, 404, {
                    error: 'Component not found.',
                    component: payload.component,
                    available: Object.keys(componentSchemas),
                });
                return;
            }

            const frameworks = componentFrameworks[component];
            if (!frameworks.includes(payload.framework)) {
                sendJSON(res, 409, {
                    error: 'Component is not available for requested framework yet.',
                    component,
                    framework: payload.framework,
                    availableFrameworks: frameworks,
                });
                return;
            }

            const props = isRecord(payload.props) ? payload.props : {};
            const parsed = componentSchemas[component].safeParse(props);
            if (!parsed.success) {
                sendJSON(res, 400, {
                    error: 'Invalid component props for requested component.',
                    component,
                    framework: payload.framework,
                    issues: parsed.error.issues.map((issue) => ({
                        code: issue.code,
                        path: issue.path.map(String),
                        message: issue.message,
                    })),
                });
                return;
            }

            const children = typeof payload.children === 'string' ? payload.children : undefined;
            let snippet: string;
            if (payload.framework === 'react') {
                snippet = buildReactSnippet({
                    component,
                    props: parsed.data,
                    children,
                });
            } else if (payload.framework === 'web-component') {
                snippet = buildWebComponentSnippet({
                    component,
                    props: parsed.data,
                    children,
                });
            } else {
                snippet = buildLaravelBladeSnippet({
                    component,
                    props: parsed.data,
                    children,
                });
            }

            sendJSON(res, 200, {
                version: MCP_VERSION,
                framework: payload.framework,
                component,
                code: snippet,
                importPathByFramework: getImportPathByFramework(component),
            });
            return;
        }

        if (pathname === '/health') {
            sendJSON(res, 200, {
                status: 'ok',
                version: MCP_VERSION,
                components: Object.keys(componentSchemas).length,
                registryComponents: lotosManifest.components.length,
                registryTemplates: lotosManifest.templates.length,
                registryRuntimes: lotosManifest.runtimes.length,
                runtimes: listRuntimeProfiles().length,
                patterns: listDesignPatterns().length,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        if (pathname === '/mcp/spec') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                spec: lotosMcpTransportSpec,
            });
            return;
        }

        if (pathname === '/manifest') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                manifest: lotosManifest,
            });
            return;
        }

        if (pathname === '/ai/context') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                product: lotosManifest.product,
                routes: lotosManifest.routes,
                components: {
                    total: lotosManifest.components.length,
                    free: lotosManifest.components.filter((entry) => entry.tier === 'free').length,
                    pro: lotosManifest.components.filter((entry) => entry.tier === 'pro').length,
                },
                templates: lotosManifest.templates.map((template) => ({
                    id: template.id,
                    name: template.name,
                    tier: template.tier,
                    maturity: template.maturity,
                    runtimes: template.runtimes,
                    previewRoute: template.previewRoute,
                    aiPrompt: template.aiPrompt,
                })),
                runtimes: lotosManifest.runtimes.map((runtime) => ({
                    id: runtime.id,
                    label: runtime.label,
                    category: runtime.category,
                    maturity: runtime.maturity,
                    packageName: runtime.packageName,
                    limitations: runtime.limitations,
                })),
                themes: lotosManifest.themes,
                tools: lotosManifest.mcpTools,
                validation: lotosManifest.validation,
                guardrails: lotosManifest.aiRules,
                releaseReadiness: lotosManifest.releaseReadiness,
                entitlementFlows: lotosManifest.entitlementFlows,
            });
            return;
        }

        if (pathname === '/runtimes') {
            const runtimes = listRuntimeProfiles();
            sendJSON(res, 200, {
                version: MCP_VERSION,
                totalRuntimes: runtimes.length,
                runtimes,
                registryRuntimeMatrix: lotosManifest.runtimes,
            });
            return;
        }

        if (pathname === '/runtime-matrix') {
            const categoryQuery = url.searchParams.get('category');
            const maturityQuery = url.searchParams.get('maturity');
            const runtimes = lotosManifest.runtimes.filter((runtime) => {
                const categoryMatches = categoryQuery ? runtime.category === categoryQuery : true;
                const maturityMatches = maturityQuery ? runtime.maturity === maturityQuery : true;
                return categoryMatches && maturityMatches;
            });

            sendJSON(res, 200, {
                version: MCP_VERSION,
                filters: {
                    category: categoryQuery,
                    maturity: maturityQuery,
                },
                totalRuntimes: runtimes.length,
                runtimes,
                rule: 'Maturity is explicit. Planned runtimes are roadmap targets, not package claims.',
            });
            return;
        }

        if (pathname === '/frameworks') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                supported: frameworkCatalog.supported,
                planned: frameworkCatalog.planned,
                stability: {
                    react: 'stable',
                    'web-component': 'prototype',
                    'laravel-blade': 'alpha',
                },
                note: 'Framework support is progressive. React is production-ready. Web components and Laravel Blade are in active expansion.',
            });
            return;
        }

        if (pathname === '/project-map') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                ...projectMap,
                product: lotosManifest.product,
                routes: lotosManifest.routes,
                validation: lotosManifest.validation,
                releaseReadiness: lotosManifest.releaseReadiness,
            });
            return;
        }

        if (pathname === '/routes') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                routes: lotosManifest.routes,
                rule: 'Route access must stay aligned with auth, entitlement, and owner boundaries.',
            });
            return;
        }

        if (pathname === '/entitlement-flows') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                flows: lotosManifest.entitlementFlows,
                rules: [
                    'Google login identifies the user; it does not grant premium access by itself.',
                    'Manual test grants are temporary and must not be treated as revenue.',
                    'Paid recovery requires reviewed evidence of a real payment.',
                    'past_due, paused, cancelled, expired, and revoked do not unlock premium by default.',
                    'Revoked or expired entitlements must not unlock vaults or downloads.',
                ],
            });
            return;
        }

        if (pathname === '/component-tiers') {
            const freeComponents = lotosManifest.components.filter((entry) => entry.tier === 'free');
            const proComponents = lotosManifest.components.filter((entry) => entry.tier === 'pro');
            sendJSON(res, 200, {
                version: MCP_VERSION,
                totals: {
                    all: lotosManifest.components.length,
                    free: freeComponents.length,
                    pro: proComponents.length,
                },
                tiers: {
                    free: freeComponents,
                    pro: proComponents,
                },
                rule: 'Public copy should say 8 free React exports plus 19 pro components, 27 total contracts.',
            });
            return;
        }

        if (pathname === '/pricing-plans') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                plans: lotosManifest.plans,
                rule: 'Pricing UI, docs, CLI, and MCP should stay aligned with the registry plan catalog.',
            });
            return;
        }

        if (pathname === '/asset-permissions') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                permissions: lotosManifest.assetPermissions,
                rule: 'Premium code and delivery artifacts stay private even when public demos are visible.',
            });
            return;
        }

        if (pathname === '/env-requirements') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                env: lotosManifest.env,
                rule: 'Agents may name required env vars but must not print or infer secret values.',
            });
            return;
        }

        if (pathname === '/templates') {
            const tierQuery = url.searchParams.get('tier');
            const runtimeQuery = url.searchParams.get('runtime');
            const industryQuery = url.searchParams.get('industry');
            const templates = lotosManifest.templates.filter((template) => {
                const tierMatches = tierQuery ? template.tier === tierQuery : true;
                const runtimeMatches = runtimeQuery ? template.runtimes.includes(runtimeQuery) : true;
                const industryMatches = industryQuery ? template.industry.includes(industryQuery) : true;
                return tierMatches && runtimeMatches && industryMatches;
            });

            sendJSON(res, 200, {
                version: MCP_VERSION,
                filters: {
                    tier: tierQuery,
                    runtime: runtimeQuery,
                    industry: industryQuery,
                },
                totalTemplates: templates.length,
                templates,
            });
            return;
        }

        const templatePromptMatch = pathname.match(/^\/templates\/([a-z0-9-]+)\/prompt$/);
        if (templatePromptMatch) {
            const templateId = templatePromptMatch[1];
            const template = lotosManifest.templates.find((entry) => entry.id === templateId);
            if (!template) {
                sendJSON(res, 404, {
                    error: 'Template not found',
                    available: lotosManifest.templates.map((entry) => entry.id),
                });
                return;
            }

            sendJSON(res, 200, {
                version: MCP_VERSION,
                id: template.id,
                name: template.name,
                aiPrompt: template.aiPrompt,
                runtimes: template.runtimes,
                deployChecklist: template.deployChecklist,
            });
            return;
        }

        const templateMatch = pathname.match(/^\/templates\/([a-z0-9-]+)$/);
        if (templateMatch) {
            const templateId = templateMatch[1];
            const template = lotosManifest.templates.find((entry) => entry.id === templateId);
            if (!template) {
                sendJSON(res, 404, {
                    error: 'Template not found',
                    available: lotosManifest.templates.map((entry) => entry.id),
                });
                return;
            }

            sendJSON(res, 200, {
                version: MCP_VERSION,
                template,
            });
            return;
        }

        if (pathname === '/themes') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                totalThemes: lotosManifest.themes.length,
                themes: lotosManifest.themes,
            });
            return;
        }

        if (pathname === '/release-readiness') {
            sendJSON(res, 200, {
                version: MCP_VERSION,
                releaseReadiness: lotosManifest.releaseReadiness,
                lifecycleValidation: lotosManifest.releaseReadiness.lifecycleValidation,
                validation: lotosManifest.validation,
                entitlementFlows: lotosManifest.entitlementFlows,
                entitlementLifecycle: {
                    manualTestsExpire: true,
                    ownerOnlyRevocation: true,
                    supabaseLifecycleMigration: 'local-only-not-remotely-executed',
                    auditEventsMigration: 'local-only-not-remotely-executed',
                    recurringCancellationAutomation: 'prepared-locally-provider-validation-required',
                    wideSalesReady: lotosManifest.releaseReadiness.lifecycleValidation.wide_sales_ready,
                    supabaseRemoteValidated: lotosManifest.releaseReadiness.lifecycleValidation.supabase_remote_validated,
                    lemonRemoteValidated: lotosManifest.releaseReadiness.lifecycleValidation.lemon_remote_validated,
                },
            });
            return;
        }

        if (pathname === '/patterns') {
            const runtimeQuery = url.searchParams.get('runtime');
            const runtime = runtimeQuery ? normalizeRuntimeId(runtimeQuery) : null;

            if (runtimeQuery && !runtime) {
                sendJSON(res, 400, {
                    error: 'Invalid runtime filter.',
                    runtime: runtimeQuery,
                    available: runtimeIds,
                });
                return;
            }

            const patterns = listDesignPatterns(runtime ?? undefined).map((pattern) => ({
                id: pattern.id,
                name: pattern.name,
                summary: pattern.summary,
                heroIntent: pattern.heroIntent,
                sections: pattern.sections.map((section) => section.title),
            }));

            sendJSON(res, 200, {
                version: MCP_VERSION,
                runtime: runtime ?? null,
                totalPatterns: patterns.length,
                patterns,
            });
            return;
        }

        if (pathname === '/desktop/templates') {
            const tierQuery = url.searchParams.get('tier');
            if (tierQuery && tierQuery !== 'free' && tierQuery !== 'pro') {
                sendJSON(res, 400, {
                    error: 'Invalid desktop template tier.',
                    tier: tierQuery,
                    available: ['free', 'pro'],
                });
                return;
            }

            const templates = listDesktopTemplates(tierQuery as 'free' | 'pro' | undefined).map((template) => ({
                id: template.id,
                name: template.name,
                tier: template.tier,
                summary: template.summary,
                patternId: template.patternId,
                recommendedRuntimes: template.recommendedRuntimes,
                layoutZones: template.layoutZones,
                primaryComponents: template.primaryComponents,
            }));

            sendJSON(res, 200, {
                version: MCP_VERSION,
                totalTemplates: templates.length,
                tier: tierQuery ?? null,
                templates,
            });
            return;
        }

        if (pathname === '/stacks') {
            const runtimeQuery = url.searchParams.get('runtime');
            const databaseQuery = url.searchParams.get('database');

            const runtime = runtimeQuery ? normalizeRuntimeId(runtimeQuery) : null;
            if (runtimeQuery && !runtime) {
                sendJSON(res, 400, {
                    error: 'Invalid runtime filter.',
                    runtime: runtimeQuery,
                    available: runtimeIds,
                });
                return;
            }

            if (databaseQuery && !isDatabaseTarget(databaseQuery)) {
                sendJSON(res, 400, {
                    error: 'Invalid database filter.',
                    database: databaseQuery,
                    available: ['none', 'mongodb'],
                });
                return;
            }

            const database: DatabaseTarget | undefined = databaseQuery
                ? (isDatabaseTarget(databaseQuery) ? databaseQuery : undefined)
                : undefined;

            const stacks = listStackTemplates({
                runtime: runtime ?? undefined,
                database,
            });

            sendJSON(res, 200, {
                version: MCP_VERSION,
                runtime: runtime ?? null,
                database: databaseQuery ?? null,
                totalStacks: stacks.length,
                stacks,
            });
            return;
        }

        const stackMatch = pathname.match(/^\/stacks\/([a-z0-9-]+)$/);
        if (stackMatch) {
            const stackId = stackMatch[1];
            if (!stackId || !isStackTemplateId(stackId)) {
                sendJSON(res, 404, {
                    error: 'Stack template not found',
                    available: listStackTemplates().map((entry) => entry.id),
                });
                return;
            }

            const stack = getStackTemplate(stackId);
            sendJSON(res, 200, {
                version: MCP_VERSION,
                stack,
            });
            return;
        }

        const desktopTemplateMatch = pathname.match(/^\/desktop\/templates\/([a-z0-9-]+)$/);
        if (desktopTemplateMatch) {
            const templateId = desktopTemplateMatch[1];
            if (!templateId || !isDesktopTemplateId(templateId)) {
                sendJSON(res, 404, {
                    error: 'Desktop template not found',
                    available: listDesktopTemplates().map((template) => template.id),
                });
                return;
            }

            const template = getDesktopTemplate(templateId);
            sendJSON(res, 200, {
                version: MCP_VERSION,
                template,
            });
            return;
        }

        const patternMatch = pathname.match(/^\/patterns\/([a-z0-9-]+)$/);
        if (patternMatch) {
            const patternId = patternMatch[1];
            if (!patternId || !isPatternId(patternId)) {
                sendJSON(res, 404, {
                    error: 'Pattern not found',
                    available: listDesignPatterns().map((pattern) => pattern.id),
                });
                return;
            }

            const runtimeQuery = url.searchParams.get('runtime');
            const runtime = runtimeQuery ? normalizeRuntimeId(runtimeQuery) : null;
            if (runtimeQuery && !runtime) {
                sendJSON(res, 400, {
                    error: 'Invalid runtime filter.',
                    runtime: runtimeQuery,
                    available: runtimeIds,
                });
                return;
            }

            const pattern = getDesignPattern(patternId);
            const blueprint = runtime
                ? createPatternBlueprint({ patternId, runtime })
                : null;

            sendJSON(res, 200, {
                version: MCP_VERSION,
                pattern,
                blueprint,
            });
            return;
        }

        if (pathname === '/components') {
            const catalog: Record<string, object> = {};
            for (const name of Object.keys(componentSchemas) as ComponentName[]) {
                catalog[name] = {
                    name,
                    description: getComponentDescription(name),
                    schema: serializeSchema(componentSchemas[name]),
                    exampleCount: componentExamples[name].length,
                    arm: 'claude',
                    frameworks: componentFrameworks[name],
                    importPathByFramework: getImportPathByFramework(name),
                };
            }

            sendJSON(res, 200, {
                version: MCP_VERSION,
                totalComponents: Object.keys(catalog).length,
                components: catalog,
            });
            return;
        }

        const componentMatch = pathname.match(/^\/components\/([a-z-]+)$/);
        if (componentMatch) {
            const componentName = componentMatch[1];
            if (!componentName) {
                sendJSON(res, 404, {
                    error: 'Component not found',
                    available: Object.keys(componentSchemas),
                });
                return;
            }
            const normalized = normalizeComponentName(componentName);
            if (!normalized) {
                sendJSON(res, 404, {
                    error: 'Component not found',
                    available: Object.keys(componentSchemas),
                });
                return;
            }

            const frameworkQuery = url.searchParams.get('framework');
            if (frameworkQuery && !isFrameworkId(frameworkQuery)) {
                sendJSON(res, 400, {
                    error: 'Unsupported framework query.',
                    framework: frameworkQuery,
                    supported: frameworkCatalog.supported,
                });
                return;
            }

            const frameworks = componentFrameworks[normalized];
            if (frameworkQuery && !frameworks.includes(frameworkQuery as FrameworkId)) {
                sendJSON(res, 409, {
                    error: 'Component is not available for requested framework yet.',
                    component: normalized,
                    framework: frameworkQuery,
                    availableFrameworks: frameworks,
                });
                return;
            }

            sendJSON(res, 200, {
                name: normalized,
                description: getComponentDescription(normalized),
                schema: serializeSchema(componentSchemas[normalized]),
                examples: componentExamples[normalized],
                importPath: frameworkQuery === 'web-component'
                    ? `@lotosui/web-components/${normalized}`
                    : frameworkQuery === 'laravel-blade'
                        ? `x-lotos-ui::lotos-${normalized}`
                    : getReactImportPath(normalized),
                frameworks,
                importPathByFramework: getImportPathByFramework(normalized),
                restrictions: getComponentRestrictions(normalized),
            });
            return;
        }

        const examplesMatch = pathname.match(/^\/components\/([a-z-]+)\/examples$/);
        if (examplesMatch) {
            const componentName = examplesMatch[1];
            if (!componentName) {
                sendJSON(res, 404, {
                    error: 'Component not found',
                    available: Object.keys(componentSchemas),
                });
                return;
            }
            const normalized = normalizeComponentName(componentName);
            if (!normalized) {
                sendJSON(res, 404, {
                    error: 'Component not found',
                    available: Object.keys(componentSchemas),
                });
                return;
            }

            sendJSON(res, 200, {
                name: normalized,
                examples: componentExamples[normalized],
            });
            return;
        }

        sendJSON(res, 404, {
            error: 'Not found',
            endpoints: [
                'GET /health',
                'GET /mcp/spec',
                'GET /manifest',
                'GET /ai/context',
                'GET /runtimes',
                'GET /runtime-matrix?category=<web|agent|desktop>&maturity=<stable|alpha|planned>',
                'GET /frameworks',
                'GET /project-map',
                'GET /routes',
                'GET /entitlement-flows',
                'GET /component-tiers',
                'GET /pricing-plans',
                'GET /asset-permissions',
                'GET /env-requirements',
                'GET /templates?tier=<free|pro|enterprise>&runtime=<runtime>&industry=<industry>',
                'GET /templates/:id',
                'GET /templates/:id/prompt',
                'GET /themes',
                'GET /release-readiness',
                'GET /patterns',
                'GET /patterns/:id?runtime=<runtime>',
                'GET /desktop/templates?tier=<free|pro>',
                'GET /desktop/templates/:id',
                'GET /stacks?runtime=<runtime>&database=<none|mongodb>',
                'GET /stacks/:id',
                'GET /components',
                'GET /components/:name',
                'GET /components/:name/examples',
                'POST /components/render',
            ],
        });
    });
}

function normalizeComponentName(value: string): ComponentName | null {
    const normalized = value.toLowerCase();
    if (normalized in componentSchemas) {
        return normalized as ComponentName;
    }

    return null;
}

function getComponentDescription(name: ComponentName): string {
    const descriptions: Partial<Record<ComponentName, string>> = {
        button: 'Interactive button element. Use for actions, form submissions, and CTAs.',
        input: 'Text input field with accessible label, helper text, and error state support.',
        modal: 'Accessible modal dialog with focus trap, backdrop, and keyboard navigation.',
        card: 'Content container with optional border, shadow, and interactive state.',
        badge: 'Small status indicator for labels, counts, and state communication.',
        select: 'Accessible select control with options, helper text, and error states.',
        checkbox: 'Binary field for multiple-selection forms and consent flows.',
        switch: 'Toggle control for settings and feature flags.',
        textarea: 'Multi-line text input with helper text and character constraints.',
        tooltip: 'Contextual helper text shown on hover or focus.',
        dropdown: 'Menu-style action list triggered from a button or icon.',
        form: 'Structured form shell with section copy, field layout, and optional footer actions.',
        'radio-group': 'Exclusive option selector with keyboard-friendly navigation.',
        table: 'Operational data table with explicit columns and stable row rendering.',
        combobox: 'Searchable select input with text filtering and option picking.',
        tabs: 'Segmented content navigation with focus and arrow key support.',
        accordion: 'Expandable disclosure content with controlled and uncontrolled modes.',
        alert: 'Inline system message for warnings, errors, and operational state changes.',
        progress: 'Progress meter for deterministic task completion and batch operations.',
        avatar: 'Identity marker with image and initials fallback support.',
        divider: 'Visual separator for grouped content with optional inline label.',
        'empty-state': 'Fallback shell for no-data views, first-run flows, and filtered empty results.',
        stat: 'Compact metric summary for dashboards, headers, and executive KPI rails.',
        spinner: 'Loading indicator for short waits, async actions, and deferred sections.',
        skeleton: 'Placeholder surface for content that is still loading.',
        breadcrumbs: 'Navigation trail for nested views and deep dashboard routes.',
        toast: 'Ephemeral notification for success, warning, error, or info feedback.',
    };
    return descriptions[name] ?? `${toPascalCase(name)} component contract.`;
}

function getComponentRestrictions(name: ComponentName): string[] {
    const restrictions: Partial<Record<ComponentName, string[]>> = {
        button: [
            'Do not use disabled and loading together; loading already implies disabled.',
            'Icon-only buttons must include aria-label.',
            'Use variant="destructive" for destructive actions.',
        ],
        input: [
            'Always provide a label for accessibility.',
            'Use the error prop instead of custom error styling.',
            'Do not mix value and defaultValue in the same input.',
        ],
        modal: [
            'Always provide title for aria-labelledby.',
            'onClose must close the modal state in parent logic.',
            'Use closeOnBackdropClick=false for critical confirmation flows.',
        ],
        card: [
            'Avoid nesting interactive cards inside interactive cards.',
            'Use glass only on dark surfaces with enough contrast.',
        ],
        badge: [
            'Use semantic variants for status communication.',
            'Dot-only badges must include aria-label.',
        ],
        select: [
            'Always provide accessible labels for form context.',
            'Use options with stable value keys for submissions.',
        ],
        checkbox: [
            'Do not mix checked and defaultChecked in the same instance.',
            'Pair labels and helper text for screen-reader context.',
        ],
        switch: [
            'Use for immediate on/off settings, not multi-option choices.',
            'Avoid ambiguous labels; state should be obvious when read aloud.',
        ],
        textarea: [
            'Use maxLength and showCount for constrained fields.',
            'Provide clear labels for long-form input contexts.',
        ],
        tooltip: [
            'Tooltip content should be supplemental, not critical for task completion.',
            'Ensure trigger remains keyboard focusable.',
        ],
        dropdown: [
            'Menu items should use concise action labels.',
            'Avoid destructive actions without explicit affordance.',
        ],
        form: [
            'Use native form semantics and explicit submit handling.',
            'Do not rely on placeholders as the only field label.',
            'Keep footer actions concise and visually grouped.',
        ],
        'radio-group': [
            'Provide at least two options with distinct values.',
            'Use vertical orientation for long labels.',
        ],
        table: [
            'Columns should stay stable across renders to preserve scanability.',
            'Prefer concise scalar values; avoid complex nested content in cells.',
            'Use explicit empty states when no rows are available.',
        ],
        combobox: [
            'Keep option labels human-readable and unique.',
            'Provide helper text when filtering behavior is non-obvious.',
        ],
        tabs: [
            'Tab labels should be short and action-independent.',
            'Keep tab count manageable for keyboard navigation.',
        ],
        accordion: [
            'Use concise titles and chunked content inside each panel.',
            'Avoid deep nesting of accordions in the same viewport region.',
        ],
        alert: [
            'Use alerts for inline state communication, not blocking confirmations.',
            'Prefer concise titles and actionable descriptions.',
        ],
        progress: [
            'Use determinate progress whenever a real value is available.',
            'Keep labels task-specific so the current operation is obvious.',
        ],
        avatar: [
            'Provide alt text when rendering remote images.',
            'Use stable fallback initials for operator-heavy interfaces.',
        ],
        divider: [
            'Use labels only when they improve scanability between sections.',
            'Prefer decorative dividers for purely visual separation.',
        ],
        'empty-state': [
            'Pair empty states with a recovery action whenever possible.',
            'Keep the title concise and the description task-oriented.',
        ],
        stat: [
            'Reserve stats for concise scalar metrics, not long-form narrative.',
            'Use tone only when the semantic meaning is clear to the user.',
        ],
        spinner: [
            'Always provide a meaningful accessible label when used standalone.',
            'Use compact sizes inside buttons and larger sizes for panels.',
        ],
        skeleton: [
            'Match the approximate size of the content being loaded.',
            'Avoid excessive placeholder density in small surfaces.',
        ],
        breadcrumbs: [
            'Keep breadcrumb labels short and ordered from broad to specific.',
            'Mark the current item clearly and avoid making it interactive.',
        ],
        toast: [
            'Use concise copy; toasts should confirm state, not explain workflows.',
            'Do not rely on toasts alone for critical blocking errors.',
        ],
    };

    return restrictions[name] ?? [
        `Follow ${toPascalCase(name)} schema contract from @lotosui/core.`,
    ];
}

const entryFile = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entryFile) {
    const port = parseInt(process.env['MCP_PORT'] ?? String(DEFAULT_PORT), 10);
    const server = createMCPServer(port);

    server.listen(port, () => {
        console.log(`LotOS MCP Server running at http://localhost:${port}`);
        console.log(`Components: ${Object.keys(componentSchemas).join(', ')}`);
        console.log('Runtimes: GET /runtimes');
        console.log('Registry: GET /manifest, /templates, /runtime-matrix, /themes');
        console.log('Frameworks: GET /frameworks');
        console.log('Project:   GET /project-map');
        console.log('AI:        GET /ai/context, /release-readiness, /mcp/spec');
        console.log('Entitlements: GET /entitlement-flows');
        console.log('Patterns: GET /patterns');
        console.log('Catalog:  GET /components');
    });

    server.on('error', (err) => {
        console.error('MCP Server error:', err);
        process.exit(1);
    });
}

export { createMCPServer };
