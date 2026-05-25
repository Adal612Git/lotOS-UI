import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../src/components/checkbox/checkbox';

describe('Checkbox', () => {
    it('renders with a label', () => {
        render(<Checkbox label="Accept terms" />);
        expect(screen.getByRole('checkbox', { name: /accept terms/i })).toBeInTheDocument();
    });

    it('label is associated via htmlFor', () => {
        render(<Checkbox label="Subscribe to newsletter" />);
        const checkbox = screen.getByRole('checkbox');
        const label = screen.getByText(/subscribe to newsletter/i);
        expect(label).toHaveAttribute('for', checkbox.id);
    });

    it('is unchecked by default', () => {
        render(<Checkbox label="Option" />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('can be checked', async () => {
        const handler = vi.fn();
        render(<Checkbox label="Option" onChange={handler} />);
        await userEvent.click(screen.getByRole('checkbox'));
        expect(handler).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is set', () => {
        render(<Checkbox label="Disabled" disabled />);
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('shows error with aria-invalid', () => {
        render(<Checkbox label="Accept" error="You must accept" />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('You must accept');
    });

    it('renders description text', () => {
        render(<Checkbox label="Option" description="Helpful context" />);
        expect(screen.getByText('Helpful context')).toBeInTheDocument();
    });

    it('renders in controlled checked state', () => {
        const { rerender } = render(<Checkbox label="Item" checked={false} onChange={() => { }} />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
        rerender(<Checkbox label="Item" checked={true} onChange={() => { }} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });
});
