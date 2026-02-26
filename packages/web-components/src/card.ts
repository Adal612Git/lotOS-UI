import { borderRadius, colors, spacing, typography } from '@lotosui/core';
import { getCustomElementsRegistry, LotosHTMLElementBase } from './dom-guards.js';

export type LotosCardPadding = 'none' | 'sm' | 'md' | 'lg';
export type LotosCardShadow = 'none' | 'sm' | 'md' | 'lg';
export type LotosCardBorder = 'none' | 'default' | 'strong';

function normalizePadding(value: string | null): LotosCardPadding {
    switch (value) {
        case 'none':
        case 'sm':
        case 'lg':
            return value;
        default:
            return 'md';
    }
}

function normalizeShadow(value: string | null): LotosCardShadow {
    switch (value) {
        case 'none':
        case 'md':
        case 'lg':
            return value;
        default:
            return 'sm';
    }
}

function normalizeBorder(value: string | null): LotosCardBorder {
    switch (value) {
        case 'none':
        case 'strong':
            return value;
        default:
            return 'default';
    }
}

function getPaddingValue(padding: LotosCardPadding): string {
    switch (padding) {
        case 'none': return '0';
        case 'sm': return spacing[3];
        case 'lg': return spacing[6];
        default: return spacing[4];
    }
}

function getShadowValue(shadow: LotosCardShadow): string {
    switch (shadow) {
        case 'none': return 'none';
        case 'md': return '0 4px 16px rgba(0, 0, 0, 0.30)';
        case 'lg': return '0 8px 32px rgba(0, 0, 0, 0.45)';
        default: return '0 2px 8px rgba(0, 0, 0, 0.20)';
    }
}

function getBorderValue(border: LotosCardBorder): string {
    switch (border) {
        case 'none': return '1px solid transparent';
        case 'strong': return `1px solid ${colors.border.strong}`;
        default: return `1px solid ${colors.border.default}`;
    }
}

export class LotosCardElement extends LotosHTMLElementBase {
    private readonly div: HTMLDivElement;

    static get observedAttributes(): string[] {
        return ['padding', 'shadow', 'border', 'glass', 'interactive'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.div = document.createElement('div');
        this.div.part.add('card');
        this.div.appendChild(document.createElement('slot'));
        shadow.appendChild(this.div);
        this.render();
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(): void {
        this.render();
    }

    private render(): void {
        const padding = normalizePadding(this.getAttribute('padding'));
        const shadow = normalizeShadow(this.getAttribute('shadow'));
        const border = normalizeBorder(this.getAttribute('border'));
        const glass = this.hasAttribute('glass');
        const interactive = this.hasAttribute('interactive');

        const bgValue = glass
            ? 'rgba(255, 255, 255, 0.05)'
            : colors.background.card;

        const backdropFilter = glass ? 'blur(12px)' : 'none';

        this.div.style.cssText = `
            box-sizing: border-box;
            font-family: ${typography.fontFamily.sans};
            background: ${bgValue};
            backdrop-filter: ${backdropFilter};
            border-radius: ${borderRadius.lg};
            border: ${getBorderValue(border)};
            box-shadow: ${getShadowValue(shadow)};
            padding: ${getPaddingValue(padding)};
            transition: transform 150ms ease, box-shadow 150ms ease;
            ${interactive ? 'cursor: pointer;' : ''}
        `;

        if (interactive) {
            this.div.onmouseenter = () => {
                this.div.style.transform = 'translateY(-1px)';
                this.div.style.boxShadow = getShadowValue('md');
            };
            this.div.onmouseleave = () => {
                this.div.style.transform = 'translateY(0)';
                this.div.style.boxShadow = getShadowValue(shadow);
            };
        } else {
            this.div.onmouseenter = null;
            this.div.onmouseleave = null;
        }
    }
}

export function registerLotosCard(tagName: string = 'lotos-card'): void {
    const registry = getCustomElementsRegistry();
    if (registry && !registry.get(tagName)) {
        registry.define(tagName, LotosCardElement);
    }
}
