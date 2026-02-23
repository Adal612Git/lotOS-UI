/**
 * @lotos/core — tests/tokens.test.ts
 * Tests for design tokens: colors, typography, spacing, animation.
 */

import { describe, it, expect } from 'vitest';
import { colors, typography, spacing, borderRadius, animation, prefersReducedMotion } from '../src/index.js';

describe('@lotos/core — Color Tokens', () => {
    it('exports all raw brand colors', () => {
        expect(colors.deepNavy).toBe('#1A1A2E');
        expect(colors.electricRed).toBe('#E94560');
        expect(colors.oceanBlue).toBe('#0F3460');
        expect(colors.pureWhite).toBe('#FFFFFF');
        expect(colors.softLavender).toBe('#F0F4FF');
    });

    it('exports semantic background tokens', () => {
        expect(colors.background.primary).toBeDefined();
        expect(colors.background.secondary).toBeDefined();
        expect(colors.background.card).toBeDefined();
        expect(colors.background.overlay).toBeDefined();
    });

    it('exports semantic foreground tokens', () => {
        expect(colors.foreground.primary).toBe('#FFFFFF');
        expect(colors.foreground.inverse).toBe('#1A1A2E');
    });

    it('exports accent tokens', () => {
        expect(colors.accent.primary).toBe('#E94560');
        expect(colors.accent.foreground).toBe('#FFFFFF');
    });

    it('exports light mode overrides', () => {
        expect(colors.light.background.primary).toBe('#F0F4FF');
        expect(colors.light.foreground.primary).toBe('#1A1A2E');
    });

    it('exports status colors', () => {
        expect(colors.status.success).toBeDefined();
        expect(colors.status.warning).toBeDefined();
        expect(colors.status.error).toBe('#E94560'); // uses brand electric red for errors
        expect(colors.status.info).toBeDefined();
    });
});

describe('@lotos/core — Typography Tokens', () => {
    it('exports font families', () => {
        expect(typography.fontFamily.sans).toContain('Inter');
        expect(typography.fontFamily.mono).toContain('JetBrains Mono');
    });

    it('exports font sizes in rem', () => {
        expect(typography.fontSize.base).toBe('1rem');
        expect(typography.fontSize.xs).toBe('0.75rem');
        expect(typography.fontSize['5xl']).toBe('3rem');
    });

    it('exports font weights as strings', () => {
        expect(typography.fontWeight.normal).toBe('400');
        expect(typography.fontWeight.bold).toBe('700');
    });
});

describe('@lotos/core — Spacing Tokens', () => {
    it('exports spacing as rem strings', () => {
        expect(spacing[1]).toBe('0.25rem');
        expect(spacing[4]).toBe('1rem');
        expect(spacing[8]).toBe('2rem');
        expect(spacing[0]).toBe('0px');
        expect(spacing['px']).toBe('1px');
    });

    it('exports border radius tokens', () => {
        expect(borderRadius.none).toBe('0px');
        expect(borderRadius.full).toBe('9999px');
        expect(borderRadius.lg).toBeDefined();
    });
});

describe('@lotos/core — Animation Tokens', () => {
    it('exports duration values in ms', () => {
        expect(animation.duration.fast).toBe('100ms');
        expect(animation.duration.normal).toBe('200ms');
        expect(animation.duration.slow).toBe('300ms');
    });

    it('exports easing curves', () => {
        expect(animation.easing.easeOut).toContain('cubic-bezier');
        expect(animation.easing.spring).toContain('cubic-bezier');
    });

    it('exports prebuilt transition values', () => {
        expect(animation.transition.normal).toContain('200ms');
        expect(animation.transition.fast).toContain('100ms');
    });

    it('prefersReducedMotion returns false in non-browser (Node env)', () => {
        // In Node/vitest, window is not defined — should return false
        const result = prefersReducedMotion();
        expect(result).toBe(false);
    });
});

describe('@lotos/core — Framework Independence', () => {
    it('does NOT export any React-specific symbols', async () => {
        // If this import works, it means no React is bundled
        const coreModule = await import('../src/index.js');
        const exportedKeys = Object.keys(coreModule);

        // These would indicate React dependency
        expect(exportedKeys).not.toContain('useState');
        expect(exportedKeys).not.toContain('useEffect');
        expect(exportedKeys).not.toContain('createElement');
    });
});
