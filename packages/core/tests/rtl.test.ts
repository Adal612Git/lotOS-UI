/**
 * @lotos/core — tests/rtl.test.ts
 * Tests for RTL engine — logical properties and direction utilities.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { toLogical, logicalProperty, generateRTLBlock, setDirection, getDirection, isRTL } from '../src/index.js';

describe('@lotos/core — RTL Logical Properties', () => {
    it('maps margin-left to margin-inline-start', () => {
        expect(toLogical('margin-left')).toBe('margin-inline-start');
    });

    it('maps margin-right to margin-inline-end', () => {
        expect(toLogical('margin-right')).toBe('margin-inline-end');
    });

    it('maps padding-left to padding-inline-start', () => {
        expect(toLogical('padding-left')).toBe('padding-inline-start');
    });

    it('maps padding-right to padding-inline-end', () => {
        expect(toLogical('padding-right')).toBe('padding-inline-end');
    });

    it('maps left to inset-inline-start', () => {
        expect(toLogical('left')).toBe('inset-inline-start');
    });

    it('maps right to inset-inline-end', () => {
        expect(toLogical('right')).toBe('inset-inline-end');
    });

    it('maps width to inline-size', () => {
        expect(toLogical('width')).toBe('inline-size');
    });

    it('maps border-left to border-inline-start', () => {
        expect(toLogical('border-left')).toBe('border-inline-start');
    });

    it('falls back to original property if no mapping exists', () => {
        expect(toLogical('color')).toBe('color');
        expect(toLogical('opacity')).toBe('opacity');
    });

    it('logicalProperty map has all expected keys', () => {
        expect(Object.keys(logicalProperty)).toContain('margin-left');
        expect(Object.keys(logicalProperty)).toContain('padding-right');
        expect(Object.keys(logicalProperty)).toContain('width');
        expect(Object.keys(logicalProperty)).toContain('height');
    });
});

describe('@lotos/core — RTL Block Generation', () => {
    it('generates a valid [dir="rtl"] CSS block', () => {
        const block = generateRTLBlock('.btn', {
            'margin-inline-start': 'auto',
            'text-align': 'start',
        });
        expect(block).toContain('[dir="rtl"] .btn');
        expect(block).toContain('margin-inline-start: auto');
        expect(block).toContain('text-align: start');
    });

    it('generates block with multiple declarations', () => {
        const block = generateRTLBlock('.card', {
            'padding-inline-start': '1rem',
            'border-inline-start': '2px solid red',
            'inset-inline-start': '0',
        });
        const lines = block.split('\n');
        expect(lines.filter(l => l.trim().endsWith(';'))).toHaveLength(3);
    });
});

describe('@lotos/core — Direction Utilities (Browser Simulation)', () => {
    beforeEach(() => {
        global.document = {
            documentElement: {
                setAttribute: vi.fn(),
                removeAttribute: vi.fn(),
                getAttribute: vi.fn().mockReturnValue('ltr'),
            },
        } as unknown as Document;
    });

    it('setDirection("rtl") sets dir and lang attributes', () => {
        setDirection('rtl');
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
    });

    it('getDirection returns ltr by default', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue('ltr');
        expect(getDirection()).toBe('ltr');
    });

    it('getDirection returns rtl when attribute is rtl', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue('rtl');
        expect(getDirection()).toBe('rtl');
    });

    it('isRTL returns false in ltr context', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue('ltr');
        expect(isRTL()).toBe(false);
    });

    it('isRTL returns true in rtl context', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue('rtl');
        expect(isRTL()).toBe(true);
    });
});
