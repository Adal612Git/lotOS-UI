import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Operator Command Center — LotOS UI Demo',
  description: 'Enterprise-grade operations dashboard built with LotOS UI.',
};

const incidents = [
  { id: 'INC-4412', title: 'Payment gateway timeout — Checkout flow', priority: 'high' as const, status: 'Investigating', assignee: 'L. Romero', time: '02m ago' },
  { id: 'INC-4411', title: 'API latency spike — User service >2s', priority: 'high' as const, status: 'Mitigating', assignee: 'A. Torres', time: '07m ago' },
  { id: 'INC-4408', title: 'Scheduled reports delayed — Batch queue', priority: 'med' as const, status: 'Monitoring', assignee: 'R. Silva', time: '23m ago' },
  { id: 'INC-4405', title: 'CDN cache miss ratio elevated (18%)', priority: 'med' as const, status: 'Resolved', assignee: 'K. Mendez', time: '41m ago' },
  { id: 'INC-4399', title: 'Minor auth token refresh delay — Mobile', priority: 'low' as const, status: 'Resolved', assignee: 'D. Vega', time: '1h ago' },
];

const systemStatus = [
  { name: 'API Gateway', status: 'green' as const, uptime: '99.98%' },
  { name: 'Database cluster', status: 'green' as const, uptime: '100%' },
  { name: 'Payment service', status: 'amber' as const, uptime: '99.1%' },
  { name: 'CDN edge nodes', status: 'green' as const, uptime: '99.9%' },
  { name: 'Auth service', status: 'green' as const, uptime: '100%' },
];

const quickActions = [
  { icon: '⚡', label: 'Escalate incident', sub: 'Send to on-call lead' },
  { icon: '📊', label: 'Pull status report', sub: 'Last 4 hours' },
  { icon: '🔔', label: 'Broadcast alert', sub: 'All subscribers' },
  { icon: '🔒', label: 'Lock feature flag', sub: 'Instant rollback' },
  { icon: '📋', label: 'Open runbook', sub: 'Current incident type' },
];

export default function OperatorDemoPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Command Surface
        </div>
        <div className="demo-header-center">
          <div className="demo-live">
            <span className="demo-live-pulse" />
            LIVE
          </div>
          <span className="demo-time">14:23:07 UTC</span>
        </div>
        <div className="demo-header-right">
          <span className="demo-badge red">7 Active alerts</span>
          <nav className="demo-nav">
            <Link href="/demo">← All Demos</Link>
            <Link href="/">LotOS UI</Link>
          </nav>
        </div>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Operator Cockpit — Enterprise Internal Tool Demo</p>

        {/* KPI Row */}
        <div className="demo-kpi-row">
          <article className="demo-kpi-card red">
            <p className="demo-kpi-label">Revenue Today</p>
            <p className="demo-kpi-value">$12,847</p>
            <p className="demo-kpi-meta">
              <span className="demo-delta up">↑ 18.4%</span>
              vs yesterday
            </p>
          </article>
          <article className="demo-kpi-card green">
            <p className="demo-kpi-label">Active Sessions</p>
            <p className="demo-kpi-value">2,341</p>
            <p className="demo-kpi-meta">
              <span className="demo-live-pulse" style={{ width: 5, height: 5 }} />
              <span className="demo-delta up">Real-time</span>
            </p>
          </article>
          <article className="demo-kpi-card blue">
            <p className="demo-kpi-label">System Health</p>
            <p className="demo-kpi-value">99.8%</p>
            <p className="demo-kpi-meta">
              <span className="demo-delta up">✓ All critical services nominal</span>
            </p>
          </article>
          <article className="demo-kpi-card amber">
            <p className="demo-kpi-label">Open Incidents</p>
            <p className="demo-kpi-value">7</p>
            <p className="demo-kpi-meta">
              <span className="demo-delta down">2 HIGH</span>
              · 3 MED · 2 LOW
            </p>
          </article>
        </div>

        {/* Main grid */}
        <div className="demo-main-grid">
          {/* Incident queue */}
          <div className="demo-card">
            <div className="demo-card-head">
              <p className="demo-card-title">Incident Queue</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="demo-badge red">2 High</span>
                <span className="demo-badge amber">3 Med</span>
              </div>
            </div>
            <table className="demo-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td className="mono">{inc.id}</td>
                    <td style={{ maxWidth: 260, color: 'rgba(240,244,255,0.88)' }}>{inc.title}</td>
                    <td>
                      <span className={`demo-priority ${inc.priority}`}>
                        {inc.priority === 'high' ? '● HIGH' : inc.priority === 'med' ? '● MED' : '● LOW'}
                      </span>
                    </td>
                    <td>{inc.status}</td>
                    <td>{inc.assignee}</td>
                    <td style={{ color: 'rgba(240,244,255,0.38)' }}>{inc.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="demo-divider" />

            {/* Progress metrics */}
            <div style={{ display: 'grid', gap: 12 }}>
              <p className="demo-section-label">Service Load</p>
              {[
                { label: 'API Gateway', value: 72, color: 'blue' as const },
                { label: 'Database Cluster', value: 45, color: 'green' as const },
                { label: 'Payment Service', value: 88, color: 'amber' as const },
                { label: 'Cache Layer', value: 31, color: 'green' as const },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.62)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,244,255,0.75)' }}>{item.value}%</span>
                  </div>
                  <div className="demo-progress-track">
                    <div className={`demo-progress-fill ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Quick Actions</p>
              </div>
              <div className="demo-action-list">
                {quickActions.map((action) => (
                  <div key={action.label} className="demo-action-item">
                    <span className="demo-action-icon">{action.icon}</span>
                    <div className="demo-action-copy">
                      <strong>{action.label}</strong>
                      <span>{action.sub}</span>
                    </div>
                    <span className="demo-badge blue">→</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">System Status</p>
                <span className="demo-badge green">All nominal</span>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {systemStatus.map((svc) => (
                  <div key={svc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(240,244,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="demo-status-dot" style={{ background: svc.status === 'green' ? '#22C55E' : '#F59E0B', boxShadow: `0 0 5px ${svc.status === 'green' ? 'rgba(34,197,94,0.6)' : 'rgba(245,158,11,0.6)'}` }} />
                      <span style={{ fontSize: 13, color: 'rgba(240,244,255,0.75)' }}>{svc.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: svc.status === 'green' ? '#86EFAC' : '#FDE68A' }}>{svc.uptime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div className="demo-status-strip">
          <div className="demo-status-item"><span className="demo-status-dot green" />All regions online</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Auth service nominal</div>
          <div className="demo-status-item"><span className="demo-status-dot amber" />Payment latency elevated</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />CDN 99.9% hit rate</div>
          <div className="demo-status-item" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.3)' }}>Built with LotOS UI</span>
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/demo/components" className="demo-btn primary">Next: Component Showcase →</Link>
          <Link href="/demo" className="demo-btn ghost">All Demos</Link>
          <Link href="/pricing" className="demo-btn ghost">See Premium Ladder</Link>
        </div>
      </div>
    </main>
  );
}
