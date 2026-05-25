import React from 'react';
import type { ToastProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const VARIANT_CLASSES: Record<NonNullable<ToastProps['variant']>, string> = {
    info: 'lotos-toast--info border-[color:var(--lotos-info)]/35 bg-[var(--lotos-info)]/8',
    success: 'lotos-toast--success border-[color:var(--lotos-success)]/35 bg-[var(--lotos-success)]/8',
    warning: 'lotos-toast--warning border-[color:var(--lotos-warning)]/35 bg-[var(--lotos-warning)]/8',
    error: 'lotos-toast--error border-[color:var(--lotos-error)]/35 bg-[var(--lotos-error)]/8',
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    (
        {
            variant = 'info',
            title,
            description,
            dismissible = false,
            onDismiss,
            action,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                role="status"
                className={cn(
                    'lotos-toast rounded-[var(--lotos-radius-xl)] border px-4 py-3 text-left',
                    VARIANT_CLASSES[variant],
                    className
                )}
                style={style}
                {...rest}
            >
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        {title ? <div className="lotos-toast__title text-sm font-semibold text-[var(--lotos-fg-primary)]">{title}</div> : null}
                        {description ? <p className="lotos-toast__description mt-1 text-sm text-[var(--lotos-fg-secondary)]">{description}</p> : null}
                        {action ? <div className="lotos-toast__action mt-3">{action}</div> : null}
                    </div>
                    {dismissible ? (
                        <button
                            type="button"
                            className="lotos-toast__dismiss rounded-[var(--lotos-radius-md)] border border-[var(--lotos-border)] px-2 py-1 text-xs font-semibold text-[var(--lotos-fg-secondary)]"
                            onClick={onDismiss}
                            aria-label="Dismiss toast"
                        >
                            Dismiss
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
);

Toast.displayName = 'LotosToast';
