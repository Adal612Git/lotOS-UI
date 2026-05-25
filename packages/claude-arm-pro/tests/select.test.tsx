import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../src/components/select/select';

const opts = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte', disabled: true },
];

describe('Select', () => {
    it('renders a labelled select', () => {
        render(<Select label="Framework" options={opts} />);
        const select = screen.getByRole('combobox', { name: /framework/i });
        expect(select).toBeInTheDocument();
    });

    it('renders all options', () => {
        render(<Select label="Framework" options={opts} />);
        expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Svelte' })).toBeInTheDocument();
    });

    it('renders placeholder option', () => {
        render(<Select label="Framework" options={opts} placeholder="Choose..." />);
        expect(screen.getByRole('option', { name: 'Choose...' })).toBeInTheDocument();
    });

    it('shows error state with aria-invalid', () => {
        render(<Select label="Framework" options={opts} error="Required" />);
        const select = screen.getByRole('combobox');
        expect(select).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });

    it('is disabled when disabled prop is set', () => {
        render(<Select label="Framework" options={opts} disabled />);
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('renders helper text', () => {
        render(<Select label="Framework" options={opts} helperText="Pick one" />);
        expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('calls onChange when value changes', async () => {
        const handler = vi.fn();
        render(<Select label="Framework" options={opts} onChange={handler} />);
        await userEvent.selectOptions(screen.getByRole('combobox'), 'vue');
        expect(handler).toHaveBeenCalled();
    });

    it('disables specific options', () => {
        render(<Select label="Framework" options={opts} />);
        const svelteOpt = screen.getByRole('option', { name: 'Svelte' }) as HTMLOptionElement;
        expect(svelteOpt.disabled).toBe(true);
    });
});
