import Link from 'next/link';
import { requirePlanAccess } from '../../../lib/auth-server';
import { soloAssets } from '../../../lib/commercial-assets';
import '../../lotos-landing.css';

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
        <h1>Commercial previews and controlled proof assets.</h1>
        <p className="lead">
          Solo unlocks evaluation-only materials, sales previews, and visual proof assets without
          exposing the full private payload.
        </p>
      </section>

      <section className="pricing expanded">
        {soloAssets.map((asset) => (
          <article key={asset.id} className="card pricing-card highlight">
            <p className="plan-tier">Solo</p>
            <h3>{asset.name}</h3>
            <p>{asset.description}</p>
            <a className="btn primary" href={`/api/download/${asset.id}`}>
              Download {asset.fileName}
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
