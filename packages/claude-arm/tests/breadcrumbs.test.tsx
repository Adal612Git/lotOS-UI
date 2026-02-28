import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '../src/components/breadcrumbs/breadcrumbs';

describe('Breadcrumbs', () => {
    it('renders current page item', () => {
        render(<Breadcrumbs items={[{ label: 'Ops' }, { label: 'Incidents', current: true }]} />);
        expect(screen.getByText('Incidents')).toHaveAttribute('aria-current', 'page');
    });
});
