import { describe, expect, it } from 'vitest';
import {
    assertValidComponentProps,
    formatSentinelIssues,
    validateComponentProps,
} from '../src/index.js';

describe('@lotos/sentinel', () => {
    it('accepts valid props', () => {
        const result = validateComponentProps('button', {
            variant: 'primary',
            children: 'Save',
        });
        expect(result.valid).toBe(true);
        expect(result.issues).toHaveLength(0);
    });

    it('reports schema errors', () => {
        const result = validateComponentProps('button', {
            variant: 'invalid',
        });
        expect(result.valid).toBe(false);
        expect(result.issues.some((issue) => issue.severity === 'error')).toBe(true);
    });

    it('reports guardrail warnings', () => {
        const result = validateComponentProps('button', {
            variant: 'primary',
            loading: true,
            disabled: true,
            children: 'Save',
        });
        expect(result.valid).toBe(true);
        expect(result.issues.some((issue) => issue.code === 'button-disabled-loading')).toBe(true);
    });

    it('throws when validation has errors', () => {
        expect(() => assertValidComponentProps('modal', { open: true })).toThrow(
            'props are invalid',
        );
    });

    it('formats issues for logs', () => {
        const result = validateComponentProps('input', { type: 'email' });
        const formatted = formatSentinelIssues(result.issues);
        expect(formatted[0]).toContain('WARNING');
        expect(formatted[0]).toContain('input-missing-label');
    });
});
