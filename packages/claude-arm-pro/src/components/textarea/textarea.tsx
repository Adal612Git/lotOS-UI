import React, { useId, forwardRef } from 'react';

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
export interface TextareaProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    maxChars?: number;
    showCharCount?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    {
        label,
        error,
        helperText,
        size = 'md',
        resize = 'vertical',
        maxChars,
        showCharCount = false,
        id: idProp,
        required,
        disabled,
        value,
        defaultValue,
        className,
        style,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const id = idProp ?? `lotos-textarea-${generatedId}`;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const counterId = `${id}-counter`;

    if (!label && !props['aria-label']) {
        warn(
            `<Textarea> is missing a label or aria-label. Every textarea must have an accessible label.`,
        );
    }

    const [charCount, setCharCount] = React.useState(
        () => String(value ?? defaultValue ?? '').length,
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        props.onChange?.(e);
    };

    const sizeClasses = {
        sm: 'lotos-textarea--sm',
        md: 'lotos-textarea--md',
        lg: 'lotos-textarea--lg',
    };

    const resizeClasses = {
        none: 'lotos-textarea--resize-none',
        vertical: 'lotos-textarea--resize-vertical',
        horizontal: 'lotos-textarea--resize-horizontal',
        both: 'lotos-textarea--resize-both',
    };

    const describedBy = [
        error ? errorId : null,
        helperText && !error ? helperId : null,
        showCharCount ? counterId : null,
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className={cn('lotos-field', className)}>
            {label && (
                <label className="lotos-field__label" htmlFor={id}>
                    {label}
                    {required && (
                        <span className="lotos-field__required" aria-hidden="true"> *</span>
                    )}
                </label>
            )}
            <textarea
                ref={ref}
                id={id}
                required={required}
                disabled={disabled}
                value={value}
                defaultValue={defaultValue}
                maxLength={maxChars}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={describedBy}
                aria-required={required}
                onChange={handleChange}
                className={cn(
                    'lotos-textarea',
                    sizeClasses[size],
                    resizeClasses[resize],
                    error && 'lotos-textarea--error',
                    disabled && 'lotos-textarea--disabled',
                )}
                style={{ resize, ...style }}
                {...props}
            />
            <div className="lotos-field__footer">
                <div>
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
                {showCharCount && (
                    <span
                        id={counterId}
                        className={cn(
                            'lotos-textarea__counter',
                            maxChars !== undefined && charCount >= maxChars && 'lotos-textarea__counter--limit',
                        )}
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {charCount}{maxChars ? `/${maxChars}` : ''}
                    </span>
                )}
            </div>
        </div>
    );
});
