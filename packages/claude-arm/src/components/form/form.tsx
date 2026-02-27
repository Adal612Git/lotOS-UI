import React from 'react';
import type { FormProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const SPACING_CLASSES: Record<NonNullable<FormProps['spacing']>, string> = {
    compact: 'lotos-form--compact',
    comfortable: 'lotos-form--comfortable',
    spacious: 'lotos-form--spacious',
};

export const Form = React.forwardRef<
    HTMLFormElement,
    FormProps & { children?: React.ReactNode }
>(
    (
        {
            title,
            description,
            spacing = 'comfortable',
            onSubmit,
            children,
            actions,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedby,
            ...rest
        },
        ref
    ) => {
        return (
            <form
                ref={ref}
                data-lotos-ui="form"
                onSubmit={onSubmit}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                className={cn('lotos-form', SPACING_CLASSES[spacing], className)}
                style={style}
                {...rest}
            >
                {(title || description) && (
                    <header className="lotos-form__header">
                        {title ? <h3 className="lotos-form__title">{title}</h3> : null}
                        {description ? <p className="lotos-form__description">{description}</p> : null}
                    </header>
                )}

                <div className="lotos-form__grid">
                    {children}
                </div>

                {actions ? <footer className="lotos-form__actions">{actions}</footer> : null}
            </form>
        );
    }
);

Form.displayName = 'LotosForm';
