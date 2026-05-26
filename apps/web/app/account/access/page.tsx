import type { Metadata } from 'next';
import Link from 'next/link';
import { AccessSummaryCard } from '../../access-ui';
import { resolveCurrentAccess } from '../../../lib/access-resolver';
import { buildRouteMetadata } from '../../../lib/seo';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Account access | LotOS UI',
  description:
    'Review your LotOS UI access level, promotional grants, expiration, and premium capability boundaries.',
  path: '/account/access',
});

export default async function AccountAccessPage() {
  const access = await resolveCurrentAccess();

  return (
    <main className="landing account-access-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/free">Free</Link>
          <Link href="/claim">Tengo código</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/team-access">Team QA</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>

      <section className="account-access-hero">
        <div>
          <p className="eyebrow">Access center</p>
          <h1>Tu acceso LotOS en una sola vista.</h1>
          <p>
            Revisa el plan activo, fuente de acceso, expiracion y capacidades principales sin exponer detalles
            internos del resolver.
          </p>
        </div>
        <AccessSummaryCard access={access} />
      </section>

      <section className="account-access-grid">
        <article>
          <p className="eyebrow">Foundation</p>
          <h2>Disponible para explorar</h2>
          <p>Demos publicas, componentes base, previews y patrones de producto sin descargas privadas.</p>
        </article>
        <article>
          <p className="eyebrow">Promotional access</p>
          <h2>Claims enlazados a cuenta</h2>
          <p>
            Pro Trials, Pro Gifts y Full Signature Gifts solo desbloquean beneficios cuando el grant esta vigente,
            no revocado y dentro de su limite de uso.
          </p>
        </article>
        <article>
          <p className="eyebrow">Premium boundary</p>
          <h2>Descargas protegidas</h2>
          <p>Los downloads premium siguen pasando por el resolver central antes de entregar cualquier asset.</p>
        </article>
      </section>
    </main>
  );
}
