import React from 'react';
import type { DividerProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    (
        {
            orientation = 'horizontal',
            label,
            decorative = true,
            className,
            style,
            ...rest
        },
        ref
    ) => {
        if (orientation === 'vertical') {
            return (
                <div
                    ref={ref}
                    role={decorative ? 'presentation' : 'separator'}
                    aria-orientation="vertical"
                    className={cn('lotos-divider lotos-divider--vertical', className)}
                    style={style}
                    {...rest}
                >
                    <span className="lotos-divider__line" />
                </div>
            );
        }

        return (
            <div
                ref={ref}
                role={decorative ? 'presentation' : 'separator'}
                aria-orientation="horizontal"
                className={cn('lotos-divider lotos-divider--horizontal', className)}
                style={style}
                {...rest}
            >
                <span className="lotos-divider__line" />
                {label ? <span className="lotos-divider__label">{label}</span> : null}
                <span className="lotos-divider__line" />
            </div>
        );
    }
);

Divider.displayName = 'LotosDivider';
