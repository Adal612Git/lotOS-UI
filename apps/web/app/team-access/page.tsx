import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../../auth-options';
import { resolveCurrentAccess } from '../../lib/access-resolver';
import type { AccessCapabilities } from '../../lib/access-policy';
import { normalizeEmail } from '../../lib/owner';
import { buildRouteMetadata } from '../../lib/seo';
import { getActiveTesterAccess, isTesterAccessConfigured } from '../../lib/tester-access';
import '../lotos-landing.css';
import { AccessSummaryCard } from '../access-ui';
import { TesterAccessForm } from './team-access-form';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Team QA Access',
  description: 'Internal tester unlock and QA entitlement registration for exhaustive LotOS UI premium validation.',
  path: '/team-access',
});

type TeamAccessSearchParams = {
  activated?: string;
  cleared?: string;
  error?: string;
  state?: string;
  next?: string;
};

const qaRoutes: Array<{
  href: string;
  label: string;
  body: string;
  capability: keyof AccessCapabilities;
  primary?: boolean;
}> = [
  {
    href: '/vault',
    label: 'Abrir Vault',
    body: 'Entrada principal para ver estado de acceso, tiers y rutas premium.',
    capability: 'vault',
    primary: true,
  },
  {
    href: '/vault/launch',
    label: 'Abrir Full / Launch',
    body: 'Superficie Full Signature con assets exclusivos launch_pack.',
    capability: 'vaultFull',
    primary: true,
  },
  {
    href: '/playground',
    label: 'Abrir Playground',
    body: 'Comparador de componentes y casos de uso para probar con IA.',
    capability: 'playground',
  },
  {
    href: '/templates',
    label: 'Abrir Templates',
    body: 'Galeria de plantillas, industrias, prompts y runtimes.',
    capability: 'templates',
  },
  {
    href: '/demo/components',
    label: 'Catalogo de Componentes',
    body: 'Showcase visual de componentes que Victor estaba buscando.',
    capability: 'componentCatalog',
  },
  {
    href: '/api/download/sales-preview',
    label: 'Descarga de prueba',
    body: 'Asset protegido para confirmar que downloads ya no dan 401/403/404.',
    capability: 'downloads',
  },
];

function formatDate(value: string | null) {
  if (!value) {
    return 'sin vencimiento registrado';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'vencimiento invalido';
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function booleanLabel(value: boolean) {
  return value ? 'si' : 'no';
}

export default async function TeamAccessPage({
  searchParams,
}: {
  searchParams?: Promise<TeamAccessSearchParams>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const email = normalizeEmail(session?.user?.email);
  const testerAccess = await getActiveTesterAccess(email);
  const access = await resolveCurrentAccess('launch_pack');
  const configured = isTesterAccessConfigured();
  const signedIn = Boolean(email);
  const qaActive = Boolean(testerAccess);
  const isFull = access.capabilities.vaultFull;

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/vault" className="nav-link nav-link--cta">Vault</Link>
          <Link href="/playground" className="nav-link nav-link--components">Playground</Link>
          <Link href="/free" className="nav-link">Free</Link>
          <Link href="/claim" className="nav-link">Claim</Link>
          <Link href="/team-access/free-grants" className="nav-link">Promo Grants</Link>
          <Link href="/team-access/launch-readiness" className="nav-link">Launch RC</Link>
          <Link href="/pricing" className="nav-link nav-link--pricing">Pricing</Link>
          {signedIn ? (
            <Link href="/api/auth/signout?callbackUrl=/" className="nav-link nav-link--muted">Sign Out</Link>
          ) : (
            <Link href="/login?callbackUrl=/team-access" className="nav-link nav-link--muted">Optional Sign In</Link>
          )}
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Internal QA</p>
        <h1>Acceso QA simple: telefono autorizado, activar, abrir Full.</h1>
        {signedIn ? (
          <p className="lead">
            Sesion Google detectada como <strong>{email}</strong>, pero es opcional para QA. El flujo principal
            sigue siendo telefono autorizado y cookie segura de navegador.
          </p>
        ) : (
          <p className="lead">
            No ocupas Google. Escribe el telefono autorizado, activa QA completo, y usa los botones grandes de abajo
            para abrir Vault, Full, Playground, Templates y Catalogo de Componentes.
          </p>
        )}
        {params?.activated === '1' ? (
          <div className="pricing-state-banner">
            <strong>QA activado.</strong>
            <span>El servidor ya debe detectar la cookie en este navegador. Si no ves Full activo, recarga esta pagina.</span>
          </div>
        ) : null}
        {params?.cleared === '1' ? (
          <div className="pricing-state-banner warning">
            <strong>QA limpiado.</strong>
            <span>La cookie de este navegador fue removida. Puedes volver a activar con el telefono autorizado.</span>
          </div>
        ) : null}
        {params?.error ? (
          <div className="pricing-state-banner warning">
            <strong>Google fallo, pero QA por telefono sigue disponible.</strong>
            <span>No uses Google para esta prueba. Mete el telefono autorizado y activa QA completo.</span>
          </div>
        ) : null}
        {params?.state === 'qa-required' ? (
          <div className="pricing-state-banner warning">
            <strong>Ruta premium bloqueada.</strong>
            <span>Activa QA por telefono aqui y despues vuelve a abrir {params.next ?? 'la ruta premium'}.</span>
          </div>
        ) : null}
        <div className="payment-meta" aria-label="Team access state">
          <span className={`payment-chip ${qaActive ? 'ready' : 'manual'} accent-emerald`}>
            {qaActive ? 'QA activo' : 'QA pendiente'}
          </span>
          <span className="payment-chip manual accent-amber">Tier: {access.tier}</span>
          <span className="payment-chip alt accent-cyan">Fuente: {access.source}</span>
        </div>
      </section>

      <section className="grid two">
        <article className="card owner-panel">
          <p className="section-label">Tester unlock</p>
          <h2>Activar acceso QA por telefono</h2>
          <TesterAccessForm
            active={qaActive}
            configured={configured}
            expiresAt={testerAccess?.expiresAt ?? access.expiresAt}
            signedIn={signedIn}
          />
        </article>

        <AccessSummaryCard access={access} title="Resumen de frontera" ctaHref="/team-access/free-grants" ctaLabel="Promo grants" />

        <article className="card">
          <p className="section-label">Diagnostico QA</p>
          <h2>Estado real detectado por servidor</h2>
          <ul>
            <li>Cookie QA detectada: {booleanLabel(qaActive)}</li>
            <li>Entitlement resuelto: {access.tier} / {access.label}</li>
            <li>Fuente: {access.source}</li>
            <li>Vence: {formatDate(access.expiresAt)}</li>
            <li>Full desbloqueado: {booleanLabel(isFull)}</li>
            <li>Downloads desbloqueadas: {booleanLabel(access.capabilities.downloads)}</li>
          </ul>
          <div className="hero-actions compact">
            <Link href="/api/tester-access" className="btn ghost">Ver Status JSON</Link>
            <Link href="/vault/launch" className="btn primary">Abrir Full</Link>
          </div>
        </article>
      </section>

      <section>
        <p className="section-label">Mapa de accesos QA</p>
        <h2>Despues de activar, usa estos accesos.</h2>
        <div className="value-grid">
          {qaRoutes.map((route) => {
            const unlocked = access.capabilities[route.capability];

            return (
              <article key={route.href} className={`value-card ${unlocked ? 'accent-emerald' : 'accent-amber'}`}>
                <p className="plan-tier">{unlocked ? 'Desbloqueado' : 'Requiere QA activo'}</p>
                <h3>{route.label}</h3>
                <p>{route.body}</p>
                <div className="hero-actions compact">
                  <Link href={route.href} className={`btn ${route.primary ? 'primary' : 'ghost'}`}>
                    {route.label}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="value-grid">
        <article className="value-card accent-cyan">
          <p className="plan-tier">Que validar</p>
          <h3>Productos que ya se pueden armar.</h3>
          <p>Dashboards, admin surfaces, landing systems, template packs, docs portals y flujos UI asistidos por IA.</p>
        </article>
        <article className="value-card accent-amber">
          <p className="plan-tier">Barra de calidad</p>
          <h3>Juzgar si el output se puede vender.</h3>
          <p>Probar responsive, copy, utilidad de assets, rutas premium, descargas y claridad del catalogo.</p>
        </article>
        <article className="value-card accent-violet">
          <p className="plan-tier">Pagina web</p>
          <h3>Evaluarla como comprador.</h3>
          <p>Confirmar si la landing y los demos explican el producto sin ayuda del equipo.</p>
        </article>
      </section>
    </main>
  );
}
