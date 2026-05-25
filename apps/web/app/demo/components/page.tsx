import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Component Catalog - LotOS UI Demo',
  description: 'Foundation components, quality matrix, and product-surface previews for LotOS UI.',
};

const qualityRows = [
  ['Button', 'Stable', 'Yes', 'Yes', 'Light/Dark', 'Ready'],
  ['Badge', 'Stable', 'N/A', 'Yes', 'Light/Dark', 'Ready'],
  ['Card', 'Stable', 'N/A', 'Yes', 'Light/Dark', 'Ready'],
  ['Input', 'Stable', 'Yes', 'Yes', 'Light/Dark', 'Ready'],
  ['Select', 'Needs polish', 'Partial', 'Yes', 'Dark', 'Replace native look'],
  ['Modal', 'Preview', 'Partial', 'Yes', 'Dark', 'Layering audit'],
  ['DataGridPro', 'Roadmap', 'Planned', 'Planned', 'Both', 'Pro surface'],
  ['ReportSurface', 'Roadmap', 'Planned', 'Planned', 'Both', 'Pro surface'],
];

const productionComponents = [
  'Button',
  'Badge',
  'Card',
  'Input',
  'Alert',
  'Progress',
  'Stat',
  'Tabs',
  'Table',
  'Skeleton',
  'Toast',
  'Tooltip',
];

export default function ComponentsDemoPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI Component Catalog
        </div>
        <div className="demo-header-center">
          <span className="demo-badge blue">Foundation</span>
          <span className="demo-badge amber">Quality matrix</span>
          <span className="demo-badge violet">Pro roadmap</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">All Demos</Link>
          <Link href="/demo/student-control">Flagship</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Component foundation with honest status</p>
        <h1 className="demo-page-title">Components are the foundation. Product surfaces are the premium value.</h1>
        <p className="demo-page-subtitle">
          This page keeps the catalog useful without overselling. Stable pieces stay visible,
          incomplete Pro pieces are marked clearly, and the flagship demos show how the parts become a product.
        </p>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Quality matrix</p>
          <table className="demo-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Status</th>
                <th>Keyboard</th>
                <th>SSR</th>
                <th>Theme</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {qualityRows.map(([component, status, keyboard, ssr, theme, action]) => (
                <tr key={component}>
                  <td style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 800 }}>{component}</td>
                  <td>
                    <span className={`demo-badge ${status === 'Stable' ? 'green' : status === 'Needs polish' ? 'amber' : 'violet'}`}>
                      {status}
                    </span>
                  </td>
                  <td>{keyboard}</td>
                  <td>{ssr}</td>
                  <td>{theme}</td>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Stable foundation preview</p>
          <div className="demo-comp-row">
            <button className="demo-sbutton primary">Primary action</button>
            <button className="demo-sbutton secondary">Secondary</button>
            <button className="demo-sbutton outline">Outlined</button>
            <button className="demo-sbutton ghost">Ghost</button>
            <button className="demo-sbutton danger">Destructive</button>
            <button className="demo-sbutton success">Confirm</button>
          </div>
        </section>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Status, metrics, and data</p>
          <div className="demo-comp-grid-3">
            <div className="demo-sstat">
              <strong>428</strong>
              <span>Students tracked</span>
            </div>
            <div className="demo-sstat" style={{ borderColor: 'rgba(34,197,94,0.22)', background: 'rgba(34,197,94,0.04)' }}>
              <strong>91.2%</strong>
              <span>Attendance</span>
            </div>
            <div className="demo-sstat" style={{ borderColor: 'rgba(139,92,246,0.22)', background: 'rgba(139,92,246,0.05)' }}>
              <strong>14</strong>
              <span>Risk cases</span>
            </div>
          </div>
        </section>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Forms and controls</p>
          <div className="demo-comp-grid-2">
            <div>
              <label className="demo-form-label">Student email</label>
              <input className="demo-sinput" type="email" placeholder="name@school.edu" />
            </div>
            <div>
              <label className="demo-form-label">Plan status</label>
              <select className="demo-sinput" defaultValue="">
                <option value="">Choose tier</option>
                <option>Foundation</option>
                <option>Pro Studio</option>
                <option>Full Signature</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="demo-form-label">Implementation note</label>
              <textarea className="demo-sinput" rows={3} placeholder="Describe the workflow to generate..." />
            </div>
          </div>
        </section>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">Production foundation list</p>
          <div className="demo-comp-row">
            {productionComponents.map((component) => (
              <span key={component} className="demo-badge blue">{component}</span>
            ))}
          </div>
        </section>

        <section className="demo-comp-section">
          <p className="demo-comp-section-label">What becomes Pro</p>
          <div className="demo-comp-grid-3">
            {[
              ['DataGridPro', 'Filters, density, bulk actions, export, and mobile card mode.'],
              ['CommandShell', 'Topbar, sidebar, command palette, notification center, and workspace switcher.'],
              ['ReportSurface', 'Charts, legends, thresholds, recommendations, export, and print view.'],
            ].map(([title, body]) => (
              <article key={title} className="demo-scard accent">
                <p className="demo-scard-title">{title}</p>
                <p className="demo-scard-body">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="demo-btn-row">
          <Link href="/demo/student-control" className="demo-btn primary">Open flagship demo</Link>
          <Link href="/playground" className="demo-btn ghost">Open playground</Link>
          <Link href="/pricing" className="demo-btn ghost">See Pro Studio</Link>
        </div>
      </div>
    </main>
  );
}
