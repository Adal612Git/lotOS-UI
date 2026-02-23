/**
 * @lotos/claude-arm — Input Component
 *
 * Accessible text input with label, helper text, error state, and adornments.
 * WCAG 2.2 AAA: label is mandatory. Use error prop for validation messages.
 * Sentinel: warns if label is missing (critical a11y violation).
 */

import React, { useId } from 'react';
import type { InputProps } from '@lotos/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const SIZE_CLASSES: Record<NonNullable<InputProps['size']>, string> = {
    sm: 'h-8  text-sm  px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg  px-4',
};

/**
 * LotOS Input Component
 *
 * @example
 * <Input type="email" label="Email address" placeholder="you@example.com" required />
 * <Input type="password" label="Password" required />
 * <Input type="email" label="Email" error="Invalid email address" />
 */
export const Input = React.forwardRef<
    HTMLInputElement,
    InputProps & { id?: string }
>(
    (
        {
            type = 'text',
            value,
            defaultValue,
            placeholder,
            label,
            helperText,
            error,
            required = false,
            disabled = false,
            readOnly = false,
            startAdornment,
            endAdornment,
            size = 'md',
            onChange,
            id: externalId,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': externalDescribedby,
            ...rest
        },
        ref
    ) => {
        // Generate stable IDs for ARIA
        const autoId = useId();
        const inputId = externalId ?? `lotos-input-${autoId}`;
        const errorId = error ? `${inputId}-error` : undefined;
        const helperId = helperText ? `${inputId}-helper` : undefined;

        // Sentinel: label is required for accessibility
        if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
            console.warn(
                '[LotOS Sentinel] Input: ALWAYS provide a `label` or `aria-label` prop. ' +
                'Unlabeled inputs fail WCAG 2.2 at all levels.'
            );
        }

        const describedby = [externalDescribedby, errorId, helperId]
            .filter(Boolean)
            .join(' ') || undefined;

        const hasError = !!error;

        return (
            <div className={cn('lotos-input-root flex flex-col gap-1.5', className)} style={style}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'lotos-input__label',
                            'text-sm font-medium leading-none',
                            'text-[var(--lotos-fg-primary)]',
                            disabled && 'opacity-50'
                        )}
                    >
                        {label}
                        {required && (
                            <span aria-hidden="true" className="text-[var(--lotos-error)] ml-1">*</span>
                        )}
                    </label>
                )}

                {/* Input wrapper (for adornments) */}
                <div className={cn(
                    'lotos-input__wrapper',
                    'relative flex items-center',
                    'rounded-[var(--lotos-radius-lg)]',
                    'border',
                    hasError
                        ? 'border-[var(--lotos-error)]'
                        : 'border-[var(--lotos-border)] focus-within:border-[var(--lotos-border-focus)]',
                    'bg-[var(--lotos-bg-secondary)]',
                    'transition-[border-color,box-shadow]',
                    'duration-[var(--lotos-duration-fast)]',
                    'focus-within:ring-1 focus-within:ring-[var(--lotos-border-focus)]',
                    disabled && 'opacity-50 cursor-not-allowed',
                )}>
                    {/* Start adornment */}
                    {startAdornment && (
                        <span
                            aria-hidden="true"
                            className={cn(
                                'lotos-input__adornment lotos-input__adornment--start',
                                'flex items-center pl-3 text-[var(--lotos-fg-muted)] shrink-0'
                            )}
                        >
                            {startAdornment}
                        </span>
                    )}

                    {/* The actual input */}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        value={value}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        aria-invalid={hasError || undefined}
                        aria-describedby={describedby}
                        aria-label={!label ? ariaLabel : undefined}
                        aria-required={required || undefined}
                        onChange={onChange}
                        className={cn(
                            'lotos-input__field',
                            'flex-1 min-w-0 bg-transparent outline-none',
                            'text-[var(--lotos-fg-primary)]',
                            'placeholder:text-[var(--lotos-fg-muted)]',
                            SIZE_CLASSES[size],
                            startAdornment && 'pl-1',
                            endAdornment && 'pr-1',
                            disabled && 'cursor-not-allowed',
                        )}
                        {...rest}
                    />

                    {/* End adornment */}
                    {endAdornment && (
                        <span
                            aria-hidden="true"
                            className={cn(
                                'lotos-input__adornment lotos-input__adornment--end',
                                'flex items-center pr-3 text-[var(--lotos-fg-muted)] shrink-0'
                            )}
                        >
                            {endAdornment}
                        </span>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p
                        id={errorId}
                        role="alert"
                        className="lotos-input__error text-xs text-[var(--lotos-error)] flex items-center gap-1"
                    >
                        <span aria-hidden="true">⚠</span>
                        {error}
                    </p>
                )}

                {/* Helper text */}
                {helperText && !error && (
                    <p
                        id={helperId}
                        className="lotos-input__helper text-xs text-[var(--lotos-fg-muted)]"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'LotosInput';
