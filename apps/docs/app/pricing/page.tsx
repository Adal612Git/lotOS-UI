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
            <span className={`${styles.heroBadge} ${styles.badgeStable}`}>Solo MX$29 / mes</span>
            <span className={`${styles.heroBadge} ${styles.badgeProof}`}>Pro MX$79 / mes</span>
            <span className={`${styles.heroBadge} ${styles.badgeActive}`}>Launch MX$149 / mes</span>
          </div>
          <h1>
            Commercial access starts here
            <span>without leaving the docs domain</span>
          </h1>
          <p className={styles.lead}>
            Free docs remain public. Paid access now climbs through three monthly tiers: premium
            proof, real private assets, and a top-tier signature launch surface.
          </p>
          <div className={styles.paymentMeta} aria-label="Accepted payment methods">
            <span className={`${styles.paymentChip} ${styles.paymentChipReady}`}>Lemon-ready subscriptions</span>
            <span className={`${styles.paymentChip} ${styles.paymentChipAlt}`}>Mercado Pago fallback</span>
            <span className={`${styles.paymentChip} ${styles.paymentChipManual}`}>Google vault access</span>
          </div>
          <p className={styles.heroProof}>
            This page should convert, not just explain. Every plan below is a deliberate recurring
            buying path with a stronger premium feeling than the tier before it.
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
          <h3>Free builds trust. Paid buys exclusivity, speed, and premium presentation.</h3>
          <ul>
            <li>Solo opens the premium proof layer for one operator.</li>
            <li>Pro unlocks the actual protected kits and monthly execution value.</li>
            <li>Launch Signature is the highest-polish commercial tier in the stack.</li>
          </ul>
        </aside>
      </section>

      <section className={`${styles.band} ${styles.statsBand}`}>
        <article><strong>$0</strong><span>Free docs</span></article>
        <article><strong>MX$29</strong><span>Solo proof</span></article>
        <article><strong>MX$79</strong><span>Pro assets</span></article>
        <article><strong>MX$149</strong><span>Launch polish</span></article>
      </section>

      <section className={`${styles.band} ${styles.plansGrid}`}>
        {docsSalesPlans.map((plan, index) => (
          <article
            key={plan.id}
            className={`${styles.planCard} ${styles[plan.id]} ${index === 1 ? styles.planCardHighlight : ''}`}
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
            <p className={styles.checkoutHint}>{plan.checkoutHint}</p>
            <div className={styles.paymentActions} role="group" aria-label={`Payment options for ${plan.name}`}>
              {plan.paymentActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.btn} ${
                    action.tone === 'primary'
                      ? styles.btnPrimary
                      : action.tone === 'paypal'
                        ? styles.btnPayPal
                        : styles.btnGhost
                  }`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className={`${styles.band} ${styles.proofBand}`}>
        <div className={styles.proofCard}>
          <p className={styles.eyebrow}>Conversion flow</p>
          <h2>Sign in, buy, then return to the vault.</h2>
          <p>
            The intended path is now explicit: authenticate first, pay through the configured
            checkout link, then use the vault as the return point after the paid plan is attached.
          </p>
        </div>
      </section>
    </main>
  );
}
