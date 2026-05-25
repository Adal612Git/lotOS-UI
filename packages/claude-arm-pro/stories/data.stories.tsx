import React from 'react';
import { Breadcrumbs } from '../src/components/breadcrumbs/breadcrumbs';
import { Stat } from '../src/components/stat/stat';
import { Table } from '../src/components/table/table';

export default {
  title: 'LotOS/Data',
  tags: ['autodocs'],
};

export const MetricsAndTable = {
  render: () => (
    <div style={{ width: 760, display: 'grid', gap: 16 }}>
      <Breadcrumbs
        items={[
          { label: 'Ops', href: '/ops' },
          { label: 'Incidents', current: true },
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        <Stat label="Queue health" value="98.4%" change="+2.1%" tone="success" />
        <Stat label="Open approvals" value={12} change="-1" tone="warning" />
        <Stat label="Blocked" value={2} tone="danger" />
      </div>
      <Table
        caption="Incident queue"
        columns={[
          { key: 'ticket', label: 'Ticket' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
        ]}
        rows={[
          { ticket: '#A-118', owner: 'Mia', status: 'Queued' },
          { ticket: '#B-204', owner: 'Luis', status: 'Review' },
        ]}
      />
    </div>
  ),
};
