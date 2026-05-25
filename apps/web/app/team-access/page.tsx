import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../../auth-options';
import { normalizeEmail } from '../../lib/owner';
import { buildRouteMetadata } from '../../lib/seo';
import { getActiveTesterAccess, isTesterAccessConfigured } from '../../lib/tester-access';
import '../lotos-landing.css';
import { TesterAccessForm } from './team-access-form';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Team QA Access',
  description: 'Internal tester unlock and QA entitlement registration for exhaustive LotOS UI premium validation.',
  path: '/team-access',
});

export default async function TeamAccessPage() {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const testerAccess = await getActiveTesterAccess(email);
  const configured = isTesterAccessConfigured();
  const signedIn = Boolean(email);

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/vault" className="nav-link nav-link--cta">Vault</Link>
          <Link href="/playground" className="nav-link nav-link--components">Playground</Link>
          <Link href="/pricing" className="nav-link nav-link--pricing">Pricing</Link>
          {signedIn ? (
            <Link href="/api/auth/signout?callbackUrl=/" className="nav-link nav-link--muted">Sign Out</Link>
          ) : (
            <Link href="/login?callbackUrl=/team-access" className="nav-link nav-link--muted">Optional Sign In</Link>
          )}
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Internal QA</p>
        <h1>Enter the tester phone once and unlock Full Signature QA in this browser.</h1>
        {signedIn ? (
          <p className="lead">
            Signed in as <strong>{email}</strong>. This page verifies an authorized tester phone, saves a 30-day
            Full Signature QA entitlement for this Google account, and sets a temporary browser unlock so the team
            can evaluate the landing, vault, demos, playground, templates, and premium routes without waiting for a
            paid checkout event.
          </p>
        ) : (
          <p className="lead">
            No Google account is required for internal QA. This page verifies an authorized tester phone and sets a
            secure browser unlock so the team can inspect vaults, downloads, demos, playground, templates, and
            premium routes immediately.
          </p>
        )}
        <div className="payment-meta" aria-label="Team access state">
          <span className="payment-chip ready accent-emerald">Full Signature QA</span>
          <span className="payment-chip manual accent-amber">Phone-only unlock</span>
          <span className="payment-chip alt accent-cyan">No Google required</span>
        </div>
      </section>

      <section className="grid two">
        <article className="card owner-panel">
          <p className="section-label">Tester unlock</p>
          <h2>Activate phone-based QA access</h2>
          <TesterAccessForm
            active={Boolean(testerAccess)}
            configured={configured}
            expiresAt={testerAccess?.expiresAt ?? null}
            signedIn={signedIn}
          />
        </article>

        <article className="card">
          <p className="section-label">What to test</p>
          <h2>Exhaustive validation path</h2>
          <ul>
            <li>Open the main landing and judge clarity, trust, and product positioning.</li>
            <li>Use Playground and templates to see what products can already be built.</li>
            <li>Open Solo, Pro, and Full vault routes and compare the paid ladder.</li>
            <li>Try AI-assisted workflows with Gemini CLI or another free assistant.</li>
            <li>Report friction: confusing copy, missing assets, broken routes, or weak examples.</li>
          </ul>
          <div className="hero-actions compact">
            <Link href="/playground" className="btn ghost">Open Playground</Link>
            <Link href="/templates" className="btn ghost">Open Templates</Link>
            <Link href="/vault/launch" className="btn primary">Open Full</Link>
          </div>
        </article>
      </section>

      <section className="value-grid">
        <article className="value-card accent-cyan">
          <p className="plan-tier">Products possible</p>
          <h3>Look for concrete buildable outputs.</h3>
          <p>Dashboards, admin surfaces, landing systems, template packs, docs portals, and AI-assisted UI flows.</p>
        </article>
        <article className="value-card accent-amber">
          <p className="plan-tier">Quality bar</p>
          <h3>Judge whether the output feels sellable.</h3>
          <p>Strong tests should include responsive behavior, copy clarity, asset usefulness, and route polish.</p>
        </article>
        <article className="value-card accent-violet">
          <p className="plan-tier">Website review</p>
          <h3>Evaluate the page like a buyer.</h3>
          <p>Focus on whether the landing makes the product understandable without help from the team.</p>
        </article>
      </section>
    </main>
  );
}
