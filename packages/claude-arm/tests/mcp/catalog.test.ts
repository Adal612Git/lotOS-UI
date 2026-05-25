import { describe, expect, it } from 'vitest';
import * as components from '../../src/components/index.js';
import { FREE_COMPONENTS, PRO_COMPONENTS } from '../../src/catalog.js';
import {
    fetchComponentCatalog,
    fetchComponentSchema,
} from '../../src/mcp/index.js';

function toPascalCase(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

describe('MCP catalog contract', () => {
    it('exports only free public components from the claude arm components barrel', () => {
        for (const componentName of FREE_COMPONENTS) {
            const exportName = toPascalCase(componentName);
            const exported = (components as Record<string, unknown>)[exportName];
            expect(exported).toBeDefined();
            expect(['function', 'object']).toContain(typeof exported);
        }

        for (const componentName of PRO_COMPONENTS) {
            const exportName = toPascalCase(componentName);
            expect((components as Record<string, unknown>)[exportName]).toBeUndefined();
        }
    });

    it('exports MCP client utilities', () => {
        expect(fetchComponentCatalog).toBeTypeOf('function');
        expect(fetchComponentSchema).toBeTypeOf('function');
    });
});
