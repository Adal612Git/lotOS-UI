import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { soloAssets } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

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
        <p className="kicker">Solo Surface</p>
        <h1>Private proof, premium previews, and a first paid experience that feels worth keeping.</h1>
        <p className="lead">
          Solo is your premium entry tier. It unlocks evaluation-only materials, sales previews, and
          visual proof assets without exposing the full private payload, while still making the buyer
          feel they crossed into a more exclusive layer of the product.
        </p>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>{soloAssets.length}</strong>
          <span>Private proof assets</span>
          <p>Enough premium material to create a real monthly step above free without exposing Pro.</p>
        </article>
        <article className="vault-kpi">
          <strong>1</strong>
          <span>Operator-first tier</span>
          <p>Solo is intentionally focused: one buyer, one recurring path, one clean upgrade ladder.</p>
        </article>
        <article className="vault-kpi">
          <strong>MX$59</strong>
          <span>Monthly entry point</span>
          <p>Phase 1 founders pricing for the first 20 customers keeps this tier accessible but still premium.</p>
        </article>
      </section>

      <section className="value-grid">
        {soloBenefits.map((item) => (
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
        {soloAssets.map((asset) => (
          <article key={asset.id} className="asset-card">
            <div className="asset-top">
              <div>
                <p className="plan-tier">Solo Premium Asset</p>
                <h3>{asset.name}</h3>
                <p>{asset.description}</p>
              </div>
              <span className="asset-file">{asset.fileName}</span>
            </div>
            <div className="asset-meta" aria-label={`Asset metadata for ${asset.name}`}>
              <span className="payment-chip ready">Buyer-only</span>
              <span className="payment-chip free">Proof layer</span>
              <span className="payment-chip manual">Controlled preview</span>
            </div>
            <a className="btn primary full" href={`/api/download/${asset.id}`}>
              Unlock {asset.name}
            </a>
          </article>
        ))}
      </section>

      <section className="tier-upgrade-panel">
        <p className="section-label">What unlocks next</p>
        <h2>Pro Studio is where the recurring value gets serious.</h2>
        <div className="tier-upgrade-grid">
          <article className="value-card">
            <h3>From proof to production</h3>
            <p>Solo proves the product is real. Pro is where buyers start collecting reusable private assets.</p>
          </article>
          <article className="value-card">
            <h3>Protected kits and layouts</h3>
            <p>Industry kits, signature layouts, and spreadsheet modernization assets sit one level above this tier.</p>
          </article>
          <article className="value-card">
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
