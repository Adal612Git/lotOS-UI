/**
 * @lotos/core - MCP Server
 *
 * Exposes component contracts plus multi-runtime design blueprints.
 */

import * as http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
    componentSchemas,
    type ComponentName,
} from '../schemas/components.js';
import {
    createPatternBlueprint,
    getDesignPattern,
    isPatternId,
    listDesignPatterns,
} from '../runtime/patterns.js';
import {
    listRuntimeProfiles,
    normalizeRuntimeId,
    runtimeIds,
} from '../runtime/runtimes.js';

const DEFAULT_PORT = 3100;
const MCP_VERSION = '0.2.0';
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

const componentFrameworksOverrides: Partial<Record<ComponentName, readonly FrameworkId[]>> = {
    button: ['react', 'web-component', 'laravel-blade'],
    input: ['react', 'web-component', 'laravel-blade'],
    modal: ['react'],
    card: ['react'],
    badge: ['react'],
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
            ? `@lotosui/claude-arm/components/${component}`
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
        return `import { ${tag} } from '@lotosui/claude-arm';\n\n<${tag}${attrPart} />`;
    }

    const content = children ?? (component === 'button' ? 'Click me' : 'Content');
    return `import { ${tag} } from '@lotosui/claude-arm';\n\n<${tag}${attrPart}>${content}</${tag}>`;
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
                runtimes: listRuntimeProfiles().length,
                patterns: listDesignPatterns().length,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        if (pathname === '/runtimes') {
            const runtimes = listRuntimeProfiles();
            sendJSON(res, 200, {
                version: MCP_VERSION,
                totalRuntimes: runtimes.length,
                runtimes,
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
                        : `@lotosui/claude-arm/components/${normalized}`,
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
                'GET /runtimes',
                'GET /frameworks',
                'GET /patterns',
                'GET /patterns/:id?runtime=<runtime>',
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
        'radio-group': 'Exclusive option selector with keyboard-friendly navigation.',
        combobox: 'Searchable select input with text filtering and option picking.',
        tabs: 'Segmented content navigation with focus and arrow key support.',
        accordion: 'Expandable disclosure content with controlled and uncontrolled modes.',
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
        'radio-group': [
            'Provide at least two options with distinct values.',
            'Use vertical orientation for long labels.',
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
        console.log('Frameworks: GET /frameworks');
        console.log('Patterns: GET /patterns');
        console.log('Catalog:  GET /components');
    });

    server.on('error', (err) => {
        console.error('MCP Server error:', err);
        process.exit(1);
    });
}

export { createMCPServer };
