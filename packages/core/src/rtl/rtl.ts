/**
 * @lotos/core — RTL Engine
 *
 * Provides utilities for Right-to-Left support using CSS logical properties.
 * All LotOS components MUST use logical properties (e.g., `margin-inline-start`)
 * instead of physical properties (e.g., `margin-left`) so RTL works automatically.
 */

export type TextDirection = 'ltr' | 'rtl';

/**
 * RTL-aware spacing helper.
 * Returns the correct logical property name for a given physical side.
 *
 * @example
 * css`${logical('padding-left')}: 1rem` → 'padding-inline-start: 1rem' (LTR)
 * css`${logical('padding-left')}: 1rem` → 'padding-inline-start: 1rem' (RTL, auto-flipped)
 */
export const logicalProperty: Record<string, string> = {
    // Margin
    'margin-left': 'margin-inline-start',
    'margin-right': 'margin-inline-end',
    'margin-top': 'margin-block-start',
    'margin-bottom': 'margin-block-end',

    // Padding
    'padding-left': 'padding-inline-start',
    'padding-right': 'padding-inline-end',
    'padding-top': 'padding-block-start',
    'padding-bottom': 'padding-block-end',

    // Position
    'left': 'inset-inline-start',
    'right': 'inset-inline-end',
    'top': 'inset-block-start',
    'bottom': 'inset-block-end',

    // Border
    'border-left': 'border-inline-start',
    'border-right': 'border-inline-end',
    'border-top': 'border-block-start',
    'border-bottom': 'border-block-end',

    // Width/Height
    'width': 'inline-size',
    'height': 'block-size',
    'min-width': 'min-inline-size',
    'min-height': 'min-block-size',
    'max-width': 'max-inline-size',
    'max-height': 'max-block-size',
} as const;

/**
 * Returns the logical property name for a physical CSS property.
 * Falls back to the original if no mapping exists.
 */
export function toLogical(physicalProperty: string): string {
    return logicalProperty[physicalProperty] ?? physicalProperty;
}

/**
 * Generates the RTL CSS rule for a given element.
 * Use by appending `dir="rtl"` on the root element.
 *
 * Returns a CSS `[dir="rtl"]` block as a string.
 */
export function generateRTLBlock(selector: string, styles: Record<string, string>): string {
    const declarations = Object.entries(styles)
        .map(([prop, val]) => `  ${prop}: ${val};`)
        .join('\n');

    return `[dir="rtl"] ${selector} {\n${declarations}\n}`;
}

/**
 * Sets the text direction on the document root.
 * Requires browser environment.
 */
export function setDirection(dir: TextDirection): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); // example
}

/**
 * Gets the current text direction from the document.
 */
export function getDirection(): TextDirection {
    if (typeof document === 'undefined') return 'ltr';
    return (document.documentElement.getAttribute('dir') as TextDirection) ?? 'ltr';
}

/**
 * Returns true if the current direction is RTL.
 */
export function isRTL(): boolean {
    return getDirection() === 'rtl';
}
