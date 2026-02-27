import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LotOS UI Docs - Platform Overview',
  description:
    'Official docs portal for LotOS UI: MCP contracts, multi-runtime matrix, desktop and stack generators, and implementation guides.',
};

const highlights = [
  { value: '80+', label: 'Components' },
  { value: '10', label: 'Generated Stack Templates' },
  { value: '5', label: 'Desktop Language Starters' },
  { value: 'MCP', label: 'Agent Contract Layer' },
];

const runtimeRows = [
  ['React', 'Stable', 'Stable', 'Production arm'],
  ['Web Components', 'Prototype', 'Prototype', 'Cross-framework primitives'],
  ['PHP / Python / Java / .NET / Go', 'Alpha', 'Alpha', 'stack-init + adapter path'],
  ['Python / Java Desktop', 'Alpha', 'Alpha', 'desktop-init + stack-init'],
  ['C / C++ Desktop', 'Prototype', 'Alpha', 'WebView starters'],
];

export default function DocsHomePage() {
  return (
    <main className="docs-home">
      <section className="hero">
        <p className="eyebrow">LotOS UI Docs</p>
        <h1>Multi-runtime UI platform with AI-safe delivery contracts.</h1>
        <p>
          Build interfaces with shared design tokens, schema-safe APIs, MCP endpoints,
          and starter generators for web and desktop stacks.
        </p>
        <div className="actions">
          <Link href="/docs/installation" className="btn primary">Get Started</Link>
          <Link href="/docs/multi-runtime" className="btn ghost">Runtime Guide</Link>
          <Link href="/docs/components/button" className="btn ghost">Component Docs</Link>
        </div>
      </section>

      <section className="stats">
        {highlights.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="grid">
        <article className="card">
          <h2>Platform Capabilities</h2>
          <ul>
            <li>MCP endpoints for components, runtimes, patterns, desktop templates, and stacks.</li>
            <li>CLI generators: `blueprint`, `desktop-init`, and `stack-init`.</li>
            <li>Mongo-capable starters for Laravel, Django, Flask, Spring, .NET, and Go.</li>
            <li>Desktop starters for Python, Java, C, and C++.</li>
            <li>Sentinel guardrails for runtime misuse prevention.</li>
          </ul>
        </article>
        <article className="card">
          <h2>Core Architecture</h2>
          <ul>
            <li>`@lotosui/core`: tokens, schemas, runtime catalog, templates, MCP contracts.</li>
            <li>`@lotosui/claude-arm`: React production component arm.</li>
            <li>`@lotosui/web-components`: interoperable web primitives.</li>
            <li>`@lotosui/cli`: generators and runtime discovery commands.</li>
            <li>`@lotosui/sentinel`: warnings and behavioral guardrails.</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Runtime Classification</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Runtime Group</th>
                <th>Design</th>
                <th>Functional</th>
                <th>Delivery Path</th>
              </tr>
            </thead>
            <tbody>
              {runtimeRows.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Quick Start Commands</h2>
        <pre>
          <code>{`pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`}</code>
        </pre>
      </section>

      <section className="cta">
        <h2>Start with docs, then ship with contracts.</h2>
        <div className="actions">
          <Link href="/docs/installation" className="btn primary">Installation</Link>
          <Link href="/docs/multi-runtime" className="btn ghost">Multi-runtime Guide</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer" className="btn ghost">GitHub</a>
        </div>
      </section>

      <style>{`
        .docs-home {
          min-height: 100vh;
          padding: 28px;
          color: #132840;
          font-family: "Manrope", "Segoe UI", sans-serif;
          background:
            radial-gradient(1100px 460px at -10% 0%, #c8f2e7 0%, transparent 58%),
            radial-gradient(900px 520px at 100% 0%, #d8e5ff 0%, transparent 54%),
            linear-gradient(180deg, #f7f9fc 0%, #ecf2fa 100%);
        }
        .hero,
        .card,
        .stats,
        .grid,
        .cta {
          max-width: 1120px;
          margin: 0 auto;
        }
        .hero h1 {
          margin: 8px 0 0;
          font-size: clamp(34px, 6vw, 60px);
          line-height: 1.03;
          letter-spacing: -0.02em;
        }
        .hero p {
          max-width: 760px;
          color: #4d6381;
          line-height: 1.6;
          font-size: 18px;
        }
        .eyebrow {
          margin: 0;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #0b7a60;
          font-weight: 800;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }
        .btn {
          text-decoration: none;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 800;
          border: 1px solid #cad8eb;
          color: #1b395a;
          background: #fff;
        }
        .btn.primary {
          color: #fff;
          border: none;
          background: linear-gradient(120deg, #0d8d70, #1f6feb);
        }
        .stats {
          margin-top: 16px;
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(130px, 1fr));
        }
        .stats article {
          border: 1px solid #d2e0f1;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.78);
          padding: 12px;
          box-shadow: 0 16px 28px rgba(17, 36, 57, 0.07);
        }
        .stats strong { display: block; font-size: 25px; }
        .stats span {
          font-size: 12px;
          color: #4e6583;
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .grid {
          margin-top: 14px;
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(260px, 1fr));
        }
        .card {
          margin-top: 14px;
          border: 1px solid #d2e0f1;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 20px 34px rgba(17, 36, 57, 0.08);
          padding: 14px;
        }
        .card h2 {
          margin: 0;
          font-size: 21px;
        }
        .card ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #2a486b;
          line-height: 1.6;
        }
        .table-wrap {
          margin-top: 10px;
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }
        th, td {
          border-bottom: 1px solid #d2e0f1;
          text-align: left;
          padding: 9px 8px;
          font-size: 13px;
        }
        th {
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #57708f;
          font-size: 11px;
        }
        pre {
          margin: 10px 0 0;
          background: #f3f7fd;
          border: 1px solid #d2e0f1;
          border-radius: 10px;
          padding: 12px;
          overflow: auto;
          font-size: 12px;
          line-height: 1.5;
          font-family: "JetBrains Mono", "Cascadia Mono", monospace;
          color: #264664;
        }
        .cta {
          margin-top: 14px;
          border: 1px solid #d2e0f1;
          border-radius: 14px;
          background: linear-gradient(180deg, #f8fbff, #eef4ff);
          padding: 18px;
        }
        .cta h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.01em;
        }
        @media (max-width: 900px) {
          .stats { grid-template-columns: repeat(2, minmax(130px, 1fr)); }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
