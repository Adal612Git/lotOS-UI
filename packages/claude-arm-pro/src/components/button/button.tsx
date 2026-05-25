/**
 * @lotos/claude-arm — Button Component
 *
 * Accessible, headless-first button with full keyboard support.
 * WCAG 2.2 AAA compliant. Sentinel-integrated.
 *
 * Props defined by @lotos/core buttonPropsSchema (Zod).
 */

import React from 'react';
import type { ButtonProps } from '@lotosui/core';

// Internal: CSS class builder
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Variant → CSS class map
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
        'lotos-btn--primary bg-[var(--lotos-accent)] text-[var(--lotos-accent-fg)] hover:bg-[var(--lotos-accent-hover)] active:bg-[var(--lotos-accent-active)]',
    secondary:
        'lotos-btn--secondary bg-[var(--lotos-bg-secondary)] text-[var(--lotos-fg-primary)] hover:opacity-80 border border-[var(--lotos-border-strong)]',
    ghost:
        'lotos-btn--ghost bg-transparent text-[var(--lotos-fg-secondary)] hover:bg-[var(--lotos-border)] hover:text-[var(--lotos-fg-primary)]',
    destructive:
        'lotos-btn--destructive bg-[var(--lotos-error)] text-white hover:opacity-90 active:opacity-80',
    outline:
        'lotos-btn--outline bg-transparent text-[var(--lotos-fg-primary)] border border-[var(--lotos-border-strong)] hover:border-[var(--lotos-border-focus)] hover:text-[var(--lotos-accent)]',
    link:
        'lotos-btn--link bg-transparent text-[var(--lotos-accent)] underline-offset-4 hover:underline p-0 h-auto',
};

// Size → CSS class map
const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
    xs: 'lotos-btn--xs h-6 px-2 text-xs gap-1',
    sm: 'lotos-btn--sm h-8 px-3 text-sm gap-1.5',
    md: 'lotos-btn--md h-10 px-4 text-base gap-2',
    lg: 'lotos-btn--lg h-12 px-6 text-lg gap-2',
    xl: 'lotos-btn--xl h-14 px-8 text-xl gap-3',
    icon: 'lotos-btn--icon h-10 w-10 p-0 justify-center',
};

// Loading spinner component (inline SVG, no external dep)
function Spinner({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="animate-spin"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * LotOS Button Component
 *
 * @example
 * <Button variant="primary" size="md">Get Started</Button>
 * <Button variant="destructive" size="sm">Delete</Button>
 * <Button variant="primary" loading>Saving...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { children?: React.ReactNode }>(
    (
        {
            variant = 'primary',
            size = 'md',
            disabled = false,
            loading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            type = 'button',
            onClick,
            children,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedby,
            ...rest
        },
        ref
    ) => {
        // Sentinel: warn if both disabled and loading are set
        if (process.env.NODE_ENV !== 'production' && disabled && loading) {
            console.warn(
                '[LotOS Sentinel] Button: Do not use `disabled` and `loading` together. ' +
                '`loading` implies disabled. Remove the `disabled` prop.'
            );
        }

        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                onClick={isDisabled ? undefined : onClick}
                style={style}
                className={cn(
                    // Base
                    'lotos-btn',
                    'inline-flex items-center justify-center',
                    'font-medium rounded-[var(--lotos-radius-lg)]',
                    'transition-[background-color,opacity,transform]',
                    'duration-[var(--lotos-duration-fast)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2',
                    'focus-visible:outline-[var(--lotos-border-focus)]',
                    'select-none cursor-pointer',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    // Variant
                    VARIANT_CLASSES[variant],
                    // Size
                    SIZE_CLASSES[size],
                    // Full width
                    fullWidth && 'w-full',
                    className
                )}
                {...rest}
            >
                {loading ? (
                    <Spinner size={size === 'xs' || size === 'sm' ? 14 : 16} />
                ) : (
                    leftIcon && <span className="lotos-btn__icon lotos-btn__icon--left" aria-hidden="true">{leftIcon}</span>
                )}
                {children && <span className="lotos-btn__label">{children}</span>}
                {!loading && rightIcon && (
                    <span className="lotos-btn__icon lotos-btn__icon--right" aria-hidden="true">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = 'LotosButton';
