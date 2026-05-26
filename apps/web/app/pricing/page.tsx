import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import { CommercialFooter } from '../commercial-footer';
import { buildRouteMetadata } from '../../lib/seo';
import { commercialReadiness, foundersOffer, salesLinks, salesPlans, type PaymentAction, type SalesPlan } from '../sales-config';
import '../lotos-landing.css';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Pricing',
  description: 'Free Foundation, Pro Studio, and Full Signature access for LotOS UI product surfaces.',
  path: '/pricing',
});

const planPosition: Record<string, string> = {
  free: 'Evaluate',
  solo: 'Private proof',
  pro: 'Best for delivery',
  'launch-pack': 'Flagship suite',
};

const planCopy: Record<string, { title: string; body: string; unlocks: string[] }> = {
  free: {
    title: 'Free Foundation',
    body: 'Inspect the public system, demos, docs, and component foundation before paying.',
    unlocks: ['Public demos', 'Component foundation', 'CLI and docs', 'Runtime roadmap'],
  },
  solo: {
    title: 'Solo Access',
    body: 'A private proof tier for one operator who wants to validate premium value quickly.',
    unlocks: ['Buyer-only vault', 'Premium previews', 'Sales proof assets', 'Guided evaluation'],
  },
  pro: {
    title: 'Pro Studio',
    body: 'The working tier for teams that need reusable surfaces, kits, and protected delivery assets.',
    unlocks: ['Product surfaces', 'Industry kits', 'Private assets', 'Reusable delivery patterns'],
  },
  'launch-pack': {
    title: 'Full Signature',
    body: 'The complete suite for buyers who want the highest-finish product handoff.',
    unlocks: ['Everything in Pro', 'Full-only surfaces', 'Executive reports', 'Premium modernization kits'],
  },
};

const proofRows = [
  ['CSS library', 'Buttons, cards, visual styles'],
  ['LotOS UI', 'Dashboards, CRUDs, reports, vaults, kits, and AI-ready handoff'],
  ['Buyer value', 'Less prototype smell, more delivery confidence'],
];

const accessRows = [
  ['Foundation', 'Public demos, docs, component catalog, and evaluation surfaces.', 'Free'],
  ['Surfaces', 'Student Control, Operator Cockpit, DataGridPro, CommandShell, ReportSurface.', 'Pro Studio'],
  ['Kits', 'Reusable delivery patterns for admin, ops, academic, and spreadsheet workflows.', 'Pro Studio'],
  ['Vault', 'Protected assets, previews, templates, and premium implementation payloads.', 'Solo / Pro'],
  ['Full-only', 'Executive briefing, launch pack surfaces, and highest-finish handoff assets.', 'Full Signature'],
  ['Support / handoff', 'Guided close, purchase recovery, and premium delivery framing.', 'Full Signature'],
];

const promoRows = [
  ['Creator Pass', 'Campaigns, community drops, and creator previews with controlled Pro access.'],
  ['Founder Pass', 'Permanent or temporary gift access for early allies, always revocable.'],
  ['Pro Studio Trial', 'A dated promotional window that falls back to Foundation when it ends.'],
  ['Full Signature Gift', 'Explicit, low-volume, auditable access for the most sensitive tier.'],
];

function safePaymentActions(actions: PaymentAction[] | undefined): PaymentAction[] {
  if (actions && actions.length > 0) return actions;
  return [{ label: 'Talk to sales', href: salesLinks.contact, external: true, tone: 'ghost' }];
}

function PlanAction({ action }: { action: PaymentAction }) {
  const className = `btn full ${action.tone === 'primary' ? 'primary' : action.tone === 'paypal' ? 'paypal' : 'ghost'}`;

  if (action.external) {
    return (
      <a href={action.href} className={className} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

function PricingCard({ plan }: { plan: SalesPlan }) {
  const copy = planCopy[plan.id] ?? {
    title: plan.name,
    body: plan.summary,
    unlocks: plan.features.slice(0, 4),
  };
  const featured = plan.id === 'pro';

  return (
    <article className={`pricing-product-card ${featured ? 'is-featured' : ''}`}>
      <div className="pricing-card-topline">
        <span>{planPosition[plan.id] ?? 'Access'}</span>
        {featured ? <strong>Recommended</strong> : null}
      </div>
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>
      <div className="pricing-price">{plan.priceLabel}</div>
      <ul>
        {copy.unlocks.map((item) => (
          <li key={`${plan.id}-${item}`}>{item}</li>
        ))}
      </ul>
      <div className="pricing-actions">
        {safePaymentActions(plan.paymentActions).map((action) => (
          <PlanAction key={`${plan.id}-${action.label}`} action={action} />
        ))}
      </div>
      <small>{plan.checkoutHint}</small>
    </article>
  );
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  let signedInEmail: string | null = null;
  let authWarning: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    signedInEmail = session?.user?.email ?? null;
  } catch (error) {
    authWarning = error instanceof Error ? error.message : 'Session temporarily unavailable.';
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const pricingState = Array.isArray(resolvedSearchParams?.state)
    ? resolvedSearchParams?.state[0]
    : resolvedSearchParams?.state;

  return (
    <main className="landing pricing-page pricing-clean">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/demo/student-control" className="nav-link">Flagship Demo</Link>
          <Link href="/demo/components" className="nav-link">Components</Link>
          <Link href="/free" className="nav-link">Free</Link>
          <Link href="/claim" className="nav-link">Claim code</Link>
          <Link href="/team-access" className="nav-link">Team QA</Link>
          {signedInEmail ? (
            <Link href="/vault" className="nav-link nav-link--cta">Open Vault</Link>
          ) : (
            <Link href="/login" className="nav-link">Sign In</Link>
          )}
        </nav>
      </header>

      <section className="pricing-hero">
        <p className="kicker">Pricing for product surfaces</p>
        <h1>Pay for the surfaces that make generated apps feel ready for clients.</h1>
        <p className="lead">
          Free is for evaluation. Pro Studio is for serious delivery. Full Signature is the
          flagship suite for premium handoff, executive surfaces, and the broadest private vault.
        </p>
        <div className="payment-meta">
          <span className="payment-chip alt accent-cyan">{foundersOffer.label}</span>
          <span className="payment-chip manual accent-violet">{foundersOffer.limitLabel}</span>
          <span className={`payment-chip ${commercialReadiness.directCheckoutReady ? 'ready' : 'manual'} accent-emerald`}>
            {commercialReadiness.directCheckoutReady ? 'Checkout available' : 'Guided close available'}
          </span>
          <span className={`payment-chip ${commercialReadiness.automaticUnlockReady ? 'ready' : 'manual'} accent-amber`}>
            {commercialReadiness.automaticUnlockReady ? 'Automatic unlock' : 'Manual unlock fallback'}
          </span>
        </div>
        {pricingState ? (
          <div className="pricing-state-banner">
            <strong>That surface needs a higher access level.</strong>
            <span>Choose the plan that matches the vault or demo you were trying to open.</span>
          </div>
        ) : null}
        {authWarning ? (
          <div className="pricing-state-banner warning">
            <strong>Session state recovered safely.</strong>
            <span>Pricing remains available while sign-in retries.</span>
          </div>
        ) : null}
      </section>

      <section className="pricing-product-grid" aria-label="LotOS UI plans">
        {salesPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </section>

      <section className="pricing-promo-band">
        <div>
          <p className="section-label">Have a promotional pass?</p>
          <h2>Promotional access can unlock Pro or Full without weakening paid plans.</h2>
          <p>
            Passes may expire, have max claims, and be revoked. Foundation stays free, while premium assets still
            require Pro Studio, Full Signature, or a valid promotional grant.
          </p>
          <Link href="/claim" className="btn primary">Claim code</Link>
        </div>
        <div className="pricing-proof-table">
          {promoRows.map(([label, value]) => (
            <div key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-access-matrix">
        <div>
          <p className="section-label">What each tier helps you build</p>
          <h2>Buy access by delivery outcome, not by component count.</h2>
          <p>
            The commercial ladder is intentionally simple: evaluate the foundation, build with Pro Studio,
            and use Full Signature when the buyer needs the most polished handoff.
          </p>
        </div>
        <div className="pricing-access-table">
          {accessRows.map(([layer, value, tier]) => (
            <div key={layer}>
              <strong>{layer}</strong>
              <span>{value}</span>
              <em>{tier}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-proof-band">
        <div>
          <p className="section-label">Why this is not a CSS library</p>
          <h2>LotOS sells the jump from prototype to deliverable product.</h2>
          <p>
            Components matter, but the paid value is the complete surface: data hierarchy,
            states, workflows, reports, vault access, and AI-ready implementation structure.
          </p>
        </div>
        <div className="pricing-proof-table">
          {proofRows.map(([label, value]) => (
            <div key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-demo-cta">
        <div>
          <p className="section-label">See the flagship first</p>
          <h2>Student Control shows the product surface buyers should remember.</h2>
          <p>
            It is easier to sell a finished academic workflow than a long list of components.
            Open the demo, then choose the tier that unlocks the private delivery layer.
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/demo/student-control" className="btn primary">Open Student Control</Link>
          <Link href="/vault" className="btn ghost">Open Vault</Link>
          {signedInEmail ? null : (
            <AuthAction mode="signin" callbackUrl="/vault" className="btn ghost">
              Sign in for vault
            </AuthAction>
          )}
        </div>
      </section>

      <section className="pricing-ops-links">
        <Link href="/after-purchase">After purchase</Link>
        <Link href="/manage-subscription">Manage subscription</Link>
        <Link href="/support">Support</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </section>

      <CommercialFooter />
    </main>
  );
}
