export const FREE_COMPONENTS = [
    'alert',
    'badge',
    'button',
    'card',
    'divider',
    'empty-state',
    'input',
    'spinner',
] as const;

export const PRO_COMPONENTS = [
    'accordion',
    'avatar',
    'breadcrumbs',
    'checkbox',
    'combobox',
    'dropdown',
    'form',
    'modal',
    'progress',
    'radio-group',
    'select',
    'skeleton',
    'stat',
    'switch',
    'table',
    'tabs',
    'textarea',
    'toast',
    'tooltip',
] as const;

export const SUPPORTED_COMPONENTS = [...FREE_COMPONENTS, ...PRO_COMPONENTS] as const;

export type SupportedComponent = (typeof SUPPORTED_COMPONENTS)[number];
export type ComponentTier = 'free' | 'pro';

export type ComponentCatalogEntry = {
    id: SupportedComponent;
    tier: ComponentTier;
};

export const COMPONENT_CATALOG: readonly ComponentCatalogEntry[] = SUPPORTED_COMPONENTS.map((id) => ({
    id,
    tier: FREE_COMPONENTS.includes(id as (typeof FREE_COMPONENTS)[number]) ? 'free' : 'pro',
}));

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

export function getComponentTier(component: SupportedComponent): ComponentTier {
    return FREE_COMPONENTS.includes(component as (typeof FREE_COMPONENTS)[number]) ? 'free' : 'pro';
}

export function getComponentImportPackage(component: SupportedComponent): '@lotosui/claude-arm' | '@lotosui/claude-arm-pro' {
    return getComponentTier(component) === 'free' ? '@lotosui/claude-arm' : '@lotosui/claude-arm-pro';
}
