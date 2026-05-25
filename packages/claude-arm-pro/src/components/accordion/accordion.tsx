import React, {
    useState,
    useId,
    useCallback,
    useRef,
} from 'react';

// ─── Sentinel ─────────────────────────────────────────────────────────────────
function warn(msg: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`[LotOS Sentinel] ${msg}`);
    }
}
function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AccordionItem {
    /** Unique key */
    value: string;
    /** Trigger/header text */
    title: React.ReactNode;
    /** Expandable content */
    content: React.ReactNode;
    /** Disable this item */
    disabled?: boolean;
}

export interface AccordionProps {
    /** Accordion items */
    items: AccordionItem[];
    /** Allow multiple items open simultaneously */
    multiple?: boolean;
    /** Controlled open item(s) — string for single, string[] for multiple */
    value?: string | string[];
    /** Default open item(s) (uncontrolled) */
    defaultValue?: string | string[];
    /** Called when open state changes */
    onChange?: (value: string | string[]) => void;
    /** Visual variant */
    variant?: 'default' | 'bordered' | 'ghost';
    /** Additional class */
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Accordion({
    items,
    multiple = false,
    value: controlledValue,
    defaultValue,
    onChange,
    variant = 'default',
    className,
}: AccordionProps) {
    const uid = useId();

    if (!items || items.length === 0) {
        warn(`<Accordion> received no items.`);
    }

    // Normalize to array
    const normalize = (v: string | string[] | undefined): string[] => {
        if (v === undefined) return [];
        return Array.isArray(v) ? v : [v];
    };

    const [internalOpen, setInternalOpen] = useState<string[]>(
        normalize(defaultValue),
    );
    const isControlled = controlledValue !== undefined;
    const openItems = isControlled ? normalize(controlledValue) : internalOpen;

    const toggle = useCallback(
        (itemValue: string) => {
            let next: string[];

            if (multiple) {
                next = openItems.includes(itemValue)
                    ? openItems.filter((v) => v !== itemValue)
                    : [...openItems, itemValue];
            } else {
                next = openItems.includes(itemValue) ? [] : [itemValue];
            }

            if (!isControlled) setInternalOpen(next);
            onChange?.(multiple ? next : (next[0] ?? ''));
        },
        [multiple, openItems, isControlled, onChange],
    );

    const variantClass = {
        default: 'lotos-accordion--default',
        bordered: 'lotos-accordion--bordered',
        ghost: 'lotos-accordion--ghost',
    }[variant];

    return (
        <div className={cn('lotos-accordion', variantClass, className)}>
            {items.map((item) => {
                const triggerId = `${uid}-trigger-${item.value}`;
                const panelId = `${uid}-panel-${item.value}`;
                const isOpen = openItems.includes(item.value);

                return (
                    <div
                        key={item.value}
                        className={cn(
                            'lotos-accordion__item',
                            isOpen && 'lotos-accordion__item--open',
                            item.disabled && 'lotos-accordion__item--disabled',
                        )}
                    >
                        {/* Trigger */}
                        <h3 className="lotos-accordion__heading">
                            <button
                                id={triggerId}
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                aria-disabled={item.disabled ? 'true' : undefined}
                                disabled={item.disabled}
                                className={cn(
                                    'lotos-accordion__trigger',
                                    isOpen && 'lotos-accordion__trigger--open',
                                )}
                                onClick={() => !item.disabled && toggle(item.value)}
                            >
                                <span className="lotos-accordion__trigger-label">
                                    {item.title}
                                </span>
                                {/* Chevron */}
                                <svg
                                    className={cn(
                                        'lotos-accordion__chevron',
                                        isOpen && 'lotos-accordion__chevron--open',
                                    )}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    aria-hidden="true"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        d="M4 6L8 10L12 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </h3>

                        {/* Panel — lazy mount: content only in DOM when open */}
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={triggerId}
                            hidden={!isOpen}
                            className={cn(
                                'lotos-accordion__panel',
                                isOpen && 'lotos-accordion__panel--open',
                            )}
                        >
                            {isOpen && (
                                <div className="lotos-accordion__panel-inner">
                                    {item.content}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
