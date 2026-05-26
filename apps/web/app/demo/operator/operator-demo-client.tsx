'use client';

import Link from 'next/link';
import { CommandShell, DataGridPro, ReportSurface, type DataGridColumn, type ReportCard } from '../../product-surface';

type Incident = {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Investigating' | 'Mitigating' | 'Monitoring' | 'Resolved';
  assignee: string;
  service: string;
  minutes: number;
};

const incidents: Incident[] = [
  { id: 'INC-4412', title: 'Payment gateway timeout in checkout flow', priority: 'High', status: 'Investigating', assignee: 'Ops Lead', service: 'Payments', minutes: 2 },
  { id: 'INC-4411', title: 'API latency spike over two seconds', priority: 'High', status: 'Mitigating', assignee: 'Platform', service: 'API Gateway', minutes: 7 },
  { id: 'INC-4408', title: 'Scheduled reports delayed in batch queue', priority: 'Medium', status: 'Monitoring', assignee: 'Data Ops', service: 'Reports', minutes: 23 },
  { id: 'INC-4405', title: 'CDN cache miss ratio elevated', priority: 'Medium', status: 'Resolved', assignee: 'Edge Team', service: 'CDN', minutes: 41 },
  { id: 'INC-4399', title: 'Minor auth token refresh delay', priority: 'Low', status: 'Resolved', assignee: 'Identity', service: 'Auth', minutes: 61 },
];

const serviceLoad = [
  { label: 'API Gateway', value: 72, tone: 'good' as const },
  { label: 'Database cluster', value: 45, tone: 'good' as const },
  { label: 'Payment service', value: 88, tone: 'warn' as const },
  { label: 'Cache layer', value: 31, tone: 'good' as const },
];

const reportCards: ReportCard[] = [
  {
    id: 'revenue',
    title: 'Revenue continuity',
    summary: 'Checkout impact is isolated but still visible to the operator.',
    kpi: '$12.8K',
    trend: '+18.4%',
    confidence: 'High',
    threshold: 84,
    tone: 'good',
    recommendation: 'Keep payment incident open until gateway timeout drops below threshold.',
  },
  {
    id: 'health',
    title: 'System health',
    summary: 'Core services remain stable while payment latency is elevated.',
    kpi: '99.8%',
    trend: 'nominal',
    confidence: 'High',
    threshold: 92,
    tone: 'good',
    recommendation: 'Maintain current mitigation and publish a short status update.',
  },
  {
    id: 'incidents',
    title: 'Incident pressure',
    summary: 'High-priority issues are active but assigned.',
    kpi: '7',
    trend: '2 high',
    confidence: 'Medium',
    threshold: 58,
    tone: 'watch',
    recommendation: 'Escalate if the second high-priority incident is not mitigated in 15 minutes.',
  },
];

const columns: DataGridColumn<Incident>[] = [
  { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: '110px' },
  { id: 'title', header: 'Incident', accessor: 'title', sortable: true },
  {
    id: 'priority',
    header: 'Priority',
    accessor: 'priority',
    sortable: true,
    filterOptions: [
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' },
    ],
    cell: (incident) => (
      <span className="lotos-badge" data-tone={incident.priority === 'High' ? 'danger' : incident.priority === 'Medium' ? 'warn' : 'good'}>
        {incident.priority}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filterOptions: [
      { label: 'Investigating', value: 'Investigating' },
      { label: 'Mitigating', value: 'Mitigating' },
      { label: 'Monitoring', value: 'Monitoring' },
      { label: 'Resolved', value: 'Resolved' },
    ],
  },
  { id: 'service', header: 'Service', accessor: 'service', sortable: true },
  { id: 'assignee', header: 'Assignee', accessor: 'assignee', sortable: true },
  { id: 'minutes', header: 'Age', accessor: 'minutes', sortable: true, align: 'right', cell: (incident) => `${incident.minutes}m` },
];

export function OperatorDemoClient() {
  return (
    <div className="demo-body">
      <CommandShell
        productName="Operator Cockpit"
        subtitle="Operations command room"
        title="Incident command surface"
        description="Dense operations UI with a real shell, command palette, incident grid, service load, and report cards."
        breadcrumbs={['Demo', 'Operator Cockpit']}
        activeItemId="incidents"
        navItems={[
          { id: 'incidents', label: 'Incidents', icon: '01', badge: '7' },
          { id: 'services', label: 'Services', icon: '02', badge: '5' },
          { id: 'reports', label: 'Reports', icon: '03' },
          { id: 'runbooks', label: 'Runbooks', icon: '04' },
        ]}
        workspaces={[
          { label: 'Production', value: 'production', description: 'Live production view' },
          { label: 'Staging', value: 'staging', description: 'Release validation' },
        ]}
        defaultWorkspace="production"
        quickActions={[
          { id: 'escalate', label: 'Escalate incident', icon: 'UP', description: 'Send to on-call lead' },
          { id: 'status', label: 'Status report', icon: 'REP', description: 'Generate the last four hours' },
          { id: 'flag', label: 'Lock feature flag', icon: 'FF', description: 'Prepare instant rollback' },
        ]}
        activities={[
          { label: 'Signal', body: 'Payment latency remains elevated but contained.' },
          { label: 'Action', body: 'On-call lead assigned to high priority queue.' },
        ]}
        actions={<Link href="/demo/components" className="lotos-btn lotos-btn--primary">Open catalog</Link>}
      >
        <div className="demo-main-grid">
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="demo-kpi-row" style={{ marginBottom: 0 }}>
              <article className="demo-kpi-card red">
                <p className="demo-kpi-label">Revenue Today</p>
                <p className="demo-kpi-value">$12,847</p>
                <p className="demo-kpi-meta">+18.4% vs yesterday</p>
              </article>
              <article className="demo-kpi-card green">
                <p className="demo-kpi-label">Active Sessions</p>
                <p className="demo-kpi-value">2,341</p>
                <p className="demo-kpi-meta">Real-time load</p>
              </article>
              <article className="demo-kpi-card blue">
                <p className="demo-kpi-label">System Health</p>
                <p className="demo-kpi-value">99.8%</p>
                <p className="demo-kpi-meta">Critical services nominal</p>
              </article>
              <article className="demo-kpi-card amber">
                <p className="demo-kpi-label">Open Incidents</p>
                <p className="demo-kpi-value">7</p>
                <p className="demo-kpi-meta">2 high, 3 medium, 2 low</p>
              </article>
            </div>
            <DataGridPro
              title="Incident queue"
              rows={incidents}
              columns={columns}
              getRowId={(incident) => incident.id}
              initialDensity="dense"
              csvFilename="operator-incidents.csv"
              rowActions={[
                { label: 'Open', tone: 'primary', onClick: () => undefined },
                { label: 'Escalate', tone: 'danger', onClick: () => undefined },
              ]}
            />
            <ReportSurface
              title="Operator ReportSurface"
              summary="Report cards turn an operations dashboard into an executive-ready incident summary."
              reports={reportCards}
              footerTitle="Built with LotOS UI"
              footerBody="This demo verifies CommandShell, DataGridPro, density controls, filters, and ReportSurface outside the academic flagship."
            />
          </div>
          <aside style={{ display: 'grid', gap: 14 }}>
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Service load</p>
                <span className="demo-badge amber">Payment watch</span>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {serviceLoad.map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: 'rgba(240,244,255,0.62)', fontSize: 12 }}>{item.label}</span>
                      <span className="lotos-badge" data-tone={item.tone}>{item.value}%</span>
                    </div>
                    <div className="demo-progress-track">
                      <div className={`demo-progress-fill ${item.tone === 'good' ? 'green' : 'amber'}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Quick actions</p>
              </div>
              <div className="demo-action-list">
                {['Broadcast alert', 'Open runbook', 'Pull status report', 'Lock feature flag'].map((action) => (
                  <button key={action} className="demo-action-item" type="button">
                    <span className="demo-action-copy">
                      <strong>{action}</strong>
                      <span>Ready command</span>
                    </span>
                    <span className="demo-badge blue">Open</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Activity feed</p>
                <span className="demo-badge green">Live ops</span>
              </div>
              <div className="demo-action-list">
                {[
                  ['02m', 'Gateway timeout acknowledged by Ops Lead.'],
                  ['07m', 'Mitigation running on API Gateway pool.'],
                  ['23m', 'Report queue monitored; no customer-facing outage.'],
                ].map(([time, body]) => (
                  <div key={`${time}-${body}`} className="demo-action-item">
                    <span className="demo-badge blue">{time}</span>
                    <span className="demo-action-copy">
                      <strong>{body}</strong>
                      <span>Incident state retained for handoff.</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </CommandShell>
    </div>
  );
}
