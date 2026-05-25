import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from '../src/components/table/table';

describe('Table', () => {
    it('renders caption, headers, and rows', () => {
        render(
            <Table
                caption="Operations queue"
                columns={[
                    { key: 'job', label: 'Job' },
                    { key: 'state', label: 'State' },
                ]}
                rows={[
                    { job: 'Deploy billing-api', state: 'Queued' },
                    { job: 'Rotate secrets', state: 'Pending' },
                ]}
            />
        );

        expect(screen.getByText('Operations queue')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Job' })).toBeInTheDocument();
        expect(screen.getByText('Deploy billing-api')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders empty state when rows are empty', () => {
        render(
            <Table
                columns={[
                    { key: 'job', label: 'Job' },
                ]}
                rows={[]}
                emptyMessage="Nothing queued."
            />
        );

        expect(screen.getByText('Nothing queued.')).toBeInTheDocument();
    });
});
