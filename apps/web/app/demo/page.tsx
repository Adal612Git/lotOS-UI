import Link from 'next/link';
import '../demo/demo.css';

export const metadata = {
  title: 'LotOS UI - Product Surface Demos',
  description: 'Flagship product surfaces, before/after comparisons, and component quality previews.',
};

const flagshipDemos = [
  {
    href: '/demo/student-control',
    num: '01',
    title: 'Student Control',
    body: 'Academic system with students, subjects, grades, reports, metrics, and before/after proof.',
    badge: 'Flagship',
    tone: 'green',
  },
  {
    href: '/demo/operator',
    num: '02',
    title: 'Operator Cockpit',
    body: 'Dense command center for incidents, queues, service health, and quick actions.',
    badge: 'Ops',
    tone: 'red',
  },
  {
    href: '/demo/con-lotos-hoja',
    num: '03',
    title: 'Spreadsheet Ops',
    body: 'Turns spreadsheet work into a command surface with KPI ribbon, status, and action framing.',
    badge: 'Modernization',
    tone: 'blue',
  },
];

const comparisonDemos = [
  ['/demo/sin-lotos-web', '/demo/con-lotos-web', 'Web admin'],
  ['/demo/sin-lotos-hoja', '/demo/con-lotos-hoja', 'Spreadsheet'],
  ['/demo/sin-lotos-desktop', '/demo/con-lotos-desktop', 'Desktop shell'],
  ['/demo/sin-lotos-desktop-langs', '/demo/con-lotos-desktop-langs', 'Multi-language desktop'],
] as const;

const secondaryDemos = [
  { href: '/demo/components', title: 'Component Catalog', body: 'Foundation components with quality status and product-context previews.' },
  { href: '/demo/vault', title: 'Vault Preview', body: 'Shows what premium access unlocks without exposing the private payload.' },
];

export default function DemoIndexPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI Demos
        </div>
        <nav className="demo-nav">
          <Link href="/">Home</Link>
          <Link href="/demo/components">Components</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/team-access">Team QA</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Product surfaces, not isolated widgets</p>
        <h1 className="demo-page-title">Open the demos that prove the transformation.</h1>
        <p className="demo-page-subtitle">
          Start with the three flagship surfaces. The rest of the page is supporting evidence:
          before/after comparisons, component quality, and the protected vault preview.
        </p>

        <div className="demo-index-grid">
          {flagshipDemos.map((demo) => (
            <Link key={demo.href} href={demo.href} className={`demo-index-card ${demo.tone === 'green' ? 'green' : demo.tone === 'blue' ? 'violet' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span className="demo-index-num">{demo.num}</span>
                <span className={`demo-badge ${demo.tone}`}>{demo.badge}</span>
              </div>
              <h2 className="demo-index-card-title">{demo.title}</h2>
              <p className="demo-index-card-body">{demo.body}</p>
              <span className="demo-index-cta">Open demo -&gt;</span>
            </Link>
          ))}
        </div>

        <div className="demo-divider" />

        <p className="demo-section-label">Before/after proof</p>
        <h2 style={{ margin: '0 0 8px', color: '#F0F4FF', fontSize: 22 }}>Same workflow. Better product surface.</h2>
        <p className="demo-page-subtitle">
          These pairs keep the raw version visible so the value is visual, not just copy.
        </p>
        <div className="demo-comparison-grid">
          {comparisonDemos.map(([before, after, title]) => (
            <article key={title} className="demo-index-card">
              <span className="demo-index-num">{title}</span>
              <h2 className="demo-index-card-title">Before and after</h2>
              <p className="demo-index-card-body">
                Compare a plain generated or native screen against the LotOS surface for the same use case.
              </p>
              <div className="demo-btn-row">
                <Link href={before} className="demo-btn ghost">Raw</Link>
                <Link href={after} className="demo-btn primary">LotOS</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="demo-divider" />

        <p className="demo-section-label">Foundation and premium proof</p>
        <div className="demo-index-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {secondaryDemos.map((demo) => (
            <Link key={demo.href} href={demo.href} className="demo-index-card violet">
              <h2 className="demo-index-card-title">{demo.title}</h2>
              <p className="demo-index-card-body">{demo.body}</p>
              <span className="demo-index-cta">Open -&gt;</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
