import Link from 'next/link';
import { getServerSession } from 'next-auth';
import './lotos-landing.css';
import { authOptions } from '../auth-options';
import { AuthAction } from './auth-action';
import { foundersOffer, salesLinks, salesPlans } from './sales-config';

const runtimeRows = [
  ['React', 'Stable', 'Stable', '27 shipped components in the public package'],
  ['Web Components', 'Prototype', 'Prototype', '4 published primitives'],
  ['Laravel / Django / Flask', 'Alpha', 'Alpha', '5 shared adapter primitives + web starters'],
  ['Spring / .NET / Go', 'Alpha', 'Alpha', '5 shared adapter primitives + web starters'],
  ['Python / .NET / Java / Rust Desktop', 'Alpha', 'Alpha', '4 demo apps plus 8 desktop templates'],
  ['C / C++ Desktop', 'Prototype', 'Prototype', 'Template metadata and WebView starters'],
];

const commandBlock = `pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s java-spring-starter -d mongodb -o stack/java-spring
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`;

const homepageTierFocus: Record<string, string[]> = {
  solo: ['Private proof', 'Fast paid entry'],
  pro: ['Reusable premium assets', 'Team-ready delivery'],
  'launch-pack': ['Full-suite exclusives', 'Highest polish handoff'],
};

const homepageAccentCycle = ['accent-cyan', 'accent-emerald', 'accent-amber', 'accent-violet', 'accent-rose'] as const;

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;
  const paidPlans = salesPlans.filter((plan) => plan.kind === 'paid');

  return (
    <main className="landing">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          {signedInEmail ? (
            <>
              <Link href="/vault">Vault</Link>
              <a href="/api/auth/signout?callbackUrl=/">Sign Out</a>
            </>
          ) : (
            <Link href="/login">Sign In</Link>
          )}
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero">
        <p className="kicker">Founders pricing from MX$59 / mes | first 20 customers</p>
        <h1>Schema-backed UI your AI agent can use with fewer blind guesses.</h1>
        <p className="lead">
          27 React components, 4 web components, MCP contracts, and starter tracks for PHP, Python,
          Java, .NET, Go, C, and C++. React is the stable surface; the rest ship as adapter or
          template tracks with alpha/prototype status. The commercial surface now scales in three
          tiers: proof, production assets, and full-suite premium polish during the current founders window.
        </p>
        {signedInEmail ? (
          <p className="lead">Signed in as {signedInEmail}. You can check free and paid access status in the vault.</p>
        ) : null}
        <div className="hero-actions">
          <Link href="/docs/installation" className="btn primary">Get Started</Link>
          <Link href="/pricing" className="btn ghost">Pricing</Link>
          {signedInEmail ? (
            <Link href="/vault" className="btn ghost">Open Vault</Link>
          ) : (
            <AuthAction mode="signin" callbackUrl="/vault" className="btn ghost">Sign In With Google</AuthAction>
          )}
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
        <article><strong>27</strong><span>React Components</span></article>
        <article><strong>4</strong><span>Web Components</span></article>
        <article><strong>8</strong><span>Desktop Templates</span></article>
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

      <section className="tier-grid">
        {paidPlans.map((plan, index) => {
          const classes = `card ${plan.kind === 'paid' ? 'highlight' : ''}`;
          const hasDirectCheckout = plan.paymentActions.some((action) => action.tone !== 'ghost');
          const tierHighlights = homepageTierFocus[plan.id] ?? [];
          const ribbon =
            index === 0 ? 'Premium Entry' : index === 1 ? 'Best Balance' : 'Full Suite';

          const content = (
            <>
              <div className="tier-head">
                <div className="tier-title-block">
                  <p className="plan-tier">{foundersOffer.label}</p>
                  <h3>{plan.name}</h3>
                  <p>{plan.audience}</p>
                </div>
                <span className="tier-badge">{ribbon}</span>
              </div>
              <p className="price-label compact">{plan.priceLabel}</p>
              <p>{plan.summary}</p>
              {tierHighlights.length > 0 ? (
                <div className="tier-pill-grid compact" aria-label={`Highlights for ${plan.name}`}>
                  {tierHighlights.map((item, itemIndex) => (
                    <span
                      key={`${plan.id}-${item}`}
                      className={`tier-pill ${homepageAccentCycle[(itemIndex + index) % homepageAccentCycle.length]}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="payment-meta" aria-label={`Summary checkout for ${plan.name}`}>
                <span
                  className={`payment-chip ${hasDirectCheckout ? 'ready' : 'manual'}`}
                >
                  {hasDirectCheckout ? 'Checkout ready' : 'Manual checkout'}
                </span>
                {plan.paymentActions.some((action) => action.tone === 'paypal') ? (
                  <span className="payment-chip alt">PayPal backup</span>
                ) : null}
              </div>
              <p className="plan-note">{plan.checkoutHint}</p>
              <span
                className={`btn ${plan.paymentActions[0]?.tone === 'paypal' ? 'paypal' : plan.kind === 'paid' ? 'primary' : 'ghost'} button-like`}
              >
                {plan.paymentActions[0]?.label ?? plan.ctaLabel}
              </span>
            </>
          );

          return plan.external ? (
            <a key={plan.id} href={plan.href} target="_blank" rel="noreferrer" className={`${classes} tier-card ${plan.id}`}>
              {content}
            </a>
          ) : (
            <Link key={plan.id} href={plan.href} className={`${classes} tier-card ${plan.id}`}>
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Free vs Paid</h2>
          <ul>
            <li>Free surface stays public and MIT for trust and adoption.</li>
            <li>Paid surface now ladders from Solo proof into Pro assets and Full Signature polish.</li>
            <li>The current founders price is reserved for the first 20 customers only.</li>
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


