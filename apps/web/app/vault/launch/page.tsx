import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { launchAssets } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

const launchSignatureLayers = [
  {
    title: 'Integrated premium tier',
    summary:
      'This is the highest entitlement tier in the current product. It should now feel like a distinct product line, not just a prettier version of Pro.',
  },
  {
    title: 'Launch-only surfaces',
    summary:
      'The purpose of this tier is not only more polish. It now reserves integrated work surfaces that do not ship in Pro.',
  },
  {
    title: 'Exclusive by ecosystem',
    summary:
      'Launch Signature becomes valuable when it opens new ecosystems: Sheets, Microsoft 365, Outlook, Power BI, Figma, and executive command surfaces.',
  },
];

const launchUseCases = [
  'Use this tier for premium modernization offers inside tools buyers already live in every day.',
  'Reserve integrated surfaces here so Launch is a new category of delivery, not just more framing.',
  'Sell this as the command-room tier for spreadsheet, inbox, analytics, and executive workflows.',
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
        <h1>The prestige layer now carries launch-only operator surfaces, not just higher polish.</h1>
        <p className="lead">
          Launch Signature sits above Pro. It now reserves six launch-only surfaces for Google
          Sheets, Microsoft 365 Excel Web, Outlook, Power BI, Figma, and executive boardroom
          delivery. This is the tier for buyers who want a category jump, not just a nicer wrapper.
        </p>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>{launchAssets.length}</strong>
          <span>Launch-only assets</span>
          <p>Exclusive manifests and premium surfaces that do not ship in Pro.</p>
        </article>
        <article className="vault-kpi">
          <strong>MX$249</strong>
          <span>Prestige subscription</span>
          <p>Phase 1 founders pricing for the first 20 customers, now tied to a truly distinct top tier.</p>
        </article>
        <article className="vault-kpi">
          <strong>6</strong>
          <span>New ecosystems</span>
          <p>Sheets, Microsoft 365, Outlook, Power BI, Figma, and executive boardroom delivery.</p>
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
          <h2>What Launch Signature now adds on top of Pro</h2>
          <ul>
            <li>Six launch-only manifests that do not exist in the Pro entitlement.</li>
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
        {launchAssets.map((asset) => (
          <article key={asset.id} className="asset-card launch">
            <div className="asset-top">
              <div>
                <p className="plan-tier">Launch Exclusive Surface</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready">Launch-only</span>
              <span className="payment-chip alt">Integrated surface</span>
              <span className="payment-chip manual">Top-tier delivery</span>
            </div>
            <a className="btn primary full" href={`/api/download/${asset.id}`}>
              Unlock {asset.name}
            </a>
          </article>
        ))}
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">Current implementation scope</p>
        <h2>This route is still the premium ceiling, but now it has its own launch-exclusive payload to defend that claim.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card">
            <h3>Integrated modernization</h3>
            <p>Use Launch for premium workflow upgrades inside spreadsheet, inbox, and analytics environments.</p>
          </article>
          <article className="value-card">
            <h3>Sharper separation</h3>
            <p>Launch now differentiates itself by ecosystem and delivery type, not only by visual polish.</p>
          </article>
          <article className="value-card">
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
            entitlement tier in the current rollout and now includes a dedicated launch-exclusive
            manifest set inside `packages/pro/launch-exclusive`.
          </p>
        </article>
        <article className="card">
          <p className="section-label">Founder standard</p>
          <h2>What belongs here</h2>
          <p>
            If an asset does not open a new paid ecosystem, it probably belongs in Pro. Launch
            Signature should carry the pieces that make the product feel like a new tier category,
            not just a prettier package.
          </p>
        </article>
      </section>
    </main>
  );
}
