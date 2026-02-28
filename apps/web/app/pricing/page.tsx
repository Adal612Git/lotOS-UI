import Link from 'next/link';
import { checkoutEnvKeys, freeSurface, paidSurface, salesLinks, salesPlans } from '../sales-config';
import '../lotos-landing.css';

export default function PricingPage() {
  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Pricing and Delivery</p>
        <h1>Sellable surfaces, clear tiers, and checkout-ready links.</h1>
        <p className="lead">
          LotOS UI now separates public adoption from proprietary delivery. Free drives trust.
          Private bundles drive paid implementation and launch packs.
        </p>
        <div className="hero-actions">
          <a href={salesLinks.contact} className="btn primary" target="_blank" rel="noreferrer">
            Contact Sales
          </a>
          <a href={salesLinks.demo} className="btn ghost" target="_blank" rel="noreferrer">
            Book Demo
          </a>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">What stays free</p>
          <h2>Public trust surface</h2>
          <ul>
            {freeSurface.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <p className="section-label">What gets sold</p>
          <h2>Private delivery surface</h2>
          <ul>
            {paidSurface.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="pricing expanded">
        {salesPlans.map((plan) => {
          const content = (
            <>
              <p className="plan-tier">{plan.kind === "free" ? "Free" : "Paid"}</p>
              <h3>{plan.name}</h3>
              <p className="price-label">{plan.priceLabel}</p>
              <p>{plan.summary}</p>
              <p className="audience">{plan.audience}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <span className={`btn ${plan.kind === "paid" ? "primary" : "ghost"} button-like`}>
                {plan.ctaLabel}
              </span>
            </>
          );

          return plan.external ? (
            <a
              key={plan.id}
              href={plan.href}
              className={`card pricing-card ${plan.kind === "paid" ? "highlight" : ""}`}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <Link
              key={plan.id}
              href={plan.href}
              className={`card pricing-card ${plan.kind === "paid" ? "highlight" : ""}`}
            >
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Checkout wiring</p>
          <h2>Environment keys</h2>
          <p>
            Wire your Stripe, Lemon Squeezy, or booking links by setting these environment variables
            in Vercel.
          </p>
          <pre><code>{checkoutEnvKeys.join("\n")}</code></pre>
        </article>
        <article className="card">
          <p className="section-label">First sale flow</p>
          <h2>One command to prepare delivery</h2>
          <pre><code>pnpm.cmd run prep:first-sale</code></pre>
          <p>
            This prepares the public bundle, private bundle, and final summary for the first
            customer handoff.
          </p>
          <div className="hero-actions">
            <Link href="/docs" className="btn ghost">Open Docs</Link>
            <a href={salesLinks.contact} className="btn primary" target="_blank" rel="noreferrer">
              Close a Deal
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
