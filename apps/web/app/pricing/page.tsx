import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import {
  checkoutEnvKeys,
  freeSurface,
  paidSurface,
  premiumPreviewSurface,
  premiumReasonsToPay,
  salesLinks,
  salesPlans
} from '../sales-config';
import '../lotos-landing.css';

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          {signedInEmail ? (
            <>
              <Link href="/vault">Vault</Link>
              <a href="/api/auth/signout?callbackUrl=/pricing">Sign Out</a>
            </>
          ) : (
            <Link href="/login">Sign In</Link>
          )}
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Pricing and Delivery</p>
        <h1>Private acceleration, proof-before-purchase, and configurable sales handoff.</h1>
        <p className="lead">
          The public layer builds trust. The paid layer buys speed, premium assets, and private
          delivery that never ships through the public MIT surface.
        </p>
        {signedInEmail ? (
          <p className="lead">Signed in as {signedInEmail}. You can open the protected vault directly.</p>
        ) : null}
        <div className="hero-actions">
          <a href={salesLinks.contact} className="btn primary" target="_blank" rel="noreferrer">
            Contact Sales
          </a>
          {signedInEmail ? (
            <Link href="/vault" className="btn ghost">
              Open Vault
            </Link>
          ) : (
            <a href="/api/auth/signin/google?callbackUrl=/vault" className="btn ghost">
              Sign In With Google
            </a>
          )}
          <a href={salesLinks.premiumPreview} className="btn ghost" target="_blank" rel="noreferrer">
            Premium Preview
          </a>
        </div>
      </section>

      <section className="grid two">
        <article className="card luxury">
          <p className="section-label">Why buyers pay</p>
          <h2>What unlocks only after payment</h2>
          <ul>
            {premiumReasonsToPay.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card luxury" id="premium-preview">
          <p className="section-label">Proof before purchase</p>
          <h2>Premium Preview for trust and QA</h2>
          <ul>
            {premiumPreviewSurface.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <pre><code>pnpm.cmd run prep:paid-preview</code></pre>
          <div className="hero-actions">
            <a href={salesLinks.premiumPreview} className="btn primary" target="_blank" rel="noreferrer">
              Try Premium Preview
            </a>
          </div>
        </article>
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
            Wire Google OAuth, Supabase entitlements, Lemon Squeezy webhooks, and commercial links
            by setting these environment variables in Vercel.
          </p>
          <pre><code>{checkoutEnvKeys.join("\n")}</code></pre>
        </article>
        <article className="card">
          <p className="section-label">Preview then deliver</p>
          <h2>Two commands, two confidence levels</h2>
          <pre><code>{`pnpm.cmd run prep:paid-preview
pnpm.cmd run prep:first-sale`}</code></pre>
          <p>
            First you generate the evaluation-only premium preview. After payment, you generate
            the full private bundle and customer handoff summary.
          </p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Your internal QA</p>
          <h2>How you verify the paid deliverable</h2>
          <ol>
            <li>Run `prep:paid-preview` and inspect the preview package.</li>
            <li>Validate manifests, previews, and proof copy before talking to the buyer.</li>
            <li>Once the buyer pays, run `prep:first-sale` for the full private handoff.</li>
          </ol>
        </article>
        <article className="card">
          <p className="section-label">Close the deal</p>
          <h2>What happens after the click</h2>
          <ol>
            <li>The buyer signs in with Google and clicks the configured Lemon checkout or contact path.</li>
            <li>Lemon confirms payment and the webhook creates the entitlement in Supabase.</li>
            <li>The buyer opens the protected vault and downloads the paid payload through guarded routes.</li>
          </ol>
          <div className="hero-actions">
            <a href={salesLinks.launchPack} className="btn primary" target="_blank" rel="noreferrer">
              Close Launch Pack
            </a>
            <a href={salesLinks.contact} className="btn ghost" target="_blank" rel="noreferrer">
              Contact Sales
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
