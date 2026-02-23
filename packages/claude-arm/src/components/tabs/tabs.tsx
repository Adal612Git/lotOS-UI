import React, {
    useState,
    useRef,
    useId,
    useCallback,
    createContext,
    useContext,
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
export interface TabItem {
    /** Unique key */
    value: string;
    /** Tab label */
    label: React.ReactNode;
    /** Panel content */
    content: React.ReactNode;
    /** Disable this tab */
    disabled?: boolean;
    /** Icon before label */
    icon?: React.ReactNode;
}

export interface TabsProps {
    /** Tab definitions */
    tabs: TabItem[];
    /** Controlled active tab */
    value?: string;
    /** Default active tab (uncontrolled) */
    defaultValue?: string;
    /** Called when a tab is selected */
    onChange?: (value: string) => void;
    /** Visual variant */
    variant?: 'underline' | 'pills' | 'card';
    /** Accessible label for the tablist */
    label?: string;
    /** Orientation */
    orientation?: 'horizontal' | 'vertical';
    /** Additional class on root */
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Tabs({
    tabs,
    value: controlledValue,
    defaultValue,
    onChange,
    variant = 'underline',
    label,
    orientation = 'horizontal',
    className,
}: TabsProps) {
    const uid = useId();
    const tablistId = `lotos-tabs-${uid}`;

    if (!label) {
        warn(
            `<Tabs> is missing a label prop. Provide label="" for an accessible tablist name.`,
        );
    }
    if (!tabs || tabs.length === 0) {
        warn(`<Tabs> received no tabs. Pass at least one TabItem.`);
    }

    const enabledTabs = tabs.filter((t) => !t.disabled);
    const firstEnabled = enabledTabs[0]?.value ?? '';

    const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const select = useCallback(
        (value: string) => {
            if (!isControlled) setInternalValue(value);
            onChange?.(value);
        },
        [isControlled, onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent, currentValue: string) => {
        const enabledValues = enabledTabs.map((t) => t.value);
        const idx = enabledValues.indexOf(currentValue);
        const isHorizontal = orientation === 'horizontal';

        let nextValue: string | undefined;

        if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
            e.preventDefault();
            nextValue = enabledValues[(idx + 1) % enabledValues.length];
        } else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
            e.preventDefault();
            nextValue = enabledValues[(idx - 1 + enabledValues.length) % enabledValues.length];
        } else if (e.key === 'Home') {
            e.preventDefault();
            nextValue = enabledValues[0];
        } else if (e.key === 'End') {
            e.preventDefault();
            nextValue = enabledValues[enabledValues.length - 1];
        }

        if (nextValue) {
            select(nextValue);
            tabRefs.current.get(nextValue)?.focus();
        }
    };

    const variantClass = {
        underline: 'lotos-tabs--underline',
        pills: 'lotos-tabs--pills',
        card: 'lotos-tabs--card',
    }[variant];

    return (
        <div
            className={cn(
                'lotos-tabs',
                variantClass,
                `lotos-tabs--${orientation}`,
                className,
            )}
        >
            {/* Tablist */}
            <div
                role="tablist"
                id={tablistId}
                aria-label={label}
                aria-orientation={orientation}
                className="lotos-tabs__tablist"
            >
                {tabs.map((tab) => {
                    const tabId = `${tablistId}-tab-${tab.value}`;
                    const panelId = `${tablistId}-panel-${tab.value}`;
                    const isActive = activeValue === tab.value;

                    return (
                        <button
                            key={tab.value}
                            ref={(el) => {
                                if (el) tabRefs.current.set(tab.value, el);
                                else tabRefs.current.delete(tab.value);
                            }}
                            id={tabId}
                            role="tab"
                            type="button"
                            aria-selected={isActive}
                            aria-controls={panelId}
                            aria-disabled={tab.disabled ? 'true' : undefined}
                            tabIndex={isActive ? 0 : -1}
                            disabled={tab.disabled}
                            className={cn(
                                'lotos-tabs__tab',
                                isActive && 'lotos-tabs__tab--active',
                                tab.disabled && 'lotos-tabs__tab--disabled',
                            )}
                            onClick={() => !tab.disabled && select(tab.value)}
                            onKeyDown={(e) => !tab.disabled && handleKeyDown(e, tab.value)}
                        >
                            {tab.icon && (
                                <span className="lotos-tabs__tab-icon" aria-hidden="true">
                                    {tab.icon}
                                </span>
                            )}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Panels */}
            {tabs.map((tab) => {
                const tabId = `${tablistId}-tab-${tab.value}`;
                const panelId = `${tablistId}-panel-${tab.value}`;
                const isActive = activeValue === tab.value;

                return (
                    <div
                        key={tab.value}
                        id={panelId}
                        role="tabpanel"
                        aria-labelledby={tabId}
                        hidden={!isActive}
                        tabIndex={isActive ? 0 : -1}
                        className={cn(
                            'lotos-tabs__panel',
                            isActive && 'lotos-tabs__panel--active',
                        )}
                    >
                        {/* Lazy render: only mount active panel content */}
                        {isActive && tab.content}
                    </div>
                );
            })}
        </div>
    );
}
