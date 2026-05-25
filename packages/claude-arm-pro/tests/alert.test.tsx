import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Alert } from '../src/components/alert/alert';

describe('Alert', () => {
    it('renders title and description', () => {
        render(<Alert title="Heads up" description="Audit required" />);
        expect(screen.getByText('Heads up')).toBeInTheDocument();
        expect(screen.getByText('Audit required')).toBeInTheDocument();
    });

    it('supports dismiss action', () => {
        const onDismiss = vi.fn();
        render(<Alert dismissible onDismiss={onDismiss} title="Notice" />);
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
