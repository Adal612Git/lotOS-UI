/**
 * @lotos/core — Animation Tokens
 * Duration, easing, and transition definitions.
 * All animations MUST be wrapped in the respectsReducedMotion guard.
 */

export const animation = {
    duration: {
        instant: '0ms',
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
        slowest: '800ms',
    },

    easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // slight overshoot
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Prebuilt transition values
    transition: {
        fast: '100ms cubic-bezier(0, 0, 0.2, 1)',
        normal: '200ms cubic-bezier(0, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0, 0, 0.2, 1)',
        springNormal: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
} as const;

/**
 * Returns true when the user prefers reduced motion.
 * Use this guard before applying any animation.
 * Works in both browser and SSR (defaults to false in non-browser).
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type LotosAnimation = typeof animation;
