import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../auth-options';

export default async function DocsVaultPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect('/login');
  }

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
          <div className="hero-actions">
            <a href="/api/auth/signout?callbackUrl=/" className="btn btn-primary">
              Sign Out
            </a>
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
    </main>
  );
}
