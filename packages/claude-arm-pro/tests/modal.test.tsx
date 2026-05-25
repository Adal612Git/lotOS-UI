/**
 * @lotos/claude-arm — Modal Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../src/components/modal/modal';
import { Button } from '../src/components/button/button';

// Test wrapper: a modal with a simple trigger
function TestModal({ open = true, onClose = vi.fn() as () => void, ...props }: Partial<React.ComponentProps<typeof Modal>>) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Test Modal"
            description="Modal description"
            {...props}
        >
            <p>Modal content</p>
            <button type="button">Action</button>
        </Modal>
    );
}

describe('Modal', () => {
    // ── Open/Close ─────────────────────────────────────────────────────────
    describe('open/close', () => {
        it('renders nothing when open=false', () => {
            render(<TestModal open={false} />);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('renders dialog when open=true', () => {
            render(<TestModal open={true} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('calls onClose when close button is clicked', async () => {
            const handleClose = vi.fn();
            const user = userEvent.setup();
            render(<TestModal onClose={handleClose} />);
            await user.click(screen.getByRole('button', { name: 'Close dialog' }));
            expect(handleClose).toHaveBeenCalledTimes(1);
        });

        it('calls onClose when Escape is pressed', async () => {
            const handleClose = vi.fn();
            const user = userEvent.setup();
            render(<TestModal onClose={handleClose} />);
            await user.keyboard('{Escape}');
            expect(handleClose).toHaveBeenCalled();
        });

        it('does NOT call onClose on Escape when closeOnEscape=false', async () => {
            const handleClose = vi.fn();
            const user = userEvent.setup();
            render(<TestModal onClose={handleClose} closeOnEscape={false} />);
            await user.keyboard('{Escape}');
            expect(handleClose).not.toHaveBeenCalled();
        });
    });

    // ── Accessibility ──────────────────────────────────────────────────────
    describe('accessibility', () => {
        it('has role=dialog', () => {
            render(<TestModal />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('has aria-modal="true"', () => {
            render(<TestModal />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        });

        it('is labeled by the title', () => {
            render(<TestModal />);
            const dialog = screen.getByRole('dialog');
            const titleId = dialog.getAttribute('aria-labelledby');
            const titleEl = document.getElementById(titleId!);
            expect(titleEl).toHaveTextContent('Test Modal');
        });

        it('renders description text', () => {
            render(<TestModal />);
            expect(screen.getByText('Modal description')).toBeInTheDocument();
        });

        it('renders children', () => {
            render(<TestModal />);
            expect(screen.getByText('Modal content')).toBeInTheDocument();
        });

        it('hides close button when showCloseButton=false', () => {
            render(<TestModal showCloseButton={false} />);
            expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
        });
    });

    // ── Footer ─────────────────────────────────────────────────────────────
    describe('Modal.Footer', () => {
        it('renders footer content', () => {
            render(
                <Modal open={true} onClose={vi.fn()} title="With footer"
                    footer={
                        <>
                            <Button variant="ghost">Cancel</Button>
                            <Button variant="primary">Confirm</Button>
                        </>
                    }
                >
                    <p>Body</p>
                </Modal>
            );
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        });
    });

    // ── Sizes ──────────────────────────────────────────────────────────────
    describe('sizes', () => {
        it.each(['sm', 'md', 'lg', 'xl'] as const)('renders size=%s', (size) => {
            render(<TestModal size={size} />);
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
        });
    });
});
