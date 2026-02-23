/**
 * @lotos/claude-arm — Button Tests
 * Tests: rendering, variants, sizes, disabled, loading, keyboard, a11y
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button/button';

describe('Button', () => {
    // ── Rendering ────────────────────────────────────────────────────────────
    describe('rendering', () => {
        it('renders with text content', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });

        it('renders with type="button" by default', () => {
            render(<Button>Submit</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });

        it('renders as type="submit" when specified', () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });

        it('applies custom className', () => {
            render(<Button className="my-custom-class">Btn</Button>);
            expect(screen.getByRole('button')).toHaveClass('my-custom-class');
        });

        it('applies the variant CSS class', () => {
            const { rerender } = render(<Button variant="primary">P</Button>);
            expect(screen.getByRole('button')).toHaveClass('lotos-btn--primary');

            rerender(<Button variant="destructive">D</Button>);
            expect(screen.getByRole('button')).toHaveClass('lotos-btn--destructive');

            rerender(<Button variant="ghost">G</Button>);
            expect(screen.getByRole('button')).toHaveClass('lotos-btn--ghost');
        });

        it('applies the size CSS class', () => {
            const { rerender } = render(<Button size="sm">S</Button>);
            expect(screen.getByRole('button')).toHaveClass('lotos-btn--sm');

            rerender(<Button size="xl">XL</Button>);
            expect(screen.getByRole('button')).toHaveClass('lotos-btn--xl');
        });

        it('renders full-width when fullWidth=true', () => {
            const { container } = render(<Button fullWidth>Full</Button>);
            expect(container.firstChild).toHaveClass('w-full');
        });
    });

    // ── Disabled state ────────────────────────────────────────────────────────
    describe('disabled state', () => {
        it('is disabled when disabled=true', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('is disabled when loading=true', () => {
            render(<Button loading>Loading</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
            expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
        });

        it('does not call onClick when disabled', () => {
            const handleClick = vi.fn();
            render(<Button disabled onClick={handleClick}>Disabled</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ── Click interaction ─────────────────────────────────────────────────────
    describe('click interaction', () => {
        it('calls onClick when clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            render(<Button onClick={handleClick}>Click</Button>);
            await user.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    // ── Keyboard interaction ──────────────────────────────────────────────────
    describe('keyboard interaction', () => {
        it('is focusable and responds to Enter', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            render(<Button onClick={handleClick}>Button</Button>);
            await user.tab();
            await user.keyboard('{Enter}');
            expect(handleClick).toHaveBeenCalled();
        });

        it('is focusable and responds to Space', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            render(<Button onClick={handleClick}>Button</Button>);
            await user.tab();
            await user.keyboard(' ');
            expect(handleClick).toHaveBeenCalled();
        });
    });

    // ── ARIA ──────────────────────────────────────────────────────────────────
    describe('accessibility', () => {
        it('forwards aria-label', () => {
            render(<Button aria-label="Close dialog">✕</Button>);
            expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
        });

        it('shows loading spinner with aria-busy', () => {
            render(<Button loading>Saving</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
        });
    });
});
