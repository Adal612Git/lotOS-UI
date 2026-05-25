import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { proAssets, proDesktopTemplates } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

const fallbackProAssets = [
  {
    id: 'pro-core-fallback',
    name: 'Pro Core Bundle',
    description: 'Fallback summary of the reusable protected Pro layer while the private catalog refresh completes.',
    fileName: 'pro-core-bundle',
  },
];

const proAccentCycle = ['accent-amber', 'accent-cyan', 'accent-violet', 'accent-emerald'] as const;

const proSignals = [
  { value: 'Core', label: 'Paid tier' },
  { value: 'MX$129', label: 'Placeholder' },
  { value: 'Reusable', label: 'Assets' },
  { value: 'Teams', label: 'Ready' },
];

const proHighlights = [
  'The real protected product starts here',
  'Reusable kits instead of proof-only previews',
  'Better monthly leverage than Solo',
  'The strongest balance of utility and price',
];

const proProofNotes = [
  'Pro should be the first tier where the buyer feels they are holding a serious private system.',
  'It earns the upgrade by saving effort, improving delivery speed, and increasing the sense of ownership.',
  'That is why this tier should feel materially stronger than Solo, not just more expensive.',
];

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
      'Still below the prestige tier of Full Signature',
      'Designed to be the practical center of your commercial ladder',
    ],
  },
];

export default async function ProVaultPage() {
  await requirePlanAccess('pro');
  const assets = proAssets.length > 0 ? proAssets : fallbackProAssets;
  const desktopTemplates = proDesktopTemplates.length > 0 ? proDesktopTemplates : [
    {
      id: 'desktop-fallback',
      name: 'Premium Desktop Catalog',
      summary: 'Pro keeps the desktop runtime lane reserved even while the catalog is being refreshed.',
      plan: 'pro' as const,
    },
  ];
  const degradedAssets = proAssets.length === 0;

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/vault">Vault Home</Link>
          <Link href="/vault/launch">Full</Link>
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
        <div className="payment-meta" aria-label="Pro tier state">
          <span className="payment-chip ready accent-amber">Core premium layer</span>
          <span className="payment-chip alt accent-cyan">Reusable delivery</span>
          <span className="payment-chip manual accent-violet">Above Solo, below Full</span>
        </div>
        {degradedAssets ? (
          <div className="pricing-state-banner warning">
            <strong>Pro catalog in fallback mode.</strong>
            <span>The tier remains usable while protected Pro assets finish syncing into the vault catalog.</span>
          </div>
        ) : null}
        <div className="hero-actions compact">
          <Link href="/vault" className="btn ghost">Vault Home</Link>
          <Link href="/vault/launch" className="btn ghost">Compare With Full</Link>
          <Link href="/pricing" className="btn primary">Review Pricing</Link>
        </div>
      </section>

      <section className="card free-entry pro-command-panel">
        <div className="tier-head">
          <div className="tier-title-block">
            <p className="plan-tier">Why Pro Wins</p>
            <h3>This is where the buyer should stop feeling &quot;preview&quot; and start feeling &quot;product&quot;.</h3>
            <p>
              Pro is the commercial center of gravity. It is the tier that should most clearly justify
              recurring payment on real utility, not only on premium framing.
            </p>
          </div>
          <span className="tier-badge accent-amber">Value Center</span>
        </div>
        <div className="free-rich-panel">
          <div className="free-rich-copy">
            <p className="tier-mini-label">Protected execution layer</p>
            <h4>Pro now reads as the serious operating tier, not a small step above Solo.</h4>
            <p>
              It delivers the first truly substantial private payload: more reusable, more team-facing,
              and much closer to something buyers can actually build with repeatedly.
            </p>
          </div>
          <div className="free-signal-grid" aria-label="Pro signals">
            {proSignals.map((signal, index) => (
              <div key={signal.label} className={`free-signal ${proAccentCycle[index % proAccentCycle.length]}`}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="tier-pill-grid" aria-label="Pro highlights">
              {proHighlights.map((item, index) => (
                <span key={item} className={`tier-pill ${proAccentCycle[index % proAccentCycle.length]}`}>
                  {item}
                </span>
              ))}
            </div>
            <ul>
              <li>Solo proves the paid layer is real. Pro is where that paid layer becomes operationally useful.</li>
              <li>It should feel like the buyer unlocked practical commercial leverage, not just more premium copy.</li>
              <li>This is the tier most buyers should view as the obvious recurring subscription if they want real momentum.</li>
            </ul>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label">What Pro must communicate</p>
            <h4>It should feel like the strongest practical purchase in the entire ladder.</h4>
            <ul className="free-proof-list">
              {proProofNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi accent-amber">
          <strong>{assets.length}</strong>
          <span>Protected Pro assets</span>
          <p>A wider premium surface built to feel materially stronger than the Solo proof layer.</p>
        </article>
        <article className="vault-kpi accent-cyan">
          <strong>{desktopTemplates.length}</strong>
          <span>Desktop templates</span>
          <p>Extra operator-facing catalog depth that expands the sense of value beyond raw files.</p>
        </article>
        <article className="vault-kpi accent-violet">
          <strong>MX$129 placeholder</strong>
          <span>Core premium tier</span>
          <p>Phase 1 founders pricing for the first 20 customers positions Pro as the value center of the ladder.</p>
        </article>
      </section>

      <section className="value-grid">
        {proPrograms.map((item, index) => (
          <article key={item.title} className={`value-card ${proAccentCycle[index % proAccentCycle.length]}`}>
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
        {assets.map((asset, index) => (
          <article key={asset.id} className={`asset-card pro ${proAccentCycle[index % proAccentCycle.length]}`}>
            <div className="asset-top">
              <div>
                <p className="plan-tier">Pro Premium Asset</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready accent-amber">Private bundle</span>
              <span className="payment-chip alt accent-cyan">Reusable</span>
              <span className="payment-chip manual accent-violet">Team-facing</span>
            </div>
            {degradedAssets ? (
              <Link className="btn primary full" href="/pricing">
                Review Pro Access
              </Link>
            ) : (
              <a className="btn primary full" href={`/api/download/${asset.id}`}>
                Unlock {asset.name}
              </a>
            )}
          </article>
        ))}
      </section>

      <section className="grid two">
        <article className="card accent-cyan">
          <p className="section-label">Desktop templates</p>
          <h2>Pro-only runtime catalog</h2>
          <ul>
            {desktopTemplates.map((template) => (
              <li key={template.id}>
                <strong>{template.name}</strong>: {template.summary}
              </li>
            ))}
          </ul>
        </article>
        <article className="card accent-amber">
          <p className="section-label">Spreadsheet monetization</p>
          <h2>Excel and OpenOffice are Pro-only</h2>
          <p>
            The Excel and OpenOffice kits stay behind the same Pro entitlement as the rest of the
            protected commercial payload. Public previews can still live in the Solo surface, but
            the stronger execution value sits here in the Pro tier.
          </p>
        </article>
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">Top tier above this</p>
        <h2>Full Signature adds breadth, prestige, and the most complete premium framing.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card accent-cyan">
            <h3>More curation</h3>
            <p>Full Signature should feel less like a kit library and more like a private launch command room.</p>
          </article>
          <article className="value-card accent-violet">
            <h3>Higher perceived value</h3>
            <p>It is the tier for buyers who want the strongest presentation quality and the most premium narrative.</p>
          </article>
          <article className="value-card accent-amber">
            <h3>Prestige layer</h3>
            <p>Pro is practical power. Full is the prestige tier above it.</p>
          </article>
        </div>
        <div className="tier-foot-strip">
          <Link href="/vault/launch" className="btn ghost">Preview Full Surface</Link>
          <Link href="/pricing" className="btn primary">Upgrade to Full Signature</Link>
        </div>
      </section>
    </main>
  );
}
