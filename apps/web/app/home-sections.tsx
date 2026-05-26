import Link from 'next/link';
import { LangToggle } from './lang-toggle';
import { CommercialFooter } from './commercial-footer';
import { surfaceQualityHighlights } from './product-surface/component-quality';
import {
  appRoutes,
  cliStarters,
  componentCatalog,
  demoRoutes,
  inventoryStats,
  premiumAssets,
  runtimeProfiles,
  type Accent,
} from './home-data';

const techChips = ['React stable', 'AI contracts', 'CLI ready', 'Vault Pro', 'Product surfaces', 'SQLite/Prisma proof'];

const valueSteps = [
  {
    title: 'Parte de una pantalla cruda',
    body: 'Toma un output de IA, un CRUD rapido o un dashboard sin jerarquia.',
    accent: 'sky' as const,
  },
  {
    title: 'Aplica una superficie',
    body: 'Usa patrones de datos, acciones, estados, reportes y navegacion real.',
    accent: 'rose' as const,
  },
  {
    title: 'Entrega como producto',
    body: 'Muestra una interfaz lista para cliente, no una biblioteca de botones.',
    accent: 'mint' as const,
  },
];

const flagshipDemos = [
  {
    href: '/demo/student-control',
    title: 'Student Control',
    body: 'Sistema academico con alumnos, materias, calificaciones, reportes, filtros y metricas.',
    proof: 'La demo que mejor demuestra el salto de prototipo a producto.',
    accent: 'aqua' as const,
  },
  {
    href: '/demo/operator',
    title: 'Operator Cockpit',
    body: 'Centro de comando para incidentes, colas, salud de servicios y acciones rapidas.',
    proof: 'Densidad operativa sin perder jerarquia.',
    accent: 'green' as const,
  },
  {
    href: '/demo/con-lotos-hoja',
    title: 'Spreadsheet Ops',
    body: 'Modernizacion visual de hojas con KPI ribbon, estados, cola y comandos.',
    proof: 'El antes/despues se entiende sin explicacion larga.',
    accent: 'gold' as const,
  },
];

const surfaceLayers = [
  ['Foundation', 'Tokens, botones, forms, cards, estados y tablas base.'],
  ['Surfaces', 'Dashboards, CRUDs, reportes, vaults, settings y operator rooms.'],
  ['Kits', 'Student Control, Operator Cockpit, Spreadsheet Ops y SaaS Admin.'],
  ['AI Contracts', 'Schemas, prompts, registry, CLI y handoff para agentes.'],
  ['Vault Pro', 'Assets privados, themes premium, templates verticales y Full-only.'],
];

const accessLadder = [
  ['Free Foundation', 'Demos publicas, componentes base y previews sin descargas premium.'],
  ['Pro Studio', 'Product surfaces, kits, DataGridPro, CommandShell y ReportSurface autorizados.'],
  ['Full Signature', 'Suite completa, vault full, superficies avanzadas y handoff premium.'],
];

const productSurfaceGallery = [
  {
    href: '/demo/student-control',
    title: 'Student Control',
    body: 'Academic operations with real filters, local CRUD, reports, and DataGridPro.',
    proof: 'Flagship demo. Best proof of the product promise.',
    accent: 'aqua' as const,
  },
  {
    href: '/demo/operator',
    title: 'Operator Cockpit',
    body: 'Incident command room with CommandShell, dense queue, service load, and report cards.',
    proof: 'Proves density without returning to raw dashboard chaos.',
    accent: 'green' as const,
  },
  {
    href: '/demo/con-lotos-hoja',
    title: 'Spreadsheet Ops',
    body: 'Spreadsheet modernization framed as a surface, not just a styled table.',
    proof: 'Useful for teams selling ops upgrades from sheets.',
    accent: 'gold' as const,
  },
  {
    href: '/vault/pro',
    title: 'SaaS Admin',
    body: 'Admin shell direction for billing, settings, entitlement, and workspace control.',
    proof: 'Pro Studio value without exposing private payload.',
    accent: 'sky' as const,
  },
  {
    href: '/vault/launch',
    title: 'Executive Briefing',
    body: 'Full Signature surface for founder, boardroom, and client-ready handoff.',
    proof: 'Full-only positioning with high-finish reporting.',
    accent: 'lavender' as const,
  },
  {
    href: '/templates',
    title: 'Data Command Console',
    body: 'Data-heavy console direction for filters, actions, exports, and status triage.',
    proof: 'Shows how DataGridPro becomes a delivery pattern.',
    accent: 'rose' as const,
  },
];

const qualityRows = [
  ...surfaceQualityHighlights.map((row) => [row.component, row.status, row.note]),
  ['Student Control', 'Live', 'Flagship app surface with academic workflows and local QA actions'],
];

function AccentIcon({ accent }: { accent: Accent }) {
  return (
    <span className={`home-icon home-accent-${accent}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 3.25 20.25 8v8L12 20.75 3.75 16V8L12 3.25Z" />
        <path d="M8.75 12.2h6.5M12 8.95v6.5" />
      </svg>
    </span>
  );
}

export function SiteHeader({ signedInEmail }: { signedInEmail: string | null }) {
  return (
    <header className="home-header">
      <Link href="/" className="home-brand" aria-label="LotOS UI home">
        <span>LotOS</span>
        <strong>UI</strong>
      </Link>
      <nav className="home-nav" aria-label="Principal">
        <LangToggle />
        <Link href="/#before-after">Product</Link>
        <Link href="/demo">Demos</Link>
        <Link href="/demo/components">Components</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/free">Free</Link>
        <Link href="/claim">Claim code</Link>
      </nav>
      <div className="home-header-actions">
        {signedInEmail ? (
          <Link href="/account/access">Access</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
        <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </header>
  );
}

function HeroTransformationPreview() {
  return (
    <aside className="home-transform-preview" aria-label="Antes y despues de LotOS UI">
      <div className="home-before-panel">
        <span>Before: AI output</span>
        <div className="home-raw-bar" />
        <div className="home-raw-grid">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="home-raw-table">
          <b />
          <b />
          <b />
        </div>
      </div>
      <div className="home-after-panel">
        <div className="home-after-top">
          <span>After: LotOS Product Surface</span>
          <strong>Student Control</strong>
        </div>
        <div className="home-after-kpis">
          {['428 students', '91.2% attendance', '14 risk cases'].map((item) => (
            <small key={item}>{item}</small>
          ))}
        </div>
        <div className="home-after-workflow">
          {['Registry', 'Reports', 'Follow-up'].map((item) => (
            <div key={item}>
              <span />
              <strong>{item}</strong>
              <p>Ready state</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__copy">
        <p className="home-kicker">LotOS UI - Product surfaces for AI-built apps</p>
        <h1>
          De pantalla generada a <span>producto vendible.</span>
        </h1>
        <p className="home-lead">
          LotOS UI convierte interfaces creadas con IA en superficies listas para entregar:
          dashboards densos, CRUDs, formularios, reportes, vaults y kits de operacion con acabado comercial.
        </p>
        <p className="home-plain">
          No es otra libreria de botones. Es el sistema que hace que una app generada se sienta lista para cliente.
        </p>
        <div className="home-hero-actions">
          <Link href="/demo/student-control" className="home-btn home-btn--primary">
            Abrir demo flagship
          </Link>
          <Link href="/free" className="home-btn home-btn--secondary">
            Empezar gratis
          </Link>
          <Link href="/pricing" className="home-btn home-btn--mint">
            Explorar Pro Studio
          </Link>
        </div>
        <div className="home-chip-row" aria-label="Tecnologias">
          {techChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <HeroTransformationPreview />
    </section>
  );
}

export function SimpleValueStrip() {
  return (
    <section className="home-value-strip" aria-label="Como se usa LotOS UI">
      {valueSteps.map((step, index) => (
        <article key={step.title} className={`home-value-step home-accent-${step.accent}`}>
          <AccentIcon accent={step.accent} />
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
        </article>
      ))}
    </section>
  );
}

export function ProofSection() {
  return (
    <section className="home-section home-proof-section">
      <div className="home-section__eyebrow">Probado mas alla del showcase</div>
      <div className="home-section__split">
        <div>
          <h2>La prueba ya vive en apps reales, no solo en componentes aislados.</h2>
          <p>
            LotOS se probo en superficies como Ops Console, Mini Club y Student Control:
            formularios, filtros, metricas, reportes y graficas con estructura de producto.
          </p>
        </div>
        <Link href="/demo/student-control" className="home-btn home-btn--primary">
          Abrir Student Control
        </Link>
      </div>
      <div className="home-proof-grid">
        {[
          ['3 apps', 'Pruebas con dashboards, registro y sistema academico.'],
          ['13 demos', 'Rutas publicas para comparar casos de uso.'],
          ['17 premium', 'Assets protegidos para vault, kits y Full Signature.'],
        ].map(([value, label]) => (
          <article key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FlagshipDemosSection() {
  return (
    <section className="home-section home-demo-showcase">
      <div className="home-section__eyebrow">Demos flagship</div>
      <div className="home-section__split">
        <div>
          <h2>Tres pruebas visuales antes de mostrar todo el inventario.</h2>
          <p>
            Un comprador premium no quiere navegar cien piezas al inicio. Quiere ver si la
            transformacion es real en una pantalla que podria venderse.
          </p>
        </div>
        <Link href="/demo" className="home-btn home-btn--secondary">
          Ver todas las demos
        </Link>
      </div>
      <div className="home-demo-grid">
        {flagshipDemos.map((demo) => (
          <Link key={demo.href} href={demo.href} className={`home-demo-card home-accent-${demo.accent}`}>
            <span>Flagship</span>
            <h3>{demo.title}</h3>
            <p>{demo.body}</p>
            <strong>{demo.proof}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProductSurfacesGallerySection() {
  return (
    <section className="home-section home-demo-showcase">
      <div className="home-section__eyebrow">Product surfaces gallery</div>
      <div className="home-section__split">
        <div>
          <h2>La home ya no vende botones. Vende superficies que un cliente puede entender.</h2>
          <p>
            Student Control, Operator Cockpit y Spreadsheet Ops son la prueba publica. SaaS Admin,
            Executive Briefing y Data Command Console quedan como rutas premium o templates.
          </p>
        </div>
        <Link href="/demo/components" className="home-btn home-btn--secondary">
          Ver componentes reales
        </Link>
      </div>
      <div className="home-demo-grid">
        {productSurfaceGallery.map((surface) => (
          <Link key={surface.title} href={surface.href} className={`home-demo-card home-accent-${surface.accent}`}>
            <span>Surface</span>
            <h3>{surface.title}</h3>
            <p>{surface.body}</p>
            <strong>{surface.proof}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="home-section home-before-after-section" id="before-after">
      <div className="home-section__eyebrow">Antes / despues</div>
      <div className="home-section__split">
        <div>
          <h2>Una CSS library te da estilo. LotOS te da una superficie completa.</h2>
          <p>
            El valor premium no vive en un boton suelto. Vive en la jerarquia, el flujo,
            los estados, los reportes y el handoff que hacen que una app parezca lista.
          </p>
        </div>
      </div>
      <div className="home-compare-table">
        {[
          ['CSS library', 'Botones y cards', 'Tu armas todo el producto.'],
          ['LotOS UI', 'Superficies completas', 'Arrancas desde demos, kits, vault y contratos AI.'],
          ['Resultado', 'Salto de madurez', 'Menos prototipo, mas entrega para cliente.'],
        ].map(([label, middle, result]) => (
          <div key={label}>
            <strong>{label}</strong>
            <span>{middle}</span>
            <p>{result}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SurfaceTaxonomySection() {
  return (
    <section className="home-section home-surface-taxonomy">
      <div className="home-section__eyebrow">Nueva taxonomia</div>
      <div className="home-section__split">
        <div>
          <h2>El producto se lee como capas de entrega, no como lista de piezas.</h2>
          <p>
            La base publica sirve para evaluar. El valor premium empieza cuando esas piezas
            se convierten en superficies y kits listos para operar.
          </p>
        </div>
      </div>
      <div className="home-layer-grid">
        {surfaceLayers.map(([title, body], index) => (
          <article key={title} className={`home-layer-card home-accent-${(['sky', 'mint', 'rose', 'aqua', 'gold'] as Accent[])[index]}`}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccessLadderSection() {
  return (
    <section className="home-section home-surface-taxonomy">
      <div className="home-section__eyebrow">Free Foundation, Pro Studio, Full Signature</div>
      <div className="home-section__split">
        <div>
          <h2>Una ruta gratis clara sin regalar la frontera premium.</h2>
          <p>
            Foundation permite evaluar el producto. Pro Studio y Full Signature desbloquean superficies,
            kits y assets privados con acceso centralizado.
          </p>
        </div>
        <Link href="/claim" className="home-btn home-btn--secondary">
          Tengo un pase
        </Link>
      </div>
      <div className="home-layer-grid">
        {accessLadder.map(([title, body], index) => (
          <article key={title} className={`home-layer-card home-accent-${(['mint', 'aqua', 'gold'] as Accent[])[index]}`}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <div className="home-full-suite">
        <div>
          <span>Promotional passes</span>
          <h3>Para campañas, testers, creadores y aliados.</h3>
        </div>
        <p>
          LotOS puede entregar pases promocionales temporales o permanentes sin romper la frontera premium:
          se validan server-side, pueden expirar y se pueden revocar.
        </p>
      </div>
    </section>
  );
}

export function QualityMatrixSection() {
  return (
    <section className="home-section home-quality-section">
      <div className="home-section__eyebrow">Quality matrix</div>
      <div className="home-section__split">
        <div>
          <h2>Lo estable se vende. Lo incompleto se marca o se mueve a roadmap.</h2>
          <p>
            La percepcion premium sube cuando el comprador ve estado real, foco y una ruta
            clara para lo que aun esta en evolucion.
          </p>
        </div>
        <Link href="/demo/components" className="home-btn home-btn--secondary">
          Abrir catalogo
        </Link>
      </div>
      <div className="home-quality-table">
        {qualityRows.map(([name, status, action]) => (
          <div key={name}>
            <strong>{name}</strong>
            <span>{status}</span>
            <p>{action}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InventoryStatsGrid() {
  return (
    <section className="home-section home-stats-section">
      <div className="home-section__eyebrow">Inventario tecnico</div>
      <div className="home-section__split">
        <div>
          <h2>El volumen existe, pero ahora vive despues de la prueba comercial.</h2>
          <p>
            Los conteos ayudan a evaluar alcance. La home ya los usa como evidencia secundaria,
            no como la promesa principal.
          </p>
        </div>
      </div>
      <div className="home-stats-grid">
        {inventoryStats.map((stat) => (
          <article key={stat.id} className={`home-stat-card home-accent-${stat.accent}`}>
            <strong>{stat.value}</strong>
            <h3>{stat.label}</h3>
            <p>{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AppRoutesShowcase() {
  const publicRoutes = appRoutes.filter((route) =>
    ['/', '/free', '/claim', '/account/access', '/demo/student-control', '/demo/components', '/pricing', '/templates', '/playground', '/vault'].includes(route.path)
  );

  return (
    <section className="home-section home-route-showcase">
      <div className="home-section__eyebrow">Rutas clave</div>
      <div className="home-section__split">
        <div>
          <h2>El mapa publico apunta a evaluacion, demos y premium.</h2>
          <p>
            Se evita tirar todo el backstage al comprador. Las rutas tecnicas siguen existiendo,
            pero la navegacion principal muestra el camino comercial.
          </p>
        </div>
        <Link href="/examples" className="home-btn home-btn--secondary">
          Ver ejemplos
        </Link>
      </div>
      <div className="home-demo-grid">
        {publicRoutes.map((route) => (
          <Link key={route.path} href={route.href} className={`home-demo-card home-accent-${route.accent}`}>
            <span>{route.path}</span>
            <h3>{route.name}</h3>
            <p>{route.description}</p>
            <strong>{route.simpleValue}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DemoRoutesShowcase() {
  return (
    <section className="home-section home-demo-showcase">
      <div className="home-section__eyebrow">Demo wall</div>
      <div className="home-section__split">
        <div>
          <h2>El resto de demos queda disponible para inspeccion tecnica.</h2>
          <p>
            Quien ya entendio la promesa puede abrir comparativas web, desktop, spreadsheet,
            vault y componentes sin mezclarlo con el primer mensaje comercial.
          </p>
        </div>
        <div className="home-callout">{demoRoutes.length} demos navegables</div>
      </div>
    </section>
  );
}

export function RuntimeProfilesMatrix() {
  const visibleRuntimes = runtimeProfiles.filter((runtime) => runtime.maturity === 'stable' || runtime.maturity === 'preview').slice(0, 6);

  return (
    <section className="home-section home-runtime-section">
      <div className="home-section__eyebrow">Roadmap honesto</div>
      <div className="home-section__split">
        <div>
          <h2>React queda como brazo estable; lo demas se presenta como roadmap.</h2>
          <p>
            La home ya no diluye el mensaje con todos los runtimes alpha arriba. La matriz completa
            sigue disponible para evaluacion tecnica.
          </p>
        </div>
        <Link href="/multi-framework" className="home-btn home-btn--secondary">
          Abrir matriz
        </Link>
      </div>
      <div className="home-runtime-grid">
        {visibleRuntimes.map((runtime) => (
          <Link key={runtime.id} href={runtime.href} className={`home-runtime-card home-accent-${runtime.accent}`}>
            <div>
              <h3>{runtime.name}</h3>
              <span>{runtime.maturity}</span>
            </div>
            <p>{runtime.environment}</p>
            <strong>{runtime.idealFor}</strong>
            <small>{runtime.support}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CliStartersShowcase() {
  return (
    <section className="home-section home-cli-showcase">
      <div className="home-section__eyebrow">Starters CLI</div>
      <div className="home-section__split">
        <div>
          <h2>Los starters ayudan a entregar, pero no encabezan la venta.</h2>
          <p>
            Quedan como soporte tecnico para equipos que ya compraron la historia de producto.
          </p>
        </div>
      </div>
      <div className="home-cli-grid">
        {cliStarters.slice(0, 6).map((starter) => (
          <article key={starter.id} className={`home-cli-card home-accent-${starter.accent}`}>
            <div className="home-cli-card__top">
              <span>{starter.family === 'stack' ? 'Stack starter' : 'Desktop starter'}</span>
              <strong>{starter.startTime}</strong>
            </div>
            <h3>{starter.name}</h3>
            <p>{starter.useCase}</p>
            <code>{starter.command}</code>
            <div className="home-cli-card__footer">
              <span>{starter.stack}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PremiumAssetsShowcase() {
  const fullOnly = premiumAssets.filter((asset) => asset.group === 'Full-only surface');

  return (
    <section className="home-section home-premium-section" id="premium">
      <div className="home-section__eyebrow">Vault Pro</div>
      <div className="home-section__split">
        <div>
          <h2>Premium se vende como vault de superficies, no como carpeta de extras.</h2>
          <p>
            Pro Studio desbloquea kits reutilizables. Full Signature reserva superficies ejecutivas,
            spreadsheet modernization y assets de mayor acabado.
          </p>
        </div>
        <Link href="/pricing" className="home-btn home-btn--primary">
          Ver Pro Studio
        </Link>
      </div>
      <div className="home-premium-list home-premium-list--wide">
        {premiumAssets.slice(0, 6).map((asset) => (
          <Link key={asset.id} href={asset.href ?? '/pricing'} className={`home-premium-card home-accent-${asset.accent}`}>
            <span>{asset.status}</span>
            <h4>{asset.name}</h4>
            <p>{asset.unlocks}</p>
            <strong>{asset.audience}</strong>
          </Link>
        ))}
      </div>
      <div className="home-full-suite">
        <div>
          <span>Full Signature</span>
          <h3>Las superficies Full-only se presentan como suite completa.</h3>
        </div>
        <div className="home-full-suite__grid">
          {fullOnly.map((asset) => (
            <Link key={asset.id} href={asset.href ?? '/vault/launch'} className={`home-full-chip home-accent-${asset.accent}`}>
              {asset.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CollectionExplorer() {
  return (
    <section className="home-section home-collection" id="coleccion">
      <div className="home-section__eyebrow">Inventario completo</div>
      <div className="home-section__split">
        <div>
          <h2>{appRoutes.length + demoRoutes.length + componentCatalog.length + runtimeProfiles.length + cliStarters.length + premiumAssets.length} items organizados, ahora en el lugar correcto.</h2>
          <p>
            El inventario sigue siendo fuerte, pero queda como mapa de inspeccion para usuarios
            tecnicos y testers despues de entender la promesa.
          </p>
        </div>
      </div>
      <div className="home-stats-grid">
        {inventoryStats.map((stat) => (
          <article key={`inventory-${stat.id}`} className={`home-stat-card home-accent-${stat.accent}`}>
            <strong>{stat.value}</strong>
            <h3>{stat.label}</h3>
            <p>{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="home-final-cta">
      <div>
        <span>Construye la primera version. Entrega la version que si parece producto.</span>
        <h2>Haz que el output de IA cruce el salto de madurez.</h2>
        <p>
          Abre Student Control, compara el antes/despues y usa Pro Studio cuando necesites
          superficies privadas, kits y vault listos para entrega.
        </p>
      </div>
      <div className="home-final-cta__actions">
        <Link href="/demo/student-control" className="home-btn home-btn--primary">
          Abrir demo flagship
        </Link>
        <Link href="/pricing" className="home-btn home-btn--mint">
          Explorar Pro Studio
        </Link>
        <Link href="/team-access" className="home-btn home-btn--secondary">
          Acceso QA
        </Link>
      </div>
    </section>
  );
}

export function HomePageContent({ signedInEmail }: { signedInEmail: string | null }) {
  return (
    <main className="lotos-home">
      <SiteHeader signedInEmail={signedInEmail} />
      <HeroSection />
      <SimpleValueStrip />
      <ProofSection />
      <FlagshipDemosSection />
      <ProductSurfacesGallerySection />
      <BeforeAfterSection />
      <SurfaceTaxonomySection />
      <AccessLadderSection />
      <QualityMatrixSection />
      <PremiumAssetsShowcase />
      <AppRoutesShowcase />
      <RuntimeProfilesMatrix />
      <CliStartersShowcase />
      <CollectionExplorer />
      <FinalCTA />
      <CommercialFooter />
    </main>
  );
}
