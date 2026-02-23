/**
 * @lotos/core — tests/theme.test.ts
 * Tests for dark mode engine, CSS variable generation, and theme switching.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateCSSVariables, applyTheme, getActiveTheme } from '../src/index.js';

describe('@lotos/core — CSS Variable Generation', () => {
    it('generates a non-empty CSS string', () => {
        const css = generateCSSVariables();
        expect(css).toBeTruthy();
        expect(typeof css).toBe('string');
    });

    it('contains :root selector', () => {
        const css = generateCSSVariables();
        expect(css).toContain(':root');
    });

    it('contains all lotos-- prefixed CSS variables', () => {
        const css = generateCSSVariables();
        expect(css).toContain('--lotos-bg-primary');
        expect(css).toContain('--lotos-bg-secondary');
        expect(css).toContain('--lotos-fg-primary');
        expect(css).toContain('--lotos-accent');
        expect(css).toContain('--lotos-border');
        expect(css).toContain('--lotos-border-focus');
        expect(css).toContain('--lotos-font-sans');
        expect(css).toContain('--lotos-space-4');
        expect(css).toContain('--lotos-radius-lg');
        expect(css).toContain('--lotos-duration-normal');
    });

    it('contains light mode overrides via [data-theme="light"]', () => {
        const css = generateCSSVariables();
        expect(css).toContain('[data-theme="light"]');
    });

    it('contains prefers-color-scheme: light media query', () => {
        const css = generateCSSVariables();
        expect(css).toContain('@media (prefers-color-scheme: light)');
    });

    it('contains prefers-reduced-motion media query', () => {
        const css = generateCSSVariables();
        expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    });

    it('dark mode uses deep navy as primary background', () => {
        const css = generateCSSVariables();
        expect(css).toContain('#1A1A2E'); // deepNavy
    });

    it('light mode uses soft lavender as primary background', () => {
        const css = generateCSSVariables();
        expect(css).toContain('#F0F4FF'); // softLavender
    });
});

describe('@lotos/core — Theme Switching (Browser Simulation)', () => {
    beforeEach(() => {
        // Mock document for non-browser env
        global.document = {
            documentElement: {
                setAttribute: vi.fn(),
                removeAttribute: vi.fn(),
                getAttribute: vi.fn().mockReturnValue(null),
            },
        } as unknown as Document;

        global.window = {
            matchMedia: vi.fn().mockReturnValue({ matches: true }),
        } as unknown as Window & typeof globalThis;
    });

    it('applyTheme("dark") sets data-theme="dark" on documentElement', () => {
        applyTheme('dark');
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('applyTheme("light") sets data-theme="light" on documentElement', () => {
        applyTheme('light');
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('applyTheme("system") removes data-theme attribute', () => {
        applyTheme('system');
        expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
    });

    it('getActiveTheme returns dark when window.matchMedia returns true', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue(null);
        (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({ matches: true });
        const theme = getActiveTheme();
        expect(theme).toBe('dark');
    });

    it('getActiveTheme returns explicit theme when data-theme is set', () => {
        (document.documentElement.getAttribute as ReturnType<typeof vi.fn>).mockReturnValue('light');
        const theme = getActiveTheme();
        expect(theme).toBe('light');
    });
});
