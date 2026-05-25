import React from 'react';
import type { AlertProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const VARIANT_CLASSES: Record<NonNullable<AlertProps['variant']>, string> = {
    info: 'lotos-alert--info border-[color:var(--lotos-info)]/40 bg-[var(--lotos-info)]/10 text-[var(--lotos-info)]',
    success: 'lotos-alert--success border-[color:var(--lotos-success)]/40 bg-[var(--lotos-success)]/10 text-[var(--lotos-success)]',
    warning: 'lotos-alert--warning border-[color:var(--lotos-warning)]/40 bg-[var(--lotos-warning)]/10 text-[var(--lotos-warning)]',
    error: 'lotos-alert--error border-[color:var(--lotos-error)]/40 bg-[var(--lotos-error)]/10 text-[var(--lotos-error)]',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps & { children?: React.ReactNode }>(
    (
        {
            variant = 'info',
            title,
            description,
            icon,
            dismissible = false,
            onDismiss,
            children,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                role="alert"
                style={style}
                className={cn(
                    'lotos-alert rounded-[var(--lotos-radius-lg)] border px-4 py-3',
                    'grid gap-3',
                    VARIANT_CLASSES[variant],
                    className
                )}
                {...rest}
            >
                <div className="flex items-start gap-3">
                    {icon ? (
                        <span className="lotos-alert__icon shrink-0 pt-0.5" aria-hidden="true">{icon}</span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                        {title ? (
                            <div className="lotos-alert__title font-semibold text-[var(--lotos-fg-primary)]">{title}</div>
                        ) : null}
                        {description ? (
                            <p className="lotos-alert__description mt-1 text-sm text-[var(--lotos-fg-secondary)]">{description}</p>
                        ) : null}
                        {children ? (
                            <div className="lotos-alert__body mt-2 text-sm text-[var(--lotos-fg-secondary)]">{children}</div>
                        ) : null}
                    </div>
                    {dismissible ? (
                        <button
                            type="button"
                            className="lotos-alert__dismiss shrink-0 rounded-[var(--lotos-radius-md)] border border-[var(--lotos-border)] px-2 py-1 text-xs font-semibold text-[var(--lotos-fg-secondary)]"
                            onClick={onDismiss}
                            aria-label="Dismiss alert"
                        >
                            Dismiss
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
);

Alert.displayName = 'LotosAlert';
