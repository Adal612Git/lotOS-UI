import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { proAssets, proDesktopTemplates } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

const proPrograms = [
  {
    title: 'Protected execution layer',
    summary:
      'Pro is the first tier that should feel like the buyer is holding the real paid product, not just a teaser.',
    bullets: [
      'Reusable private assets that move beyond preview-only proof',
      'The core premium tier for recurring monthly value',
      'Built to justify the jump from Solo on utility, not only on copy',
    ],
  },
  {
    title: 'Reusable commercial leverage',
    summary:
      'This tier is where agencies, startups, and internal platform teams should start saving real time.',
    bullets: [
      'Layouts and kits that compress presentation and implementation effort',
      'Private manifests and stronger delivery primitives',
      'A richer premium catalog that feels materially different from Solo',
    ],
  },
  {
    title: 'Team-facing premium path',
    summary:
      'Pro should be the obvious recurring choice for buyers who want the strongest balance of price and value.',
    bullets: [
      'Higher-value monthly subscription than Solo',
      'Still below the prestige tier of Launch Signature',
      'Designed to be the practical center of your commercial ladder',
    ],
  },
];

export default async function ProVaultPage() {
  await requirePlanAccess('pro');

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/vault">Vault Home</Link>
          <Link href="/vault/launch">Launch</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Pro Surface</p>
        <h1>The real premium product: protected assets, reusable kits, and recurring production leverage.</h1>
        <p className="lead">
          Pro unlocks the real paid surface: private manifests, layout packs, industry kits, and the
          Pro-only desktop template catalog. This is the tier where the buyer should clearly feel the
          difference between paying for access and actually paying for momentum.
        </p>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>{proAssets.length}</strong>
          <span>Protected Pro assets</span>
          <p>A wider premium surface built to feel materially stronger than the Solo proof layer.</p>
        </article>
        <article className="vault-kpi">
          <strong>{proDesktopTemplates.length}</strong>
          <span>Desktop templates</span>
          <p>Extra operator-facing catalog depth that expands the sense of value beyond raw files.</p>
        </article>
        <article className="vault-kpi">
          <strong>MX$79</strong>
          <span>Core premium tier</span>
          <p>The strongest balance tier for recurring value, reusable assets, and real private leverage.</p>
        </article>
      </section>

      <section className="value-grid">
        {proPrograms.map((item) => (
          <article key={item.title} className="value-card">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <ul className="value-list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="vault-assets-grid">
        {proAssets.map((asset) => (
          <article key={asset.id} className="asset-card pro">
            <div className="asset-top">
              <div>
                <p className="plan-tier">Pro Premium Asset</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready">Private bundle</span>
              <span className="payment-chip alt">Reusable</span>
              <span className="payment-chip manual">Team-facing</span>
            </div>
            <a className="btn primary full" href={`/api/download/${asset.id}`}>
              Unlock {asset.name}
            </a>
          </article>
        ))}
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Desktop templates</p>
          <h2>Pro-only runtime catalog</h2>
          <ul>
            {proDesktopTemplates.map((template) => (
              <li key={template.id}>
                <strong>{template.name}</strong>: {template.summary}
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Spreadsheet monetization</p>
          <h2>Excel and OpenOffice are Pro-only</h2>
          <p>
            The Excel and OpenOffice kits are now behind the same Pro entitlement as the rest of the
            protected commercial payload. Public previews can still live in the Solo surface, but
            the stronger execution value sits here in the Pro tier.
          </p>
        </article>
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">Top tier above this</p>
        <h2>Launch Signature adds prestige, polish, and the most exclusive commercial framing.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card">
            <h3>More curation</h3>
            <p>Launch Signature should feel less like a kit library and more like a private launch command room.</p>
          </article>
          <article className="value-card">
            <h3>Higher perceived value</h3>
            <p>It is the tier for buyers who want the strongest presentation quality and the most premium narrative.</p>
          </article>
          <article className="value-card">
            <h3>Prestige layer</h3>
            <p>Pro is practical power. Launch is the prestige tier above it.</p>
          </article>
        </div>
        <div className="tier-foot-strip">
          <Link href="/vault/launch" className="btn ghost">Preview Launch Surface</Link>
          <Link href="/pricing" className="btn primary">Upgrade to Launch Signature</Link>
        </div>
      </section>
    </main>
  );
}
