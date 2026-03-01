import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';

export default async function DocsPricingPage() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user?.email);

  return (
    <main className="lotos-docs-home">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">Pricing / Precios</p>
          <div className="hero-badges" aria-label="Commercial plans">
            <span className="hero-badge badge-stable">Solo $29</span>
            <span className="hero-badge badge-proof">Pro $79</span>
            <span className="hero-badge badge-active">Launch $149</span>
          </div>
          <h1>
            Commercial access starts here
            <span>without leaving the docs domain</span>
          </h1>
          <p className="lead">
            Free docs remain public. Paid access starts with Google sign-in, then moves into the
            protected vault and later into entitlement-aware premium delivery.
          </p>
          <div className="hero-actions">
            {signedIn ? (
              <Link href="/vault" className="btn btn-primary">
                Open Vault
              </Link>
            ) : (
              <AuthAction mode="signin" callbackUrl="/vault" className="btn btn-google">
                Sign In With Google
              </AuthAction>
            )}
            <Link href="/" className="btn btn-ghost">
              Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="band stats-band">
        <article><strong>$0</strong><span>Free docs</span></article>
        <article><strong>$29</strong><span>Solo previews</span></article>
        <article><strong>$79</strong><span>Pro kits</span></article>
        <article><strong>$149</strong><span>Launch pack</span></article>
      </section>
    </main>
  );
}
