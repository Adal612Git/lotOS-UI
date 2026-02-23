/**
 * @lotos/core — tests/schemas.test.ts
 * Tests for Zod component schemas — prop validation contracts.
 */

import { describe, it, expect } from 'vitest';
import {
    buttonPropsSchema,
    inputPropsSchema,
    modalPropsSchema,
    cardPropsSchema,
    badgePropsSchema,
    componentSchemas,
} from '../src/index.js';
import { z } from 'zod';

describe('@lotos/core — Button Schema', () => {
    it('validates default button props', () => {
        const result = buttonPropsSchema.parse({});
        expect(result.variant).toBe('primary');
        expect(result.size).toBe('md');
        expect(result.type).toBe('button');
    });

    it('accepts all valid variants', () => {
        const variants = ['primary', 'secondary', 'ghost', 'destructive', 'link', 'outline'] as const;
        for (const variant of variants) {
            const result = buttonPropsSchema.parse({ variant });
            expect(result.variant).toBe(variant);
        }
    });

    it('accepts all valid sizes', () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'icon'] as const;
        for (const size of sizes) {
            const result = buttonPropsSchema.parse({ size });
            expect(result.size).toBe(size);
        }
    });

    it('rejects invalid variant', () => {
        expect(() => buttonPropsSchema.parse({ variant: 'danger' })).toThrow(z.ZodError);
    });

    it('rejects invalid size', () => {
        expect(() => buttonPropsSchema.parse({ size: 'xxl' })).toThrow(z.ZodError);
    });

    it('accepts disabled and loading flags', () => {
        const result = buttonPropsSchema.parse({ disabled: true, loading: true });
        expect(result.disabled).toBe(true);
        expect(result.loading).toBe(true);
    });
});

describe('@lotos/core — Input Schema', () => {
    it('validates with defaults', () => {
        const result = inputPropsSchema.parse({});
        expect(result.type).toBe('text');
        expect(result.size).toBe('md');
    });

    it('accepts all valid input types', () => {
        const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'] as const;
        for (const type of types) {
            const result = inputPropsSchema.parse({ type });
            expect(result.type).toBe(type);
        }
    });

    it('rejects invalid type', () => {
        expect(() => inputPropsSchema.parse({ type: 'color' })).toThrow(z.ZodError);
    });

    it('accepts error string for validation state', () => {
        const result = inputPropsSchema.parse({ error: 'This field is required' });
        expect(result.error).toBe('This field is required');
    });

    it('accepts required and readOnly flags', () => {
        const result = inputPropsSchema.parse({ required: true, readOnly: true });
        expect(result.required).toBe(true);
        expect(result.readOnly).toBe(true);
    });
});

describe('@lotos/core — Modal Schema', () => {
    it('requires open and onClose and title', () => {
        expect(() => modalPropsSchema.parse({})).toThrow(z.ZodError);
        expect(() => modalPropsSchema.parse({ open: true })).toThrow(z.ZodError);
    });

    it('validates with minimum required props', () => {
        const result = modalPropsSchema.parse({
            open: true,
            onClose: () => { },
            title: 'Confirmation',
        });
        expect(result.open).toBe(true);
        expect(result.title).toBe('Confirmation');
        expect(result.size).toBe('md');
        expect(result.closeOnBackdropClick).toBe(true);
        expect(result.closeOnEscape).toBe(true);
        expect(result.showCloseButton).toBe(true);
    });

    it('accepts all valid sizes', () => {
        const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
        for (const size of sizes) {
            const result = modalPropsSchema.parse({
                open: false,
                onClose: () => { },
                title: 'Test',
                size,
            });
            expect(result.size).toBe(size);
        }
    });
});

describe('@lotos/core — Card Schema', () => {
    it('validates with defaults', () => {
        const result = cardPropsSchema.parse({});
        expect(result.padding).toBe('md');
        expect(result.shadow).toBe('sm');
        expect(result.border).toBe('default');
    });

    it('accepts glass morphism flag', () => {
        const result = cardPropsSchema.parse({ glass: true });
        expect(result.glass).toBe(true);
    });
});

describe('@lotos/core — Badge Schema', () => {
    it('validates with defaults', () => {
        const result = badgePropsSchema.parse({});
        expect(result.variant).toBe('default');
        expect(result.size).toBe('md');
    });

    it('accepts all valid badge variants', () => {
        const variants = ['default', 'success', 'warning', 'error', 'info', 'outline'] as const;
        for (const variant of variants) {
            const result = badgePropsSchema.parse({ variant });
            expect(result.variant).toBe(variant);
        }
    });
});

describe('@lotos/core — Component Registry', () => {
    it('exports componentSchemas with all 5 components', () => {
        expect(componentSchemas).toBeDefined();
        expect(Object.keys(componentSchemas)).toContain('button');
        expect(Object.keys(componentSchemas)).toContain('input');
        expect(Object.keys(componentSchemas)).toContain('modal');
        expect(Object.keys(componentSchemas)).toContain('card');
        expect(Object.keys(componentSchemas)).toContain('badge');
    });

    it('all schemas in registry are Zod schemas', () => {
        for (const [name, schema] of Object.entries(componentSchemas)) {
            expect(schema).toBeDefined();
            expect(typeof schema.parse).toBe('function');
            expect(typeof schema.safeParse).toBe('function');
        }
    });
});
