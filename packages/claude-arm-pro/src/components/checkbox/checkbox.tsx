import React, { useId, forwardRef } from 'react';

// ─── Sentinel ────────────────────────────────────────────────────────────────
function warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[LotOS Sentinel] ${msg}`);
    }
}
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    description?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    indeterminate?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
        label,
        description,
        error,
        size = 'md',
        indeterminate,
        id: idProp,
        disabled,
        className,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const id = idProp ?? `lotos-checkbox-${generatedId}`;
    const descId = `${id}-desc`;
    const errorId = `${id}-error`;

    if (!label && !props['aria-label']) {
        warn(
            `<Checkbox> is missing a label or aria-label. Every checkbox must have an accessible name.`,
        );
    }

    // Handle indeterminate state
    const checkboxRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            if (node) {
                node.indeterminate = indeterminate ?? false;
            }
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        },
        [indeterminate, ref],
    );

    const sizeClasses = {
        sm: 'lotos-checkbox--sm',
        md: 'lotos-checkbox--md',
        lg: 'lotos-checkbox--lg',
    };

    return (
        <div className={cn('lotos-checkbox-root', sizeClasses[size], disabled && 'lotos-checkbox-root--disabled', className)}>
            <div className="lotos-checkbox-wrapper">
                <input
                    ref={checkboxRef}
                    type="checkbox"
                    id={id}
                    disabled={disabled}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={[description ? descId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
                    className="lotos-checkbox__input"
                    {...props}
                />
                {/* Custom checkbox visual */}
                <span className="lotos-checkbox__box" aria-hidden="true">
                    {/* Checkmark */}
                    <svg className="lotos-checkbox__checkmark" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {/* Indeterminate dash */}
                    <span className="lotos-checkbox__indeterminate" />
                </span>
                {label && (
                    <label htmlFor={id} className="lotos-checkbox__label">
                        {label}
                    </label>
                )}
            </div>
            {description && !error && (
                <span id={descId} className="lotos-field__helper">
                    {description}
                </span>
            )}
            {error && (
                <span id={errorId} className="lotos-field__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
});
