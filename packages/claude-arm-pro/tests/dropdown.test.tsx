import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../src/components/dropdown/dropdown';
import { Button } from '../src/components/button/button';

const items = [
    { value: 'edit', label: 'Edit' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'delete', label: 'Delete', destructive: true },
    { value: 'archive', label: 'Archive', disabled: true },
];

function renderDropdown(props = {}) {
    return render(
        <Dropdown
            label="Actions"
            trigger={<Button>Open Menu</Button>}
            items={items}
            {...props}
        />,
    );
}

describe('Dropdown', () => {
    it('renders the trigger button', () => {
        renderDropdown();
        expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
    });

    it('menu is not visible initially', () => {
        renderDropdown();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens menu on trigger click', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders all menu items', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Archive' })).toBeInTheDocument();
    });

    it('calls onSelect when an item is clicked', () => {
        const onSelect = vi.fn();
        renderDropdown({ onSelect });
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        expect(onSelect).toHaveBeenCalledWith('edit', expect.objectContaining({ value: 'edit' }));
    });

    it('closes menu after item selection', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not call onSelect for disabled items', () => {
        const onSelect = vi.fn();
        renderDropdown({ onSelect });
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('closes menu on Escape key', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        expect(screen.getByRole('menu')).toBeInTheDocument();
        fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('menu has aria-label', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Actions');
    });

    it('disabled items have aria-disabled="true"', () => {
        renderDropdown();
        fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
        const archiveItem = screen.getByRole('menuitem', { name: 'Archive' });
        expect(archiveItem).toHaveAttribute('aria-disabled', 'true');
    });
});
