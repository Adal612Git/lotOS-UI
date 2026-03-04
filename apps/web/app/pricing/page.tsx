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

type TierSignal = {
  value: string;
  label: string;
};

const accentCycle = ['accent-cyan', 'accent-emerald', 'accent-amber', 'accent-violet', 'accent-rose'] as const;

const freeLayerSignals: TierSignal[] = [
  { value: 'MIT', label: 'Public base' },
  { value: '27+', label: 'Shipped UI' },
  { value: 'CLI', label: 'Included' },
  { value: 'Docs', label: 'Ready' },
];

const freeLayerHighlights = [
  'Public MIT access with real utility',
  'Adoption-safe evaluation path',
  'CLI + docs + runtime guides',
  'Trust layer before any payment',
];

const freeLayerProof = [
  'The free layer now reads as a serious entry product, not a placeholder tier.',
  'It gives teams enough surface area to validate architecture, design quality, and implementation fit before they pay.',
  'That stronger free experience makes the paid ladder feel more legitimate because buyers can clearly see what is public and what becomes premium.',
];

type TierPresentation = {
  eyebrow: string;
  headline: string;
  proof: string;
  pillars: string[];
  signals: TierSignal[];
  compareLabel: string;
};

const defaultTierPresentation: TierPresentation = {
  eyebrow: 'Private proof, fast entry',
  headline: 'A confident first paid step for buyers who need to validate before scaling up.',
  proof:
    'Solo is the trust bridge between the free surface and the real premium product. It proves the commercial layer is alive.',
  pillars: ['Buyer-only vault', 'Premium proof assets', 'Founders pricing lock'],
  signals: [
    { value: '1', label: 'Operator' },
    { value: 'Fast', label: 'Activation' },
    { value: 'Proof', label: 'Before scale' },
  ],
  compareLabel: 'Best when the buyer wants confidence first, not the full reusable payload yet.',
};

const tierPresentation: Record<string, TierPresentation> = {
  solo: defaultTierPresentation,
  pro: {
    eyebrow: 'The real premium product starts here',
    headline: 'Pro is the first tier that feels like a deployable private system, not just gated access.',
    proof:
      'This is where the paid experience becomes materially stronger: reusable assets, structured kits, richer vault value, and clear delivery weight.',
    pillars: ['Protected asset bundle', 'Reusable team kits', 'Production-facing layouts', 'Private implementation packs'],
    signals: [
      { value: 'Teams', label: 'Ready' },
      { value: 'Core', label: 'Paid layer' },
      { value: 'Reusable', label: 'Delivery' },
    ],
    compareLabel: 'Built for teams that expect the purchase to immediately feel like a complete working product.',
  },
  'launch-pack': {
    eyebrow: 'Flagship full-suite delivery',
    headline: 'Full Signature is the top-tier offer for buyers who expect the strongest, most complete premium presentation.',
    proof:
      'This layer extends beyond Pro with exclusive cross-surface assets, executive-facing polish, and the highest-finish commercial handoff in the stack.',
    pillars: ['Everything in Pro', 'Executive launch surfaces', 'Cross-suite operator workflows', 'Highest polish handoff'],
    signals: [
      { value: 'Top', label: 'Tier' },
      { value: 'Full', label: 'Suite' },
      { value: 'Elite', label: 'Presentation' },
    ],
    compareLabel: 'Use this when the buyer is paying for the fullest, most premium version of the product experience.',
  },
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;
  const freePlan = salesPlans.find((plan) => plan.id === 'free');
  const paidPlans = salesPlans.filter((plan) => plan.kind === 'paid');
  const proPlan = paidPlans.find((plan) => plan.id === 'pro');
  const fullPlan = paidPlans.find((plan) => plan.id === 'launch-pack');

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
          private bundle, and `Full Signature` turns the experience into a top-tier commercial
          surface. This founders window stays available only while the first 20 customers are still open.
        </p>
        <div className="payment-meta" aria-label="Accepted payment methods">
          <span className="payment-chip alt accent-cyan">{foundersOffer.label}</span>
          <span className="payment-chip manual accent-violet">{foundersOffer.limitLabel}</span>
          <span className="payment-chip ready accent-emerald">Lemon-ready subscriptions</span>
          <span className="payment-chip alt accent-amber">Mercado Pago fallback</span>
          <span className="payment-chip manual accent-rose">Google vault access</span>
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
            <span className="tier-badge accent-cyan">Trust Layer</span>
          </div>
          <div className="free-rich-panel">
            <div className="free-rich-copy">
              <p className="tier-mini-label">Public layer with real substance</p>
              <h4>The free tier should already feel useful, polished, and worth adopting.</h4>
              <p>
                This is your trust engine: a richer public surface that lets buyers validate the
                platform before they ever need a checkout.
              </p>
            </div>
            <div className="free-signal-grid" aria-label="Free layer signals">
              {freeLayerSignals.map((signal, index) => (
                <div key={signal.label} className={`free-signal ${accentCycle[index % accentCycle.length]}`}>
                  <strong>{signal.value}</strong>
                  <span>{signal.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="free-entry-grid">
            <div className="free-main-stack">
              <div className="tier-price-row">
                <p className="price-label">{freePlan.priceLabel}</p>
                <p className="tier-subcopy">{freePlan.summary}</p>
              </div>
              <div className="tier-pill-grid" aria-label={`Free highlights for ${freePlan.name}`}>
                {freeLayerHighlights.map((item, index) => (
                  <span key={item} className={`tier-pill ${accentCycle[index % accentCycle.length]}`}>
                    {item}
                  </span>
                ))}
              </div>
              <ul>
                {freePlan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="payment-meta" aria-label="Free access state">
                <span className="payment-chip free accent-cyan">No payment required</span>
                <span className="payment-chip manual accent-violet">Entry into the paid ladder</span>
                <span className="payment-chip alt accent-amber">Strong public trust surface</span>
              </div>
              <p className="plan-note">{freePlan.checkoutHint}</p>
              <div className="payment-actions" role="group" aria-label={`Actions for ${freePlan.name}`}>
                {freePlan.paymentActions.map((action) => (
                  <Link key={action.label} href={action.href} className="btn ghost">
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
            <aside className="free-side-card">
              <p className="tier-mini-label">Why free converts</p>
              <h4>Free now carries enough depth to make the premium ladder more credible.</h4>
              <ul className="free-proof-list">
                {freeLayerProof.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      ) : null}

      {proPlan && fullPlan ? (
        <section className="premium-stage">
          <article className="premium-stage-card pro">
            <p className="section-label">Pro Focus</p>
            <h2>{proPlan.name} is where the purchase starts to feel substantial.</h2>
            <p className="micro-note">
              It is not just access. It is the first tier with enough protected assets, reusable kits,
              and implementation structure to feel like a serious premium product.
            </p>
            <div className="premium-stage-list">
              {['Reusable delivery assets', 'Private team-facing vault value', 'Layouts, kits, and manifests with real weight'].map(
                (item, index) => (
                  <span key={item} className={`tier-pill ${accentCycle[index % accentCycle.length]}`}>
                    {item}
                  </span>
                ),
              )}
            </div>
          </article>
          <article className="premium-stage-card full">
            <p className="section-label">Full Focus</p>
            <h2>{fullPlan.name} should feel unmistakably complete.</h2>
            <p className="micro-note">
              This top tier now frames itself as the fullest premium suite: broader workflows,
              executive-facing presentation, and stronger visual proof that the buyer is getting the best package.
            </p>
            <div className="premium-stage-list">
              {['Full-suite exclusive surfaces', 'Boardroom-grade premium polish', 'Highest-finish operator handoff'].map(
                (item, index) => (
                  <span key={item} className={`tier-pill ${accentCycle[(index + 2) % accentCycle.length]}`}>
                    {item}
                  </span>
                ),
              )}
            </div>
          </article>
        </section>
      ) : null}

      <section className="tier-grid">
        {paidPlans.map((plan, index) => {
          const hasDirectCheckout = plan.paymentActions.some((action) => action.tone !== 'ghost');
          const presentation: TierPresentation = tierPresentation[plan.id] ?? defaultTierPresentation;
          const ribbon =
            index === 0 ? 'Premium Entry' : index === 1 ? 'Best Balance' : 'Full Suite';

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

              <div className="tier-luxe-panel">
                <div className="tier-story">
                  <p className="tier-mini-label">{presentation.eyebrow}</p>
                  <h4>{presentation.headline}</h4>
                  <p>{presentation.proof}</p>
                </div>
                <div className="tier-stat-grid" aria-label={`Tier signals for ${plan.name}`}>
                  {presentation.signals.map((signal, signalIndex) => (
                    <div
                      key={`${plan.id}-${signal.label}`}
                      className={`tier-stat ${accentCycle[(signalIndex + index) % accentCycle.length]}`}
                    >
                      <strong>{signal.value}</strong>
                      <span>{signal.label}</span>
                    </div>
                  ))}
                </div>
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
                <div className="tier-pill-grid" aria-label={`Core promise for ${plan.name}`}>
                  {presentation.pillars.map((pillar, pillarIndex) => (
                    <span
                      key={`${plan.id}-${pillar}`}
                      className={`tier-pill ${accentCycle[(pillarIndex + index) % accentCycle.length]}`}
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <p className="tier-compare-note">{presentation.compareLabel}</p>
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

      {proPlan && fullPlan ? (
        <section className="tier-upgrade-panel">
          <div>
            <p className="section-label">Pro and Full</p>
            <h2>Where the premium ladder becomes a complete product story</h2>
            <p className="micro-note">
              `Pro` should win buyers who need reusable premium delivery. `Full Signature` should
              close buyers who want the strongest possible handoff, the broadest surface area, and a visibly richer product.
            </p>
          </div>
          <div className="tier-upgrade-grid">
            <article className="value-card">
              <p className="plan-tier">Why Pro converts</p>
              <h3>{proPlan.name}</h3>
              <p>
                It moves the offer from "premium access" into "premium execution" by adding the real
                protected bundle and a more useful delivery surface.
              </p>
              <ul className="value-list">
                <li>Feels deployable, not decorative.</li>
                <li>Gives teams reusable assets instead of one-time proof.</li>
                <li>Creates a much stronger sense of commercial substance.</li>
              </ul>
            </article>
            <article className="value-card">
              <p className="plan-tier">Why Full feels better</p>
              <h3>{fullPlan.name}</h3>
              <p>
                It is now framed as the flagship package, with extra breadth, top-tier polish, and
                a stronger premium identity than the layer below it.
              </p>
              <ul className="value-list">
                <li>Clearly broader than Pro in both scope and finish.</li>
                <li>Visually positioned as the most complete offer.</li>
                <li>Built for higher-ticket buyers who expect the best version.</li>
              </ul>
            </article>
            <article className="value-card">
              <p className="plan-tier">What the buyer feels</p>
              <h3>Clear ladder, real escalation</h3>
              <p>
                The jump from Solo to Pro and from Pro to Full now reads as a meaningful product
                expansion, not a minor pricing tweak.
              </p>
              <ul className="value-list">
                <li>Better premium hierarchy.</li>
                <li>Stronger justification for paying more.</li>
                <li>More confidence that the top tier is truly complete.</li>
              </ul>
            </article>
          </div>
          <div className="tier-foot-strip">
            <span className="payment-chip alt accent-cyan">Pro = reusable premium delivery</span>
            <span className="payment-chip manual accent-violet">Full = flagship commercial package</span>
            <span className="payment-chip ready accent-emerald">Both stay inside the founders window while the first 20 customers remain open</span>
          </div>
        </section>
      ) : null}

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
              Open Full Signature
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
