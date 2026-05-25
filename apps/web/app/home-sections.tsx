import Link from 'next/link';
import { LangToggle } from './lang-toggle';
import { CommercialFooter } from './commercial-footer';
import { CliStartersShowcase, CollectionExplorer, ComponentShowcaseCarousel } from './home-interactive';
import {
  appRoutes,
  demoRoutes,
  inventoryStats,
  premiumAssets,
  runtimeProfiles,
  stateMachines,
  useCases,
  type Accent,
  type AppRouteItem,
} from './home-data';

const techChips = ['React', 'TypeScript', 'Next.js', 'Vite', 'Node.js', 'PostgreSQL', 'AI-ready', 'CLI'];

const valueSteps = [
  {
    title: 'Elige una base',
    body: 'Rutas, starters o layouts listos para no abrir una pantalla vacia.',
    accent: 'sky' as const,
  },
  {
    title: 'Prueba en vivo',
    body: 'Abres una demo, ves el patron y decides si encaja con tu producto.',
    accent: 'rose' as const,
  },
  {
    title: 'Entrega con confianza',
    body: 'Assets premium, runtimes, contratos y vault para cerrar el handoff.',
    accent: 'mint' as const,
  },
];

const architectureLayers = [
  {
    title: 'Superficie UI',
    body: 'Pantallas, componentes, demos y patrones que un comprador puede abrir.',
    accent: 'peach' as const,
  },
  {
    title: 'Contratos y datos',
    body: 'Schemas, estados, props y contexto para que humanos y agentes compongan sin improvisar.',
    accent: 'mint' as const,
  },
  {
    title: 'Runtimes y starters',
    body: 'React estable, backend alpha, desktop shells y CLI para empezar por stack.',
    accent: 'lavender' as const,
  },
  {
    title: 'Entrega premium',
    body: 'Vault, assets protegidos, previews, layouts, kits y superficies Full-only.',
    accent: 'gold' as const,
  },
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
        <Link href="/demo">Demos</Link>
        <Link href="/examples">Ejemplos</Link>
        <Link href="/pricing">Precios</Link>
        <Link href="/multi-framework">Matriz de Runtimes</Link>
        <Link href="/ai">Capa AI</Link>
        <Link href="/design-lab">Laboratorio</Link>
      </nav>
      <div className="home-header-actions">
        {signedInEmail ? (
          <Link href="/api/auth/signout?callbackUrl=/">Cerrar sesion</Link>
        ) : (
          <Link href="/login">Iniciar sesion</Link>
        )}
        <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </header>
  );
}

function HeroDashboardPreview() {
  return (
    <aside className="home-dashboard" aria-label="Panel de inventario LotOS UI">
      <div className="home-dashboard__top">
        <span />
        <span />
        <span />
        <strong>LotOS Control Panel</strong>
      </div>
      <div className="home-dashboard__stats">
        {inventoryStats.map((stat) => (
          <article key={stat.id} className={`home-dashboard-stat home-accent-${stat.accent}`}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
      <div className="home-dashboard__work">
        {[
          ['Demos en vivo', '12 rutas para abrir y comparar', 'rose'],
          ['Quick start CLI', '18 bases para arrancar rapido', 'gold'],
          ['Capa de control IA', 'Contexto, contratos y registry', 'aqua'],
          ['Vault / Premium assets', '17 entregables protegidos', 'peach'],
          ['Contratos seguros', 'Props, estados y rutas claras', 'mint'],
        ].map(([title, body, accent]) => (
          <div key={title} className={`home-dashboard-mini home-accent-${accent}`}>
            <span />
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__copy">
        <p className="home-kicker">Inventario real actualizado · 36 rutas · 12 demos · 27 componentes · 18 starters</p>
        <h1>
          Construye productos con IA <span>sin empezar desde cero.</span>
        </h1>
        <p className="home-lead">
          LotOS UI te da pantallas, componentes, demos, starters y assets premium listos para construir
          interfaces serias sin perder semanas armando la base.
        </p>
        <p className="home-plain">
          No vendemos solo componentes. Te damos una superficie completa para construir, probar y entregar.
        </p>
        <div className="home-hero-actions">
          <Link href="#coleccion" className="home-btn home-btn--primary">
            Explorar coleccion
          </Link>
          <Link href="/demo" className="home-btn home-btn--secondary">
            Ver demos
          </Link>
          <Link href="/playground" className="home-btn home-btn--mint">
            Abrir playground
          </Link>
        </div>
        <div className="home-chip-row" aria-label="Tecnologias">
          {techChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <HeroDashboardPreview />
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

export function InventoryStatsGrid() {
  return (
    <section className="home-section home-stats-section">
      <div className="home-section__eyebrow">Inventario visible</div>
      <div className="home-section__split">
        <div>
          <h2>La home ya no reduce el producto a un resumen chiquito.</h2>
          <p>
            Estos conteos salen de la data centralizada de la landing. Si el inventario crece,
            la historia comercial puede crecer con el producto.
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

function groupRoutes(routes: AppRouteItem[]) {
  return routes.reduce<Record<string, AppRouteItem[]>>((groups, route) => {
    groups[route.group] = [...(groups[route.group] ?? []), route];
    return groups;
  }, {});
}

export function AppRoutesShowcase() {
  const routeGroups = groupRoutes(appRoutes);
  const orderedGroups = ['Producto', 'Demos', 'Dashboard', 'Admin', 'AI', 'Vault', 'Premium', 'Templates', 'Runtimes', 'Settings', 'Docs/Delivery'];

  return (
    <section className="home-section home-route-showcase">
      <div className="home-section__eyebrow">Rutas app</div>
      <div className="home-section__split">
        <div>
          <h2>36 rutas reales para navegar, adaptar y ensenar.</h2>
          <p>
            Estas no son promesas de landing. Son pantallas reales para probar valor, operar acceso,
            explicar premium, revisar ejemplos y arrancar entregas.
          </p>
        </div>
        <Link href="/examples" className="home-btn home-btn--secondary">
          Ver ejemplos
        </Link>
      </div>
      <div className="home-route-groups">
        {orderedGroups
          .filter((group) => routeGroups[group]?.length)
          .map((group) => (
            <article key={group} className="home-route-group">
              <div className="home-route-group__head">
                <h3>{group}</h3>
                <span>{routeGroups[group]?.length ?? 0} rutas</span>
              </div>
              <div className="home-route-list">
                {routeGroups[group]?.map((route) => (
                  <Link key={route.path} href={route.href} className={`home-route-row home-accent-${route.accent}`}>
                    <span>{route.path}</span>
                    <strong>{route.name}</strong>
                    <p>{route.simpleValue}</p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export function DemoRoutesShowcase() {
  return (
    <section className="home-section home-demo-showcase">
      <div className="home-section__eyebrow">Demos en vivo</div>
      <div className="home-section__split">
        <div>
          <h2>12 demos para ver el producto en situaciones reales.</h2>
          <p>
            Las demos ensenan como se ve LotOS UI en web, desktop, hojas, componentes, operator rooms
            y vault. Abres, comparas y entiendes el valor.
          </p>
        </div>
        <div className="home-callout">Antes era una promesa. Ahora se puede abrir.</div>
      </div>
      <div className="home-demo-grid">
        {demoRoutes.map((demo) => (
          <Link key={demo.path} href={demo.href} className={`home-demo-card home-accent-${demo.accent}`}>
            <span>Live demo</span>
            <h3>{demo.name}</h3>
            <p>{demo.description}</p>
            <strong>{demo.useCase}</strong>
            {demo.comparison ? <small>{demo.comparison}</small> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RuntimeProfilesMatrix() {
  return (
    <section className="home-section home-runtime-section">
      <div className="home-section__eyebrow">Runtimes</div>
      <div className="home-section__split">
        <div>
          <h2>19 perfiles runtime para que el roadmap se lea como plataforma.</h2>
          <p>
            React es el brazo estable. El resto se muestra con madurez honesta para que el comprador
            entienda que puede usar hoy y que esta en camino.
          </p>
        </div>
        <Link href="/multi-framework" className="home-btn home-btn--secondary">
          Abrir matriz
        </Link>
      </div>
      <div className="home-runtime-grid">
        {runtimeProfiles.map((runtime) => (
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

export function PremiumAssetsShowcase() {
  const fullOnly = premiumAssets.filter((asset) => asset.group === 'Full-only surface');
  const groupedAssets = premiumAssets.reduce<Record<string, typeof premiumAssets>>((groups, asset) => {
    groups[asset.group] = [...(groups[asset.group] ?? []), asset];
    return groups;
  }, {});

  return (
    <section className="home-section home-premium-section" id="premium">
      <div className="home-section__eyebrow">Inventario premium</div>
      <div className="home-section__split">
        <div>
          <h2>17 assets premium. No son solo packs.</h2>
          <p>
            Hay previews para vender, admin shell para construir, layouts para presentar, kits por industria
            y seis superficies Full-only que hacen que la capa mas alta se sienta completa.
          </p>
        </div>
        <Link href="/pricing" className="home-btn home-btn--primary">
          Ver precios
        </Link>
      </div>
      <div className="home-premium-groups">
        {Object.entries(groupedAssets).map(([group, assets]) => (
          <article key={group} className="home-premium-group">
            <div className="home-premium-group__head">
              <h3>{group}</h3>
              <span>{assets.length} assets</span>
            </div>
            <div className="home-premium-list">
              {assets.map((asset) => (
                <Link key={asset.id} href={asset.href ?? '/pricing'} className={`home-premium-card home-accent-${asset.accent}`}>
                  <span>{asset.status}</span>
                  <h4>{asset.name}</h4>
                  <p>{asset.unlocks}</p>
                  <strong>{asset.audience}</strong>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="home-full-suite">
        <div>
          <span>Full Signature</span>
          <h3>Las 6 superficies Full-only se ven como suite, no como extra escondido.</h3>
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

export function ArchitectureSection() {
  return (
    <section className="home-section home-architecture-section">
      <div className="home-section__eyebrow">Arquitectura</div>
      <div className="home-section__split">
        <div>
          <h2>El sistema completo: producto, contratos, runtimes y entrega.</h2>
          <p>
            LotOS UI funciona como catalogo vivo. El comprador ve pantallas; el dev ve componentes,
            rutas, comandos y estados; el equipo ve como se entrega.
          </p>
        </div>
      </div>

      <div className="home-layer-grid">
        {architectureLayers.map((layer) => (
          <article key={layer.title} className={`home-layer-card home-accent-${layer.accent}`}>
            <AccentIcon accent={layer.accent} />
            <h3>{layer.title}</h3>
            <p>{layer.body}</p>
          </article>
        ))}
      </div>

      <div className="home-architecture-columns">
        <div className="home-user-stories">
          <h3>Historias de usuario</h3>
          {useCases.map((useCase) => (
            <article key={useCase.title} className={`home-story-card home-accent-${useCase.accent}`}>
              <span>{useCase.title}</span>
              <p>{useCase.story}</p>
              <strong>{useCase.outcome}</strong>
            </article>
          ))}
        </div>
        <div className="home-state-machines">
          <h3>Maquinas de estado</h3>
          {stateMachines.map((machine) => (
            <article key={machine.name} className={`home-machine-card home-accent-${machine.accent}`}>
              <div>
                <span>{machine.name}</span>
                <p>{machine.description}</p>
              </div>
              <ol>
                {machine.states.map((state) => (
                  <li key={`${machine.name}-${state}`}>{state}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="home-final-cta">
      <div>
        <span>Empieza con una base real</span>
        <h2>No abras una pantalla vacia para tu proximo producto.</h2>
        <p>
          Explora rutas, componentes, demos y starters listos para adaptar. Cuando necesites mas acabado,
          abre la capa premium y usa assets protegidos.
        </p>
      </div>
      <div className="home-final-cta__actions">
        <Link href="#coleccion" className="home-btn home-btn--primary">
          Ver coleccion completa
        </Link>
        <Link href="/demo" className="home-btn home-btn--secondary">
          Abrir demos
        </Link>
        <Link href="/pricing" className="home-btn home-btn--mint">
          Explorar premium
        </Link>
      </div>
    </section>
  );
}

export function HomePageContent({ signedInEmail }: { signedInEmail: string | null }) {
  return (
    <main className="lotos-home">
      <div className="home-bg-shape home-bg-shape--one" />
      <div className="home-bg-shape home-bg-shape--two" />
      <div className="home-bg-shape home-bg-shape--three" />
      <SiteHeader signedInEmail={signedInEmail} />
      <HeroSection />
      <SimpleValueStrip />
      <InventoryStatsGrid />
      <CollectionExplorer />
      <ComponentShowcaseCarousel />
      <AppRoutesShowcase />
      <DemoRoutesShowcase />
      <RuntimeProfilesMatrix />
      <CliStartersShowcase />
      <PremiumAssetsShowcase />
      <ArchitectureSection />
      <FinalCTA />
      <CommercialFooter />
    </main>
  );
}
