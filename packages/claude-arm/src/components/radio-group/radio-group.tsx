import React, { useId, forwardRef, useRef, useCallback } from 'react';

// ─── Sentinel ─────────────────────────────────────────────────────────────────
function warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[LotOS Sentinel] ${msg}`);
    }
}
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    /** Group legend (visible label for the fieldset) */
    label: string;
    /** Radio options */
    options: RadioOption[];
    /** Controlled value */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Layout direction */
    orientation?: 'vertical' | 'horizontal';
    /** Size */
    size?: 'sm' | 'md' | 'lg';
    /** Name attribute (auto-generated if omitted) */
    name?: string;
    /** Disabled group */
    disabled?: boolean;
    /** Additional class */
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RadioGroup({
    label,
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    error,
    helperText,
    orientation = 'vertical',
    size = 'md',
    name: nameProp,
    disabled,
    className,
}: RadioGroupProps) {
    const generatedId = useId();
    const groupName = nameProp ?? `lotos-radio-${generatedId}`;
    const errorId = `${groupName}-error`;
    const helperId = `${groupName}-helper`;

    if (!label) {
        warn(
            `<RadioGroup> is missing a label. Every radio group must have a visible legend for accessibility.`,
        );
    }

    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : internalValue;

    const groupRef = useRef<HTMLFieldSetElement>(null);

    const handleChange = useCallback(
        (val: string) => {
            if (!isControlled) setInternalValue(val);
            onChange?.(val);
        },
        [isControlled, onChange],
    );

    // Arrow key navigation within the group
    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        const enabledOptions = options.filter((o) => !o.disabled && !disabled);
        const count = enabledOptions.length;
        if (count === 0) return;

        let nextIndex = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % count;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + count) % count;
        }

        if (nextIndex >= 0) {
            const nextOption = enabledOptions[nextIndex];
            if (!nextOption) return;
            handleChange(nextOption.value);
            // Focus the next radio
            const inputs = groupRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)');
            inputs?.[nextIndex]?.focus();
        }
    };

    const sizeClasses = {
        sm: 'lotos-radio-group--sm',
        md: 'lotos-radio-group--md',
        lg: 'lotos-radio-group--lg',
    };

    return (
        <fieldset
            ref={groupRef}
            className={cn(
                'lotos-radio-group',
                sizeClasses[size],
                `lotos-radio-group--${orientation}`,
                disabled && 'lotos-radio-group--disabled',
                className,
            )}
            aria-describedby={[error ? errorId : null, helperText && !error ? helperId : null].filter(Boolean).join(' ') || undefined}
            aria-invalid={error ? 'true' : undefined}
            disabled={disabled}
        >
            <legend className="lotos-radio-group__legend">{label}</legend>

            <div className="lotos-radio-group__options">
                {options.map((option, idx) => {
                    const optId = `${groupName}-${option.value}`;
                    const isChecked = selectedValue === option.value;
                    const isDisabled = disabled || option.disabled;
                    const enabledOptions = options.filter((o) => !o.disabled && !disabled);
                    const enabledIdx = enabledOptions.indexOf(option);

                    return (
                        <label
                            key={option.value}
                            htmlFor={optId}
                            className={cn(
                                'lotos-radio__item',
                                isChecked && 'lotos-radio__item--checked',
                                isDisabled && 'lotos-radio__item--disabled',
                            )}
                        >
                            <input
                                type="radio"
                                id={optId}
                                name={groupName}
                                value={option.value}
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={() => handleChange(option.value)}
                                onKeyDown={(e) => enabledIdx >= 0 && handleKeyDown(e, enabledIdx)}
                                className="lotos-radio__input"
                                aria-describedby={option.description ? `${optId}-desc` : undefined}
                            />
                            {/* Custom radio visual */}
                            <span className="lotos-radio__circle" aria-hidden="true">
                                <span className="lotos-radio__dot" />
                            </span>
                            <span className="lotos-radio__label-wrapper">
                                <span className="lotos-radio__label">{option.label}</span>
                                {option.description && (
                                    <span id={`${optId}-desc`} className="lotos-radio__description">
                                        {option.description}
                                    </span>
                                )}
                            </span>
                        </label>
                    );
                })}
            </div>

            {error && (
                <span id={errorId} className="lotos-field__error" role="alert">
                    {error}
                </span>
            )}
            {helperText && !error && (
                <span id={helperId} className="lotos-field__helper">
                    {helperText}
                </span>
            )}
        </fieldset>
    );
}
