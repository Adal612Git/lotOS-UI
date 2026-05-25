import React, { useId, forwardRef } from 'react';

// ─── Sentinel ────────────────────────────────────────────────────────────────
function warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[LotOS Sentinel] ${msg}`);
    }
}
// ─── Utils ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    {
        label,
        options,
        placeholder,
        error,
        helperText,
        size = 'md',
        id: idProp,
        required,
        disabled,
        className,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const id = idProp ?? `lotos-select-${generatedId}`;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    if (!label && !props['aria-label']) {
        warn(
            `<Select> is missing a label or aria-label. Every select must have an accessible label.`,
        );
    }

    const sizeClasses = {
        sm: 'lotos-select--sm',
        md: 'lotos-select--md',
        lg: 'lotos-select--lg',
    };

    const describedBy = [error ? errorId : null, helperText && !error ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className={cn('lotos-field', className)}>
            {label && (
                <label className="lotos-field__label" htmlFor={id}>
                    {label}
                    {required && (
                        <span className="lotos-field__required" aria-hidden="true"> *</span>
                    )}
                </label>
            )}
            <div className="lotos-select-wrapper">
                <select
                    ref={ref}
                    id={id}
                    required={required}
                    disabled={disabled}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    aria-required={required}
                    className={cn(
                        'lotos-select',
                        sizeClasses[size],
                        error && 'lotos-select--error',
                        disabled && 'lotos-select--disabled',
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Custom chevron arrow */}
                <span className="lotos-select-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
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
        </div>
    );
});
