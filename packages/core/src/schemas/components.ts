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

// ─── Select ───────────────────────────────────────────────────────────────

export const selectPropsSchema = basePropsSchema.extend({
    /** Current value (controlled) */
    value: z.string().optional(),
    /** Default value (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Field label */
    label: z.string().optional(),
    /** Placeholder shown when no value is selected */
    placeholder: z.string().optional(),
    /** Helper text shown below the field */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Whether the field is required */
    required: z.boolean().optional(),
    /** Whether the field is disabled */
    disabled: z.boolean().optional(),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Available options */
    options: z.array(z.object({ value: z.string(), label: z.string(), disabled: z.boolean().optional() })).optional(),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Checkbox ─────────────────────────────────────────────────────────────

export const checkboxPropsSchema = basePropsSchema.extend({
    /** Whether the checkbox is checked (controlled) */
    checked: z.boolean().optional(),
    /** Default checked state (uncontrolled) */
    defaultChecked: z.boolean().optional(),
    /** Checkbox label */
    label: z.string().optional(),
    /** Helper text */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Whether the field is required */
    required: z.boolean().optional(),
    /** Whether the checkbox is disabled */
    disabled: z.boolean().optional(),
    /** Indeterminate state (partially checked) */
    indeterminate: z.boolean().optional(),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Switch ───────────────────────────────────────────────────────────────

export const switchPropsSchema = basePropsSchema.extend({
    /** Whether the switch is on (controlled) */
    checked: z.boolean().optional(),
    /** Default state (uncontrolled) */
    defaultChecked: z.boolean().optional(),
    /** Switch label */
    label: z.string().optional(),
    /** Helper text */
    helperText: z.string().optional(),
    /** Whether the switch is disabled */
    disabled: z.boolean().optional(),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Textarea ─────────────────────────────────────────────────────────────

export const textareaPropsSchema = basePropsSchema.extend({
    /** Current value (controlled) */
    value: z.string().optional(),
    /** Default value (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Field label */
    label: z.string().optional(),
    /** Placeholder text */
    placeholder: z.string().optional(),
    /** Helper text */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Whether the field is required */
    required: z.boolean().optional(),
    /** Whether the field is disabled */
    disabled: z.boolean().optional(),
    /** Whether the field is read-only */
    readOnly: z.boolean().optional(),
    /** Number of visible rows */
    rows: z.number().int().positive().optional(),
    /** Maximum character count */
    maxLength: z.number().int().positive().optional(),
    /** Whether to show character counter */
    showCount: z.boolean().optional(),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Tooltip ──────────────────────────────────────────────────────────────

export const tooltipPropsSchema = basePropsSchema.extend({
    /** Tooltip text content */
    content: z.string(),
    /** Preferred placement relative to the trigger */
    placement: z.enum(['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end']).default('top'),
    /** Delay before showing tooltip in ms */
    delay: z.number().int().nonnegative().optional(),
    /** Whether the tooltip is disabled */
    disabled: z.boolean().optional(),
    /** Trigger element */
    children: z.any(),
});

// ─── Dropdown ─────────────────────────────────────────────────────────────

export const dropdownPropsSchema = basePropsSchema.extend({
    /** Trigger element */
    trigger: z.any(),
    /** Menu items */
    items: z.array(z.object({
        id: z.string(),
        label: z.string(),
        icon: z.any().optional(),
        disabled: z.boolean().optional(),
        destructive: z.boolean().optional(),
        onClick: z.function().optional(),
    })).optional(),
    /** Whether the menu is open (controlled) */
    open: z.boolean().optional(),
    /** Placement relative to trigger */
    placement: z.enum(['bottom-start', 'bottom-end', 'top-start', 'top-end']).default('bottom-start'),
    /** Open/close handler */
    onOpenChange: z.function().args(z.boolean()).optional(),
});

// ─── RadioGroup ───────────────────────────────────────────────────────────

export const radioGroupPropsSchema = basePropsSchema.extend({
    /** Current selected value (controlled) */
    value: z.string().optional(),
    /** Default value (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Group label */
    label: z.string().optional(),
    /** Helper text */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Whether the group is required */
    required: z.boolean().optional(),
    /** Whether the group is disabled */
    disabled: z.boolean().optional(),
    /** Layout direction */
    orientation: z.enum(['horizontal', 'vertical']).default('vertical'),
    /** Radio options */
    options: z.array(z.object({
        value: z.string(),
        label: z.string(),
        disabled: z.boolean().optional(),
    })),
    /** Change handler */
    onChange: z.function().args(z.string()).optional(),
});

// ─── Combobox ─────────────────────────────────────────────────────────────

export const comboboxPropsSchema = basePropsSchema.extend({
    /** Current selected value (controlled) */
    value: z.string().optional(),
    /** Default value (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Field label */
    label: z.string().optional(),
    /** Placeholder text */
    placeholder: z.string().optional(),
    /** Helper text */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Whether the field is required */
    required: z.boolean().optional(),
    /** Whether the field is disabled */
    disabled: z.boolean().optional(),
    /** Available options */
    options: z.array(z.object({
        value: z.string(),
        label: z.string(),
        disabled: z.boolean().optional(),
    })),
    /** Whether the dropdown is open (controlled) */
    open: z.boolean().optional(),
    /** Change handler */
    onChange: z.function().args(z.string()).optional(),
    /** Open state change handler */
    onOpenChange: z.function().args(z.boolean()).optional(),
});

// ─── Tabs ─────────────────────────────────────────────────────────────────

export const tabsPropsSchema = basePropsSchema.extend({
    /** Current active tab value (controlled) */
    value: z.string().optional(),
    /** Default active tab (uncontrolled) */
    defaultValue: z.string().optional(),
    /** Tab items */
    tabs: z.array(z.object({
        value: z.string(),
        label: z.string(),
        disabled: z.boolean().optional(),
        content: z.any().optional(),
    })),
    /** Visual variant */
    variant: z.enum(['underline', 'pills', 'boxed']).default('underline'),
    /** Layout orientation */
    orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
    /** Change handler */
    onChange: z.function().args(z.string()).optional(),
});

// ─── Accordion ────────────────────────────────────────────────────────────

export const accordionPropsSchema = basePropsSchema.extend({
    /** Accordion items */
    items: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.any(),
        disabled: z.boolean().optional(),
    })),
    /** Allow multiple items open at once */
    multiple: z.boolean().optional(),
    /** Currently open item IDs (controlled) */
    value: z.union([z.string(), z.array(z.string())]).optional(),
    /** Default open item IDs (uncontrolled) */
    defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
    /** Visual variant */
    variant: z.enum(['default', 'bordered', 'ghost']).default('default'),
    /** Change handler */
    onChange: z.function().args(z.any()).optional(),
});

// ─── Exports ──────────────────────────────────────────────────────────────

export type ButtonProps = z.infer<typeof buttonPropsSchema>;
export type InputProps = z.infer<typeof inputPropsSchema>;
export type ModalProps = z.infer<typeof modalPropsSchema>;
export type CardProps = z.infer<typeof cardPropsSchema>;
export type BadgeProps = z.infer<typeof badgePropsSchema>;
export type SelectProps = z.infer<typeof selectPropsSchema>;
export type CheckboxProps = z.infer<typeof checkboxPropsSchema>;
export type SwitchProps = z.infer<typeof switchPropsSchema>;
export type TextareaProps = z.infer<typeof textareaPropsSchema>;
export type TooltipProps = z.infer<typeof tooltipPropsSchema>;
export type DropdownProps = z.infer<typeof dropdownPropsSchema>;
export type RadioGroupProps = z.infer<typeof radioGroupPropsSchema>;
export type ComboboxProps = z.infer<typeof comboboxPropsSchema>;
export type TabsProps = z.infer<typeof tabsPropsSchema>;
export type AccordionProps = z.infer<typeof accordionPropsSchema>;
export type BaseProps = z.infer<typeof basePropsSchema>;

/** Registry of all component schemas — used by the MCP Server */
export const componentSchemas = {
    button: buttonPropsSchema,
    input: inputPropsSchema,
    modal: modalPropsSchema,
    card: cardPropsSchema,
    badge: badgePropsSchema,
    select: selectPropsSchema,
    checkbox: checkboxPropsSchema,
    switch: switchPropsSchema,
    textarea: textareaPropsSchema,
    tooltip: tooltipPropsSchema,
    dropdown: dropdownPropsSchema,
    'radio-group': radioGroupPropsSchema,
    combobox: comboboxPropsSchema,
    tabs: tabsPropsSchema,
    accordion: accordionPropsSchema,
} as const;

export type ComponentName = keyof typeof componentSchemas;
