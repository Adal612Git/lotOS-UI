import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import { listUserPlans } from '../../lib/entitlements';
import { isOwnerEmail } from '../../lib/owner';

export default async function DocsVaultPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect('/login');
  }

  const owner = isOwnerEmail(email);
  const plans = owner ? ['launch_pack'] : await listUserPlans(email);
  const hasSolo = owner || plans.includes('solo') || plans.includes('pro') || plans.includes('launch_pack');
  const hasPro = owner || plans.includes('pro') || plans.includes('launch_pack');
  const hasLaunch = owner || plans.includes('launch_pack');

  return (
    <main className="lotos-docs-home">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">Commercial Vault</p>
          <div className="hero-badges" aria-label="Vault status">
            <span className="hero-badge badge-stable">Session Active</span>
            <span className="hero-badge badge-proof">Docs Domain</span>
          </div>
          <h1>
            You are signed in
            <span>{email}</span>
          </h1>
          <p className="lead">
            The login loop is now alive on the docs domain. This confirms Google OAuth, callback
            wiring, and session persistence are working from the public front door.
          </p>
          <p className="hero-proof">
            {owner
              ? 'Owner bypass is active. This account can see the full premium surface without payment checks.'
              : plans.length > 0
                ? `Active commercial plans: ${plans.join(', ')}`
                : 'Session works, but no paid entitlement is attached to this account yet.'}
          </p>
          <div className="hero-actions">
            <AuthAction mode="signout" callbackUrl="/" className="btn btn-primary">
              Sign Out
            </AuthAction>
            <Link href="/pricing" className="btn btn-ghost">
              Pricing
            </Link>
            <Link href="/" className="btn btn-ghost">
              Home
            </Link>
          </div>
        </div>
      </section>

      <section className="band proof-band">
        <div className="proof-card">
          <p className="eyebrow">What this proves</p>
          <h2>The auth layer is alive on the actual production domain.</h2>
          <p>
            This route confirms the critical path is working: user hits docs, clicks sign in, returns
            through Google, and lands in a session-backed page. Next we can extend the same session
            into entitlement-aware premium routes if needed.
          </p>
        </div>
      </section>

      <section className="band stats-band">
        <article><strong>{hasSolo ? 'Yes' : 'No'}</strong><span>Solo access</span></article>
        <article><strong>{hasPro ? 'Yes' : 'No'}</strong><span>Pro access</span></article>
        <article><strong>{hasLaunch ? 'Yes' : 'No'}</strong><span>Launch access</span></article>
        <article><strong>{owner ? 'Owner' : plans.length}</strong><span>{owner ? 'Bypass' : 'Entitlements'}</span></article>
      </section>

      <section className="band proof-band">
        <div className="proof-card">
          <p className="eyebrow">What happens next</p>
          <h2>{hasPro ? 'This account is ready for premium delivery.' : 'This account still needs a paid plan.'}</h2>
          <p>
            {hasPro
              ? 'The session is live and a premium plan is present. The remaining step is to connect this docs-side vault to the exact premium assets or redirects you want to expose.'
              : 'Right now, this page proves login works. A paid plan appears here only after the Lemon webhook writes an entitlement row for this email in Supabase.'}
          </p>
          {!hasPro ? (
            <div className="hero-actions">
              <Link href="/pricing" className="btn btn-primary">Go To Pricing</Link>
              <Link href="/" className="btn btn-ghost">Back Home</Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
