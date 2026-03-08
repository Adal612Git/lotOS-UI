import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Full Signature Vault — LotOS UI Demo',
  description: 'Premium vault experience for Full Signature tier buyers.',
};

const unlockedAssets = [
  {
    icon: '📊',
    name: 'Excel Integration Pack',
    desc: 'Command ribbons, macro-driven facelift, and branded layouts for existing workbooks.',
    tag: 'Full Signature',
    size: '4 templates',
  },
  {
    icon: '📧',
    name: 'Outlook Command Shell',
    desc: 'Professional email templates, signature blocks, and meeting briefing formats.',
    tag: 'Full Signature',
    size: '12 templates',
  },
  {
    icon: '🎨',
    name: 'Figma Mastery Bundle',
    desc: 'LotOS UI component library for Figma with full design token variables.',
    tag: 'Full Signature',
    size: '200+ frames',
  },
  {
    icon: '🖥️',
    name: 'Control Room Desktop',
    desc: 'Electron-ready operator dashboard shell with real-time data connectors.',
    tag: 'Full Signature',
    size: '6 layouts',
  },
  {
    icon: '🤖',
    name: 'AI Agent Dashboard',
    desc: 'MCP-compatible command surface for Claude and multi-model agent workflows.',
    tag: 'Full Signature',
    size: '3 surfaces',
  },
  {
    icon: '📈',
    name: 'Power BI Connector',
    desc: 'LotOS-branded Power BI theme, custom visuals, and executive report templates.',
    tag: 'Full Signature',
    size: '8 reports',
  },
];

const proOnlyAssets = [
  { name: 'Industry Kit — SaaS', tier: 'Pro + Full' },
  { name: 'Team Delivery Layouts', tier: 'Pro + Full' },
  { name: 'Protected CLI Templates', tier: 'Pro + Full' },
];

const soloOnlyAssets = [
  { name: 'Premium Proof Pack', tier: 'Solo + above' },
  { name: 'Sales Preview Assets', tier: 'Solo + above' },
  { name: 'Evaluation Materials', tier: 'Solo + above' },
];

export default function VaultDemoPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI Vault
        </div>
        <div className="demo-header-center">
          <span className="demo-live">
            <span className="demo-live-pulse" />
            Full Signature Access
          </span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">← All Demos</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vault">Real Vault</Link>
        </nav>
      </header>

      {/* Premium hero */}
      <div className="demo-premium-hero">
        <div>
          <p className="demo-section-label">Premium Access Surface — Demo Preview</p>
          <h1 className="demo-page-title">Full Signature Vault</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'rgba(240,244,255,0.52)', maxWidth: 560 }}>
            Six premium asset packs unlocked. Exclusive integrations for Excel, Outlook, Figma,
            desktop, AI agents, and Power BI — on top of the full Pro bundle.
          </p>
        </div>
        <div className="demo-tier-ladder">
          <span className="demo-tier-rung active">Full Signature</span>
          <span className="demo-tier-rung inactive">Pro Studio</span>
          <span className="demo-tier-rung inactive">Solo</span>
          <span className="demo-tier-rung inactive">Free</span>
        </div>
      </div>

      <div className="demo-body">
        {/* Access state KPIs */}
        <div className="demo-kpi-row">
          <article className="demo-kpi-card violet">
            <p className="demo-kpi-label">Access Level</p>
            <p className="demo-kpi-value" style={{ fontSize: 22 }}>Full Signature</p>
            <p className="demo-kpi-meta"><span className="demo-delta up">✓ All tiers included</span></p>
          </article>
          <article className="demo-kpi-card green">
            <p className="demo-kpi-label">Unlocked Assets</p>
            <p className="demo-kpi-value">6</p>
            <p className="demo-kpi-meta">Full Signature exclusives</p>
          </article>
          <article className="demo-kpi-card blue">
            <p className="demo-kpi-label">Pro Assets</p>
            <p className="demo-kpi-value">3</p>
            <p className="demo-kpi-meta">Included with Full</p>
          </article>
          <article className="demo-kpi-card amber">
            <p className="demo-kpi-label">Total Value</p>
            <p className="demo-kpi-value">MX$249</p>
            <p className="demo-kpi-meta">/ month · Founders pricing locked</p>
          </article>
        </div>

        {/* Unlocked assets */}
        <p className="demo-section-label" style={{ marginBottom: 14 }}>Unlocked — Full Signature Exclusives</p>
        <div className="demo-asset-grid">
          {unlockedAssets.map((asset) => (
            <article key={asset.name} className="demo-asset-card unlocked">
              <span className="demo-asset-icon">{asset.icon}</span>
              <div>
                <p className="demo-asset-name">{asset.name}</p>
                <p className="demo-asset-desc">{asset.desc}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="demo-asset-tag">✓ {asset.tag}</span>
                <span style={{ fontSize: 11, color: 'rgba(240,244,255,0.4)' }}>{asset.size}</span>
              </div>
              <button className="demo-btn violet full">Download Pack</button>
            </article>
          ))}
        </div>

        <div className="demo-divider" />

        {/* Locked for lower tiers */}
        <p className="demo-section-label" style={{ marginBottom: 14 }}>
          Also Included (Pro Studio layer — unlocked for this tier)
        </p>
        <div className="demo-locked-grid" style={{ opacity: 1 }}>
          {proOnlyAssets.map((item) => (
            <div key={item.name} className="demo-locked-item" style={{ opacity: 1, borderColor: 'rgba(245,158,11,0.18)', background: 'rgba(245,158,11,0.04)' }}>
              <strong>✓ {item.name}</strong>
              <span>{item.tier}</span>
            </div>
          ))}
          {soloOnlyAssets.map((item) => (
            <div key={item.name} className="demo-locked-item" style={{ opacity: 1, borderColor: 'rgba(59,130,246,0.18)', background: 'rgba(59,130,246,0.04)' }}>
              <strong>✓ {item.name}</strong>
              <span>{item.tier}</span>
            </div>
          ))}
        </div>

        <div className="demo-locked-section">
          <p className="demo-section-label">What Solo buyers see instead</p>
          <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.42)', margin: '0 0 14px' }}>
            Solo and Pro buyers see a locked placeholder here. Full Signature is the only tier
            with access to all 6 integration packs above.
          </p>
          <div className="demo-locked-grid">
            {unlockedAssets.slice(0, 3).map((asset) => (
              <div key={asset.name} className="demo-locked-item">
                <strong>🔒 {asset.name}</strong>
                <span>Full Signature only</span>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/pricing" className="demo-btn violet">Get Full Signature Access</Link>
          <Link href="/demo/operator" className="demo-btn ghost">← Operator Demo</Link>
          <Link href="/demo" className="demo-btn ghost">All Demos</Link>
          <Link href="/vault" className="demo-btn ghost">Real Vault →</Link>
        </div>
      </div>
    </main>
  );
}
