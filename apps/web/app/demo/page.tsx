import Link from 'next/link';
import '../demo/demo.css';

export const metadata = {
  title: 'LotOS UI — Live Demos',
  description: 'Three production-quality demo surfaces built with LotOS UI.',
};

export default function DemoIndexPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI
        </div>
        <nav className="demo-nav">
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vault">Vault</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Interactive Demos</p>
        <h1 className="demo-page-title">Three surfaces. One design system.</h1>
        <p className="demo-page-subtitle">
          Every demo is built entirely with LotOS UI components, tokens, and design language.
          No external libraries. No theme overrides.
        </p>

        <div className="demo-index-grid">
          <Link href="/demo/operator" className="demo-index-card">
            <span className="demo-index-num">01</span>
            <h2 className="demo-index-card-title">Operator Command Center</h2>
            <p className="demo-index-card-body">
              A high-pressure enterprise dashboard for support, risk, and dispatch teams.
              Signal-first KPIs, incident queue, real-time status.
            </p>
            <span className="demo-index-cta">Open demo →</span>
          </Link>

          <Link href="/demo/components" className="demo-index-card violet">
            <span className="demo-index-num">02</span>
            <h2 className="demo-index-card-title">Component Showcase</h2>
            <p className="demo-index-card-body">
              All 27 production React components in one dark-theme gallery.
              Buttons, cards, badges, inputs, progress, stats, and alerts.
            </p>
            <span className="demo-index-cta" style={{ color: '#A78BFA' }}>Open demo →</span>
          </Link>

          <Link href="/demo/vault" className="demo-index-card green">
            <span className="demo-index-num">03</span>
            <h2 className="demo-index-card-title">Full Signature Vault</h2>
            <p className="demo-index-card-body">
              Premium gated experience for Full Signature buyers. Six unlocked asset packs,
              tier routing, and protected delivery surfaces.
            </p>
            <span className="demo-index-cta" style={{ color: '#4ADE80' }}>Open demo →</span>
          </Link>
        </div>

        <div className="demo-divider" />

        <p className="demo-section-label">Built with</p>
        <div className="demo-comp-row" style={{ gap: 8 }}>
          {['React 19', '27 Components', 'WCAG 2.2 AAA', 'Dark-first tokens', 'CLI scaffolding', 'Zero external deps'].map((tag) => (
            <span key={tag} className="demo-badge violet">{tag}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
