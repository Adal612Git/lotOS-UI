import React from 'react';
import type { SpinnerProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps['size']>, string> = {
    sm: 'lotos-spinner--sm h-4 w-4 border-2',
    md: 'lotos-spinner--md h-6 w-6 border-2',
    lg: 'lotos-spinner--lg h-9 w-9 border-[3px]',
};

const TONE_CLASSES: Record<NonNullable<SpinnerProps['tone']>, string> = {
    neutral: 'border-[var(--lotos-border)] border-t-[var(--lotos-fg-muted)]',
    info: 'border-[var(--lotos-info)]/20 border-t-[var(--lotos-info)]',
    success: 'border-[var(--lotos-success)]/20 border-t-[var(--lotos-success)]',
};

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
    (
        {
            size = 'md',
            label = 'Loading',
            tone = 'neutral',
            className,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <span
                ref={ref}
                role="status"
                aria-label={label}
                className={cn('lotos-spinner inline-flex items-center justify-center', className)}
                style={style}
                {...rest}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        'lotos-spinner__glyph inline-block animate-spin rounded-full border-solid',
                        SIZE_CLASSES[size],
                        TONE_CLASSES[tone]
                    )}
                />
            </span>
        );
    }
);

Spinner.displayName = 'LotosSpinner';
