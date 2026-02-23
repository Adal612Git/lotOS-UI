/**
 * @lotos/claude-arm — Card Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from '../src/components/card/card';

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Card content</Card>);
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies padding CSS class', () => {
        const { container } = render(<Card padding="lg">Big</Card>);
        expect(container.firstChild).toHaveClass('p-8');
    });

    it('applies shadow CSS class', () => {
        const { container } = render(<Card shadow="md">Shadow</Card>);
        expect(container.firstChild).toHaveClass('shadow-md');
    });

    it('is NOT interactive by default (no role=button)', () => {
        const { container } = render(<Card>Static</Card>);
        expect(container.firstChild).not.toHaveAttribute('role', 'button');
    });

    it('gets role=button when interactive=true', () => {
        const { container } = render(<Card interactive>Clickable</Card>);
        expect(container.firstChild).toHaveAttribute('role', 'button');
        expect(container.firstChild).toHaveAttribute('tabIndex', '0');
    });

    it('calls onClick when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Card interactive onClick={handleClick}>Click me</Card>);
        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('activates on Enter key when interactive', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Card interactive onClick={handleClick}>Card</Card>);
        await user.tab();
        await user.keyboard('{Enter}');
        expect(handleClick).toHaveBeenCalled();
    });

    it('activates on Space key when interactive', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Card interactive onClick={handleClick}>Card</Card>);
        await user.tab();
        await user.keyboard(' ');
        expect(handleClick).toHaveBeenCalled();
    });

    it('applies glass styles when glass=true', () => {
        const { container } = render(<Card glass>Glass</Card>);
        expect(container.firstChild).toHaveClass('lotos-card--glass');
    });
});
