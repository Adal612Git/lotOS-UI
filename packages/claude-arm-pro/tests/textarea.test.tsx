import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../src/components/textarea/textarea';

describe('Textarea', () => {
    it('renders with a label', () => {
        render(<Textarea label="Message" />);
        expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    });

    it('label is associated via htmlFor', () => {
        render(<Textarea label="Comments" />);
        const textarea = screen.getByRole('textbox');
        const label = screen.getByText('Comments');
        expect(label).toHaveAttribute('for', textarea.id);
    });

    it('shows error with aria-invalid', () => {
        render(<Textarea label="Comments" error="Too short" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Too short');
    });

    it('renders helper text', () => {
        render(<Textarea label="Bio" helperText="Max 500 characters" />);
        expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is set', () => {
        render(<Textarea label="Notes" disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('shows char counter when showCharCount=true', async () => {
        render(<Textarea label="Bio" showCharCount />);
        expect(screen.getByText('0')).toBeInTheDocument();
        await userEvent.type(screen.getByRole('textbox'), 'Hello');
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows char counter with max when maxChars set', async () => {
        render(<Textarea label="Bio" showCharCount maxChars={100} />);
        expect(screen.getByText('0/100')).toBeInTheDocument();
        await userEvent.type(screen.getByRole('textbox'), 'Hi');
        expect(screen.getByText('2/100')).toBeInTheDocument();
    });

    it('calls onChange when text is entered', async () => {
        const handler = vi.fn();
        render(<Textarea label="Notes" onChange={handler} />);
        await userEvent.type(screen.getByRole('textbox'), 'test');
        expect(handler).toHaveBeenCalled();
    });

    it('marks field as required with aria-required', () => {
        render(<Textarea label="Message" required />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });
});
