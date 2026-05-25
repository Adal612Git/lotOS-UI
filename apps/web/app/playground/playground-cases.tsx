'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  Input,
  Spinner,
} from '@lotosui/claude-arm';
import {
  Accordion,
  Avatar,
  Breadcrumbs,
  Checkbox,
  Combobox,
  Dropdown,
  Form,
  Modal,
  Progress,
  RadioGroup,
  Select,
  Skeleton,
  Stat,
  Switch,
  Table,
  Tabs,
  Textarea,
  Toast,
  Tooltip,
} from '../../../../packages/claude-arm-pro/dist/index.js';

export type Tier = 'free' | 'pro';

export type PlaygroundCase = {
  id: string;
  label: string;
  tier: Tier;
  packageName: '@lotosui/claude-arm' | '@lotosui/claude-arm-pro';
  summary: string;
  plainCode: string;
  lotosCode: string;
  renderPlain: () => ReactNode;
  renderLotos: () => ReactNode;
};

function ModalPlainDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="playground-stack">
      <button className="plain-btn" onClick={() => setOpen(true)}>Open plain modal</button>
      {open ? (
        <div className="plain-backdrop" onClick={() => setOpen(false)}>
          <div className="plain-modal" onClick={(event) => event.stopPropagation()}>
            <h4>Confirm release</h4>
            <p>In plain React you own the overlay, close rules and focus handling.</p>
            <div className="plain-actions">
              <button className="plain-btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="plain-btn danger" onClick={() => setOpen(false)}>Deploy</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ModalLotosDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="playground-stack">
      <Button type="button" size="md" variant="primary" onClick={() => setOpen(true)}>Open LotOS modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm release"
        description="LotOS wraps the dialog structure, close behavior and accessibility wiring."
        size="md"
        closeOnBackdropClick
        closeOnEscape
        showCloseButton
        footer={
          <>
            <Button type="button" size="md" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" size="md" variant="primary" onClick={() => setOpen(false)}>Deploy</Button>
          </>
        }
      >
        <p className="playground-copy">
          Same workflow, but with a reusable modal contract instead of a hand-built overlay.
        </p>
      </Modal>
    </div>
  );
}

function DropdownPlainDemo() {
  return (
    <details className="plain-menu">
      <summary>Plain menu</summary>
      <ul>
        <li>Edit</li>
        <li>Archive</li>
        <li className="danger">Delete</li>
      </ul>
    </details>
  );
}

function DropdownLotosDemo() {
  const [selection, setSelection] = useState('none');

  return (
    <div className="playground-stack">
      <Dropdown
        label="Record actions"
        trigger={<Button type="button" size="md" variant="outline">LotOS menu</Button>}
        items={[
          { value: 'edit', label: 'Edit' },
          { value: 'archive', label: 'Archive' },
          { value: 'delete', label: 'Delete', destructive: true, separator: true },
        ]}
        onSelect={(value: string) => setSelection(value)}
      />
      <small className="playground-note">Selected: {selection}</small>
    </div>
  );
}

function TabsPlainDemo() {
  const [tab, setTab] = useState<'build' | 'verify' | 'deliver'>('build');

  return (
    <div className="plain-tabs">
      <div className="plain-tab-row">
        {(['build', 'verify', 'deliver'] as const).map((item) => (
          <button key={item} className={`plain-tab${tab === item ? ' active' : ''}`} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="plain-panel">
        {tab === 'build'
          ? 'Build contracts first.'
          : tab === 'verify'
            ? 'Verify with tests and visual checks.'
            : 'Deliver only after packaging and gating are ready.'}
      </div>
    </div>
  );
}

function TabsLotosDemo() {
  return (
    <Tabs
      label="Release lanes"
      variant="pills"
      defaultValue="verify"
      tabs={[
        { value: 'build', label: 'Build', content: <p>Build contracts first.</p> },
        { value: 'verify', label: 'Verify', content: <p>Verify with tests and visual checks.</p> },
        { value: 'deliver', label: 'Deliver', content: <p>Deliver only after packaging and gating are ready.</p> },
      ]}
    />
  );
}

function AccordionPlainDemo() {
  return (
    <div className="playground-stack">
      <details className="plain-accordion" open>
        <summary>Onboarding</summary>
        <p>Read the docs, install the package, then theme the surface.</p>
      </details>
      <details className="plain-accordion">
        <summary>Upgrade path</summary>
        <p>Unlock the premium layer when you need the heavier interaction surfaces.</p>
      </details>
    </div>
  );
}

function AccordionLotosDemo() {
  return (
    <Accordion
      defaultValue="onboarding"
      items={[
        { value: 'onboarding', title: 'Onboarding', content: <p>Read the docs, install the package, then theme the surface.</p> },
        { value: 'upgrade', title: 'Upgrade path', content: <p>Unlock the premium layer when you need the heavier interaction surfaces.</p> },
      ]}
    />
  );
}

export const playgroundCases: PlaygroundCase[] = [
  {
    id: 'button',
    label: 'Button',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Primary action surface.',
    plainCode: `function PlainButton() {\n  return <button className="plain-btn">Ship change</button>;\n}`,
    lotosCode: `import { Button } from '@lotosui/claude-arm';\n\n<Button variant="primary">Ship change</Button>;`,
    renderPlain: () => <button className="plain-btn">Ship change</button>,
    renderLotos: () => <Button type="button" size="md" variant="primary">Ship change</Button>,
  },
  {
    id: 'input',
    label: 'Input',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Labelled input with helper text.',
    plainCode: `<label><span>Email</span><input type="email" /></label>`,
    lotosCode: `import { Input } from '@lotosui/claude-arm';\n\n<Input label="Email" type="email" helperText="Use your work email." />;`,
    renderPlain: () => <label className="plain-field"><span>Email</span><input className="plain-input" type="email" placeholder="ops@company.com" /><small>Use your work email.</small></label>,
    renderLotos: () => <Input label="Email" type="email" size="md" placeholder="ops@company.com" helperText="Use your work email." />,
  },
  {
    id: 'alert',
    label: 'Alert',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Feedback banner for warnings and system state.',
    plainCode: `<div role="alert" className="plain-alert warning">Sync delayed by 4 minutes.</div>`,
    lotosCode: `import { Alert } from '@lotosui/claude-arm';\n\n<Alert variant="warning" title="Delayed sync" description="The queue is 4 minutes behind." />;`,
    renderPlain: () => <div className="plain-alert warning">Sync delayed by 4 minutes.</div>,
    renderLotos: () => <Alert variant="warning" title="Delayed sync" description="The queue is 4 minutes behind." />,
  },
  {
    id: 'badge',
    label: 'Badge',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Compact status token.',
    plainCode: `<span className="plain-badge">Active</span>`,
    lotosCode: `import { Badge } from '@lotosui/claude-arm';\n\n<Badge variant="success">Active</Badge>;`,
    renderPlain: () => <span className="plain-badge">Active</span>,
    renderLotos: () => <Badge variant="success" size="sm">Active</Badge>,
  },
  {
    id: 'card',
    label: 'Card',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Reusable content surface.',
    plainCode: `<section className="plain-card"><h4>Control room</h4><p>One reusable container.</p></section>`,
    lotosCode: `import { Card } from '@lotosui/claude-arm';\n\n<Card><strong>Control room</strong><p>One reusable container.</p></Card>;`,
    renderPlain: () => <section className="plain-card"><h4>Control room</h4><p>One reusable container.</p></section>,
    renderLotos: () => <Card padding="md" shadow="sm" border="default"><strong>Control room</strong><p className="playground-copy">One reusable container.</p></Card>,
  },
  {
    id: 'spinner',
    label: 'Spinner',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Loading indicator.',
    plainCode: `<span className="plain-spinner" aria-label="Loading" />`,
    lotosCode: `import { Spinner } from '@lotosui/claude-arm';\n\n<Spinner tone="info" label="Loading release data" />;`,
    renderPlain: () => <span className="plain-spinner" aria-label="Loading" />,
    renderLotos: () => <Spinner size="md" tone="info" label="Loading release data" />,
  },
  {
    id: 'divider',
    label: 'Divider',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Separation primitive for layout rhythm.',
    plainCode: `<hr className="plain-divider" />`,
    lotosCode: `import { Divider } from '@lotosui/claude-arm';\n\n<Divider />;`,
    renderPlain: () => <hr className="plain-divider" />,
    renderLotos: () => <Divider orientation="horizontal" decorative />,
  },
  {
    id: 'empty-state',
    label: 'Empty State',
    tier: 'free',
    packageName: '@lotosui/claude-arm',
    summary: 'Fallback product surface when there is no data.',
    plainCode: `<section className="plain-empty"><h4>No deployments</h4><p>Create the first rollout.</p></section>`,
    lotosCode: `import { Button, EmptyState } from '@lotosui/claude-arm';\n\n<EmptyState title="No deployments" description="Create the first rollout." actions={<Button>Create deployment</Button>} />;`,
    renderPlain: () => <section className="plain-empty"><h4>No deployments</h4><p>Create the first rollout.</p></section>,
    renderLotos: () => <EmptyState title="No deployments" description="Create the first rollout." actions={<Button type="button" size="md" variant="primary">Create deployment</Button>} />,
  },
  {
    id: 'modal',
    label: 'Modal',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Dialog workflow with reusable interaction rules.',
    plainCode: `const [open, setOpen] = useState(false);\n// own overlay, close rules and focus management manually`,
    lotosCode: `import { Modal } from '@lotosui/claude-arm-pro';\n\n<Modal open={open} onClose={close} title="Confirm release">...</Modal>;`,
    renderPlain: () => <ModalPlainDemo />,
    renderLotos: () => <ModalLotosDemo />,
  },
  {
    id: 'dropdown',
    label: 'Dropdown',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Action menu with item states and keyboard handling.',
    plainCode: `<details><summary>Actions</summary><ul><li>Edit</li><li>Archive</li></ul></details>`,
    lotosCode: `import { Dropdown } from '@lotosui/claude-arm-pro';\n\n<Dropdown label="Record actions" trigger={<Button>Actions</Button>} items={[...]} />;`,
    renderPlain: () => <DropdownPlainDemo />,
    renderLotos: () => <DropdownLotosDemo />,
  },
  {
    id: 'combobox',
    label: 'Combobox',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Search-plus-select surface.',
    plainCode: `<input list="owners" placeholder="Search owner" />`,
    lotosCode: `import { Combobox } from '@lotosui/claude-arm-pro';\n\n<Combobox label="Owner" options={[...]} placeholder="Search owner" />;`,
    renderPlain: () => <input className="plain-input" list="owners" placeholder="Search owner" />,
    renderLotos: () => <Combobox label="Owner" placeholder="Search owner" options={[{ value: 'victor', label: 'Victor' }, { value: 'mia', label: 'Mia' }, { value: 'luis', label: 'Luis' }]} />,
  },
  {
    id: 'table',
    label: 'Table',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Operational data table.',
    plainCode: `<table><thead><tr><th>Ticket</th><th>Status</th></tr></thead><tbody>...</tbody></table>`,
    lotosCode: `import { Table } from '@lotosui/claude-arm-pro';\n\n<Table caption="Incident queue" columns={[...]} rows={[...]} />;`,
    renderPlain: () => <table className="plain-table"><thead><tr><th>Ticket</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>#A-118</td><td>Mia</td><td>Queued</td></tr><tr><td>#B-204</td><td>Luis</td><td>Review</td></tr></tbody></table>,
    renderLotos: () => <Table caption="Incident queue" columns={[{ key: 'ticket', label: 'Ticket' }, { key: 'owner', label: 'Owner' }, { key: 'status', label: 'Status' }]} rows={[{ ticket: '#A-118', owner: 'Mia', status: 'Queued' }, { ticket: '#B-204', owner: 'Luis', status: 'Review' }]} />,
  },
  {
    id: 'tabs',
    label: 'Tabs',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Stateful pane switching.',
    plainCode: `const [tab, setTab] = useState('build');`,
    lotosCode: `import { Tabs } from '@lotosui/claude-arm-pro';\n\n<Tabs label="Release lanes" tabs={[...]} variant="pills" />;`,
    renderPlain: () => <TabsPlainDemo />,
    renderLotos: () => <TabsLotosDemo />,
  },
  {
    id: 'accordion',
    label: 'Accordion',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Disclosure pattern for layered content.',
    plainCode: `<details><summary>Onboarding</summary><p>Read docs first.</p></details>`,
    lotosCode: `import { Accordion } from '@lotosui/claude-arm-pro';\n\n<Accordion items={[...]} defaultValue="onboarding" />;`,
    renderPlain: () => <AccordionPlainDemo />,
    renderLotos: () => <AccordionLotosDemo />,
  },
  {
    id: 'form',
    label: 'Form',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Structured shell for grouped actions and fields.',
    plainCode: `<form className="plain-form"><label>Customer<input /></label></form>`,
    lotosCode: `import { Form, Input, Button } from '@lotosui/claude-arm-pro';\n\n<Form title="Customer handoff" actions={<Button>Stage bundle</Button>}>...</Form>;`,
    renderPlain: () => <form className="plain-form"><h4>Customer handoff</h4><label className="plain-field"><span>Customer</span><input className="plain-input" /></label><label className="plain-field"><span>Delivery channel</span><input className="plain-input" /></label></form>,
    renderLotos: () => <Form title="Customer handoff" description="Prepare a private delivery package." spacing="comfortable" actions={<Button type="submit" size="md" variant="primary">Stage bundle</Button>}><Input label="Customer" type="text" size="md" placeholder="LotOS Enterprise" /><Input label="Delivery channel" type="text" size="md" placeholder="Private registry token" /></Form>,
  },
  {
    id: 'select',
    label: 'Select',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Option selection control.',
    plainCode: `<select><option>Solo</option><option>Pro</option></select>`,
    lotosCode: `import { Select } from '@lotosui/claude-arm-pro';\n\n<Select label="Plan" options={[...]} placeholder="Choose plan" />;`,
    renderPlain: () => <select className="plain-input"><option>Solo</option><option>Pro</option><option>Full</option></select>,
    renderLotos: () => <Select label="Plan" placeholder="Choose plan" options={[{ value: 'solo', label: 'Solo' }, { value: 'pro', label: 'Pro' }, { value: 'launch', label: 'Full Signature' }]} />,
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Consent and multi-select control.',
    plainCode: `<label><input type="checkbox" /> Include premium assets</label>`,
    lotosCode: `import { Checkbox } from '@lotosui/claude-arm-pro';\n\n<Checkbox label="Include premium assets" description="Adds Pro files to the bundle." />;`,
    renderPlain: () => <label className="plain-check"><input type="checkbox" /> Include premium assets</label>,
    renderLotos: () => <Checkbox label="Include premium assets" description="Adds Pro files to the bundle." />,
  },
  {
    id: 'radio-group',
    label: 'Radio Group',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Grouped single-choice input.',
    plainCode: `<fieldset><legend>Delivery mode</legend><label><input type="radio" /> Vault</label></fieldset>`,
    lotosCode: `import { RadioGroup } from '@lotosui/claude-arm-pro';\n\n<RadioGroup label="Delivery mode" options={[...]} defaultValue="vault" />;`,
    renderPlain: () => <fieldset className="plain-fieldset"><legend>Delivery mode</legend><label><input type="radio" name="delivery" defaultChecked /> Vault</label><label><input type="radio" name="delivery" /> Private registry</label></fieldset>,
    renderLotos: () => <RadioGroup label="Delivery mode" defaultValue="vault" options={[{ value: 'vault', label: 'Vault download' }, { value: 'registry', label: 'Private registry' }]} />,
  },
  {
    id: 'switch',
    label: 'Switch',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Boolean control for toggles and flags.',
    plainCode: `<label><input type="checkbox" /> Auto unlock</label>`,
    lotosCode: `import { Switch } from '@lotosui/claude-arm-pro';\n\n<Switch label="Auto unlock" description="Grant access after payment." />;`,
    renderPlain: () => <label className="plain-check"><input type="checkbox" defaultChecked /> Auto unlock</label>,
    renderLotos: () => <Switch label="Auto unlock" description="Grant access after payment." defaultChecked />,
  },
  {
    id: 'textarea',
    label: 'Textarea',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Long-form text input with counter support.',
    plainCode: `<textarea rows={4}></textarea>`,
    lotosCode: `import { Textarea } from '@lotosui/claude-arm-pro';\n\n<Textarea label="Notes" showCharCount maxChars={180} />;`,
    renderPlain: () => <textarea rows={4} className="plain-input" />,
    renderLotos: () => <Textarea label="Notes" helperText="Capture launch context." showCharCount maxChars={180} defaultValue="Need Pro access for the rollout team." />,
  },
  {
    id: 'tooltip',
    label: 'Tooltip',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Context hinting for controls.',
    plainCode: `<button title="Only Pro buyers can export this bundle">Export</button>`,
    lotosCode: `import { Tooltip } from '@lotosui/claude-arm-pro';\n\n<Tooltip content="Only Pro buyers can export this bundle"><button>Export</button></Tooltip>;`,
    renderPlain: () => <button className="plain-btn" title="Only Pro buyers can export this bundle">Export</button>,
    renderLotos: () => <Tooltip content="Only Pro buyers can export this bundle"><button className="plain-btn">Export</button></Tooltip>,
  },
  {
    id: 'toast',
    label: 'Toast',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Transient status messaging.',
    plainCode: `<div className="plain-toast">Bundle exported successfully.</div>`,
    lotosCode: `import { Toast } from '@lotosui/claude-arm-pro';\n\n<Toast variant="success" title="Bundle exported" description="The Pro package was staged." />;`,
    renderPlain: () => <div className="plain-toast">Bundle exported successfully.</div>,
    renderLotos: () => <Toast variant="success" title="Bundle exported" description="The Pro package was staged." />,
  },
  {
    id: 'avatar',
    label: 'Avatar',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Identity primitive.',
    plainCode: `<span className="plain-avatar">VR</span>`,
    lotosCode: `import { Avatar } from '@lotosui/claude-arm-pro';\n\n<Avatar name="Victor Romero" size="lg" />;`,
    renderPlain: () => <span className="plain-avatar">VR</span>,
    renderLotos: () => <Avatar name="Victor Romero" size="lg" shape="circle" />,
  },
  {
    id: 'breadcrumbs',
    label: 'Breadcrumbs',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Navigation trail for deeper surfaces.',
    plainCode: `<nav><a>Ops</a> / <a>Vault</a> / <span>Pro</span></nav>`,
    lotosCode: `import { Breadcrumbs } from '@lotosui/claude-arm-pro';\n\n<Breadcrumbs items={[...]} />;`,
    renderPlain: () => <nav className="plain-breadcrumbs"><a href="#">Ops</a><span>/</span><a href="#">Vault</a><span>/</span><strong>Pro</strong></nav>,
    renderLotos: () => <Breadcrumbs separator="/" items={[{ label: 'Ops', href: '#' }, { label: 'Vault', href: '#' }, { label: 'Pro', current: true }]} />,
  },
  {
    id: 'progress',
    label: 'Progress',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Progress visualization for delivery flows.',
    plainCode: `<progress value={72} max={100} />`,
    lotosCode: `import { Progress } from '@lotosui/claude-arm-pro';\n\n<Progress value={72} label="Commercial hardening" />;`,
    renderPlain: () => <progress value={72} max={100} className="plain-progress" />,
    renderLotos: () => <Progress value={72} max={100} variant="info" showLabel label="Commercial hardening" />,
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Placeholder surface for loading states.',
    plainCode: `<div className="plain-skeleton"></div>`,
    lotosCode: `import { Skeleton } from '@lotosui/claude-arm-pro';\n\n<Skeleton width="100%" height="1rem" />;`,
    renderPlain: () => <div className="plain-skeleton" />,
    renderLotos: () => <Skeleton width="100%" height="1rem" shape="line" animated />,
  },
  {
    id: 'stat',
    label: 'Stat',
    tier: 'pro',
    packageName: '@lotosui/claude-arm-pro',
    summary: 'Metric card for KPI-heavy surfaces.',
    plainCode: `<section className="plain-stat"><small>Queue health</small><strong>98.4%</strong></section>`,
    lotosCode: `import { Stat } from '@lotosui/claude-arm-pro';\n\n<Stat label="Queue health" value="98.4%" change="+2.1%" tone="success" />;`,
    renderPlain: () => <section className="plain-stat"><small>Queue health</small><strong>98.4%</strong><span>+2.1%</span></section>,
    renderLotos: () => <Stat label="Queue health" value="98.4%" change="+2.1%" tone="success" helperText="Successful completion rate." />,
  },
];
