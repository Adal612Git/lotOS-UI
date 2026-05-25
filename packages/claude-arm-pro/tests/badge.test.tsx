/**
 * @lotos/claude-arm — Badge Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../src/components/badge/badge';

describe('Badge', () => {
    it('renders text content', () => {
        render(<Badge>Active</Badge>);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('applies variant CSS class', () => {
        const { rerender } = render(<Badge variant="success">OK</Badge>);
        expect(screen.getByText('OK')).toHaveClass('lotos-badge--success');

        rerender(<Badge variant="error">Fail</Badge>);
        expect(screen.getByText('Fail')).toHaveClass('lotos-badge--error');
    });

    it('applies size CSS class', () => {
        render(<Badge size="lg">Big</Badge>);
        expect(screen.getByText('Big')).toHaveClass('lotos-badge--lg');
    });

    it('renders dot indicator', () => {
        render(<Badge dot aria-label="Online status" variant="success" />);
        const dotEl = document.querySelector('.lotos-badge__dot');
        expect(dotEl).toBeInTheDocument();
    });

    it('forwards aria-label for dot badges', () => {
        render(<Badge dot aria-label="Offline" variant="error" />);
        // The aria-label is on the span container
        expect(screen.getByLabelText('Offline')).toBeInTheDocument();
    });

    it('combines dot and text content', () => {
        render(<Badge dot variant="success">Connected</Badge>);
        expect(screen.getByText('Connected')).toBeInTheDocument();
        expect(document.querySelector('.lotos-badge__dot')).toBeInTheDocument();
    });

    it('defaults to variant="default" and size="md"', () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText('Default');
        expect(badge).toHaveClass('lotos-badge--default');
        expect(badge).toHaveClass('lotos-badge--md');
    });
});
