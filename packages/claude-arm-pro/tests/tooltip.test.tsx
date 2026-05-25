import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Tooltip } from '../src/components/tooltip/tooltip';
import { Button } from '../src/components/button/button';

describe('Tooltip', () => {
    it('renders the trigger element', () => {
        render(
            <Tooltip content="Save your work">
                <Button>Save</Button>
            </Tooltip>,
        );
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('tooltip element is in DOM but aria-hidden initially', () => {
        render(
            <Tooltip content="Tooltip text">
                <Button>Trigger</Button>
            </Tooltip>,
        );
        const tooltip = screen.getByRole('tooltip', { hidden: true });
        expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });

    it('shows tooltip on mouseenter after delay', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Tooltip text" delay={200}>
                <Button>Trigger</Button>
            </Tooltip>,
        );
        const wrapper = screen.getByRole('button').closest('span')!;
        fireEvent.mouseEnter(screen.getByRole('button'));
        act(() => { vi.advanceTimersByTime(200); });
        const tooltip = screen.getByRole('tooltip', { hidden: false });
        expect(tooltip).toBeInTheDocument();
        vi.useRealTimers();
    });

    it('hides tooltip on mouseleave', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Info" delay={0}>
                <Button>Hover me</Button>
            </Tooltip>,
        );
        const btn = screen.getByRole('button');
        fireEvent.mouseEnter(btn);
        act(() => { vi.advanceTimersByTime(0); });
        fireEvent.mouseLeave(btn);
        const tooltip = screen.getByRole('tooltip', { hidden: true });
        expect(tooltip).toHaveAttribute('aria-hidden', 'true');
        vi.useRealTimers();
    });

    it('shows tooltip on focus', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Focus tooltip" delay={0}>
                <Button>Focus me</Button>
            </Tooltip>,
        );
        const btn = screen.getByRole('button');
        fireEvent.focus(btn);
        act(() => { vi.advanceTimersByTime(0); });
        // When visible, aria-hidden is removed so getByRole without hidden succeeds
        expect(screen.getByRole('tooltip', { hidden: false })).toBeInTheDocument();
        vi.useRealTimers();
    });

    it('does not show when disabled', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Hidden" delay={0} disabled>
                <Button>Button</Button>
            </Tooltip>,
        );
        fireEvent.mouseEnter(screen.getByRole('button'));
        act(() => { vi.advanceTimersByTime(0); });
        const tooltip = screen.getByRole('tooltip', { hidden: true });
        expect(tooltip).toHaveAttribute('aria-hidden', 'true');
        vi.useRealTimers();
    });

    it('tooltip has role="tooltip"', () => {
        render(
            <Tooltip content="I am a tooltip">
                <Button>Info</Button>
            </Tooltip>,
        );
        expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });

    it('injects aria-describedby on trigger when visible', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Description" delay={0}>
                <Button>Trigger</Button>
            </Tooltip>,
        );
        const btn = screen.getByRole('button');
        fireEvent.mouseEnter(btn);
        act(() => { vi.advanceTimersByTime(0); });
        const tooltip = screen.getByRole('tooltip');
        expect(btn).toHaveAttribute('aria-describedby', tooltip.id);
        vi.useRealTimers();
    });
});
