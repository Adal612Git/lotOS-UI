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
export interface SwitchProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
    {
        label,
        description,
        size = 'md',
        id: idProp,
        disabled,
        className,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const id = idProp ?? `lotos-switch-${generatedId}`;
    const descId = `${id}-desc`;

    if (!label && !props['aria-label']) {
        warn(
            `<Switch> is missing a label or aria-label. Every switch must have an accessible name for screen readers.`,
        );
    }

    const sizeClasses = {
        sm: 'lotos-switch--sm',
        md: 'lotos-switch--md',
        lg: 'lotos-switch--lg',
    };

    return (
        <div className={cn('lotos-switch-root', sizeClasses[size], disabled && 'lotos-switch-root--disabled', className)}>
            <div className="lotos-switch-wrapper">
                <input
                    ref={ref}
                    type="checkbox"
                    role="switch"
                    id={id}
                    disabled={disabled}
                    aria-describedby={description ? descId : undefined}
                    className="lotos-switch__input"
                    {...props}
                />
                {/* Track + thumb */}
                <label htmlFor={id} className="lotos-switch__track" aria-hidden="true">
                    <span className="lotos-switch__thumb" />
                </label>
                {label && (
                    <label htmlFor={id} className="lotos-switch__label">
                        {label}
                    </label>
                )}
            </div>
            {description && (
                <span id={descId} className="lotos-field__helper">
                    {description}
                </span>
            )}
        </div>
    );
});
