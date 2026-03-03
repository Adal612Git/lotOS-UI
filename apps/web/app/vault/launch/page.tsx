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
        <p className="kicker">Launch Signature</p>
        <h1>Top-tier launch polish, private control assets, and the most premium vault surface.</h1>
        <p className="lead">
          Launch Signature sits above Pro. It is the commercial control room for buyers who want the
          strongest presentation quality, the richest premium surface, and the most exclusive-feeling
          launch-ready materials you offer.
        </p>
      </section>

      <section className="grid two">
        <article className="card luxury">
          <p className="section-label">Included</p>
          <h2>What Launch Signature adds on top of Pro</h2>
          <ul>
            <li>Signature handoff decks, launch-room proof assets, and premium rollout framing.</li>
            <li>Highest-tier positioning for buyers who want the strongest commercial polish.</li>
            <li>Exclusive launch-facing materials designed to make the product feel elite.</li>
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Delivery note</p>
          <h2>Current implementation scope</h2>
          <p>
            This route protects the commercial control surface inside `apps/web`. It is the highest
            entitlement tier in the current rollout and is meant to feel richer, more curated, and
            more exclusive than the Pro surface.
          </p>
        </article>
      </section>
    </main>
  );
}
