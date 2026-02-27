import Link from 'next/link';
import './lotos-landing.css';

const runtimeRows = [
  ['React', 'Stable', 'Stable', 'Production arm'],
  ['Web Components', 'Prototype', 'Prototype', 'Cross-framework primitives'],
  ['Laravel / Django / Flask', 'Alpha', 'Alpha', 'stack-init starters + adapter track'],
  ['Spring / .NET / Go', 'Alpha', 'Alpha', 'stack-init starters + adapter track'],
  ['Python / Java Desktop', 'Alpha', 'Alpha', 'desktop-init + stack-init'],
  ['C / C++ Desktop', 'Prototype', 'Alpha', 'WebView starters'],
];

const commandBlock = `pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s java-spring-starter -d mongodb -o stack/java-spring
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`;

export default function HomePage() {
  return (
    <main className="landing">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/docs">Docs</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero">
        <p className="kicker">Early access · Solo from $149</p>
        <h1>The UI platform your AI agent can actually execute without breaking.</h1>
        <p className="lead">
          MCP contracts + schema-safe components + desktop and backend stack starters for real delivery
          in React, PHP, Python, Java, .NET, Go, C and C++.
        </p>
        <div className="hero-actions">
          <Link href="/docs/installation" className="btn primary">Get Started</Link>
          <Link href="/docs/multi-runtime" className="btn ghost">View Runtime Guide</Link>
          <Link href="/design-lab" className="btn ghost">Open Design Lab</Link>
        </div>
      </section>

      <section className="terminal">
        <div className="term-head">terminal</div>
        <pre>
          <code>{`# install
pnpm add @lotosui/claude-arm

# stack generation
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel

# desktop generation
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`}</code>
        </pre>
      </section>

      <section className="stats">
        <article><strong>80+</strong><span>Components</span></article>
        <article><strong>WCAG AAA</strong><span>Accessibility Baseline</span></article>
        <article><strong>MCP</strong><span>AI-native contract layer</span></article>
        <article><strong>10</strong><span>Generated stack templates</span></article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Core Architecture</h2>
          <ul>
            <li>`@lotosui/core`: tokens, schemas, runtimes, patterns, stacks, desktop templates</li>
            <li>`@lotosui/claude-arm`: production React arm</li>
            <li>`@lotosui/web-components`: cross-framework primitives</li>
            <li>`@lotosui/cli`: blueprint, stack-init, desktop-init</li>
            <li>`@lotosui/sentinel`: guardrails and misuse warnings</li>
          </ul>
        </article>
        <article className="card">
          <h2>MCP Endpoints</h2>
          <ul>
            <li>`GET /components` and `POST /components/render`</li>
            <li>`GET /runtimes` and `GET /patterns`</li>
            <li>`GET /desktop/templates`</li>
            <li>`GET /stacks`</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Runtime and Delivery Classification</h2>
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

      <section className="grid two">
        <article className="card">
          <h2>How Teams Use It</h2>
          <ol>
            <li>Select runtime + pattern blueprint.</li>
            <li>Generate stack/desktop starter with CLI.</li>
            <li>Implement domain logic on top of generated contracts.</li>
            <li>Ship with MCP + Sentinel guardrails active.</li>
          </ol>
        </article>
        <article className="card">
          <h2>Quick Commands</h2>
          <pre><code>{commandBlock}</code></pre>
        </article>
      </section>

      <section className="pricing">
        <article className="card">
          <h3>Free</h3>
          <p>Core components, docs, MCP basics, and starter workflows.</p>
        </article>
        <article className="card highlight">
          <h3>Pro</h3>
          <p>Premium templates, advanced starter bundles, and higher velocity support.</p>
        </article>
      </section>

      <footer className="footer">
        <p>LotOS UI · 2026 · Lotos Technologies</p>
        <div>
          <Link href="/docs">Docs</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
