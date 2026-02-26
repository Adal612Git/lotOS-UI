import { borderRadius, colors, spacing, typography } from '@lotosui/core';
import { getCustomElementsRegistry, LotosHTMLElementBase } from './dom-guards.js';

export type LotosInputSize = 'sm' | 'md' | 'lg';

function normalizeSize(value: string | null): LotosInputSize {
    switch (value) {
        case 'sm':
        case 'lg':
            return value;
        default:
            return 'md';
    }
}

function normalizeType(value: string | null): string {
    switch (value) {
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'url':
        case 'search':
        case 'date':
        case 'time':
            return value;
        default:
            return 'text';
    }
}

function getInputSizeStyles(size: LotosInputSize): string {
    switch (size) {
        case 'sm':
            return `
                min-height: 34px;
                font-size: ${typography.fontSize.sm};
                padding: 0 ${spacing[3]};
            `;
        case 'lg':
            return `
                min-height: 46px;
                font-size: ${typography.fontSize.lg};
                padding: 0 ${spacing[4]};
            `;
        default:
            return `
                min-height: 40px;
                font-size: ${typography.fontSize.base};
                padding: 0 ${spacing[3.5]};
            `;
    }
}

export class LotosInputElement extends LotosHTMLElementBase {
    private readonly wrapper: HTMLDivElement;

    private readonly labelElement: HTMLLabelElement;

    private readonly inputElement: HTMLInputElement;

    private readonly helperElement: HTMLParagraphElement;

    static get observedAttributes(): string[] {
        return [
            'type',
            'value',
            'placeholder',
            'label',
            'helper-text',
            'error',
            'required',
            'disabled',
            'readonly',
            'size',
            'name',
            'id',
        ];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        this.wrapper = document.createElement('div');
        this.labelElement = document.createElement('label');
        this.inputElement = document.createElement('input');
        this.helperElement = document.createElement('p');

        this.wrapper.append(this.labelElement, this.inputElement, this.helperElement);
        shadow.appendChild(this.wrapper);

        this.inputElement.addEventListener('input', () => {
            const nextValue = this.inputElement.value;
            if (this.getAttribute('value') !== nextValue) {
                this.setAttribute('value', nextValue);
            }
            this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        });

        this.inputElement.addEventListener('change', () => {
            const nextValue = this.inputElement.value;
            if (this.getAttribute('value') !== nextValue) {
                this.setAttribute('value', nextValue);
            }
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });

        this.render();
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(): void {
        this.render();
    }

    private render(): void {
        const size = normalizeSize(this.getAttribute('size'));
        const type = normalizeType(this.getAttribute('type'));
        const label = this.getAttribute('label');
        const helperText = this.getAttribute('helper-text');
        const error = this.getAttribute('error');
        const value = this.getAttribute('value') ?? '';
        const placeholder = this.getAttribute('placeholder') ?? '';
        const inputName = this.getAttribute('name');
        const inputId = this.getAttribute('id');
        const isDisabled = this.hasAttribute('disabled');
        const isReadOnly = this.hasAttribute('readonly');
        const isRequired = this.hasAttribute('required');
        const message = error ?? helperText ?? '';
        const helperColor = error ? colors.status.error : colors.foreground.muted;

        this.wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: ${spacing[1.5]};
            width: 100%;
            font-family: ${typography.fontFamily.sans};
        `;

        this.labelElement.style.cssText = `
            display: ${label ? 'inline-flex' : 'none'};
            align-items: center;
            gap: ${spacing[1]};
            color: ${colors.foreground.secondary};
            font-size: ${typography.fontSize.sm};
            font-weight: ${typography.fontWeight.medium};
            line-height: ${typography.lineHeight.normal};
        `;
        this.labelElement.textContent = label ?? '';

        this.inputElement.type = type;
        this.inputElement.disabled = isDisabled;
        this.inputElement.readOnly = isReadOnly;
        this.inputElement.required = isRequired;
        this.inputElement.placeholder = placeholder;
        this.inputElement.name = inputName ?? '';
        this.inputElement.id = inputId ?? '';
        this.inputElement.ariaInvalid = error ? 'true' : 'false';

        if (this.inputElement.value !== value) {
            this.inputElement.value = value;
        }

        this.inputElement.style.cssText = `
            all: unset;
            box-sizing: border-box;
            width: 100%;
            border: 1px solid ${error ? colors.status.error : colors.border.default};
            border-radius: ${borderRadius.md};
            background: ${colors.background.card};
            color: ${colors.foreground.primary};
            font-family: ${typography.fontFamily.sans};
            line-height: ${typography.lineHeight.normal};
            transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
            ${getInputSizeStyles(size)}
        `;

        if (!isDisabled) {
            this.inputElement.onfocus = () => {
                this.inputElement.style.borderColor = error ? colors.status.error : colors.border.focus;
                this.inputElement.style.boxShadow = error
                    ? '0 0 0 3px rgba(239, 68, 68, 0.25)'
                    : '0 0 0 3px rgba(56, 189, 248, 0.24)';
            };
            this.inputElement.onblur = () => {
                this.inputElement.style.borderColor = error ? colors.status.error : colors.border.default;
                this.inputElement.style.boxShadow = 'none';
            };
        } else {
            this.inputElement.style.cursor = 'not-allowed';
            this.inputElement.style.opacity = '0.72';
            this.inputElement.style.background = colors.background.secondary;
            this.inputElement.onfocus = null;
            this.inputElement.onblur = null;
        }

        this.helperElement.style.cssText = `
            display: ${message ? 'block' : 'none'};
            margin: 0;
            color: ${helperColor};
            font-size: ${typography.fontSize.xs};
            line-height: ${typography.lineHeight.normal};
        `;
        this.helperElement.textContent = message;
    }
}

export function registerLotosInput(tagName: string = 'lotos-input'): void {
    const registry = getCustomElementsRegistry();
    if (registry && !registry.get(tagName)) {
        registry.define(tagName, LotosInputElement);
    }
}
