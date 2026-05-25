import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from '../src/components/accordion/accordion';

const items = [
    { value: 'what', title: 'What is LotOS UI?', content: <p>A component library.</p> },
    { value: 'how', title: 'How to install?', content: <p>npm install @lotos/claude-arm</p> },
    { value: 'why', title: 'Why use it?', content: <p>Accessibility first.</p>, disabled: true },
];

function renderAccordion(props = {}) {
    return render(<Accordion items={items} {...props} />);
}

describe('Accordion', () => {
    it('renders all trigger buttons', () => {
        renderAccordion();
        expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('all panels are closed by default', () => {
        renderAccordion();
        expect(screen.queryByText('A component library.')).not.toBeInTheDocument();
    });

    it('opens a panel on click', () => {
        renderAccordion();
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        expect(screen.getByText('A component library.')).toBeInTheDocument();
    });

    it('trigger has aria-expanded=false when closed', () => {
        renderAccordion();
        expect(screen.getByRole('button', { name: /what is lotos/i })).toHaveAttribute('aria-expanded', 'false');
    });

    it('trigger has aria-expanded=true when open', () => {
        renderAccordion();
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        expect(screen.getByRole('button', { name: /what is lotos/i })).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes open panel on second click (single mode)', () => {
        renderAccordion();
        const btn = screen.getByRole('button', { name: /how to install/i });
        fireEvent.click(btn);
        expect(screen.getByText('npm install @lotos/claude-arm')).toBeInTheDocument();
        fireEvent.click(btn);
        expect(screen.queryByText('npm install @lotos/claude-arm')).not.toBeInTheDocument();
    });

    it('single mode closes previous when opening new', () => {
        renderAccordion();
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        fireEvent.click(screen.getByRole('button', { name: /how to install/i }));
        expect(screen.queryByText('A component library.')).not.toBeInTheDocument();
        expect(screen.getByText('npm install @lotos/claude-arm')).toBeInTheDocument();
    });

    it('multiple mode allows several open at once', () => {
        renderAccordion({ multiple: true });
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        fireEvent.click(screen.getByRole('button', { name: /how to install/i }));
        expect(screen.getByText('A component library.')).toBeInTheDocument();
        expect(screen.getByText('npm install @lotos/claude-arm')).toBeInTheDocument();
    });

    it('disabled item cannot be opened', () => {
        renderAccordion();
        expect(screen.getByRole('button', { name: /why use it/i })).toBeDisabled();
    });

    it('respects defaultValue (uncontrolled)', () => {
        renderAccordion({ defaultValue: 'what' });
        expect(screen.getByText('A component library.')).toBeInTheDocument();
    });

    it('panel has role=region with aria-labelledby', () => {
        renderAccordion();
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        const region = screen.getByRole('region');
        expect(region).toBeInTheDocument();
        expect(region).toHaveAttribute('aria-labelledby');
    });

    it('calls onChange when toggled', () => {
        const onChange = vi.fn();
        renderAccordion({ onChange });
        fireEvent.click(screen.getByRole('button', { name: /what is lotos/i }));
        expect(onChange).toHaveBeenCalledWith('what');
    });
});
