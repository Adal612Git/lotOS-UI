import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from '../src/components/form/form';
import { Button } from '../src/components/button/button';
import { Input } from '../src/components/input/input';

describe('Form', () => {
    it('renders title and description', () => {
        render(
            <Form title="Create deployment" description="Launch a new rollout">
                <Input label="Service" />
            </Form>
        );

        expect(screen.getByText('Create deployment')).toBeInTheDocument();
        expect(screen.getByText('Launch a new rollout')).toBeInTheDocument();
    });

    it('calls onSubmit when submitted', () => {
        const handleSubmit = vi.fn((event: Event) => {
            event.preventDefault();
        });

        const { container } = render(
            <Form onSubmit={handleSubmit}>
                <Input label="Service" />
            </Form>
        );

        const form = container.querySelector('form');
        expect(form).not.toBeNull();
        fireEvent.submit(form as HTMLFormElement);
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('renders footer actions when provided', () => {
        render(
            <Form actions={<Button type="submit">Deploy</Button>}>
                <Input label="Service" />
            </Form>
        );

        expect(screen.getByRole('button', { name: 'Deploy' })).toBeInTheDocument();
    });
});
