import Link from 'next/link';

export default function DocsLoginPage() {
  const authReady = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET
  );

  return (
    <main className="lotos-docs-home">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">Commercial Access</p>
          <div className="hero-badges" aria-label="Auth status">
            <span className="hero-badge badge-proof">Docs Project</span>
            <span className="hero-badge badge-active">
              {authReady ? 'Google OAuth Ready' : 'OAuth Incomplete'}
            </span>
          </div>
          <h1>
            Sign in with Google
            <span>to open the commercial vault</span>
          </h1>
          <p className="lead">
            This docs deployment is the public front door right now, so the auth entrypoint lives
            here. Once you sign in, you can move into the protected commercial surface.
          </p>
          <div className="hero-actions">
            {authReady ? (
              <a href="/api/auth/signin/google?callbackUrl=/vault" className="btn btn-primary">
                Sign In With Google
              </a>
            ) : (
              <span className="btn btn-ghost">Missing Auth Variables</span>
            )}
            <Link href="/vault" className="btn btn-ghost">
              Open Vault
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
