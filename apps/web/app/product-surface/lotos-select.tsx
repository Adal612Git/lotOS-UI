'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export type LotOSSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type LotOSSelectProps = {
  label?: string;
  helper?: string;
  error?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  options: LotOSSelectOption[];
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  density?: 'comfortable' | 'compact' | 'dense';
  className?: string;
  onChange?: (value: string, option: LotOSSelectOption) => void;
};

function firstEnabled(options: LotOSSelectOption[]) {
  return options.find((option) => !option.disabled);
}

export function LotOSSelect({
  label,
  helper,
  error,
  name,
  value,
  defaultValue,
  placeholder = 'Select option',
  options,
  disabled,
  size = 'md',
  density = 'comfortable',
  className,
  onChange,
}: LotOSSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === (value ?? defaultValue))));
  const selectedValue = controlled ? value : internalValue;
  const selected = useMemo(() => options.find((option) => option.value === selectedValue), [options, selectedValue]);
  const listboxId = `${id}-listbox`;
  const helpId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const nextIndex = options.findIndex((option) => option.value === selectedValue);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  }, [options, selectedValue]);

  function commit(option: LotOSSelectOption) {
    if (option.disabled) return;
    if (!controlled) setInternalValue(option.value);
    onChange?.(option.value, option);
    setOpen(false);
  }

  function move(delta: 1 | -1) {
    if (options.length === 0) return;
    let next = activeIndex;
    for (let tries = 0; tries < options.length; tries += 1) {
      next = (next + delta + options.length) % options.length;
      if (!options[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      move(-1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const option = options[activeIndex] ?? firstEnabled(options);
      if (option) commit(option);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className={`lotos-field ${className ?? ''}`}>
      {label ? (
        <label className="lotos-field__label" id={`${id}-label`}>
          {label}
        </label>
      ) : null}
      <div className="lotos-select" ref={rootRef} data-open={open ? 'true' : 'false'}>
        {name ? <input type="hidden" name={name} value={selectedValue ?? ''} /> : null}
        <button
          type="button"
          id={id}
          className="lotos-select__button"
          data-size={size}
          data-density={density}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={label ? `${id}-label ${id}` : undefined}
          aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
          disabled={disabled}
          onClick={() => setOpen((next) => !next)}
          onKeyDown={handleKeyDown}
        >
          <span className="lotos-select__value">{selected?.label ?? placeholder}</span>
          <span className="lotos-select__chevron" aria-hidden="true">
            v
          </span>
        </button>
        {open ? (
          <div className="lotos-select__menu" role="listbox" id={listboxId} aria-labelledby={label ? `${id}-label` : undefined}>
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === selectedValue}
                disabled={option.disabled}
                className="lotos-select__option"
                data-active={index === activeIndex ? 'true' : 'false'}
                data-selected={option.value === selectedValue ? 'true' : 'false'}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(option)}
              >
                <span>
                  {option.label}
                  {option.description ? <small>{option.description}</small> : null}
                </span>
                <span className="lotos-select__check" aria-hidden="true">
                  {option.value === selectedValue ? 'OK' : ''}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {helper ? (
        <span className="lotos-field__helper" id={helpId}>
          {helper}
        </span>
      ) : null}
      {error ? (
        <span className="lotos-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
