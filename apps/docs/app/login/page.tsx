import Link from 'next/link';
import { AuthAction } from '../auth-action';
import styles from '../commercial-shell.module.css';
import { docsSalesPlans } from '../../lib/sales';

export default async function DocsLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authReady = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET
  );
  const accessDenied = params?.error === 'AccessDenied';

  return (
    <main className={styles.page}>
      <section className={styles.heroShell}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Commercial Access</p>
          <div className={styles.heroBadges} aria-label="Auth status">
            <span className={`${styles.heroBadge} ${styles.badgeProof}`}>Docs Project</span>
            <span className={`${styles.heroBadge} ${styles.badgeActive}`}>
              {authReady ? 'Google OAuth Ready' : 'OAuth Incomplete'}
            </span>
          </div>
          <h1>
            Sign in with Google
            <span>to open the commercial vault</span>
          </h1>
          <p className={styles.lead}>
            This docs deployment is the public front door right now, so the auth entrypoint lives
            here. Once you sign in, you can move into the protected commercial surface.
          </p>
          <p className={styles.heroProof}>
            The login surface should sell confidence, not just prove wiring. This is now a branded
            access gate into the paid system.
          </p>
          {accessDenied ? (
            <p className={styles.heroProof}>
              Access denied. Google sign-in is open to valid accounts, but protected vault access still depends on entitlement or owner status.
            </p>
          ) : null}
          <div className={styles.heroActions}>
            {authReady ? (
              <AuthAction mode="signin" callbackUrl="/vault" className={`${styles.btn} ${styles.btnGoogle}`}>
                Sign In With Google
              </AuthAction>
            ) : (
              <span className={`${styles.btn} ${styles.btnGhost}`}>Missing Auth Variables</span>
            )}
            <Link href="/pricing" className={`${styles.btn} ${styles.btnGhost}`}>
              Pricing
            </Link>
            <Link href="/vault" className={`${styles.btn} ${styles.btnGhost}`}>
              Open Vault
            </Link>
            <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
              Back Home
            </Link>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <p className={styles.eyebrow}>Access Ladder</p>
          <h3>Start trusted, then move into paid access.</h3>
          <ul>
            {docsSalesPlans.map((plan) => (
              <li key={plan.id}>
                <strong>{plan.name}</strong> {plan.priceLabel}: {plan.summary}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
