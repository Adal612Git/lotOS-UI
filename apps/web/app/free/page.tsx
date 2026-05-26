import type { Metadata } from 'next';
import Link from 'next/link';
import { AccessBadge, AccessSummaryCard } from '../access-ui';
import { resolveCurrentAccess } from '../../lib/access-resolver';
import { buildRouteMetadata } from '../../lib/seo';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Free Foundation | LotOS UI',
  description:
    'Start with LotOS Foundation for public demos, base components, and product surface previews before upgrading to Pro Studio or Full Signature.',
  path: '/free',
});

const foundationItems = [
  'Demos publicas y before/after',
  'Componentes foundation',
  'Previews de product surfaces',
  'Documentacion publica',
  'Catalogo de componentes con disponibilidad clara',
];

const proItems = [
  'DataGridPro con acciones reales',
  'CommandShell para operaciones',
  'ReportSurface para metricas y recomendaciones',
  'Kits premium y descargas autorizadas',
  'Vault y handoff privado cuando el plan lo permite',
];

const promoItems = [
  'Creator Pass para creadores y comunidad',
  'Founder Pass para aliados tempranos',
  'Pro Studio Trial con expiracion',
  'Full Signature Gift explicito y revocable',
];

export default async function FreePage() {
  const access = await resolveCurrentAccess();

  return (
    <main className="landing free-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/#product">Product</Link>
          <Link href="/demo">Demos</Link>
          <Link href="/demo/components">Components</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/free">Free</Link>
          <Link href="/claim">Tengo código</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>

      <section className="free-hero">
        <div className="free-hero-copy">
          <AccessBadge level="free" source="free_default" />
          <h1>Empieza gratis. Entrega mejor desde la primera pantalla.</h1>
          <p>
            Usa LotOS Foundation para explorar componentes, demos publicas y patrones de producto. Cuando necesites
            superficies completas, kits premium y assets privados, Pro Studio esta listo.
          </p>
          <div className="hero-actions">
          <Link className="btn primary" href="/account/access">Empezar gratis</Link>
          <Link className="btn secondary" href="/claim">Tengo un codigo promocional</Link>
          <Link className="btn ghost" href="/demo/student-control">Ver Student Control</Link>
          <Link className="btn ghost" href="/feedback">Enviar feedback</Link>
          </div>
        </div>
        <div className="free-hero-proof" aria-label="Vista previa de producto LotOS Foundation">
          <div className="free-proof-toolbar">
            <span>Student Control</span>
            <strong>Product-ready</strong>
          </div>
          <div className="free-proof-grid">
            <div>
              <span>Foundation</span>
              <strong>Demos + base components</strong>
            </div>
            <div>
              <span>Pro Studio</span>
              <strong>DataGridPro + reports</strong>
            </div>
            <div>
              <span>Full Signature</span>
              <strong>Private vault + exports</strong>
            </div>
          </div>
          <div className="free-proof-chart">
            <span style={{ height: '42%' }} />
            <span style={{ height: '64%' }} />
            <span style={{ height: '88%' }} />
            <span style={{ height: '76%' }} />
          </div>
        </div>
      </section>

      <section className="free-access-band">
        <AccessSummaryCard access={access} title="Acceso detectado" />
      </section>

      <section className="free-columns" aria-label="Foundation y Pro Studio">
        <article>
          <p className="eyebrow">Que incluye Foundation</p>
          <h2>Gratis sin abrir el vault privado</h2>
          <ul>
            {foundationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <p className="eyebrow">Que desbloquea Pro Studio</p>
          <h2>Superficies completas para vender mejor</h2>
          <ul>
            {proItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="promo-pass-band">
        <div>
          <p className="eyebrow">Pases promocionales</p>
          <h2>Regalos controlados para campanas, testers, creadores y aliados.</h2>
          <p>
            Los pases pueden ser temporales o permanentes, siempre validados del lado del servidor, con expiracion,
            limite de claims y revocacion cuando aplica.
          </p>
        </div>
        <div className="promo-pass-list">
          {promoItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <Link className="btn primary" href="/claim">Reclamar codigo</Link>
      </section>

      <section className="free-demo-strip" aria-label="Demos publicas">
        {([
          ['Student Control', 'CRUD, metricas, reportes y acciones en una pantalla vendible.', '/demo/student-control'],
          ['Operator Cockpit', 'Centro de comando con CommandShell, incidentes y reportes.', '/demo/operator'],
          ['Spreadsheet Ops', 'Flujo de selectores y datos tabulares sin plantilla generica.', '/demo/con-lotos-web'],
        ] as const).map(([title, body, href]) => (
          <Link href={href} key={title} className="free-demo-card">
            <span>{title}</span>
            <strong>{body}</strong>
          </Link>
        ))}
      </section>

      <section className="final-cta">
        <p className="eyebrow">De pantalla generada a producto vendible</p>
        <h2>Empieza gratis, y cuando tu app necesite verse vendible, sube a Pro Studio.</h2>
        <Link className="btn primary" href="/pricing">Comparar planes</Link>
      </section>
    </main>
  );
}
