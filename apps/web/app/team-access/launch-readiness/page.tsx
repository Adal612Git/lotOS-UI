import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth-options';
import { isOwnerEmail, normalizeEmail } from '../../../lib/owner';
import { buildRouteMetadata } from '../../../lib/seo';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Launch readiness | LotOS UI',
  description: 'Owner-only release candidate checklist for promo grants, QA, screenshots, analytics, and npm staging.',
  path: '/team-access/launch-readiness',
});

const readinessItems = [
  { label: 'Supabase migration applied staging', status: 'manual', note: 'Aplicar 0003 y 0004 en staging con backup.' },
  { label: 'Supabase migration applied production', status: 'manual', note: 'Solo despues del claim QA en staging.' },
  { label: 'QA PRO_TRIAL tested', status: 'manual', note: 'Claim real no publico, verificar /account/access y revocar.' },
  { label: 'RPC transactional enabled', status: 'ready', note: 'Migracion 0004 lista; requiere aplicacion remota.' },
  { label: 'First Creator Pass created', status: 'manual', note: 'Crear uno a uno, maxClaims 1, expiracion 14 dias.' },
  { label: 'First Founder Pass created', status: 'manual', note: 'Crear solo para aliados seleccionados.' },
  { label: 'Analytics connected', status: 'pending', note: 'Adapter no-op listo; proveedor pendiente.' },
  { label: 'Screenshots captured', status: 'pending', note: 'Usar checklist de docs/marketing/screenshots.' },
  { label: 'Demo video recorded', status: 'pending', note: 'Usar guiones de marketing antes de publicar.' },
  { label: 'Feedback form ready', status: 'ready', note: 'Ruta /feedback y preguntas base disponibles.' },
  { label: 'npm package staged', status: 'ready', note: '@lotosui/react sigue private con prepublishOnly bloqueante.' },
  { label: 'Premium boundary verified', status: 'ready', note: 'Ejecutar verify:premium-boundary antes de campaña.' },
] as const;

const statusLabels = {
  ready: 'Listo local',
  manual: 'Requiere accion',
  pending: 'Pendiente',
} as const;

export default async function LaunchReadinessPage() {
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const owner = isOwnerEmail(email);

  return (
    <main className="landing team-access-page launch-readiness-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/team-access">Team QA</Link>
          <Link href="/team-access/free-grants">Promo Grants</Link>
          <Link href="/account/access">Access</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="team-access-hero">
        <div>
          <p className="eyebrow">Release candidate</p>
          <h1>Launch readiness sin fingir automatizacion.</h1>
          <p>
            Checklist owner-only para llevar LotOS UI de RC a primera campana real con testers, grants
            transaccionales, feedback y frontera premium verificada.
          </p>
        </div>
      </section>

      {owner ? (
        <section className="launch-readiness-grid">
          {readinessItems.map((item) => (
            <article key={item.label} className={`launch-readiness-item launch-readiness-item-${item.status}`}>
              <span>{statusLabels[item.status]}</span>
              <h2>{item.label}</h2>
              <p>{item.note}</p>
            </article>
          ))}
        </section>
      ) : (
        <section className="team-access-denied">
          <p className="eyebrow">Acceso restringido</p>
          <h2>Esta pantalla solo es para owner/admin autorizado.</h2>
          <p>El estado publico de acceso vive en /account/access y no expone checklist interno.</p>
          <Link className="btn primary" href="/login?callbackUrl=/team-access/launch-readiness">Entrar</Link>
        </section>
      )}
    </main>
  );
}
