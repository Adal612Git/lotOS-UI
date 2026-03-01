import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import styles from '../commercial-shell.module.css';
import { docsSalesPlans } from '../../lib/sales';

export default async function DocsPricingPage() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user?.email);

  return (
    <main className={styles.page}>
      <section className={styles.heroShell}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Pricing / Precios</p>
          <div className={styles.heroBadges} aria-label="Commercial plans">
            <span className={`${styles.heroBadge} ${styles.badgeStable}`}>Solo $29</span>
            <span className={`${styles.heroBadge} ${styles.badgeProof}`}>Pro $79</span>
            <span className={`${styles.heroBadge} ${styles.badgeActive}`}>Launch $149</span>
          </div>
          <h1>
            Commercial access starts here
            <span>without leaving the docs domain</span>
          </h1>
          <p className={styles.lead}>
            Free docs remain public. Paid access starts with Google sign-in, then moves into the
            protected vault and later into entitlement-aware premium delivery.
          </p>
          <p className={styles.heroProof}>
            This page should convert, not just explain. Every plan below is a deliberate buying path.
          </p>
          <div className={styles.heroActions}>
            {signedIn ? (
              <Link href="/vault" className={`${styles.btn} ${styles.btnPrimary}`}>
                Open Vault
              </Link>
            ) : (
              <AuthAction mode="signin" callbackUrl="/vault" className={`${styles.btn} ${styles.btnGoogle}`}>
                Sign In With Google
              </AuthAction>
            )}
            <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
              Back Home
            </Link>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <p className={styles.eyebrow}>Why buyers move</p>
          <h3>Free builds trust. Paid buys speed and private acceleration.</h3>
          <ul>
            <li>Solo opens the commercial preview layer.</li>
            <li>Pro unlocks the actual protected kits and premium surface.</li>
            <li>Launch Pack is the handoff path for real client delivery.</li>
          </ul>
        </aside>
      </section>

      <section className={`${styles.band} ${styles.statsBand}`}>
        <article><strong>$0</strong><span>Free docs</span></article>
        <article><strong>$29</strong><span>Solo previews</span></article>
        <article><strong>$79</strong><span>Pro kits</span></article>
        <article><strong>$149</strong><span>Launch pack</span></article>
      </section>

      <section className={`${styles.band} ${styles.plansGrid}`}>
        {docsSalesPlans.map((plan, index) => (
          <article
            key={plan.id}
            className={`${styles.planCard} ${index === 1 ? styles.planCardHighlight : ''}`}
          >
            <div className={styles.planTop}>
              <div>
                <p className={styles.eyebrow}>{plan.id.replace('_', ' ')}</p>
                <h3>{plan.name}</h3>
              </div>
              <span className={styles.planPrice}>{plan.priceLabel}</span>
            </div>
            <p>{plan.summary}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a href={plan.href} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
              {plan.id === 'launch_pack' ? 'Book Launch Pack' : `Buy ${plan.name}`}
            </a>
          </article>
        ))}
      </section>

      <section className={`${styles.band} ${styles.proofBand}`}>
        <div className={styles.proofCard}>
          <p className={styles.eyebrow}>Conversion flow</p>
          <h2>Sign in, buy, then return to the vault.</h2>
          <p>
            The intended path is now explicit: authenticate first, purchase the right tier, and then
            use the vault as the return point for entitlement-aware access.
          </p>
        </div>
      </section>
    </main>
  );
}
