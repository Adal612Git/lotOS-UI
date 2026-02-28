import React from 'react';
import type { SkeletonProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            width,
            height,
            shape = 'line',
            animated = true,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        const mergedStyle: React.CSSProperties = {
            width: width ?? (shape === 'circle' ? '2.5rem' : '100%'),
            height: height ?? (shape === 'line' ? '0.875rem' : '5rem'),
            ...style,
        };

        return (
            <div
                ref={ref}
                aria-hidden="true"
                className={cn(
                    'lotos-skeleton block bg-[var(--lotos-surface-2)]',
                    shape === 'circle' ? 'rounded-full' : 'rounded-[var(--lotos-radius-md)]',
                    animated && 'lotos-skeleton--animated',
                    className
                )}
                style={mergedStyle}
                {...rest}
            />
        );
    }
);

Skeleton.displayName = 'LotosSkeleton';
