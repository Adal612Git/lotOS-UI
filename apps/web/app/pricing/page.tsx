import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import {
  checkoutEnvKeys,
  foundersOffer,
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
  const freePlan = salesPlans.find((plan) => plan.id === 'free');
  const paidPlans = salesPlans.filter((plan) => plan.kind === 'paid');

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
        <h1>Phase 1 founders pricing is live for the first 20 customers, with three tiers that scale in polish.</h1>
        <p className="lead">
          The public layer builds trust. `Solo` gives a premium first step, `Pro` unlocks the real
          private bundle, and `Launch Signature` turns the experience into a top-tier commercial
          surface. This founders window stays available only while the first 20 customers are still open.
        </p>
        <div className="payment-meta" aria-label="Accepted payment methods">
          <span className="payment-chip alt">{foundersOffer.label}</span>
          <span className="payment-chip manual">{foundersOffer.limitLabel}</span>
          <span className="payment-chip ready">Lemon-ready subscriptions</span>
          <span className="payment-chip alt">Mercado Pago fallback</span>
          <span className="payment-chip manual">Google vault access</span>
        </div>
        {signedInEmail ? (
          <p className="lead">Signed in as {signedInEmail}. You can open the protected vault directly.</p>
        ) : null}
        <div className="hero-actions">
          <a href={salesLinks.contact} className="btn primary" target="_blank" rel="noreferrer">
            Talk to Sales
          </a>
          {signedInEmail ? (
            <Link href="/vault" className="btn ghost">
              Open Vault
            </Link>
          ) : (
            <AuthAction mode="signin" callbackUrl="/vault" className="btn ghost">
              Sign In With Google
            </AuthAction>
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

      {freePlan ? (
        <section className="card free-entry">
          <div className="tier-head">
            <div className="tier-title-block">
              <p className="plan-tier">Free Foundation</p>
              <h3>{freePlan.name}</h3>
              <p>{freePlan.audience}</p>
            </div>
            <span className="tier-badge">Trust Layer</span>
          </div>
          <div className="tier-price-row">
            <p className="price-label">{freePlan.priceLabel}</p>
            <p className="tier-subcopy">{freePlan.summary}</p>
          </div>
          <ul>
            {freePlan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="payment-meta" aria-label="Free access state">
            <span className="payment-chip free">No payment required</span>
            <span className="payment-chip manual">Entry into the paid ladder</span>
          </div>
          <p className="plan-note">{freePlan.checkoutHint}</p>
          <div className="payment-actions" role="group" aria-label={`Actions for ${freePlan.name}`}>
            {freePlan.paymentActions.map((action) => (
              <Link key={action.label} href={action.href} className="btn ghost">
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="tier-grid">
        {paidPlans.map((plan, index) => {
          const hasDirectCheckout = plan.paymentActions.some((action) => action.tone !== 'ghost');
          const ribbon =
            index === 0 ? 'Premium Entry' : index === 1 ? 'Best Balance' : 'Signature Tier';

          return (
            <article key={plan.id} className={`tier-card ${plan.id}`}>
              <div className="tier-head">
                <div className="tier-title-block">
                  <p className="plan-tier">{plan.kind === 'paid' ? 'Founders Launch' : 'Free'}</p>
                  <h3>{plan.name}</h3>
                  <p>{plan.audience}</p>
                </div>
                <span className="tier-badge">{ribbon}</span>
              </div>

              <div className="tier-price-row">
                <p className="price-label">{plan.priceLabel}</p>
                <p className="tier-subcopy">
                  {index === 0
                    ? 'Perfect for buyers who want proof and premium confidence without jumping straight into the deep end.'
                    : index === 1
                      ? 'The strongest recurring value tier for teams who need actual protected assets every month.'
                      : 'Your highest-polish monthly tier for the buyers who expect the product to feel elite.'}
                </p>
              </div>

              <div className="tier-stack">
                <p className="tier-promise">{plan.summary}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="payment-meta" aria-label={`Checkout state for ${plan.name}`}>
                <span className={`payment-chip ${hasDirectCheckout ? 'ready' : 'manual'}`}>
                  {hasDirectCheckout ? 'Checkout ready' : 'Manual handoff'}
                </span>
                {index === 0 ? <span className="payment-chip free">1 operator</span> : null}
                {index === 1 ? <span className="payment-chip alt">Team-facing assets</span> : null}
                {index === 2 ? <span className="payment-chip alt">Highest polish</span> : null}
                {plan.paymentActions.some((action) => action.tone === 'paypal') ? (
                  <span className="payment-chip alt">PayPal backup</span>
                ) : null}
                {plan.paymentActions.some((action) => action.tone === 'ghost') ? (
                  <span className="payment-chip manual">Fallback route</span>
                ) : null}
              </div>

              <div className="tier-cta-stack">
                <p className="tier-footnote">{plan.checkoutHint}</p>
                <div className="payment-actions" role="group" aria-label={`Actions for ${plan.name}`}>
                  {plan.paymentActions.map((action) =>
                    action.external ? (
                      <a
                        key={action.label}
                        href={action.href}
                        className={`btn full ${action.tone === 'primary' ? 'primary' : action.tone === 'paypal' ? 'paypal' : 'ghost'}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {action.label}
                      </a>
                    ) : (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={`btn full ${action.tone === 'primary' ? 'primary' : action.tone === 'paypal' ? 'paypal' : 'ghost'}`}
                      >
                        {action.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Checkout wiring</p>
          <h2>Environment keys</h2>
          <p>
            Wire Google OAuth, Supabase entitlements, your Lemon-ready checkout links, and any
            optional fallback payment routes by setting these environment variables in Vercel.
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
            <li>The buyer chooses the tier and locks founders pricing if they are still inside the first 20 customers.</li>
            <li>The checkout flow clears payment and your entitlement path unlocks the matching plan.</li>
            <li>The buyer signs in and experiences a clearly richer vault surface at every paid tier.</li>
          </ol>
          <div className="hero-actions">
            <a href={salesLinks.launchPack} className="btn primary" target="_blank" rel="noreferrer">
              Open Launch Signature
            </a>
            <a href={salesLinks.contact} className="btn ghost" target="_blank" rel="noreferrer">
              Talk to Sales
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
