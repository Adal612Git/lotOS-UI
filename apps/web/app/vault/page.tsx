import Link from 'next/link';
import { getViewerContext } from '../../lib/auth-server';
import '../lotos-landing.css';
import { GrantAccessForm } from '../grant-access-form';

export default async function VaultPage() {
  const viewer = await getViewerContext();

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
        <h1>Protected delivery for Solo, Pro, and Launch buyers.</h1>
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
