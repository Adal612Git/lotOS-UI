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

export const ALL_COMPONENTS = [...FREE_COMPONENTS, ...PRO_COMPONENTS] as const;

export type FreeComponentId = (typeof FREE_COMPONENTS)[number];
export type ProComponentId = (typeof PRO_COMPONENTS)[number];
export type ComponentId = (typeof ALL_COMPONENTS)[number];
export type ComponentTier = 'free' | 'pro';

export type ComponentCatalogEntry = {
    id: ComponentId;
    tier: ComponentTier;
    label: string;
};

function toLabel(id: ComponentId): string {
    return id
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export const COMPONENT_CATALOG: readonly ComponentCatalogEntry[] = ALL_COMPONENTS.map((id) => ({
    id,
    tier: FREE_COMPONENTS.includes(id as FreeComponentId) ? 'free' : 'pro',
    label: toLabel(id),
}));

export function getComponentTier(id: string): ComponentTier | null {
    if (FREE_COMPONENTS.includes(id as FreeComponentId)) {
        return 'free';
    }

    if (PRO_COMPONENTS.includes(id as ProComponentId)) {
        return 'pro';
    }

    return null;
}
