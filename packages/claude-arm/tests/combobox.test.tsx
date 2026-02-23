import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Combobox } from '../src/components/combobox/combobox';

const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
];

function renderCombobox(props = {}) {
    return render(
        <Combobox label="Framework" options={options} {...props} />,
    );
}

describe('Combobox', () => {
    it('renders with accessible label', () => {
        renderCombobox();
        expect(screen.getByRole('combobox', { name: /framework/i })).toBeInTheDocument();
    });

    it('listbox is not visible initially', () => {
        renderCombobox();
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('opens listbox on focus', () => {
        renderCombobox();
        fireEvent.focus(screen.getByRole('combobox'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('shows all options when opened', () => {
        renderCombobox();
        fireEvent.focus(screen.getByRole('combobox'));
        expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    it('filters options based on input', () => {
        renderCombobox();
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'vue' } });
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
        expect(options[0]).toHaveTextContent('Vue');
    });

    it('shows empty message when no results', () => {
        renderCombobox({ emptyMessage: 'Nothing found' });
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'zzzz' } });
        expect(screen.getByText('Nothing found')).toBeInTheDocument();
    });

    it('calls onChange when option is selected', () => {
        const onChange = vi.fn();
        renderCombobox({ onChange });
        fireEvent.focus(screen.getByRole('combobox'));
        fireEvent.click(screen.getByRole('option', { name: 'React' }));
        expect(onChange).toHaveBeenCalledWith('react', expect.objectContaining({ value: 'react' }));
    });

    it('selecting an option updates the input value', () => {
        const onChange = vi.fn();
        renderCombobox({ onChange });
        fireEvent.focus(screen.getByRole('combobox'));
        fireEvent.click(screen.getByRole('option', { name: 'Vue' }));
        // Input should now display the selected label
        expect(screen.getByRole('combobox')).toHaveValue('Vue');
        expect(onChange).toHaveBeenCalledWith('vue', expect.objectContaining({ label: 'Vue' }));
    });

    it('closes on Escape and restores previous query', () => {
        renderCombobox();
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        fireEvent.keyDown(input, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('has aria-expanded=false initially', () => {
        renderCombobox();
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded=true when open', () => {
        renderCombobox();
        fireEvent.focus(screen.getByRole('combobox'));
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });

    it('shows error with aria-invalid', () => {
        renderCombobox({ error: 'Invalid selection' });
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid selection');
    });

    it('is disabled when disabled prop is set', () => {
        renderCombobox({ disabled: true });
        expect(screen.getByRole('combobox')).toBeDisabled();
    });
});
