import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stat } from '../src/components/stat/stat';

describe('Stat', () => {
    it('renders metric content', () => {
        render(<Stat label="Queue Health" value="98.4%" change="+2.1%" />);
        expect(screen.getByText('Queue Health')).toBeInTheDocument();
        expect(screen.getByText('98.4%')).toBeInTheDocument();
        expect(screen.getByText('+2.1%')).toBeInTheDocument();
    });
});
