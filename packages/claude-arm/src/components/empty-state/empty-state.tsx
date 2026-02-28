import React from 'react';
import type { EmptyStateProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    (
        {
            title,
            description,
            icon,
            actions,
            compact = false,
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
                    'lotos-empty-state rounded-[var(--lotos-radius-xl)] border border-[var(--lotos-border)] bg-[var(--lotos-bg-card)] text-center',
                    compact ? 'px-5 py-6' : 'px-6 py-8',
                    className
                )}
                style={style}
                {...rest}
            >
                {icon ? <div className="lotos-empty-state__icon mx-auto mb-3">{icon}</div> : null}
                {title ? <h3 className="lotos-empty-state__title text-base font-semibold text-[var(--lotos-fg-primary)]">{title}</h3> : null}
                {description ? (
                    <p className="lotos-empty-state__description mx-auto mt-2 max-w-[32rem] text-sm text-[var(--lotos-fg-secondary)]">
                        {description}
                    </p>
                ) : null}
                {actions ? <div className="lotos-empty-state__actions mt-4 flex items-center justify-center gap-3">{actions}</div> : null}
            </section>
        );
    }
);

EmptyState.displayName = 'LotosEmptyState';
