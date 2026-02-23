/**
 * @lotos/core — MCP Server (Minimum Viable)
 *
 * Model Context Protocol Server.
 * Exposes the LotOS component catalog to any LLM that supports MCP.
 * The agent never hallucinates because it always has the ground truth.
 *
 * Usage:
 *   node --experimental-vm-modules dist/mcp/server.js --port 3100
 *
 * Endpoints:
 *   GET /health              → Server health check
 *   GET /components          → Full catalog (all component schemas)
 *   GET /components/:name    → Single component schema
 *   GET /components/:name/examples → Usage examples
 */

import * as http from 'node:http';
import { componentSchemas, type ComponentName } from '../schemas/components.js';

const DEFAULT_PORT = 3100;

// ─── Component Examples ────────────────────────────────────────────────────
// These examples teach the LLM how to correctly compose each component.
// If it's not here, the agent doesn't use it.

const componentExamples: Record<string, object[]> = {
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

// ─── Schema Serializer ─────────────────────────────────────────────────────

function serializeSchema(schema: object): object {
    // Extract meaningful info from Zod schema for LLM consumption
    // This is a simplified serializer — a full one would use zod-to-json-schema
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zodSchema = schema as any;
        if (zodSchema._def?.shape) {
            const shape = zodSchema._def.shape();
            const props: Record<string, object> = {};
            for (const [key, value] of Object.entries(shape)) {
                const v = value as { _def?: { typeName?: string; defaultValue?: () => unknown; innerType?: { _def?: { values?: string[] } }; options?: Array<{ _def?: { value?: unknown } }> } };
                const typeName = v?._def?.typeName ?? 'unknown';
                props[key] = {
                    type: typeName,
                    required: !typeName.includes('Optional'),
                    ...(v?._def?.defaultValue ? { default: v._def.defaultValue() } : {}),
                    ...(v?._def?.innerType?._def?.values ? { enum: v._def.innerType._def.values } : {}),
                };
            }
            return { type: 'object', properties: props };
        }
    } catch {
        // Fallback
    }
    return { type: 'object', note: 'See TypeScript types in @lotos/core for full schema' };
}

// ─── HTTP Server ───────────────────────────────────────────────────────────

function sendJSON(res: http.ServerResponse, statusCode: number, data: unknown): void {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-LotOS-MCP-Version': '0.1.0',
    });
    res.end(JSON.stringify(data, null, 2));
}

function createMCPServer(port: number = DEFAULT_PORT): http.Server {
    const server = http.createServer((req, res) => {
        if (req.method === 'OPTIONS') {
            res.writeHead(204, { 'Access-Control-Allow-Origin': '*' });
            res.end();
            return;
        }

        const url = new URL(req.url ?? '/', `http://localhost:${port}`);
        const pathname = url.pathname;

        // ── GET /health ──────────────────────────────────────────────────────
        if (pathname === '/health') {
            sendJSON(res, 200, {
                status: 'ok',
                version: '0.1.0',
                components: Object.keys(componentSchemas).length,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        // ── GET /components ──────────────────────────────────────────────────
        if (pathname === '/components') {
            const catalog: Record<string, object> = {};
            for (const [name, schema] of Object.entries(componentSchemas)) {
                catalog[name] = {
                    name,
                    description: getComponentDescription(name as ComponentName),
                    schema: serializeSchema(schema),
                    exampleCount: (componentExamples[name] ?? []).length,
                    arm: 'claude', // which arm implements this
                };
            }
            sendJSON(res, 200, {
                version: '0.1.0',
                totalComponents: Object.keys(catalog).length,
                components: catalog,
            });
            return;
        }

        // ── GET /components/:name ────────────────────────────────────────────
        const componentMatch = pathname.match(/^\/components\/([a-z-]+)$/);
        if (componentMatch) {
            const name = componentMatch[1] as ComponentName;
            const schema = componentSchemas[name];
            if (!schema) {
                sendJSON(res, 404, {
                    error: 'Component not found',
                    available: Object.keys(componentSchemas),
                });
                return;
            }
            sendJSON(res, 200, {
                name,
                description: getComponentDescription(name),
                schema: serializeSchema(schema),
                examples: componentExamples[name] ?? [],
                importPath: `@lotos/claude-arm/components/${name}`,
                restrictions: getComponentRestrictions(name),
            });
            return;
        }

        // ── GET /components/:name/examples ───────────────────────────────────
        const examplesMatch = pathname.match(/^\/components\/([a-z-]+)\/examples$/);
        if (examplesMatch) {
            const name = examplesMatch[1] as ComponentName;
            const examples = componentExamples[name];
            if (!examples) {
                sendJSON(res, 404, { error: 'Component not found', available: Object.keys(componentSchemas) });
                return;
            }
            sendJSON(res, 200, { name, examples });
            return;
        }

        // ── 404 ──────────────────────────────────────────────────────────────
        sendJSON(res, 404, {
            error: 'Not found',
            endpoints: [
                'GET /health',
                'GET /components',
                'GET /components/:name',
                'GET /components/:name/examples',
            ],
        });
    });

    return server;
}

// ─── Helper Functions ──────────────────────────────────────────────────────

function getComponentDescription(name: ComponentName): string {
    const descriptions: Record<ComponentName, string> = {
        button: 'Interactive button element. Use for actions, form submissions, and CTAs.',
        input: 'Text input field with accessible label, helper text, and error state support.',
        modal: 'Accessible modal dialog with focus trap, backdrop, and keyboard navigation.',
        card: 'Content container with optional border, shadow, and interactive state.',
        badge: 'Small status indicator for labels, counts, and state communication.',
    };
    return descriptions[name] ?? 'LotOS UI component.';
}

function getComponentRestrictions(name: ComponentName): string[] {
    const restrictions: Record<ComponentName, string[]> = {
        button: [
            'Do NOT use disabled + loading together — loading implies disabled',
            'Icon-only buttons MUST have an aria-label',
            'Use variant="destructive" for delete/remove actions, NOT variant="primary" with red styling',
        ],
        input: [
            'ALWAYS provide a label prop for accessibility',
            'Use the error prop instead of custom error styling',
            'Do NOT mix value (controlled) and defaultValue (uncontrolled)',
        ],
        modal: [
            'ALWAYS provide a title prop — it is required for aria-labelledby',
            'onClose MUST close the modal — the component does not manage its own open state',
            'Use closeOnBackdropClick=false for critical confirmations to prevent accidental dismissal',
        ],
        card: [
            'Do NOT nest interactive cards inside other interactive cards',
            'Use glass=true only on dark backgrounds (deepNavy, oceanBlue)',
        ],
        badge: [
            'Use variant="error" for errors, NOT custom red className',
            'Badges with only a dot (dot=true) MUST have an aria-label describing the status',
        ],
    };
    return restrictions[name] ?? [];
}

// ─── Main ──────────────────────────────────────────────────────────────────

const port = parseInt(process.env['MCP_PORT'] ?? String(DEFAULT_PORT), 10);
const server = createMCPServer(port);

server.listen(port, () => {
    console.log(`\n🚀 LotOS MCP Server running at http://localhost:${port}`);
    console.log(`   Components: ${Object.keys(componentSchemas).join(', ')}`);
    console.log(`   Health:     GET /health`);
    console.log(`   Catalog:    GET /components\n`);
});

server.on('error', (err) => {
    console.error('MCP Server error:', err);
    process.exit(1);
});

export { createMCPServer };
