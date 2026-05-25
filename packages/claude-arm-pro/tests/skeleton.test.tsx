import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../src/components/skeleton/skeleton';

describe('Skeleton', () => {
    it('renders with animated class by default', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelector('.lotos-skeleton--animated')).toBeInTheDocument();
    });
});
