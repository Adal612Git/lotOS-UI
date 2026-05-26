import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth-options';
import { isOwnerEmail, normalizeEmail } from '../../../lib/owner';
import { buildRouteMetadata } from '../../../lib/seo';
import { FreeGrantsClient } from './free-grants-client';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Promotional grants | LotOS UI',
  description: 'Owner-only promotional grant creation, review, and revocation for LotOS UI.',
  path: '/team-access/free-grants',
});

export default async function FreeGrantsPage() {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const owner = isOwnerEmail(email);

  return (
    <main className="landing team-access-page free-grants-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/team-access">Team QA</Link>
          <Link href="/account/access">Access</Link>
          <Link href="/claim">Claim</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="team-access-hero">
        <div>
          <p className="eyebrow">Owner tools</p>
          <h1>Promotional grants sin romper premium.</h1>
          <p>
            Crea Creator Passes, Pro Studio Trials y Full Signature Gifts con hash, expiracion, limite de claims y
            revocacion centralizada.
          </p>
        </div>
      </section>

      {owner ? (
        <FreeGrantsClient />
      ) : (
        <section className="team-access-denied">
          <p className="eyebrow">Acceso restringido</p>
          <h2>Esta pantalla solo es para owner/admin autorizado.</h2>
          <p>La ruta publica de usuarios promocionales vive en /claim y no muestra codigos activos.</p>
          <Link className="btn primary" href="/login?callbackUrl=/team-access/free-grants">Entrar</Link>
        </section>
      )}
    </main>
  );
}
