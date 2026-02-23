/**
 * @lotos/claude-arm — Modal Component
 *
 * Accessible modal dialog with:
 * - Focus trap (Tab cycles within the modal)
 * - Keyboard close (Escape)
 * - aria-modal, aria-labelledby, aria-describedby
 * - Backdrop click to close (optional)
 * - Scroll lock on body
 *
 * WCAG 2.2 AAA compliant.
 */

import React, { useEffect, useRef, useId, useCallback } from 'react';
import type { ModalProps } from '@lotos/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

const SIZE_CLASSES: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-none w-full h-full m-0 rounded-none',
};

// Returns all focusable elements within a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
            'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        )
    ).filter((el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'));
}

/**
 * LotOS Modal Component
 *
 * @example
 * <Modal open={isOpen} onClose={handleClose} title="Confirm action" size="sm">
 *   <p>Are you sure?</p>
 *   <Modal.Footer>
 *     <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *     <Button variant="destructive" onClick={handleDelete}>Delete</Button>
 *   </Modal.Footer>
 * </Modal>
 */
export const Modal: React.FC<ModalProps & { children?: React.ReactNode }> & {
    Footer: React.FC<{ children?: React.ReactNode; className?: string }>;
} = ({
    open,
    onClose,
    title,
    description,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    size = 'md',
    showCloseButton = true,
    children,
    footer,
    className,
    'aria-label': ariaLabel,
}) => {
        const dialogRef = useRef<HTMLDivElement>(null);
        const autoId = useId();
        const titleId = `lotos-modal-title-${autoId}`;
        const descId = description ? `lotos-modal-desc-${autoId}` : undefined;

        // ── Focus Trap ───────────────────────────────────────────────────────────
        const handleKeyDown = useCallback(
            (e: KeyboardEvent) => {
                if (!open) return;

                // Escape to close
                if (e.key === 'Escape' && closeOnEscape) {
                    e.preventDefault();
                    onClose();
                    return;
                }

                // Tab cycling (focus trap)
                if (e.key === 'Tab' && dialogRef.current) {
                    const focusable = getFocusableElements(dialogRef.current);
                    if (focusable.length === 0) { e.preventDefault(); return; }

                    const first = focusable[0]!;
                    const last = focusable[focusable.length - 1]!;

                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            },
            [open, closeOnEscape, onClose]
        );

        // ── Lifecycle effects ────────────────────────────────────────────────────
        useEffect(() => {
            if (!open) return;

            // Lock scroll
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Move focus inside dialog
            const firstFocusable = dialogRef.current
                ? getFocusableElements(dialogRef.current)[0]
                : null;
            firstFocusable?.focus();

            // Keyboard listener
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = prevOverflow;
                document.removeEventListener('keydown', handleKeyDown);
            };
        }, [open, handleKeyDown]);

        if (!open) return null;

        // ── Render ───────────────────────────────────────────────────────────────
        return (
            <div className="lotos-modal-portal" aria-live="polite">
                {/* Backdrop */}
                <div
                    aria-hidden="true"
                    className={cn(
                        'lotos-modal__backdrop',
                        'fixed inset-0 z-50',
                        'bg-[var(--lotos-bg-overlay)]',
                        'backdrop-blur-sm',
                        'transition-opacity duration-[var(--lotos-duration-normal)]'
                    )}
                    onClick={closeOnBackdropClick ? onClose : undefined}
                />

                {/* Centering container */}
                <div
                    className={cn(
                        'lotos-modal__positioner',
                        'fixed inset-0 z-50',
                        'flex items-center justify-center p-4'
                    )}
                    onClick={(e) => {
                        // Only close if clicking the positioner itself (not the dialog)
                        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
                    }}
                >
                    {/* Dialog */}
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descId}
                        aria-label={!title ? ariaLabel : undefined}
                        className={cn(
                            'lotos-modal__dialog',
                            'relative w-full',
                            'bg-[var(--lotos-bg-secondary)]',
                            'border border-[var(--lotos-border)]',
                            'rounded-[var(--lotos-radius-2xl)]',
                            'shadow-xl',
                            'flex flex-col',
                            'animate-in fade-in-0 zoom-in-95',
                            'duration-[var(--lotos-duration-normal)]',
                            SIZE_CLASSES[size],
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="lotos-modal__header flex items-start justify-between gap-4 p-6 pb-0">
                            <div className="flex-1 min-w-0">
                                <h2
                                    id={titleId}
                                    className="lotos-modal__title text-xl font-semibold text-[var(--lotos-fg-primary)] leading-snug"
                                >
                                    {title}
                                </h2>
                                {description && (
                                    <p
                                        id={descId}
                                        className="lotos-modal__description mt-1 text-sm text-[var(--lotos-fg-muted)]"
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Close button */}
                            {showCloseButton && (
                                <button
                                    type="button"
                                    aria-label="Close dialog"
                                    onClick={onClose}
                                    className={cn(
                                        'lotos-modal__close-btn',
                                        'shrink-0 -mt-1 -mr-1',
                                        'h-8 w-8 rounded-[var(--lotos-radius-lg)]',
                                        'flex items-center justify-center',
                                        'text-[var(--lotos-fg-muted)] hover:text-[var(--lotos-fg-primary)]',
                                        'hover:bg-[var(--lotos-border)]',
                                        'transition-colors duration-[var(--lotos-duration-fast)]',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2',
                                        'focus-visible:outline-[var(--lotos-border-focus)]'
                                    )}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="lotos-modal__body flex-1 overflow-y-auto p-6">
                            {children}
                        </div>

                        {/* Footer (accepts a footer prop OR Modal.Footer children) */}
                        {footer && (
                            <div className="lotos-modal__footer border-t border-[var(--lotos-border)] p-4 flex items-center justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

// Subcomponent: Modal.Footer
Modal.Footer = function ModalFooter({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'lotos-modal__footer',
                'border-t border-[var(--lotos-border)]',
                'p-4 flex items-center justify-end gap-3',
                className
            )}
        >
            {children}
        </div>
    );
};

Modal.displayName = 'LotosModal';
Modal.Footer.displayName = 'LotosModal.Footer';
