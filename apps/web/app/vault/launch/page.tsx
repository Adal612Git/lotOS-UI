import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { launchAssets } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

const fallbackLaunchAssets = [
  {
    id: 'launch-signature-fallback',
    name: 'Full Signature Command Pack',
    description: 'Fallback summary of the flagship tier while the launch-exclusive asset catalog is being refreshed.',
    fileName: 'full-signature-command-pack',
  },
];

const fullAccentCycle = ['accent-violet', 'accent-rose', 'accent-amber', 'accent-cyan'] as const;

const fullSignals = [
  { value: 'Top', label: 'Tier' },
  { value: 'MX$249', label: 'Monthly' },
  { value: '6', label: 'New ecosystems' },
  { value: 'Full', label: 'Suite' },
];

const fullHighlights = [
  'Exclusive cross-surface workflows',
  'A true category jump above Pro',
  'Boardroom-grade premium framing',
  'The most complete commercial package',
];

const fullProofNotes = [
  'This tier should feel like a distinct product line, not merely a more decorated version of Pro.',
  'Its value comes from broader ecosystem reach, stronger presentation, and assets buyers cannot access below.',
  'That is what makes the top tier feel defendable and worth the premium jump.',
];

const launchSignatureLayers = [
  {
    title: 'Integrated premium tier',
    summary:
      'This is the highest entitlement tier in the current product. It should now feel like a distinct product line, not just a prettier version of Pro.',
  },
  {
    title: 'Full-only surfaces',
    summary:
      'The purpose of this tier is not only more polish. It now reserves integrated work surfaces that do not ship in Pro.',
  },
  {
    title: 'Exclusive by ecosystem',
    summary:
      'Full Signature becomes valuable when it opens new ecosystems: Sheets, Microsoft 365, Outlook, Power BI, Figma, and executive command surfaces.',
  },
];

const launchUseCases = [
  'Use this tier for premium modernization offers inside tools buyers already live in every day.',
  'Reserve integrated surfaces here so Full is a new category of delivery, not just more framing.',
  'Sell this as the command-room tier for spreadsheet, inbox, analytics, and executive workflows.',
];

export default async function LaunchVaultPage() {
  await requirePlanAccess('launch_pack');
  const assets = launchAssets.length > 0 ? launchAssets : fallbackLaunchAssets;
  const degradedAssets = launchAssets.length === 0;

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
        <p className="kicker">Full Signature</p>
        <h1>The prestige layer now carries full-only operator surfaces, not just higher polish.</h1>
        <p className="lead">
          Full Signature sits above Pro. It now reserves six full-only surfaces for Google
          Sheets, Microsoft 365 Excel Web, Outlook, Power BI, Figma, and executive boardroom
          delivery. This is the tier for buyers who want a category jump, not just a nicer wrapper.
        </p>
        <div className="payment-meta" aria-label="Full tier state">
          <span className="payment-chip ready accent-violet">Flagship premium layer</span>
          <span className="payment-chip alt accent-rose">New ecosystem access</span>
          <span className="payment-chip manual accent-amber">Above Pro by scope</span>
        </div>
        {degradedAssets ? (
          <div className="pricing-state-banner warning">
            <strong>Full catalog in fallback mode.</strong>
            <span>The top tier remains understandable and navigable while launch-exclusive assets finish syncing.</span>
          </div>
        ) : null}
        <div className="hero-actions compact">
          <Link href="/vault" className="btn ghost">Vault Home</Link>
          <Link href="/vault/pro" className="btn ghost">Compare With Pro</Link>
          <Link href="/pricing" className="btn primary">Review Pricing</Link>
        </div>
      </section>

      <section className="card free-entry full-command-panel">
        <div className="tier-head">
          <div className="tier-title-block">
            <p className="plan-tier">Why Full Exists</p>
            <h3>The top tier should feel like a complete premium suite, not just the final upsell.</h3>
            <p>
              This route needs to defend its price with broader reach, stronger delivery categories,
              and a visibly more elite product posture than the tier below it.
            </p>
          </div>
          <span className="tier-badge accent-violet">Flagship Tier</span>
        </div>
        <div className="free-rich-panel">
          <div className="free-rich-copy">
            <p className="tier-mini-label">Full-suite command layer</p>
            <h4>Full Signature now reads like the most complete product experience in the stack.</h4>
            <p>
              It is not just more polish. It is the place where the product expands into additional
              ecosystems and feels most executive, integrated, and high-finish.
            </p>
          </div>
          <div className="free-signal-grid" aria-label="Full signals">
            {fullSignals.map((signal, index) => (
              <div key={signal.label} className={`free-signal ${fullAccentCycle[index % fullAccentCycle.length]}`}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="tier-pill-grid" aria-label="Full highlights">
              {fullHighlights.map((item, index) => (
                <span key={item} className={`tier-pill ${fullAccentCycle[index % fullAccentCycle.length]}`}>
                  {item}
                </span>
              ))}
            </div>
            <ul>
              <li>Pro gives the buyer a strong private product. Full should feel like a bigger category of premium delivery.</li>
              <li>This is where the ladder expands by ecosystem, workflow type, and executive-facing surface area.</li>
              <li>The buyer should immediately feel that this is the fullest version of the offer, not merely the most expensive one.</li>
            </ul>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label">What Full must prove</p>
            <h4>It must look and feel like the complete premium ceiling.</h4>
            <ul className="free-proof-list">
              {fullProofNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi accent-violet">
          <strong>{assets.length}</strong>
          <span>Full-only assets</span>
          <p>Exclusive manifests and premium surfaces that do not ship in Pro.</p>
        </article>
        <article className="vault-kpi accent-rose">
          <strong>MX$249</strong>
          <span>Prestige subscription</span>
          <p>Phase 1 founders pricing for the first 20 customers, now tied to a truly distinct top tier.</p>
        </article>
        <article className="vault-kpi accent-amber">
          <strong>6</strong>
          <span>New ecosystems</span>
          <p>Sheets, Microsoft 365, Outlook, Power BI, Figma, and executive boardroom delivery.</p>
        </article>
      </section>

      <section className="value-grid">
        {launchSignatureLayers.map((item, index) => (
          <article key={item.title} className={`value-card ${fullAccentCycle[index % fullAccentCycle.length]}`}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>

      <section className="grid two">
        <article className="card luxury">
          <p className="section-label">Included</p>
          <h2>What Full Signature now adds on top of Pro</h2>
          <ul>
            <li>Six full-only manifests that do not exist in the Pro entitlement.</li>
            <li>Integrated surfaces for spreadsheet, inbox, analytics, design-token, and executive workflows.</li>
            <li>Highest-tier positioning for buyers who want premium delivery plus category expansion.</li>
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

      <section className="vault-assets-grid">
        {assets.map((asset, index) => (
          <article key={asset.id} className={`asset-card launch ${fullAccentCycle[index % fullAccentCycle.length]}`}>
            <div className="asset-top">
              <div>
                <p className="plan-tier">Full Exclusive Surface</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready accent-violet">Full-only</span>
              <span className="payment-chip alt accent-rose">Integrated surface</span>
              <span className="payment-chip manual accent-amber">Top-tier delivery</span>
            </div>
            {degradedAssets ? (
              <Link className="btn primary full" href="/pricing">
                Review Full Signature
              </Link>
            ) : (
              <a className="btn primary full" href={`/api/download/${asset.id}`}>
                Unlock {asset.name}
              </a>
            )}
          </article>
        ))}
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">Current implementation scope</p>
        <h2>This route is still the premium ceiling, but now it has its own full-exclusive payload to defend that claim.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card accent-cyan">
            <h3>Integrated modernization</h3>
            <p>Use Full for premium workflow upgrades inside spreadsheet, inbox, and analytics environments.</p>
          </article>
          <article className="value-card accent-violet">
            <h3>Sharper separation</h3>
            <p>Full now differentiates itself by ecosystem and delivery type, not only by visual polish.</p>
          </article>
          <article className="value-card accent-rose">
            <h3>Premium retention</h3>
            <p>Recurring buyers stay longer when the top tier unlocks assets they cannot already get in Pro.</p>
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
            entitlement tier in the current rollout and now includes a dedicated full-exclusive
            manifest set inside `packages/pro/launch-exclusive`.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Founder standard</p>
          <h2>What belongs here</h2>
          <p>
            If an asset does not open a new paid ecosystem, it probably belongs in Pro. Full
            Signature should carry the pieces that make the product feel like a new tier category,
            not just a prettier package.
          </p>
        </article>
      </section>
    </main>
  );
}
