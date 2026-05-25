import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../src/components/avatar/avatar';

describe('Avatar', () => {
    it('renders initials fallback from name', () => {
        render(<Avatar name="Mia Solis" />);
        expect(screen.getByLabelText('Mia Solis')).toHaveTextContent('MS');
    });

    it('renders img when src is provided', () => {
        const { container } = render(<Avatar src="https://example.com/avatar.png" alt="Profile photo" />);
        expect(screen.getByRole('img', { name: 'Profile photo' })).toBeInTheDocument();
        expect(container.querySelector('.lotos-avatar__image')).toBeInTheDocument();
    });
});
