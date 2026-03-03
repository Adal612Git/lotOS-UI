import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import { listUserPlans } from '../../lib/entitlements';
import { isOwnerEmail } from '../../lib/owner';
import { docsSalesPlans } from '../../lib/sales';
import styles from '../commercial-shell.module.css';

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
  const nextPlan = !hasSolo ? docsSalesPlans[0] : !hasPro ? docsSalesPlans[1] : !hasLaunch ? docsSalesPlans[2] : null;

  return (
    <main className={styles.page}>
      <section className={styles.heroShell}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Commercial Vault</p>
          <div className={styles.heroBadges} aria-label="Vault status">
            <span className={`${styles.heroBadge} ${styles.badgeStable}`}>Session Active</span>
            <span className={`${styles.heroBadge} ${styles.badgeProof}`}>Docs Domain</span>
            {owner ? <span className={`${styles.heroBadge} ${styles.badgeActive}`}>Owner Bypass</span> : null}
          </div>
          <h1>
            You are signed in
            <span>{email}</span>
          </h1>
          <p className={styles.lead}>
            The login loop is now alive on the docs domain. This confirms Google OAuth, callback
            wiring, and session persistence are working from the public front door. It also means
            the paid ladder can feel real the moment a subscription is attached.
          </p>
          <p className={styles.heroProof}>
            {owner
              ? 'Owner bypass is active. This account can see the full premium surface without payment checks.'
              : plans.length > 0
                ? `Active commercial plans: ${plans.join(', ')}`
                : 'Session works, but no paid entitlement is attached to this account yet.'}
          </p>
          <div className={styles.heroActions}>
            <AuthAction mode="signout" callbackUrl="/" className={`${styles.btn} ${styles.btnPrimary}`}>
              Sign Out
            </AuthAction>
            <Link href="/pricing" className={`${styles.btn} ${styles.btnGhost}`}>
              Pricing
            </Link>
            <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
              Home
            </Link>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <p className={styles.eyebrow}>Commercial status</p>
          <h3>{hasPro ? 'This account is inside the premium path.' : 'This account is authenticated, not monetized yet.'}</h3>
          <ul>
            <li>Login is real and session-backed.</li>
            <li>Entitlements are read live from Supabase.</li>
            <li>Paid access appears only after checkout clears and this email gets a plan row.</li>
          </ul>
          {nextPlan ? (
            <>
              <p className={styles.checkoutHint}>{nextPlan.checkoutHint}</p>
              <div className={styles.paymentActions} role="group" aria-label={`Payment options for ${nextPlan.name}`}>
                {nextPlan.paymentActions.map((action) => (
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
            </>
          ) : null}
        </aside>
      </section>

      <section className={`${styles.band} ${styles.proofBand}`}>
        <div className={styles.proofCard}>
          <p className={styles.eyebrow}>What this proves</p>
          <h2>The auth layer is alive on the actual production domain.</h2>
          <p>
            This route confirms the critical path is working: user hits docs, clicks sign in, returns
            through Google, and lands in a session-backed page. From there, the same session can
            step into a progressively richer premium route as subscriptions unlock higher tiers.
          </p>
        </div>
      </section>

      <section className={`${styles.band} ${styles.statsBand}`}>
        <article><strong>{hasSolo ? 'Yes' : 'No'}</strong><span>Solo access</span></article>
        <article><strong>{hasPro ? 'Yes' : 'No'}</strong><span>Pro access</span></article>
        <article><strong>{hasLaunch ? 'Yes' : 'No'}</strong><span>Launch access</span></article>
        <article><strong>{owner ? 'Owner' : plans.length}</strong><span>{owner ? 'Bypass' : 'Entitlements'}</span></article>
      </section>

      <section className={`${styles.band} ${styles.proofBand}`}>
        <div className={styles.proofCard}>
          <p className={styles.eyebrow}>What happens next</p>
          <h2>{hasPro ? 'This account is ready for premium delivery.' : 'This account still needs a paid plan.'}</h2>
          <p>
            {hasPro
              ? 'The session is live and a premium plan is present. The remaining step is to keep enriching the protected assets or redirects so the buyer feels a clear jump in value at each tier.'
              : 'Right now, this page proves login works. A paid plan appears here only after checkout clears and an entitlement row is attached for this email in Supabase.'}
          </p>
          {!hasPro ? (
            <div className={styles.heroActions}>
              <Link href="/pricing" className={`${styles.btn} ${styles.btnPrimary}`}>Go To Pricing</Link>
              <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>Back Home</Link>
            </div>
          ) : null}
        </div>
      </section>

      {!hasPro ? (
        <section className={`${styles.band} ${styles.plansGrid}`}>
          {docsSalesPlans.map((plan, index) => (
            <article
              key={plan.id}
              className={`${styles.planCard} ${nextPlan?.id === plan.id || index === 1 ? styles.planCardHighlight : ''}`}
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
      ) : null}
    </main>
  );
}
