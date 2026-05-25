/**
 * @lotos/claude-arm — Badge Component
 *
 * Status indicator. Supports dot mode (status only) and text mode.
 * WCAG 2.2 AAA: dot badges require aria-label for screen readers.
 */

import React from 'react';
import type { BadgeProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
    default:
        'lotos-badge--default bg-[var(--lotos-border)] text-[var(--lotos-fg-secondary)]',
    success:
        'lotos-badge--success bg-[var(--lotos-success)]/20 text-[var(--lotos-success)]',
    warning:
        'lotos-badge--warning bg-[var(--lotos-warning)]/20 text-[var(--lotos-warning)]',
    error:
        'lotos-badge--error bg-[var(--lotos-error)]/20 text-[var(--lotos-error)]',
    info:
        'lotos-badge--info bg-[var(--lotos-info)]/20 text-[var(--lotos-info)]',
    outline:
        'lotos-badge--outline border border-[var(--lotos-border-strong)] text-[var(--lotos-fg-secondary)] bg-transparent',
};

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'lotos-badge--sm text-xs px-1.5 py-0.5 gap-1',
    md: 'lotos-badge--md text-xs px-2.5 py-1 gap-1.5',
    lg: 'lotos-badge--lg text-sm px-3 py-1.5 gap-2',
};

const DOT_COLORS: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-[var(--lotos-fg-muted)]',
    success: 'bg-[var(--lotos-success)]',
    warning: 'bg-[var(--lotos-warning)]',
    error: 'bg-[var(--lotos-error)]',
    info: 'bg-[var(--lotos-info)]',
    outline: 'bg-[var(--lotos-fg-muted)]',
};

/**
 * LotOS Badge Component
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Failed</Badge>
 * <Badge variant="outline" size="sm">Beta</Badge>
 * <Badge variant="success" dot aria-label="Online" />
 */
export const Badge = React.forwardRef<
    HTMLSpanElement,
    BadgeProps & { children?: React.ReactNode }
>(
    (
        {
            variant = 'default',
            size = 'md',
            dot = false,
            children,
            className,
            style,
            'aria-label': ariaLabel,
            ...rest
        },
        ref
    ) => {
        // Sentinel: dot badges without children need aria-label
        if (process.env.NODE_ENV !== 'production' && dot && !ariaLabel && !children) {
            console.warn(
                '[LotOS Sentinel] Badge: Dot badges without text content MUST have an ' +
                '`aria-label` describing the status for screen reader users.'
            );
        }

        return (
            <span
                ref={ref}
                aria-label={ariaLabel}
                style={style}
                className={cn(
                    'lotos-badge',
                    'inline-flex items-center',
                    'font-medium rounded-[var(--lotos-radius-full)]',
                    'leading-none whitespace-nowrap',
                    VARIANT_CLASSES[variant],
                    SIZE_CLASSES[size],
                    dot && 'lotos-badge--dot',
                    className
                )}
                {...rest}
            >
                {dot && (
                    <span
                        aria-hidden="true"
                        className={cn(
                            'lotos-badge__dot',
                            'block rounded-full shrink-0',
                            size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5',
                            DOT_COLORS[variant]
                        )}
                    />
                )}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'LotosBadge';
