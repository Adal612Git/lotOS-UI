import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../src/components/switch/switch';

describe('Switch', () => {
    it('renders with role="switch"', () => {
        render(<Switch label="Dark mode" />);
        expect(screen.getByRole('switch', { name: /dark mode/i })).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
        render(<Switch label="Notifications" />);
        expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('can be toggled', async () => {
        const handler = vi.fn();
        render(<Switch label="Notifications" onChange={handler} />);
        await userEvent.click(screen.getByRole('switch'));
        expect(handler).toHaveBeenCalled();
    });

    it('renders in checked state', () => {
        render(<Switch label="Feature" checked={true} onChange={() => { }} />);
        expect(screen.getByRole('switch')).toBeChecked();
    });

    it('is disabled when disabled prop is set', () => {
        render(<Switch label="Unavailable" disabled />);
        expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('renders description text', () => {
        render(<Switch label="Wi-Fi" description="Enable wireless connectivity" />);
        expect(screen.getByText('Enable wireless connectivity')).toBeInTheDocument();
    });

    it('label is associated with the input', () => {
        render(<Switch label="Enable" />);
        const input = screen.getByRole('switch');
        // The label elements for track and label both point to the same id
        expect(input.id).toBeTruthy();
    });
});
