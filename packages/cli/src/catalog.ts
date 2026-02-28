export const SUPPORTED_COMPONENTS = [
    'accordion',
    'alert',
    'avatar',
    'badge',
    'button',
    'card',
    'checkbox',
    'combobox',
    'dropdown',
    'form',
    'input',
    'modal',
    'progress',
    'radio-group',
    'select',
    'switch',
    'table',
    'tabs',
    'textarea',
    'tooltip',
] as const;

export type SupportedComponent = (typeof SUPPORTED_COMPONENTS)[number];

function toLookupKey(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

const componentLookup = new Map<string, SupportedComponent>(
    SUPPORTED_COMPONENTS.map((component) => [toLookupKey(component), component]),
);

export function normalizeComponentName(value: string): SupportedComponent | null {
    return componentLookup.get(toLookupKey(value)) ?? null;
}

export function componentToPascalCase(component: SupportedComponent): string {
    return component
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}
