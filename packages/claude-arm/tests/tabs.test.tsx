import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../src/components/tabs/tabs';

const tabs = [
    { value: 'account', label: 'Account', content: <div>Account content</div> },
    { value: 'security', label: 'Security', content: <div>Security content</div> },
    { value: 'billing', label: 'Billing', content: <div>Billing content</div> },
    { value: 'advanced', label: 'Advanced', content: <div>Advanced content</div>, disabled: true },
];

function renderTabs(props = {}) {
    return render(<Tabs label="Settings" tabs={tabs} {...props} />);
}

describe('Tabs', () => {
    it('renders tablist with aria-label', () => {
        renderTabs();
        expect(screen.getByRole('tablist', { name: /settings/i })).toBeInTheDocument();
    });

    it('renders all tab buttons', () => {
        renderTabs();
        expect(screen.getAllByRole('tab')).toHaveLength(4);
    });

    it('first non-disabled tab is active by default', () => {
        renderTabs();
        expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
    });

    it('shows content of active tab', () => {
        renderTabs();
        expect(screen.getByText('Account content')).toBeInTheDocument();
    });

    it('does not render inactive panel content (lazy)', () => {
        renderTabs();
        expect(screen.queryByText('Security content')).not.toBeInTheDocument();
    });

    it('switches active tab on click', () => {
        renderTabs();
        fireEvent.click(screen.getByRole('tab', { name: 'Security' }));
        expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Security content')).toBeInTheDocument();
    });

    it('calls onChange when a tab is selected', () => {
        const onChange = vi.fn();
        renderTabs({ onChange });
        fireEvent.click(screen.getByRole('tab', { name: 'Billing' }));
        expect(onChange).toHaveBeenCalledWith('billing');
    });

    it('disabled tab cannot be selected', () => {
        renderTabs();
        expect(screen.getByRole('tab', { name: 'Advanced' })).toBeDisabled();
    });

    it('respects defaultValue prop', () => {
        renderTabs({ defaultValue: 'security' });
        expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowRight moves to next tab and focuses it', () => {
        renderTabs();
        const accountTab = screen.getByRole('tab', { name: 'Account' });
        accountTab.focus();
        fireEvent.keyDown(accountTab, { key: 'ArrowRight' });
        expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
    });

    it('Home key selects first tab', () => {
        renderTabs({ defaultValue: 'billing' });
        const billingTab = screen.getByRole('tab', { name: 'Billing' });
        billingTab.focus();
        fireEvent.keyDown(billingTab, { key: 'Home' });
        expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
    });

    it('tabpanel has aria-labelledby pointing to the tab', () => {
        renderTabs();
        const tab = screen.getByRole('tab', { name: 'Account' });
        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    });
});
