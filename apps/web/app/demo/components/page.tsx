import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Component Showcase — LotOS UI Demo',
  description: '27 production React components with dark-first design system.',
};

export default function ComponentsDemoPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI — Component System
        </div>
        <div className="demo-header-center">
          <span className="demo-badge violet">27 Components</span>
          <span className="demo-badge green">WCAG 2.2 AAA</span>
          <span className="demo-badge blue">React 19</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">← All Demos</Link>
          <Link href="/docs/components/button">Docs</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Component Library — Interactive Preview</p>
        <h1 className="demo-page-title">27 production components. One design language.</h1>
        <p className="demo-page-subtitle">
          Dark-first, accessible, and built to ship. Every component uses LotOS design tokens
          — no external UI library required.
        </p>

        {/* ── Buttons ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Buttons — 6 variants</p>
          <div className="demo-comp-row">
            <button className="demo-sbutton primary">Primary Action</button>
            <button className="demo-sbutton secondary">Secondary</button>
            <button className="demo-sbutton outline">Outlined</button>
            <button className="demo-sbutton ghost">Ghost</button>
            <button className="demo-sbutton danger">Destructive</button>
            <button className="demo-sbutton success">Confirm</button>
          </div>
        </section>

        {/* ── Badges & Chips ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Badges & Status Chips</p>
          <div className="demo-comp-row">
            <span className="demo-badge red">Critical</span>
            <span className="demo-badge amber">Warning</span>
            <span className="demo-badge green">Success</span>
            <span className="demo-badge blue">Info</span>
            <span className="demo-badge violet">Premium</span>
            <span className="demo-priority high">● HIGH</span>
            <span className="demo-priority med">● MED</span>
            <span className="demo-priority low">● LOW</span>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Stat Cards</p>
          <div className="demo-comp-grid-3">
            <div className="demo-sstat">
              <strong>$48.2K</strong>
              <span>Monthly Revenue</span>
            </div>
            <div className="demo-sstat" style={{ borderColor: 'rgba(139,92,246,0.22)', background: 'rgba(139,92,246,0.05)' }}>
              <strong>2,341</strong>
              <span>Active Users</span>
            </div>
            <div className="demo-sstat" style={{ borderColor: 'rgba(34,197,94,0.22)', background: 'rgba(34,197,94,0.04)' }}>
              <strong>99.8%</strong>
              <span>Uptime SLA</span>
            </div>
          </div>
        </section>

        {/* ── Cards ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Cards — 3 variants</p>
          <div className="demo-comp-grid-3">
            <div className="demo-scard">
              <p className="demo-scard-title">Standard Card</p>
              <p className="demo-scard-body">
                Default surface for content containers. Border + background with subtle elevation.
              </p>
              <button className="demo-sbutton ghost" style={{ fontSize: 12, padding: '6px 12px' }}>Action</button>
            </div>
            <div className="demo-scard glass">
              <p className="demo-scard-title">Glass Card</p>
              <p className="demo-scard-body">
                Glass morphism surface with backdrop blur. Works best over gradient backgrounds.
              </p>
              <div className="demo-comp-row" style={{ gap: 6 }}>
                <span className="demo-badge violet">Glass</span>
                <span className="demo-badge blue">Blur</span>
              </div>
            </div>
            <div className="demo-scard accent">
              <p className="demo-scard-title">Accent Card</p>
              <p className="demo-scard-body">
                Electric red tint for highlighted surfaces, CTAs, and important action zones.
              </p>
              <button className="demo-sbutton primary" style={{ fontSize: 12, padding: '6px 12px' }}>Get Started</button>
            </div>
          </div>
        </section>

        {/* ── Progress ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Progress Bars</p>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { label: 'API Load', value: 72, color: 'blue' as const },
              { label: 'Storage Used', value: 88, color: undefined },
              { label: 'Monthly Budget', value: 54, color: 'amber' as const },
              { label: 'Deployment Progress', value: 91, color: 'green' as const },
              { label: 'Premium Tier Capacity', value: 35, color: 'violet' as const },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.62)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,244,255,0.75)' }}>{item.value}%</span>
                </div>
                <div className="demo-progress-track">
                  <div className={`demo-progress-fill ${item.color ?? ''}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Form inputs ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Form Elements</p>
          <div className="demo-comp-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 8 }}>
                Email Address
              </label>
              <input className="demo-sinput" type="email" placeholder="name@company.com" defaultValue="" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 8 }}>
                Select Plan
              </label>
              <select className="demo-sinput" defaultValue="" style={{ cursor: 'pointer' }}>
                <option value="">Choose tier…</option>
                <option>Solo — MX$59/mo</option>
                <option>Pro — MX$129/mo</option>
                <option>Full Signature — MX$249/mo</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 8 }}>
                Project Description
              </label>
              <textarea
                className="demo-sinput"
                rows={3}
                placeholder="Describe your use case…"
                style={{ resize: 'none' }}
              />
            </div>
          </div>
        </section>

        {/* ── Alerts ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Alerts & Feedback</p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="demo-salert info">ℹ Your account is in free tier. Upgrade to unlock premium surfaces.</div>
            <div className="demo-salert success">✓ Component library successfully installed. You are ready to build.</div>
            <div className="demo-salert warning">⚠ Entitlement check delayed. Vault will retry in 30 seconds.</div>
            <div className="demo-salert danger">✗ Payment processing failed. Check your Mercado Pago or PayPal account.</div>
          </div>
        </section>

        {/* ── Live indicator panel ── */}
        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Status & Live Signals</p>
          <div className="demo-status-strip" style={{ marginTop: 0 }}>
            <div className="demo-status-item"><span className="demo-status-dot green" />React arm stable</div>
            <div className="demo-status-item"><span className="demo-status-dot green" />CLI active</div>
            <div className="demo-status-item"><span className="demo-status-dot amber" />Backend stacks alpha</div>
            <div className="demo-status-item"><span className="demo-status-dot amber" />Desktop prototype</div>
            <div className="demo-status-item"><span className="demo-status-dot green" />Vault gating live</div>
          </div>
        </section>

        <div className="demo-divider" />

        <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.38)', marginBottom: 16 }}>
          Install the full component library in your project:
        </p>
        <div style={{
          padding: '14px 18px',
          borderRadius: 12,
          background: 'rgba(240,244,255,0.04)',
          border: '1px solid rgba(240,244,255,0.1)',
          fontFamily: '"JetBrains Mono", "Cascadia Mono", monospace',
          fontSize: 13,
          color: '#A5B4FC',
          marginBottom: 20,
        }}>
          npm install @lotosui/claude-arm
        </div>

        <div className="demo-btn-row">
          <Link href="/demo/vault" className="demo-btn primary">Next: Premium Vault →</Link>
          <Link href="/docs/components/button" className="demo-btn ghost">Read Component Docs</Link>
          <Link href="/demo" className="demo-btn ghost">All Demos</Link>
        </div>
      </div>
    </main>
  );
}
