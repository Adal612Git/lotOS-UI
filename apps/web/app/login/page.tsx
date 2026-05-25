import Link from 'next/link';
import { env } from '../../lib/env';
import '../lotos-landing.css';

const requiredEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'AUTH_SECRET'] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl?.startsWith('/') ? params.callbackUrl : '/vault';
  const accessDenied = params?.error === 'AccessDenied';

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
          {env.googleConfigured && env.AUTH_SECRET ? (
            <a
              href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="btn primary"
            >
              Continue with Google
            </a>
          ) : (
            <span className="btn ghost button-like">OAuth Not Configured Yet</span>
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
          <p className="section-label">Environment status</p>
          <h2>Required variables</h2>
          <ul>
            {requiredEnv.map((item) => (
              <li key={item}>
                {item}: {process.env[item] ? 'present' : 'missing'}
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Buyer login</p>
          <h2>Google login first, entitlement gate second</h2>
          <p>
            Any valid Google account can sign in. Paid routes unlock only when Supabase/Lemon
            entitlements match the buyer email. Emails in <code>LOTOS_OWNER_EMAILS</code> are
            administrative bypasses, not the buyer login policy.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Internal QA</p>
          <h2>Phone unlock for testers</h2>
          <p>
            Authorized testers can open <code>/team-access</code> after Google sign-in, register their phone, and
            receive temporary Full Signature access in that browser for exhaustive validation.
          </p>
        </article>
      </section>
    </main>
  );
}
