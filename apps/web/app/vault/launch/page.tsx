import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import '../../lotos-landing.css';

export default async function LaunchVaultPage() {
  await requirePlanAccess('launch_pack');

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/vault">Vault Home</Link>
          <Link href="/vault/pro">Pro</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Launch Pack</p>
        <h1>Private delivery and customer-specific handoff readiness.</h1>
        <p className="lead">
          Launch Pack sits above Pro. It covers the protected asset surface plus private delivery and
          custom starter output for a paying client handoff.
        </p>
      </section>

      <section className="grid two">
        <article className="card luxury">
          <p className="section-label">Included</p>
          <h2>What Launch adds on top of Pro</h2>
          <ul>
            <li>Customer-specific starter generation and handoff packaging.</li>
            <li>Private ZIP or private repo delivery after payment clears.</li>
            <li>Commercial readiness flow for first-sale execution.</li>
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Delivery note</p>
          <h2>Current repo-safe implementation</h2>
          <p>
            This route protects the commercial control surface inside `apps/web`. It does not move the
            underlying package out of the monorepo yet, which matches the current rollout scope.
          </p>
        </article>
      </section>
    </main>
  );
}
