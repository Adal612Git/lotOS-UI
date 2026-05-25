import React from 'react';
import type { BreadcrumbsProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
    (
        {
            items,
            separator = '/',
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <nav
                ref={ref}
                aria-label="Breadcrumb"
                className={cn('lotos-breadcrumbs', className)}
                style={style}
                {...rest}
            >
                <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--lotos-fg-secondary)]">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1 || item.current;
                        return (
                            <React.Fragment key={`${item.label}-${index}`}>
                                <li className="lotos-breadcrumbs__item">
                                    {item.href && !isLast ? (
                                        <a href={item.href} className="lotos-breadcrumbs__link hover:text-[var(--lotos-fg-primary)]">
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span
                                            aria-current={isLast ? 'page' : undefined}
                                            className={cn(
                                                'lotos-breadcrumbs__label',
                                                isLast && 'font-semibold text-[var(--lotos-fg-primary)]'
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                                {!isLast ? (
                                    <li aria-hidden="true" className="lotos-breadcrumbs__separator text-[var(--lotos-fg-muted)]">
                                        {separator}
                                    </li>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>
        );
    }
);

Breadcrumbs.displayName = 'LotosBreadcrumbs';
