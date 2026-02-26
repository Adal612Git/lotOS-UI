import { borderRadius, colors, spacing, typography } from '@lotosui/core';
import { getCustomElementsRegistry, LotosHTMLElementBase } from './dom-guards.js';

export type LotosButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type LotosButtonSize = 'sm' | 'md' | 'lg';

function normalizeVariant(value: string | null): LotosButtonVariant {
    switch (value) {
        case 'secondary':
        case 'ghost':
        case 'destructive':
        case 'outline':
            return value;
        default:
            return 'primary';
    }
}

function normalizeSize(value: string | null): LotosButtonSize {
    switch (value) {
        case 'sm':
        case 'lg':
            return value;
        default:
            return 'md';
    }
}

function getVariantStyles(variant: LotosButtonVariant): string {
    switch (variant) {
        case 'secondary':
            return `
                color: ${colors.foreground.primary};
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
            `;
        case 'ghost':
            return `
                color: ${colors.foreground.primary};
                background: transparent;
                border-color: transparent;
            `;
        case 'destructive':
            return `
                color: ${colors.accent.foreground};
                background: ${colors.status.error};
                border-color: ${colors.status.error};
            `;
        case 'outline':
            return `
                color: ${colors.foreground.primary};
                background: transparent;
                border-color: ${colors.border.strong};
            `;
        default:
            return `
                color: ${colors.accent.foreground};
                background: ${colors.accent.primary};
                border-color: ${colors.accent.primary};
            `;
    }
}

function getSizeStyles(size: LotosButtonSize): string {
    switch (size) {
        case 'sm':
            return `
                padding: ${spacing[2]} ${spacing[3]};
                font-size: ${typography.fontSize.sm};
                min-height: 32px;
            `;
        case 'lg':
            return `
                padding: ${spacing[3]} ${spacing[6]};
                font-size: ${typography.fontSize.lg};
                min-height: 44px;
            `;
        default:
            return `
                padding: ${spacing[2.5]} ${spacing[5]};
                font-size: ${typography.fontSize.base};
                min-height: 38px;
            `;
    }
}

export class LotosButtonElement extends LotosHTMLElementBase {
    private readonly button: HTMLButtonElement;

    static get observedAttributes(): string[] {
        return ['variant', 'size', 'disabled', 'full-width', 'type'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.button = document.createElement('button');
        this.button.part.add('button');
        this.button.appendChild(document.createElement('slot'));
        shadow.appendChild(this.button);
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
        const disabled = this.hasAttribute('disabled');
        const fullWidth = this.hasAttribute('full-width');
        const type = this.getAttribute('type') ?? 'button';

        this.button.type = type === 'submit' || type === 'reset' ? type : 'button';
        this.button.disabled = disabled;
        this.button.style.cssText = `
            all: unset;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${fullWidth ? '100%' : 'auto'};
            gap: ${spacing[2]};
            font-family: ${typography.fontFamily.sans};
            font-weight: ${typography.fontWeight.semibold};
            border-radius: ${borderRadius.md};
            border-width: 1px;
            border-style: solid;
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            opacity: ${disabled ? '0.58' : '1'};
            transition: transform 120ms ease, filter 120ms ease, background-color 120ms ease;
            ${getSizeStyles(size)}
            ${getVariantStyles(variant)}
        `;

        if (!disabled) {
            this.button.onmouseenter = () => {
                this.button.style.filter = 'brightness(1.06)';
            };
            this.button.onmouseleave = () => {
                this.button.style.filter = 'none';
            };
            this.button.onmousedown = () => {
                this.button.style.transform = 'translateY(1px)';
            };
            this.button.onmouseup = () => {
                this.button.style.transform = 'translateY(0)';
            };
        } else {
            this.button.onmouseenter = null;
            this.button.onmouseleave = null;
            this.button.onmousedown = null;
            this.button.onmouseup = null;
        }
    }
}

export function registerLotosButton(tagName: string = 'lotos-button'): void {
    const registry = getCustomElementsRegistry();
    if (registry && !registry.get(tagName)) {
        registry.define(tagName, LotosButtonElement);
    }
}
