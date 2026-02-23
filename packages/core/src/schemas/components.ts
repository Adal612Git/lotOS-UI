/**
 * @lotos/core — Zod Schemas
 *
 * Component prop contracts that BOTH arms must implement.
 * The MCP Server uses these schemas to expose valid props to LLMs.
 * Sentinel uses these schemas to validate AI-generated code at runtime.
 */

import { z } from 'zod';

// ─── Shared Base Schemas ───────────────────────────────────────────────────

/** Common props all LotOS components accept */
export const basePropsSchema = z.object({
    /** Extra CSS class names */
    className: z.string().optional(),
    /** Inline styles (use sparingly, prefer tokens) */
    style: z.record(z.string()).optional(),
    /** ARIA label override */
    'aria-label': z.string().optional(),
    /** ARIA described-by reference */
    'aria-describedby': z.string().optional(),
    /** ARIA controls reference */
    'aria-controls': z.string().optional(),
    /** Data test ID for e2e testing */
    'data-testid': z.string().optional(),
});

// ─── Button ───────────────────────────────────────────────────────────────

export const buttonVariant = z.enum(['primary', 'secondary', 'ghost', 'destructive', 'link', 'outline']);
export const buttonSize = z.enum(['xs', 'sm', 'md', 'lg', 'xl', 'icon']);

export const buttonPropsSchema = basePropsSchema.extend({
    /** Visual style variant */
    variant: buttonVariant.default('primary'),
    /** Size variant */
    size: buttonSize.default('md'),
    /** Disables the button */
    disabled: z.boolean().optional(),
    /** Shows loading spinner (disables interactions) */
    loading: z.boolean().optional(),
    /** Extends to full container width */
    fullWidth: z.boolean().optional(),
    /** Icon element to show before the label */
    leftIcon: z.any().optional(),
    /** Icon element to show after the label */
    rightIcon: z.any().optional(),
    /** HTML button type */
    type: z.enum(['button', 'submit', 'reset']).default('button'),
    /** Click handler */
    onClick: z.function().args(z.any()).optional(),
    /** Children content */
    children: z.any().optional(),
});

// ─── Input ────────────────────────────────────────────────────────────────

export const inputType = z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time']);

export const inputPropsSchema = basePropsSchema.extend({
    /** HTML input type */
    type: inputType.default('text'),
    /** Current value (controlled) */
    value: z.string().optional(),
    /** Default value (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Placeholder text */
    placeholder: z.string().optional(),
    /** Field label (required for accessibility) */
    label: z.string().optional(),
    /** Helper text shown below the input */
    helperText: z.string().optional(),
    /** Error message (sets aria-invalid and aria-describedby automatically) */
    error: z.string().optional(),
    /** Makes the field required */
    required: z.boolean().optional(),
    /** Disables the field */
    disabled: z.boolean().optional(),
    /** Makes the field read-only */
    readOnly: z.boolean().optional(),
    /** Icon to show at the start (left in LTR) */
    startAdornment: z.any().optional(),
    /** Icon to show at the end (right in LTR) */
    endAdornment: z.any().optional(),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Modal ────────────────────────────────────────────────────────────────

export const modalPropsSchema = basePropsSchema.extend({
    /** Whether the modal is visible */
    open: z.boolean(),
    /** Callback when the modal should close */
    onClose: z.function().args().returns(z.void()),
    /** Modal title (required for accessibility, sets aria-labelledby) */
    title: z.string(),
    /** Optional description (sets aria-describedby) */
    description: z.string().optional(),
    /** Whether clicking the backdrop closes the modal */
    closeOnBackdropClick: z.boolean().default(true),
    /** Whether pressing Escape closes the modal */
    closeOnEscape: z.boolean().default(true),
    /** Size variant controls max-width */
    size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('md'),
    /** Whether to show the close button */
    showCloseButton: z.boolean().default(true),
    /** Children content */
    children: z.any().optional(),
    /** Footer content area */
    footer: z.any().optional(),
});

// ─── Card ─────────────────────────────────────────────────────────────────

export const cardPropsSchema = basePropsSchema.extend({
    /** Padding variant */
    padding: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
    /** Shadow elevation */
    shadow: z.enum(['none', 'sm', 'md', 'lg']).default('sm'),
    /** Whether the card has a hover state (for interactive cards) */
    interactive: z.boolean().optional(),
    /** Border variant */
    border: z.enum(['none', 'default', 'strong']).default('default'),
    /** Whether to use the glass morphism effect */
    glass: z.boolean().optional(),
    /** Children content */
    children: z.any().optional(),
    /** Click handler (also makes the card interactive automatically) */
    onClick: z.function().args(z.any()).optional(),
});

// ─── Badge ────────────────────────────────────────────────────────────────

export const badgePropsSchema = basePropsSchema.extend({
    /** Visual variant */
    variant: z.enum(['default', 'success', 'warning', 'error', 'info', 'outline']).default('default'),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Whether to show a dot indicator instead of text */
    dot: z.boolean().optional(),
    /** Children content */
    children: z.any().optional(),
});

// ─── Exports ──────────────────────────────────────────────────────────────

export type ButtonProps = z.infer<typeof buttonPropsSchema>;
export type InputProps = z.infer<typeof inputPropsSchema>;
export type ModalProps = z.infer<typeof modalPropsSchema>;
export type CardProps = z.infer<typeof cardPropsSchema>;
export type BadgeProps = z.infer<typeof badgePropsSchema>;
export type BaseProps = z.infer<typeof basePropsSchema>;

/** Registry of all component schemas — used by the MCP Server */
export const componentSchemas = {
    button: buttonPropsSchema,
    input: inputPropsSchema,
    modal: modalPropsSchema,
    card: cardPropsSchema,
    badge: badgePropsSchema,
} as const;

export type ComponentName = keyof typeof componentSchemas;
