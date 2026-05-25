import React from 'react';
import { Alert } from '../src/components/alert/alert';
import { EmptyState } from '../src/components/empty-state/empty-state';
import { Toast } from '../src/components/toast/toast';
import { Button } from '../src/components/button/button';

export default {
  title: 'LotOS/Surface Patterns',
  tags: ['autodocs'],
};

export const FeedbackStack = {
  render: () => (
    <div style={{ width: 520, display: 'grid', gap: 16 }}>
      <Alert
        variant="warning"
        title="Delayed sync"
        description="The reporting queue is 4 minutes behind the source system."
      />
      <Toast
        variant="success"
        title="Deployment created"
        description="The rollout was queued successfully."
      />
      <EmptyState
        title="No deployments"
        description="Create the first rollout to populate this view."
        actions={<Button variant="primary">Create deployment</Button>}
      />
    </div>
  ),
};
