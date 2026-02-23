import React, {
    useState,
    useRef,
    useId,
    useCallback,
    useEffect,
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
export interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ComboboxProps {
    /** Visible label */
    label: string;
    /** All options */
    options: ComboboxOption[];
    /** Controlled value */
    value?: string;
    /** Called when an option is selected */
    onChange?: (value: string, option: ComboboxOption) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** No results message */
    emptyMessage?: string;
    /** Disabled */
    disabled?: boolean;
    /** Size */
    size?: 'sm' | 'md' | 'lg';
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Combobox({
    label,
    options,
    value: controlledValue,
    onChange,
    placeholder = 'Search...',
    error,
    helperText,
    emptyMessage = 'No results found',
    disabled,
    size = 'md',
}: ComboboxProps) {
    const uid = useId();
    const inputId = `lotos-combobox-${uid}`;
    const listboxId = `lotos-combobox-list-${uid}`;
    const errorId = `lotos-combobox-error-${uid}`;
    const helperId = `lotos-combobox-helper-${uid}`;

    if (!label) {
        warn(
            `<Combobox> is missing a label. Every combobox must have an accessible label.`,
        );
    }

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [selectedLabel, setSelectedLabel] = useState(() => {
        if (controlledValue) {
            return options.find((o) => o.value === controlledValue)?.label ?? '';
        }
        return '';
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filtered options
    const filtered = options.filter(
        (o) => !o.disabled && o.label.toLowerCase().includes(query.toLowerCase()),
    );

    // Sync selected label when controlled value changes
    useEffect(() => {
        if (controlledValue !== undefined) {
            const found = options.find((o) => o.value === controlledValue);
            setSelectedLabel(found?.label ?? '');
        }
    }, [controlledValue, options]);

    // Focus active listbox item
    useEffect(() => {
        if (!open || activeIndex < 0) return;
        const items = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
        const el = items?.[activeIndex];
        if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex, open]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
                setQuery(selectedLabel);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, selectedLabel]);

    const openList = useCallback(() => {
        setOpen(true);
        setActiveIndex(filtered.length > 0 ? 0 : -1);
    }, [filtered.length]);

    const selectOption = useCallback(
        (option: ComboboxOption) => {
            setSelectedLabel(option.label);
            setQuery('');
            setOpen(false);
            setActiveIndex(-1);
            onChange?.(option.value, option);
            inputRef.current?.focus();
        },
        [onChange],
    );

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setSelectedLabel('');
        setOpen(true);
        setActiveIndex(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                openList();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && filtered[activeIndex]) {
                    selectOption(filtered[activeIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                setQuery(selectedLabel);
                break;
            case 'Home':
                e.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setActiveIndex(filtered.length - 1);
                break;
            case 'Tab':
                setOpen(false);
                setQuery(selectedLabel);
                break;
        }
    };

    const sizeClasses = {
        sm: 'lotos-combobox--sm',
        md: 'lotos-combobox--md',
        lg: 'lotos-combobox--lg',
    };

    const describedBy = [
        error ? errorId : null,
        helperText && !error ? helperId : null,
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div
            ref={containerRef}
            className={cn('lotos-field', 'lotos-combobox', sizeClasses[size], className)}
        >
            {label && (
                <label className="lotos-field__label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <div className="lotos-combobox__wrapper">
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    role="combobox"
                    autoComplete="off"
                    disabled={disabled}
                    value={selectedLabel || query}
                    placeholder={placeholder}
                    aria-expanded={open}
                    aria-controls={open ? listboxId : undefined}
                    aria-activedescendant={
                        open && activeIndex >= 0
                            ? `${listboxId}-opt-${activeIndex}`
                            : undefined
                    }
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    aria-autocomplete="list"
                    onChange={handleInput}
                    onFocus={openList}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'lotos-combobox__input',
                        error && 'lotos-combobox__input--error',
                    )}
                />
                {/* Chevron toggle */}
                <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="lotos-combobox__toggle"
                    onClick={() => {
                        if (open) {
                            setOpen(false);
                            setQuery(selectedLabel);
                        } else {
                            inputRef.current?.focus();
                            openList();
                        }
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d={open ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Listbox */}
            {open && (
                <ul
                    ref={listboxRef}
                    id={listboxId}
                    role="listbox"
                    aria-label={label}
                    className="lotos-combobox__listbox"
                >
                    {filtered.length > 0 ? (
                        filtered.map((option, idx) => (
                            <li
                                key={option.value}
                                id={`${listboxId}-opt-${idx}`}
                                role="option"
                                aria-selected={
                                    (controlledValue ?? selectedLabel) === option.value ||
                                    selectedLabel === option.label
                                }
                                className={cn(
                                    'lotos-combobox__option',
                                    idx === activeIndex && 'lotos-combobox__option--active',
                                    selectedLabel === option.label && 'lotos-combobox__option--selected',
                                )}
                                onMouseDown={(e) => e.preventDefault()} // prevent input blur
                                onClick={() => selectOption(option)}
                                onMouseEnter={() => setActiveIndex(idx)}
                            >
                                <span className="lotos-combobox__option-label">{option.label}</span>
                                {selectedLabel === option.label && (
                                    <svg
                                        className="lotos-combobox__option-check"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M3 8L6.5 11.5L13 5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </li>
                        ))
                    ) : (
                        <li role="option" aria-selected="false" className="lotos-combobox__empty">
                            {emptyMessage}
                        </li>
                    )}
                </ul>
            )}

            {error && (
                <span id={errorId} className="lotos-field__error" role="alert">
                    {error}
                </span>
            )}
            {helperText && !error && (
                <span id={helperId} className="lotos-field__helper">
                    {helperText}
                </span>
            )}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const className: any = undefined;
