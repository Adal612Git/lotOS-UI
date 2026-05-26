import Link from 'next/link';
import { env } from '../../lib/env';
import '../lotos-landing.css';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl?.startsWith('/') ? params.callbackUrl : '/vault';
  const accessDenied = params?.error === 'AccessDenied';
  const signInAvailable = env.googleConfigured && env.authConfigured;

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vault">Vault</Link>
          <Link href="/team-access">Team QA</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Protected Access</p>
        <h1>Sign in before opening the commercial surface.</h1>
        <p className="lead">
          Free content remains public. Solo, Pro, and Full routes require Google sign-in and
          entitlement checks before protected assets can be delivered.
        </p>
        {accessDenied ? (
          <div className="pricing-state-banner warning">
            <strong>Access denied.</strong>
            <span>Google sign-in failed or did not return a valid email. Paid vault access still depends on entitlement checks after login.</span>
          </div>
        ) : null}
        <div className="hero-actions">
          {signInAvailable ? (
            <a
              href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="btn primary"
            >
              Continue with Google
            </a>
          ) : (
            <span className="btn ghost button-like">Sign-in temporarily unavailable</span>
          )}
          <Link href="/pricing" className="btn ghost">
            Back to Pricing
          </Link>
          <Link href="/team-access" className="btn ghost">
            Team QA Access
          </Link>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Sign-in health</p>
          <h2>{signInAvailable ? 'Google sign-in is available.' : 'Google sign-in is temporarily unavailable.'}</h2>
          <p>
            The public site remains open. Buyers can retry sign-in, and team testers can use
            phone-only QA access from the team page.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Buyer login</p>
          <h2>Google login first, entitlement gate second</h2>
          <p>
            Any valid Google account can sign in. Paid routes unlock only when Supabase/Lemon
            entitlements match the buyer email. Admin access is handled server-side and is not
            part of the public buyer flow.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Internal QA</p>
          <h2>Phone-only unlock for testers</h2>
          <p>
            Authorized testers should open <code>/team-access</code>, enter their phone, and receive Full
            Signature QA access in that browser without needing Google sign-in.
          </p>
        </article>
      </section>
    </main>
  );
}
