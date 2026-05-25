import React from 'react';
import type { ProgressProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const VARIANT_BAR_CLASSES: Record<NonNullable<ProgressProps['variant']>, string> = {
    info: 'lotos-progress__bar--info bg-[var(--lotos-info)]',
    success: 'lotos-progress__bar--success bg-[var(--lotos-success)]',
    warning: 'lotos-progress__bar--warning bg-[var(--lotos-warning)]',
    error: 'lotos-progress__bar--error bg-[var(--lotos-error)]',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            value,
            max = 100,
            variant = 'info',
            showLabel = true,
            label,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        const normalized = Math.max(0, Math.min(value, max));
        const percent = max <= 0 ? 0 : Math.round((normalized / max) * 100);
        const accessibleLabel = label ?? `Progress ${percent}%`;

        return (
            <div
                ref={ref}
                className={cn('lotos-progress grid gap-2', className)}
                style={style}
                {...rest}
            >
                {showLabel ? (
                    <div className="flex items-center justify-between gap-3">
                        <span className="lotos-progress__label text-sm font-medium text-[var(--lotos-fg-secondary)]">{accessibleLabel}</span>
                        <span className="lotos-progress__value text-xs font-semibold text-[var(--lotos-fg-muted)]">{percent}%</span>
                    </div>
                ) : null}
                <div
                    role="progressbar"
                    aria-label={accessibleLabel}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-valuenow={normalized}
                    className="lotos-progress__track h-2.5 overflow-hidden rounded-[var(--lotos-radius-full)] bg-[var(--lotos-surface-2)]"
                >
                    <div
                        className={cn(
                            'lotos-progress__bar h-full rounded-[var(--lotos-radius-full)] transition-[width] duration-300 ease-out',
                            VARIANT_BAR_CLASSES[variant]
                        )}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        );
    }
);

Progress.displayName = 'LotosProgress';
