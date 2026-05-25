import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../src/components/empty-state/empty-state';

describe('EmptyState', () => {
    it('renders title and description', () => {
        render(<EmptyState title="No data" description="Create the first record to continue." />);
        expect(screen.getByText('No data')).toBeInTheDocument();
        expect(screen.getByText('Create the first record to continue.')).toBeInTheDocument();
    });
});
