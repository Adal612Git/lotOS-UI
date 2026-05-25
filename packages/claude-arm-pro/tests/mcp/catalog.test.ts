import { describe, expect, it } from 'vitest';
import { componentSchemas } from '@lotosui/core/schemas';
import * as components from '../../src/components/index.js';
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
    it('exports all core schema components from claude arm barrel', () => {
        for (const componentName of Object.keys(componentSchemas)) {
            const exportName = toPascalCase(componentName);
            const exported = (components as Record<string, unknown>)[exportName];
            expect(exported).toBeDefined();
            expect(['function', 'object']).toContain(typeof exported);
        }
    });

    it('exports MCP client utilities', () => {
        expect(fetchComponentCatalog).toBeTypeOf('function');
        expect(fetchComponentSchema).toBeTypeOf('function');
    });
});
