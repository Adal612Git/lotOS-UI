import { borderRadius, colors, spacing, typography } from '@lotosui/core';
import { getCustomElementsRegistry, LotosHTMLElementBase } from './dom-guards.js';

export type LotosBadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
export type LotosBadgeSize = 'sm' | 'md' | 'lg';

function normalizeVariant(value: string | null): LotosBadgeVariant {
    switch (value) {
        case 'success':
        case 'warning':
        case 'error':
        case 'info':
        case 'outline':
            return value;
        default:
            return 'default';
    }
}

function normalizeSize(value: string | null): LotosBadgeSize {
    switch (value) {
        case 'sm':
        case 'lg':
            return value;
        default:
            return 'md';
    }
}

function getVariantStyles(variant: LotosBadgeVariant): string {
    switch (variant) {
        case 'success':
            return `
                color: #fff;
                background: ${colors.status.success};
                border-color: ${colors.status.success};
            `;
        case 'warning':
            return `
                color: #1a1208;
                background: ${colors.status.warning};
                border-color: ${colors.status.warning};
            `;
        case 'error':
            return `
                color: #fff;
                background: ${colors.status.error};
                border-color: ${colors.status.error};
            `;
        case 'info':
            return `
                color: #fff;
                background: ${colors.status.info};
                border-color: ${colors.status.info};
            `;
        case 'outline':
            return `
                color: ${colors.foreground.primary};
                background: transparent;
                border-color: ${colors.border.strong};
            `;
        default:
            return `
                color: ${colors.foreground.secondary};
                background: rgba(255, 255, 255, 0.06);
                border-color: ${colors.border.default};
            `;
    }
}

function getSizeStyles(size: LotosBadgeSize): string {
    switch (size) {
        case 'sm':
            return `
                padding: 1px ${spacing[1.5]};
                font-size: 10px;
                line-height: 16px;
            `;
        case 'lg':
            return `
                padding: 3px ${spacing[3]};
                font-size: ${typography.fontSize.sm};
                line-height: 20px;
            `;
        default:
            return `
                padding: 2px ${spacing[2]};
                font-size: 11px;
                line-height: 18px;
            `;
    }
}

export class LotosBadgeElement extends LotosHTMLElementBase {
    private readonly span: HTMLSpanElement;

    static get observedAttributes(): string[] {
        return ['variant', 'size', 'dot'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.span = document.createElement('span');
        this.span.part.add('badge');
        this.span.appendChild(document.createElement('slot'));
        shadow.appendChild(this.span);
        this.render();
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(): void {
        this.render();
    }

    private render(): void {
        const variant = normalizeVariant(this.getAttribute('variant'));
        const size = normalizeSize(this.getAttribute('size'));
        const dot = this.hasAttribute('dot');

        if (dot) {
            this.span.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 8px;
                height: 8px;
                border-radius: ${borderRadius.full};
                ${getVariantStyles(variant)}
            `;
        } else {
            this.span.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: ${spacing[1]};
                border-radius: ${borderRadius.sm};
                font-family: ${typography.fontFamily.sans};
                font-weight: ${typography.fontWeight.medium};
                white-space: nowrap;
                border-width: 1px;
                border-style: solid;
                ${getSizeStyles(size)}
                ${getVariantStyles(variant)}
            `;
        }
    }
}

export function registerLotosBadge(tagName: string = 'lotos-badge'): void {
    const registry = getCustomElementsRegistry();
    if (registry && !registry.get(tagName)) {
        registry.define(tagName, LotosBadgeElement);
    }
}
