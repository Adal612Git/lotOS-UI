import React, {
    useState,
    useRef,
    useId,
    useCallback,
    useEffect,
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
export interface DropdownItem {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    destructive?: boolean;
    /** If set, renders as a section separator above this item */
    separator?: boolean;
}

export interface DropdownProps {
    /** The trigger element */
    trigger: React.ReactNode;
    /** Menu items */
    items: DropdownItem[];
    /** Called when an item is selected */
    onSelect?: (value: string, item: DropdownItem) => void;
    /** Placement of the menu */
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    /** Width strategy */
    width?: 'trigger' | 'auto';
    /** Accessible label for the menu */
    label?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface DropdownCtx {
    close: () => void;
}
const DropdownContext = createContext<DropdownCtx>({ close: () => { } });

// ─── Component ────────────────────────────────────────────────────────────────
export function Dropdown({
    trigger,
    items,
    onSelect,
    placement = 'bottom-start',
    width = 'auto',
    label,
}: DropdownProps) {
    const menuId = useId();
    const id = `lotos-dropdown-${menuId}`;
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    if (!label) {
        warn(
            `<Dropdown> is missing a label prop. Provide label="" to give the menu an accessible name for screen readers.`,
        );
    }

    const enabledItems = items.filter((i) => !i.disabled);

    const openMenu = useCallback(() => {
        setOpen(true);
        setActiveIndex(0);
    }, []);

    const closeMenu = useCallback(() => {
        setOpen(false);
        setActiveIndex(-1);
        triggerRef.current?.focus();
    }, []);

    const selectItem = useCallback(
        (item: DropdownItem) => {
            if (item.disabled) return;
            onSelect?.(item.value, item);
            closeMenu();
        },
        [onSelect, closeMenu],
    );

    // Close on outside click / focus
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent | FocusEvent) => {
            if (
                !triggerRef.current?.contains(e.target as Node) &&
                !menuRef.current?.contains(e.target as Node)
            ) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('focusin', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('focusin', handler);
        };
    }, [open, closeMenu]);

    // Focus active item
    useEffect(() => {
        if (!open || activeIndex < 0) return;
        const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
        items?.[activeIndex]?.focus();
    }, [open, activeIndex]);

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            openMenu();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setActiveIndex(enabledItems.length - 1);
        }
    };

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
        const enabledCount = enabledItems.length;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % enabledCount);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + enabledCount) % enabledCount);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveIndex(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActiveIndex(enabledCount - 1);
        }
    };

    const placementClass = {
        'bottom-start': 'lotos-dropdown__menu--bottom-start',
        'bottom-end': 'lotos-dropdown__menu--bottom-end',
        'top-start': 'lotos-dropdown__menu--top-start',
        'top-end': 'lotos-dropdown__menu--top-end',
    }[placement];

    return (
        <DropdownContext.Provider value={{ close: closeMenu }}>
            <div className="lotos-dropdown">
                {/* Trigger wrapper — holds ARIA attrs so any element can be trigger */}
                <div
                    className="lotos-dropdown__trigger-wrapper"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-controls={open ? id : undefined}
                    onClick={() => (open ? closeMenu() : openMenu())}
                    onKeyDown={handleTriggerKeyDown}
                    style={{ display: 'inline-flex' }}
                >
                    {trigger}
                </div>

                {/* Menu */}
                {open && (
                    <ul
                        ref={menuRef}
                        id={id}
                        role="menu"
                        aria-label={label}
                        className={cn(
                            'lotos-dropdown__menu',
                            placementClass,
                            width === 'trigger' && 'lotos-dropdown__menu--fit',
                        )}
                        onKeyDown={handleMenuKeyDown}
                    >
                        {items.map((item, idx) => {
                            const enabledIdx = enabledItems.indexOf(item);
                            return (
                                <React.Fragment key={item.value}>
                                    {item.separator && (
                                        <li role="separator" className="lotos-dropdown__separator" />
                                    )}
                                    <li
                                        role="menuitem"
                                        tabIndex={!item.disabled && enabledIdx === activeIndex ? 0 : -1}
                                        aria-disabled={item.disabled ? 'true' : undefined}
                                        className={cn(
                                            'lotos-dropdown__item',
                                            item.disabled && 'lotos-dropdown__item--disabled',
                                            item.destructive && 'lotos-dropdown__item--destructive',
                                        )}
                                        onClick={() => selectItem(item)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                selectItem(item);
                                            }
                                        }}
                                    >
                                        {item.icon && (
                                            <span className="lotos-dropdown__item-icon" aria-hidden="true">
                                                {item.icon}
                                            </span>
                                        )}
                                        <span className="lotos-dropdown__item-label">{item.label}</span>
                                    </li>
                                </React.Fragment>
                            );
                        })}
                    </ul>
                )}
            </div>
        </DropdownContext.Provider>
    );
}
