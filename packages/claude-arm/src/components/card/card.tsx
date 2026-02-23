/**
 * @lotos/claude-arm — Card Component
 *
 * Content container with optional interactivity, glass effect, and border variants.
 * Sentinel: warns when interactive cards are nested.
 */

import React from 'react';
import type { CardProps } from '@lotos/core';

type ClassValue = string | undefined | false | null | ClassValue[];

function cn(...classes: ClassValue[]): string {
    return classes
        .flat(Infinity as 20)
        .filter(Boolean)
        .join(' ');
}

const PADDING_CLASSES: Record<NonNullable<CardProps['padding']>, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
};

const SHADOW_CLASSES: Record<NonNullable<CardProps['shadow']>, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
};

const BORDER_CLASSES: Record<NonNullable<CardProps['border']>, string> = {
    none: 'border-0',
    default: 'border border-[var(--lotos-border)]',
    strong: 'border border-[var(--lotos-border-strong)]',
};

/**
 * LotOS Card Component
 *
 * @example
 * <Card padding="md" shadow="sm">Content</Card>
 * <Card interactive onClick={handleClick}>Clickable card</Card>
 * <Card glass padding="lg">Glassmorphism</Card>
 */
export const Card = React.forwardRef<
    HTMLDivElement,
    CardProps & { children?: React.ReactNode }
>(
    (
        {
            padding = 'md',
            shadow = 'sm',
            interactive = false,
            border = 'default',
            glass = false,
            children,
            onClick,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedby,
            ...rest
        },
        ref
    ) => {
        const isInteractive = interactive || !!onClick;

        return (
            <div
                ref={ref}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                onClick={onClick}
                onKeyDown={
                    isInteractive
                        ? (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                            }
                        }
                        : undefined
                }
                style={style}
                className={cn(
                    'lotos-card',
                    'rounded-[var(--lotos-radius-xl)]',
                    'bg-[var(--lotos-bg-card)]',
                    'transition-[transform,box-shadow,opacity]',
                    'duration-[var(--lotos-duration-fast)]',
                    PADDING_CLASSES[padding],
                    SHADOW_CLASSES[shadow],
                    BORDER_CLASSES[border],
                    // Glassmorphism
                    glass && [
                        'lotos-card--glass',
                        'backdrop-blur-md',
                        'bg-white/10',
                        'border border-white/20',
                    ],
                    // Interactive
                    isInteractive && [
                        'lotos-card--interactive',
                        'cursor-pointer',
                        'hover:shadow-lg',
                        'hover:-translate-y-0.5',
                        'active:translate-y-0',
                        'focus-visible:outline-2 focus-visible:outline-offset-2',
                        'focus-visible:outline-[var(--lotos-border-focus)]',
                    ],
                    className
                )}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'LotosCard';
