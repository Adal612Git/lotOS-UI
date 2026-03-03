import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import '../../lotos-landing.css';

const launchSignatureLayers = [
  {
    title: 'Prestige tier',
    summary:
      'This is the highest entitlement tier in the current product. It should feel like the buyer entered an operator lounge, not just another downloads page.',
  },
  {
    title: 'Launch-room framing',
    summary:
      'The purpose of this tier is not only more access. It is a stronger sense of polish, confidence, and premium control around the launch story.',
  },
  {
    title: 'Exclusive by contrast',
    summary:
      'Launch Signature becomes valuable when it is visibly more curated, more deliberate, and more elite-feeling than Pro.',
  },
];

const launchUseCases = [
  'Use this surface to house the most polished commercial proof and launch-facing materials you own.',
  'Reserve the strongest narrative assets, signature decks, and prestige framing for this tier.',
  'Make this feel like a premium command room for buyers who want the best version of the product story.',
];

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
        <h1>The prestige layer: top-tier polish, launch-room framing, and your most exclusive premium surface.</h1>
        <p className="lead">
          Launch Signature sits above Pro. It is the commercial control room for buyers who want the
          strongest presentation quality, the richest premium surface, and the most exclusive-feeling
          launch-ready materials you offer.
        </p>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>Tier 3</strong>
          <span>Highest entitlement</span>
          <p>The top rung in the current ladder, positioned to feel elite from the first screen.</p>
        </article>
        <article className="vault-kpi">
          <strong>MX$249</strong>
          <span>Prestige subscription</span>
          <p>Phase 1 founders pricing for the first 20 customers still preserves this tier as the prestige ceiling.</p>
        </article>
        <article className="vault-kpi">
          <strong>Top</strong>
          <span>Commercial polish</span>
          <p>This is the place for the best narrative, the best framing, and the most premium perception.</p>
        </article>
      </section>

      <section className="value-grid">
        {launchSignatureLayers.map((item) => (
          <article key={item.title} className="value-card">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
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
          <p className="section-label">Use it like this</p>
          <h2>How this tier should feel to the buyer</h2>
          <ul>
            {launchUseCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">Current implementation scope</p>
        <h2>This route is already the premium ceiling. Now the job is to make it feel unmistakably special.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card">
            <h3>Richer curation</h3>
            <p>Keep the strongest assets, cleanest proof, and most polished positioning here.</p>
          </article>
          <article className="value-card">
            <h3>Sharper separation</h3>
            <p>The more distinct this feels from Pro, the more believable your highest tier becomes.</p>
          </article>
          <article className="value-card">
            <h3>Premium retention</h3>
            <p>Recurring buyers stay longer when the top tier feels curated, intentional, and status-bearing.</p>
          </article>
        </div>
        <div className="tier-foot-strip">
          <Link href="/pricing" className="btn primary">Review Pricing Ladder</Link>
          <Link href="/vault/pro" className="btn ghost">Compare Against Pro</Link>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Delivery note</p>
          <h2>Current implementation scope</h2>
          <p>
            This route protects the commercial control surface inside `apps/web`. It is the highest
            entitlement tier in the current rollout and is meant to feel richer, more curated, and
            more exclusive than the Pro surface.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Founder standard</p>
          <h2>What belongs here</h2>
          <p>
            If an asset, narrative, or premium surface does not noticeably raise the sense of
            exclusivity, it probably belongs in Pro. Launch Signature should carry the pieces that
            make the product feel elite.
          </p>
        </article>
      </section>
    </main>
  );
}
