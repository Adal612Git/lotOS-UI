import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from '../src/components/radio-group/radio-group';

const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte', disabled: true },
];

describe('RadioGroup', () => {
    it('renders a group of radio buttons', () => {
        render(<RadioGroup label="Framework" options={options} />);
        expect(screen.getByRole('group', { name: /framework/i })).toBeInTheDocument();
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders the legend text', () => {
        render(<RadioGroup label="Pick one" options={options} />);
        expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('no option is selected by default', () => {
        render(<RadioGroup label="Framework" options={options} />);
        screen.getAllByRole('radio').forEach((radio) => {
            expect(radio).not.toBeChecked();
        });
    });

    it('renders defaultValue as pre-selected', () => {
        render(<RadioGroup label="Framework" options={options} defaultValue="vue" />);
        expect(screen.getByRole('radio', { name: 'Vue' })).toBeChecked();
    });

    it('calls onChange when an option is selected', () => {
        const handler = vi.fn();
        render(<RadioGroup label="Framework" options={options} onChange={handler} />);
        fireEvent.click(screen.getByRole('radio', { name: 'React' }));
        expect(handler).toHaveBeenCalledWith('react');
    });

    it('disabled option is not interactive', () => {
        render(<RadioGroup label="Framework" options={options} />);
        expect(screen.getByRole('radio', { name: 'Svelte' })).toBeDisabled();
    });

    it('all options disabled when group is disabled', () => {
        render(<RadioGroup label="Framework" options={options} disabled />);
        screen.getAllByRole('radio').forEach((radio) => {
            expect(radio).toBeDisabled();
        });
    });

    it('shows error with role="alert"', () => {
        render(<RadioGroup label="Framework" options={options} error="Pick a framework" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Pick a framework');
    });

    it('renders helper text', () => {
        render(<RadioGroup label="Framework" options={options} helperText="Choose your preferred framework" />);
        expect(screen.getByText('Choose your preferred framework')).toBeInTheDocument();
    });

    it('controlled: shows selected from value prop', () => {
        render(<RadioGroup label="Framework" options={options} value="react" onChange={() => { }} />);
        expect(screen.getByRole('radio', { name: 'React' })).toBeChecked();
    });

    it('all radios share the same name for form grouping', () => {
        render(<RadioGroup label="Framework" options={options} />);
        const radios = screen.getAllByRole('radio') as HTMLInputElement[];
        const names = new Set(radios.map((r) => r.name));
        expect(names.size).toBe(1);
    });
});
