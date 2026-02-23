/**
 * @lotos/claude-arm — Input Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../src/components/input/input';

describe('Input', () => {
    it('renders with a label', () => {
        render(<Input label="Email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('associates label with input via htmlFor/id', () => {
        render(<Input label="Email" />);
        const label = screen.getByText('Email').closest('label');
        const input = screen.getByRole('textbox');
        expect(label).toHaveAttribute('for', input.id);
    });

    it('renders an asterisk for required fields', () => {
        render(<Input label="Email" required />);
        // The asterisk span is aria-hidden, so check in DOM
        const asterisk = document.querySelector('[aria-hidden="true"]');
        expect(asterisk).toBeInTheDocument();
        expect(asterisk?.textContent).toBe('*');
    });

    it('shows error message with role=alert', () => {
        render(<Input label="Email" error="Invalid email" />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Invalid email');
    });

    it('sets aria-invalid on input when there is an error', () => {
        render(<Input label="Email" error="Required" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links input to error message via aria-describedby', () => {
        render(<Input label="Email" error="Required" />);
        const input = screen.getByRole('textbox');
        const errorId = input.getAttribute('aria-describedby');
        const errorEl = document.getElementById(errorId!);
        expect(errorEl).toHaveTextContent('Required');
    });

    it('shows helper text', () => {
        render(<Input label="Email" helperText="We never spam" />);
        expect(screen.getByText('We never spam')).toBeInTheDocument();
    });

    it('does NOT show helper text when there is an error', () => {
        render(<Input label="Email" error="Invalid" helperText="Helper" />);
        expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('calls onChange when value changes', () => {
        const handleChange = vi.fn();
        render(<Input label="Name" onChange={handleChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Rick' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled=true', () => {
        render(<Input label="Email" disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders start adornment', () => {
        render(<Input label="Search" startAdornment={<span data-testid="icon">🔍</span>} />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders end adornment', () => {
        render(<Input label="Password" endAdornment={<span data-testid="eye">👁</span>} />);
        expect(screen.getByTestId('eye')).toBeInTheDocument();
    });

    it('renders type=email', () => {
        render(<Input label="Email" type="email" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
});
