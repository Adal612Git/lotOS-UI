import Link from 'next/link';
import './lotos-landing.css';
import { salesLinks, salesPlans } from './sales-config';

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
          <Link href="/pricing">Pricing</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero">
        <p className="kicker">Early access | Solo from $149</p>
        <h1>The UI platform your AI agent can actually execute without breaking.</h1>
        <p className="lead">
          MCP contracts + schema-safe components + desktop and backend stack starters for real delivery
          in React, PHP, Python, Java, .NET, Go, C and C++.
        </p>
        <div className="hero-actions">
          <Link href="/docs/installation" className="btn primary">Get Started</Link>
          <Link href="/pricing" className="btn ghost">Pricing</Link>
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
        <article><strong>20+</strong><span>Components</span></article>
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
        {salesPlans.slice(0, 2).map((plan) => {
          const classes = `card ${plan.kind === 'paid' ? 'highlight' : ''}`;
          return plan.external ? (
            <a key={plan.id} href={plan.href} target="_blank" rel="noreferrer" className={classes}>
              <h3>{plan.name}</h3>
              <p className="price-label compact">{plan.priceLabel}</p>
              <p>{plan.summary}</p>
            </a>
          ) : (
            <Link key={plan.id} href={plan.href} className={classes}>
              <h3>{plan.name}</h3>
              <p className="price-label compact">{plan.priceLabel}</p>
              <p>{plan.summary}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Free vs Paid</h2>
          <ul>
            <li>Free surface stays public and MIT for trust and adoption.</li>
            <li>Paid surface ships as private pro bundles, launch packs, and custom starters.</li>
            <li>Open packages are not sold as exclusive assets.</li>
          </ul>
        </article>
        <article className="card">
          <h2>Ready to Close</h2>
          <p>
            The repository already has a one-command preparation flow for the first paid delivery.
          </p>
          <pre><code>pnpm.cmd run prep:first-sale</code></pre>
          <div className="hero-actions">
            <Link href="/pricing" className="btn primary">Open Pricing</Link>
            <a href={salesLinks.contact} className="btn ghost" target="_blank" rel="noreferrer">Contact Sales</a>
          </div>
        </article>
      </section>

      <footer className="footer">
        <p>LotOS UI | 2026 | Lotos Technologies</p>
        <div>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </main>
  );
}


