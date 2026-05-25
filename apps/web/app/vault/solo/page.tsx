import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { soloAssets } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

const fallbackSoloAssets = [
  {
    id: 'solo-proof-fallback',
    name: 'Solo Proof Pack',
    description: 'Fallback summary of the private proof layer while the protected asset catalog stabilizes.',
    fileName: 'solo-proof-pack',
  },
];

const soloAccentCycle = ['accent-cyan', 'accent-emerald', 'accent-amber', 'accent-violet'] as const;

const soloSignals = [
  { value: '1', label: 'Operator' },
  { value: 'MX$59', label: 'Placeholder' },
  { value: 'Private', label: 'Proof layer' },
  { value: 'Fast', label: 'Upgrade path' },
];

const soloHighlights = [
  'Private proof with real perceived value',
  'A compact first paid experience',
  'Controlled previews without full payload',
  'Clean bridge from free into premium',
];

const soloProofNotes = [
  'Solo should feel clearly better than free, but still intentionally lighter than Pro.',
  'Its job is to create recurring confidence and premium momentum without giving away the strongest execution assets.',
  'That makes Solo easier to buy first and makes the Pro upgrade easier to justify later.',
];

const soloBenefits = [
  {
    title: 'Premium proof layer',
    summary:
      'Solo is where the product starts feeling private: it gives the buyer enough premium proof to justify recurring payment without exposing the full Pro payload.',
    bullets: [
      'Evaluation-first, trust-building commercial materials',
      'Private presentation assets you can reuse while validating value',
      'A safer premium entry for one operator before committing to Pro',
    ],
  },
  {
    title: 'Monthly confidence pack',
    summary:
      'This tier should feel like a compact subscription that keeps the buyer close to the premium story every month.',
    bullets: [
      'Buyer-only access to recurring premium proof assets',
      'A cleaner bridge from public docs into private value',
      'An easier yes for cautious buyers who still want something exclusive',
    ],
  },
  {
    title: 'Upgrade-ready by design',
    summary:
      'Solo does not try to be the whole product. It is intentionally framed as the first premium rung in the ladder.',
    bullets: [
      'Shows what quality feels like without giving away everything',
      'Creates a natural path into Pro Studio',
      'Keeps the strongest execution assets protected for higher tiers',
    ],
  },
];

export default async function SoloVaultPage() {
  await requirePlanAccess('solo');
  const assets = soloAssets.length > 0 ? soloAssets : fallbackSoloAssets;
  const degradedAssets = soloAssets.length === 0;

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/vault">Vault Home</Link>
          <Link href="/vault/pro">Pro</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Solo Surface</p>
        <h1>Private proof, premium previews, and a first paid experience that feels worth keeping.</h1>
        <p className="lead">
          Solo is your premium entry tier. It unlocks evaluation-only materials, sales previews, and
          visual proof assets without exposing the full private payload, while still making the buyer
          feel they crossed into a more exclusive layer of the product.
        </p>
        <div className="payment-meta" aria-label="Solo tier state">
          <span className="payment-chip ready accent-cyan">Buyer-only layer</span>
          <span className="payment-chip alt accent-amber">Above free, below Pro</span>
          <span className="payment-chip manual accent-violet">Proof-first premium</span>
        </div>
        {degradedAssets ? (
          <div className="pricing-state-banner warning">
            <strong>Solo catalog in fallback mode.</strong>
            <span>The tier stays usable and explainable while the protected asset list is being refreshed.</span>
          </div>
        ) : null}
        <div className="hero-actions compact">
          <Link href="/vault" className="btn ghost">Vault Home</Link>
          <Link href="/vault/pro" className="btn ghost">Compare With Pro</Link>
          <Link href="/pricing" className="btn primary">Review Pricing</Link>
        </div>
      </section>

      <section className="card free-entry solo-proof-panel">
        <div className="tier-head">
          <div className="tier-title-block">
            <p className="plan-tier">From Free To Solo</p>
            <h3>The first paid step should feel noticeably richer without collapsing the upgrade ladder.</h3>
            <p>
              Solo is where the buyer first feels exclusivity. It should be more valuable than the
              public layer, but still preserve the bigger jump into Pro.
            </p>
          </div>
          <span className="tier-badge accent-amber">Proof Upgrade</span>
        </div>
        <div className="free-rich-panel">
          <div className="free-rich-copy">
            <p className="tier-mini-label">Premium entry design</p>
            <h4>Solo now reads as a deliberate bridge between trust and stronger paid utility.</h4>
            <p>
              It gives the buyer enough private value to stay subscribed, while keeping the heavier
              implementation payload protected for the higher tier.
            </p>
          </div>
          <div className="free-signal-grid" aria-label="Solo signals">
            {soloSignals.map((signal, index) => (
              <div key={signal.label} className={`free-signal ${soloAccentCycle[index % soloAccentCycle.length]}`}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="tier-pill-grid" aria-label="Solo highlights">
              {soloHighlights.map((item, index) => (
                <span key={item} className={`tier-pill ${soloAccentCycle[index % soloAccentCycle.length]}`}>
                  {item}
                </span>
              ))}
            </div>
            <ul>
              <li>Free proves the platform is real; Solo proves the commercial layer is worth paying for.</li>
              <li>It introduces private access, curated proof assets, and a stronger sense of product ownership.</li>
              <li>It stays intentionally compact so the recurring upgrade path remains clean and believable.</li>
            </ul>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label">Why Solo works</p>
            <h4>It creates premium momentum without burning the Pro value proposition too early.</h4>
            <ul className="free-proof-list">
              {soloProofNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi accent-cyan">
          <strong>{assets.length}</strong>
          <span>Private proof assets</span>
          <p>Enough premium material to create a real monthly step above free without exposing Pro.</p>
        </article>
        <article className="vault-kpi accent-amber">
          <strong>1</strong>
          <span>Operator-first tier</span>
          <p>Solo is intentionally focused: one buyer, one recurring path, one clean upgrade ladder.</p>
        </article>
        <article className="vault-kpi accent-violet">
          <strong>MX$59 placeholder</strong>
          <span>Monthly entry point</span>
          <p>Phase 1 founders pricing for the first 20 customers keeps this tier accessible but still premium.</p>
        </article>
      </section>

      <section className="value-grid">
        {soloBenefits.map((item, index) => (
          <article key={item.title} className={`value-card ${soloAccentCycle[index % soloAccentCycle.length]}`}>
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
          <article key={asset.id} className={`asset-card solo ${soloAccentCycle[index % soloAccentCycle.length]}`}>
            <div className="asset-top">
              <div>
                <p className="plan-tier">Solo Premium Asset</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready accent-cyan">Buyer-only</span>
              <span className="payment-chip free accent-amber">Proof layer</span>
              <span className="payment-chip manual accent-violet">Controlled preview</span>
            </div>
            {degradedAssets ? (
              <Link className="btn primary full" href="/pricing">
                Review Solo Access
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
        <p className="section-label">What unlocks next</p>
        <h2>Pro Studio is where the recurring value gets serious.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card accent-cyan">
            <h3>From proof to production</h3>
            <p>Solo proves the product is real. Pro is where buyers start collecting reusable private assets.</p>
          </article>
          <article className="value-card accent-amber">
            <h3>Protected kits and layouts</h3>
            <p>Industry kits, signature layouts, and spreadsheet modernization assets sit one level above this tier.</p>
          </article>
          <article className="value-card accent-violet">
            <h3>Clear upgrade logic</h3>
            <p>Solo stays light on purpose so the jump into Pro always feels like a meaningful gain.</p>
          </article>
        </div>
        <div className="tier-foot-strip">
          <Link href="/vault/pro" className="btn ghost">Preview Pro Surface</Link>
          <Link href="/pricing" className="btn primary">Upgrade to Pro Studio</Link>
        </div>
      </section>
    </main>
  );
}
