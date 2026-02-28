import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../src/components/spinner/spinner';

describe('Spinner', () => {
    it('renders status role with accessible label', () => {
        render(<Spinner label="Loading incidents" />);
        expect(screen.getByRole('status', { name: 'Loading incidents' })).toBeInTheDocument();
    });
});
