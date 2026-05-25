import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from '../src/components/toast/toast';

describe('Toast', () => {
    it('renders title and description', () => {
        render(<Toast title="Saved" description="The rollout was queued." />);
        expect(screen.getByText('Saved')).toBeInTheDocument();
        expect(screen.getByText('The rollout was queued.')).toBeInTheDocument();
    });

    it('supports dismiss action', () => {
        const onDismiss = vi.fn();
        render(<Toast dismissible onDismiss={onDismiss} title="Saved" />);
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss toast' }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
