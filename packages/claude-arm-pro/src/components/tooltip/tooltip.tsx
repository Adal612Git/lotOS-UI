import React, { useState, useRef, useId, useCallback } from 'react';

// ─── Sentinel ────────────────────────────────────────────────────────────────
function warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[LotOS Sentinel] ${msg}`);
    }
}
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TooltipProps {
    /** The trigger element */
    children: React.ReactElement;
    /** Tooltip content */
    content: React.ReactNode;
    /** Placement of the tooltip */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Delay in ms before showing */
    delay?: number;
    /** Whether the tooltip is disabled */
    disabled?: boolean;
    /** Max width in px */
    maxWidth?: number;
}

type TooltipTriggerProps = React.HTMLAttributes<Element> & {
    'aria-describedby'?: string;
};

// ─── Component ───────────────────────────────────────────────────────────────
export function Tooltip({
    children,
    content,
    placement = 'top',
    delay = 200,
    disabled = false,
    maxWidth = 280,
}: TooltipProps) {
    const tooltipId = useId();
    const id = `lotos-tooltip-${tooltipId}`;
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!content) {
        warn(
            `<Tooltip> has no content. A tooltip without content provides no value and should be removed.`,
        );
    }

    const show = useCallback(() => {
        if (disabled) return;
        timerRef.current = setTimeout(() => setVisible(true), delay);
    }, [disabled, delay]);

    const hide = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setVisible(false);
    }, []);

    const placementClass = {
        top: 'lotos-tooltip--top',
        bottom: 'lotos-tooltip--bottom',
        left: 'lotos-tooltip--left',
        right: 'lotos-tooltip--right',
    }[placement];

    // Clone the trigger to inject ARIA + event handlers
    const triggerElement = children as React.ReactElement<TooltipTriggerProps>;
    const trigger = React.cloneElement(triggerElement, {
        'aria-describedby': visible ? id : undefined,
        onMouseEnter: (e: React.MouseEvent) => {
            show();
            triggerElement.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
            hide();
            triggerElement.props.onMouseLeave?.(e);
        },
        onFocus: (e: React.FocusEvent) => {
            show();
            triggerElement.props.onFocus?.(e);
        },
        onBlur: (e: React.FocusEvent) => {
            hide();
            triggerElement.props.onBlur?.(e);
        },
    });

    return (
        <span className="lotos-tooltip-wrapper">
            {trigger}
            <span
                id={id}
                role="tooltip"
                className={cn(
                    'lotos-tooltip',
                    placementClass,
                    visible && 'lotos-tooltip--visible',
                )}
                style={{ maxWidth }}
                aria-hidden={!visible}
            >
                {content}
            </span>
        </span>
    );
}
