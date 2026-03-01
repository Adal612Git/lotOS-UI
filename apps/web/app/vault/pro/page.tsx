import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { proAssets, proDesktopTemplates } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

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
        <h1>Protected asset packs, spreadsheet kits, and desktop template unlocks.</h1>
        <p className="lead">
          Pro unlocks the real paid surface: private manifests, layout packs, industry kits, and
          the Pro-only desktop template catalog.
        </p>
      </section>

      <section className="pricing expanded">
        {proAssets.map((asset) => (
          <article key={asset.id} className="card pricing-card highlight">
            <p className="plan-tier">Pro</p>
            <h3>{asset.name}</h3>
            <p>{asset.description}</p>
            <a className="btn primary" href={`/api/download/${asset.id}`}>
              Download {asset.fileName}
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
            protected commercial payload. Public previews can still live in the Solo surface.
          </p>
        </article>
      </section>
    </main>
  );
}
