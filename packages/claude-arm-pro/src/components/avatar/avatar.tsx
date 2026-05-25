import React from 'react';
import type { AvatarProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
    sm: 'lotos-avatar--sm h-8 w-8 text-xs',
    md: 'lotos-avatar--md h-10 w-10 text-sm',
    lg: 'lotos-avatar--lg h-14 w-14 text-base',
    xl: 'lotos-avatar--xl h-20 w-20 text-xl',
};

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
    (
        {
            src,
            alt,
            name,
            fallback,
            size = 'md',
            shape = 'circle',
            className,
            style,
            ...rest
        },
        ref
    ) => {
        const initials = fallback
            ?? name
                ?.split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part: string) => part[0]?.toUpperCase() ?? '')
                .join('')
            ?? '?';

        const label = alt ?? name ?? 'Avatar';

        return (
            <span
                ref={ref}
                style={style}
                className={cn(
                    'lotos-avatar inline-flex items-center justify-center overflow-hidden border border-[var(--lotos-border)] bg-[var(--lotos-surface-2)] font-semibold text-[var(--lotos-fg-primary)]',
                    SIZE_CLASSES[size],
                    shape === 'circle' ? 'rounded-full' : 'rounded-[var(--lotos-radius-lg)]',
                    className
                )}
                {...(!src ? { role: 'img', 'aria-label': label } : {})}
                {...rest}
            >
                {src ? (
                    <img src={src} alt={alt ?? name ?? ''} className="lotos-avatar__image h-full w-full object-cover" />
                ) : (
                    <span className="lotos-avatar__fallback">{initials}</span>
                )}
            </span>
        );
    }
);

Avatar.displayName = 'LotosAvatar';
