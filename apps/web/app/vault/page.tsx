import Link from 'next/link';
import { getViewerContext } from '../../lib/auth-server';
import '../lotos-landing.css';
import { GrantAccessForm } from '../grant-access-form';

export default async function VaultPage() {
  const viewer = await getViewerContext();
  const hasSolo = viewer.isOwner || viewer.plans.includes('solo') || viewer.plans.includes('pro') || viewer.plans.includes('launch_pack');
  const hasPro = viewer.isOwner || viewer.plans.includes('pro') || viewer.plans.includes('launch_pack');
  const hasLaunch = viewer.isOwner || viewer.plans.includes('launch_pack');

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="/api/auth/signout?callbackUrl=/">Sign Out</a>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Commercial Vault</p>
        <h1>Protected delivery with a three-tier premium ladder that should feel richer at every step.</h1>
        <p className="lead">
          Signed in as <strong>{viewer.email}</strong>. Free assets stay public; protected assets
          unlock here based on entitlement or owner status.
        </p>
        <div className="hero-actions">
          <Link href="/vault/solo" className="btn primary">
            Solo Surface
          </Link>
          <Link href="/vault/pro" className="btn ghost">
            Pro Surface
          </Link>
          <Link href="/vault/launch" className="btn ghost">
            Launch Surface
          </Link>
        </div>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>{hasSolo ? 'Yes' : 'No'}</strong>
          <span>Solo access</span>
          <p>Premium proof assets and the first private layer above the public trust surface.</p>
        </article>
        <article className="vault-kpi">
          <strong>{hasPro ? 'Yes' : 'No'}</strong>
          <span>Pro access</span>
          <p>The real premium bundle tier with protected assets, templates, and stronger monthly value.</p>
        </article>
        <article className="vault-kpi">
          <strong>{hasLaunch ? 'Yes' : 'No'}</strong>
          <span>Launch access</span>
          <p>The prestige layer with the highest commercial polish and most exclusive premium framing.</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Viewer state</p>
          <h2>Current access</h2>
          <ul>
            <li>Owner: {viewer.isOwner ? 'Yes' : 'No'}</li>
            <li>
              Active plans: {viewer.isOwner ? 'owner bypass (all premium)' : viewer.plans.join(', ') || 'none'}
            </li>
            <li>Free docs and public MIT packages remain open without this vault.</li>
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Protected paths</p>
          <h2>What this vault controls</h2>
          <ul>
            <li>Commercial previews and evaluation-only sales assets.</li>
            <li>Protected `packages/pro` delivery assets and manifests.</li>
            <li>Desktop template Pro catalog surfaces and kit downloads.</li>
          </ul>
        </article>
      </section>

      <section className="value-grid">
        <article className="value-card">
          <h3>Solo Access</h3>
          <p>For premium proof, controlled previews, and a buyer-only entry point that feels private without giving away the strongest assets.</p>
        </article>
        <article className="value-card">
          <h3>Pro Studio</h3>
          <p>For buyers who want the real protected product surface: reusable kits, layouts, manifests, and stronger production leverage.</p>
        </article>
        <article className="value-card">
          <h3>Launch Signature</h3>
          <p>For buyers who want the highest-polish experience, the strongest premium framing, and the most exclusive-feeling tier in the stack.</p>
        </article>
      </section>

      {viewer.isOwner ? (
        <section className="card owner-panel">
          <p className="section-label">Owner tools</p>
          <h2>Confirm payment, then unlock the buyer</h2>
          <p>
            Use this when you need an operator override: confirm the Lemon Squeezy subscription,
            Mercado Pago receipt, or fallback payment, then grant the matching plan to the buyer
            email from here.
          </p>
          <GrantAccessForm />
        </section>
      ) : null}
    </main>
  );
}
