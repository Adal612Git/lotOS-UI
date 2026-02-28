import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from '../src/components/divider/divider';

describe('Divider', () => {
    it('renders optional label', () => {
        render(<Divider label="Section" />);
        expect(screen.getByText('Section')).toBeInTheDocument();
    });

    it('uses separator role when not decorative', () => {
        render(<Divider decorative={false} />);
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });
});
