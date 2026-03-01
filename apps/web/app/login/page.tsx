import Link from 'next/link';
import { env } from '../../lib/env';
import '../lotos-landing.css';

const requiredEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'AUTH_SECRET'] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl?.startsWith('/') ? params.callbackUrl : '/vault';

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vault">Vault</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Protected Access</p>
        <h1>Sign in before opening the commercial surface.</h1>
        <p className="lead">
          Free content remains public. Solo, Pro, and Launch routes require Google sign-in and
          entitlement checks before protected assets can be delivered.
        </p>
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
          <p className="section-label">Owner bypass</p>
          <h2>Direct premium access for the owner</h2>
          <p>
            Accounts listed in <code>LOTOS_OWNER_EMAILS</code> skip entitlement checks after login.
            The route is still authenticated, but payment verification is bypassed.
          </p>
        </article>
      </section>
    </main>
  );
}
