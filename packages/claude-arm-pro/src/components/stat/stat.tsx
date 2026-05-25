import React from 'react';
import type { StatProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const TONE_CLASSES: Record<NonNullable<StatProps['tone']>, string> = {
    neutral: 'lotos-stat--neutral border-[var(--lotos-border)]',
    success: 'lotos-stat--success border-[color:var(--lotos-success)]/35',
    warning: 'lotos-stat--warning border-[color:var(--lotos-warning)]/35',
    danger: 'lotos-stat--danger border-[color:var(--lotos-error)]/35',
    info: 'lotos-stat--info border-[color:var(--lotos-info)]/35',
};

const CHANGE_TONE_CLASSES: Record<NonNullable<StatProps['tone']>, string> = {
    neutral: 'text-[var(--lotos-fg-muted)]',
    success: 'text-[var(--lotos-success)]',
    warning: 'text-[var(--lotos-warning)]',
    danger: 'text-[var(--lotos-error)]',
    info: 'text-[var(--lotos-info)]',
};

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
    (
        {
            label,
            value,
            change,
            helperText,
            tone = 'neutral',
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <section
                ref={ref}
                className={cn(
                    'lotos-stat rounded-[var(--lotos-radius-xl)] border bg-[var(--lotos-bg-card)] px-4 py-4',
                    TONE_CLASSES[tone],
                    className
                )}
                style={style}
                {...rest}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="lotos-stat__label text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lotos-fg-muted)]">{label}</div>
                        <div className="lotos-stat__value mt-2 text-2xl font-semibold text-[var(--lotos-fg-primary)]">{value}</div>
                    </div>
                    {change ? (
                        <span className={cn('lotos-stat__change text-sm font-semibold', CHANGE_TONE_CLASSES[tone])}>
                            {change}
                        </span>
                    ) : null}
                </div>
                {helperText ? (
                    <p className="lotos-stat__helper mt-3 text-sm text-[var(--lotos-fg-secondary)]">{helperText}</p>
                ) : null}
            </section>
        );
    }
);

Stat.displayName = 'LotosStat';
