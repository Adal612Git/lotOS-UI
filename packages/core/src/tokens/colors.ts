/**
 * @lotos/core — Design Tokens
 * Color palette for LotOS UI. Pure TypeScript, zero framework dependencies.
 */

export const colors = {
    // Primary palette
    deepNavy: '#1A1A2E',
    electricRed: '#E94560',
    oceanBlue: '#0F3460',
    pureWhite: '#FFFFFF',
    softLavender: '#F0F4FF',

    // Semantic aliases
    background: {
        primary: '#1A1A2E',
        secondary: '#0F3460',
        card: '#F0F4FF',
        overlay: 'rgba(26, 26, 46, 0.85)',
    },
    foreground: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.72)',
        muted: 'rgba(255, 255, 255, 0.45)',
        inverse: '#1A1A2E',
    },
    accent: {
        primary: '#E94560',
        hover: '#FF5A78',
        active: '#C73350',
        foreground: '#FFFFFF',
    },
    border: {
        default: 'rgba(255, 255, 255, 0.12)',
        strong: 'rgba(255, 255, 255, 0.24)',
        focus: '#E94560',
    },
    status: {
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#E94560',
        info: '#3B82F6',
    },

    // Light mode overrides (via CSS variables)
    light: {
        background: {
            primary: '#F0F4FF',
            secondary: '#FFFFFF',
            card: '#FFFFFF',
        },
        foreground: {
            primary: '#1A1A2E',
            secondary: 'rgba(26, 26, 46, 0.72)',
            muted: 'rgba(26, 26, 46, 0.45)',
        },
        border: {
            default: 'rgba(26, 26, 46, 0.12)',
            strong: 'rgba(26, 26, 46, 0.24)',
        },
    },
} as const;

export type LotosColors = typeof colors;
