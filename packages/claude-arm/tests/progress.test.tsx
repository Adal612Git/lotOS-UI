import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../src/components/progress/progress';

describe('Progress', () => {
    it('renders clamped percentage label', () => {
        render(<Progress value={120} max={100} label="Deploy progress" />);
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });
});
