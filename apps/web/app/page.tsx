import Link from 'next/link';
import { getServerSession } from 'next-auth';
import './lotos-landing.css';
import { authOptions } from '../auth-options';
import { AuthAction } from './auth-action';
import { LangToggle } from './lang-toggle';
import { foundersOffer, salesLinks, salesPlans } from './sales-config';
import { premiumExamples } from './examples/gallery-data';

const runtimeCards = [
  {
    name: 'React',
    status: 'Stable',
    tone: 'accent-cyan',
    summary: 'Production-ready component arm with the cleanest route to polished delivery.',
    summaryEs: 'Brazo de componentes listo para produccion con la ruta mas limpia hacia una entrega pulida.',
  },
  {
    name: 'Laravel / Django / Flask',
    status: 'Alpha',
    tone: 'accent-emerald',
    summary: 'Server-side starters with contract-first structure and Mongo-ready generators.',
    summaryEs: 'Starters server-side con estructura basada en contratos y generadores listos para Mongo.',
  },
  {
    name: 'Spring / .NET / Go',
    status: 'Alpha',
    tone: 'accent-amber',
    summary: 'Enterprise-oriented tracks generated from the same product language.',
    summaryEs: 'Rutas orientadas a entornos enterprise generadas desde el mismo lenguaje del producto.',
  },
  {
    name: 'Desktop',
    status: 'Alpha / Prototype',
    tone: 'accent-violet',
    summary: 'Desktop shells for operator rooms, internal tools, and premium dashboards.',
    summaryEs: 'Shells desktop para cuartos de operacion, herramientas internas y dashboards premium.',
  },
  {
    name: 'Web Components',
    status: 'Prototype',
    tone: 'accent-rose',
    summary: 'Portable primitives that keep the visual system reusable across runtimes.',
    summaryEs: 'Primitivas portables que mantienen reutilizable el sistema visual entre runtimes.',
  },
];

const documentationLanes = [
  {
    title: 'Start Here',
    titleEs: 'Empieza Aqui',
    href: '/docs/start-here',
    body: 'The shortest onboarding path: package choice, correct runtime, and where spreadsheet modernization fits.',
    bodyEs: 'La ruta de onboarding mas corta: que paquete elegir, cual runtime usar y donde encaja la modernizacion de spreadsheets.',
    cta: 'Start Here',
  },
  {
    title: 'Component Library',
    titleEs: 'Libreria de Componentes',
    href: '/docs/components/button',
    body: 'Inspect component behavior, schemas, and the exact shape your agent can compose.',
    bodyEs: 'Inspecciona comportamiento, schemas y la forma exacta que tu agente puede componer.',
    cta: 'Components',
  },
  {
    title: 'Runtime Guide',
    titleEs: 'Guia de Runtimes',
    href: '/docs/multi-runtime',
    body: 'Understand what is stable, what is alpha, and how each delivery path is meant to be used.',
    bodyEs: 'Entiende que esta estable, que esta en alpha y como debe usarse cada ruta de entrega.',
    cta: 'Runtime Guide',
  },
  {
    title: 'Commercial Surface',
    titleEs: 'Superficie Comercial',
    href: '/pricing',
    body: 'Move from the free trust layer into Solo, Pro, and Full with a clearer upgrade story.',
    bodyEs: 'Pasa de la capa gratuita de confianza hacia Solo, Pro y Full con una historia de upgrade mas clara.',
    cta: 'Pricing',
  },
];

const signaturePrinciples = [
  {
    label: 'System',
    labelEs: 'Sistema',
    title: 'Product discipline, not component chaos.',
    titleEs: 'Disciplina de producto, no caos de componentes.',
    body: 'LotOS UI is organized around a product language: tokens, contracts, and a visual hierarchy that holds across docs, vault, and every runtime surface without drifting.',
    bodyEs: 'LotOS UI esta organizado en un lenguaje de producto: tokens, contratos y una jerarquia visual que se mantiene en docs, vault y cada runtime sin desviarse.',
  },
  {
    label: 'Clarity',
    labelEs: 'Claridad',
    title: 'Premium without hidden complexity.',
    titleEs: 'Premium sin complejidad oculta.',
    body: 'Every layer from free docs to paid vault is structured so buyers know exactly what they get, what it costs, and why it is worth the upgrade.',
    bodyEs: 'Cada capa desde docs gratis hasta vault pagado esta estructurada para que los compradores sepan que obtienen, cuanto cuesta y por que vale la pena el upgrade.',
  },
  {
    label: 'Range',
    labelEs: 'Alcance',
    title: 'React today. Backend, desktop, AI-native tomorrow.',
    titleEs: 'React hoy. Backend, desktop e IA nativa manana.',
    body: 'The component arm is stable. Backend stacks are in alpha. Desktop and AI surfaces are being built on the same design language — one system, many delivery paths.',
    bodyEs: 'El brazo de componentes es estable. Los stacks backend estan en alpha. Las superficies desktop e IA se construyen sobre el mismo lenguaje — un sistema, muchas rutas.',
  },
];

const englishFlow = [
  'Pick the runtime that matches the delivery target.',
  'Use the docs and CLI to generate a real starting point.',
  'Build on top of contracts instead of improvising structure.',
  'Upgrade into premium surfaces only when the project needs protected assets.',
];

const spanishFlow = [
  'Elige el runtime que coincide con el objetivo de entrega.',
  'Usa la documentacion y el CLI para generar una base real.',
  'Construye encima de contratos en lugar de improvisar estructura.',
  'Sube a superficies premium solo cuando el proyecto necesite assets protegidos.',
];

const architectureItems = [
  '`@lotosui/core`: tokens, schemas, runtimes, patterns, stacks, and desktop templates',
  '`@lotosui/claude-arm`: production React arm',
  '`@lotosui/web-components`: portable primitives for cross-framework reuse',
  '`@lotosui/cli`: blueprint, stack-init, and desktop-init',
  '`@lotosui/sentinel`: guardrails and misuse warnings',
];

const architectureItemsEs = [
  '`@lotosui/core`: tokens, schemas, runtimes, patterns, stacks y templates desktop',
  '`@lotosui/claude-arm`: brazo React listo para produccion',
  '`@lotosui/web-components`: primitivas portables para reutilizacion cross-framework',
  '`@lotosui/cli`: blueprint, stack-init y desktop-init',
  '`@lotosui/sentinel`: guardrails y advertencias de mal uso',
];

const commandBlock = `pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`;

const homepageTierFocus: Record<string, string[]> = {
  solo: ['Private proof', 'Fast paid entry'],
  pro: ['Reusable premium assets', 'Team-ready delivery'],
  'launch-pack': ['Full-suite exclusives', 'Highest polish handoff'],
};

const homepageAccentCycle = ['accent-cyan', 'accent-emerald', 'accent-amber', 'accent-violet', 'accent-rose'] as const;

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;
  const paidPlans = salesPlans.filter((plan) => plan.kind === 'paid');
  const vaultHref = signedInEmail ? '/vault' : '/login';

  return (
    <main className="landing">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <LangToggle />
          <Link href="/docs" className="nav-link">
            <span className="en-only">Docs</span>
            <span className="es-only">Documentacion</span>
          </Link>
          <Link href="/demo" className="nav-link">
            <span className="en-only">Demos</span>
            <span className="es-only">Demos</span>
          </Link>
          <Link href="/examples" className="nav-link nav-link--showcase">
            <span className="en-only">Examples</span>
            <span className="es-only">Ejemplos</span>
          </Link>
          <Link href="/pricing" className="nav-link nav-link--pricing">
            <span className="en-only">Pricing</span>
            <span className="es-only">Precios</span>
          </Link>
          <Link href="/multi-framework" className="nav-link nav-link--runtime">
            <span className="en-only">Runtime Matrix</span>
            <span className="es-only">Matriz de Runtimes</span>
          </Link>
          {signedInEmail ? (
            <>
              <Link href="/vault" className="nav-link nav-link--cta">Vault</Link>
              <a href="/api/auth/signout?callbackUrl=/" className="nav-link nav-link--muted">
                <span className="en-only">Sign Out</span>
                <span className="es-only">Cerrar Sesion</span>
              </a>
            </>
          ) : (
            <Link href="/login" className="nav-link">
              <span className="en-only">Sign In</span>
              <span className="es-only">Iniciar Sesion</span>
            </Link>
          )}
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
        </nav>
      </header>

      <section className="hero home-hero">
        <div className="home-hero-grid">
          <div className="hero-copy-stack">
            <p className="kicker">
              <span className="en-only">{foundersOffer.label} · from MX$59 / month · 27 components · multi-runtime</span>
              <span className="es-only">{foundersOffer.label} · desde MX$59 / mes · 27 componentes · multi-runtime</span>
            </p>
            <div className="hero-pill-row" aria-label="Landing signals">
              <span className="tier-pill accent-cyan"><span className="en-only">React Stable</span><span className="es-only">React Estable</span></span>
              <span className="tier-pill accent-emerald"><span className="en-only">Docs First</span><span className="es-only">Docs Primero</span></span>
              <span className="tier-pill accent-amber"><span className="en-only">AI-safe contracts</span><span className="es-only">Contratos seguros para AI</span></span>
              <span className="tier-pill accent-violet"><span className="en-only">Full Signature ready</span><span className="es-only">Full Signature listo</span></span>
            </div>
            <h1>
              <span className="en-only">Ship production UI with the discipline it actually needs.</span>
              <span className="es-only">Entrega UI de produccion con la disciplina que realmente necesita.</span>
              <span className="hero-subline en-only">Dark-first. Contract-driven. Premium-gated from the first deploy.</span>
              <span className="hero-subline es-only">Dark-first. Basado en contratos. Premium protegido desde el primer deploy.</span>
            </h1>
            <p className="lead en-only">
              LotOS UI is a structured component system for React: 27 production-ready components,
              a CLI that scaffolds real starting points, and a layered architecture from open docs
              to gated vault — so buyers can evaluate the system before they pay for protected surfaces.
            </p>
            <p className="lead es-only">
              LotOS UI es un sistema de componentes estructurado para React: 27 componentes listos
              para produccion, un CLI que genera puntos de partida reales y una arquitectura por capas
              desde docs abiertos hasta vault protegido — para que los compradores evaluen antes de pagar.
            </p>
            <p className="lead lead-compact">
              <span className="en-only">Built for teams that need speed, visual consistency, and scalability from the first deploy.</span>
              <span className="es-only">Disenado para equipos que necesitan velocidad, consistencia visual y escalabilidad desde el primer deploy.</span>
            </p>
            <div className="hero-language-grid">
              <article className="language-panel en-only">
                <p className="section-label">React First</p>
                <h2>Start fast with the stable arm.</h2>
                <p>
                  The React arm ships polished surfaces right now: 27 components, a CLI that
                  generates real project scaffolds, and a design system that holds visual discipline
                  from the first screen to the premium vault.
                </p>
              </article>
              <article className="language-panel es es-only">
                <p className="section-label">React Primero</p>
                <h2>Empieza rapido con el brazo estable.</h2>
                <p>
                  El brazo React entrega superficies pulidas ahora mismo: 27 componentes, un CLI
                  que genera scaffolds reales y un sistema de diseno que mantiene disciplina visual
                  desde la primera pantalla hasta el vault premium.
                </p>
              </article>
            </div>
            <div className="hero-actions">
              <Link href="/docs/start-here" className="btn primary">
                <span className="en-only">Get Started</span>
                <span className="es-only">Empezar</span>
              </Link>
              <Link href="/docs" className="btn ghost">
                <span className="en-only">Open Docs</span>
                <span className="es-only">Abrir Docs</span>
              </Link>
              <Link href="/pricing" className="btn ghost">
                <span className="en-only">Pricing</span>
                <span className="es-only">Precios</span>
              </Link>
              <Link href="/demo" className="btn ghost">
                <span className="en-only">Live Demos</span>
                <span className="es-only">Demos en Vivo</span>
              </Link>
              <Link href="/examples" className="btn ghost">
                <span className="en-only">Examples</span>
                <span className="es-only">Ejemplos</span>
              </Link>
            </div>
          </div>

          <aside className="hero-preview-shell" aria-label="LotOS UI landing preview">
            <div className="hero-preview-panel">
              <div className="hero-preview-top">
                <span />
                <span />
                <span />
                <small>LotOS Command Surface</small>
              </div>
              <div className="hero-preview-body">
                <div className="hero-preview-main">
                  <div className="hero-preview-stats">
                    <article>
                      <strong>27</strong>
                      <span>React</span>
                    </article>
                    <article>
                      <strong>10</strong>
                      <span>Stacks</span>
                    </article>
                    <article>
                      <strong>8</strong>
                      <span>Desktop</span>
                    </article>
                  </div>
                  <div className="preview-surface-card primary">
                    <div className="preview-surface-head">
                      <h3>Docs-first path</h3>
                      <span className="payment-chip ready accent-cyan">Public</span>
                    </div>
                    <p>
                      <span className="en-only">Onboarding, components, runtime guidance, and spreadsheet context are visible before checkout pressure.</span>
                      <span className="es-only">Onboarding, componentes, guia de runtimes y contexto de spreadsheets quedan visibles antes de cualquier presion de checkout.</span>
                    </p>
                    <div className="preview-code-strip">start-here | installation | components | runtime</div>
                  </div>
                  <div className="preview-surface-card secondary">
                    <div className="preview-surface-head">
                      <h3>Premium ladder</h3>
                      <span className="payment-chip alt accent-violet">Clear</span>
                    </div>
                    <p>
                      <span className="en-only">Solo proves value, Pro carries delivery weight, and Full closes at the top tier.</span>
                      <span className="es-only">Solo prueba valor, Pro carga la entrega y Full cierra en la capa mas alta.</span>
                    </p>
                  </div>
                </div>
                <div className="hero-preview-rail">
                  <p className="preview-rail-label">Navigation</p>
                  {documentationLanes.map((lane, index) => (
                    <div key={lane.title} className={`preview-rail-item ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                      <strong className="en-only">{lane.title}</strong>
                      <strong className="es-only">{lane.titleEs}</strong>
                      <span className="en-only">{lane.cta}</span>
                      <span className="es-only">{lane.titleEs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="stats">
        <article><strong>27</strong><span><span className="en-only">React Components</span><span className="es-only">Componentes React</span></span></article>
        <article><strong>4</strong><span><span className="en-only">Web Primitives</span><span className="es-only">Primitivas Web</span></span></article>
        <article><strong>10</strong><span><span className="en-only">Stack Templates</span><span className="es-only">Templates de Stack</span></span></article>
        <article><strong>8</strong><span><span className="en-only">Desktop Templates</span><span className="es-only">Templates Desktop</span></span></article>
      </section>

      <section className="card landing-section examples-band">
        <div className="section-headline">
          <p className="section-label"><span className="en-only">Examples</span><span className="es-only">Ejemplos</span></p>
          <h2 className="en-only">Six real delivery scenarios. One design system powering all of them.</h2>
          <h2 className="es-only">Seis escenarios reales de entrega. Un sistema de diseno que los alimenta a todos.</h2>
          <p className="micro-note en-only">
            Command rooms, executive dashboards, spreadsheet modernization, premium vaults, and AI agent surfaces —
            all shipped with the same component language and visual discipline.
          </p>
          <p className="micro-note es-only">
            Cuartos de comando, dashboards ejecutivos, modernizacion de spreadsheets, vaults premium y superficies
            de agentes IA — todos entregados con el mismo lenguaje de componentes y disciplina visual.
          </p>
        </div>
        <div className="examples-lane-grid">
          {premiumExamples.slice(0, 4).map((example, index) => (
            <article key={example.slug} className={`example-lane-card ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
              <div className="example-lane-top">
                <p className="docs-lane-kicker">{example.category}</p>
                <h3>{example.title}</h3>
              </div>
              <p>{example.summary}</p>
              <div className="example-mini-metrics">
                {example.metrics.map((metric) => (
                  <span key={metric.label} className={`tier-pill ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                    {metric.value} {metric.label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="hero-actions compact">
          <Link href="/examples" className="btn primary"><span className="en-only">Open All Examples</span><span className="es-only">Abrir Todos los Ejemplos</span></Link>
          <Link href="/pricing" className="btn ghost"><span className="en-only">See Premium Ladder</span><span className="es-only">Ver Escalera Premium</span></Link>
        </div>
      </section>

      <section className="card landing-section signature-band">
        <div className="signature-band-copy">
          <p className="section-label"><span className="en-only">Product Principles</span><span className="es-only">Principios del Producto</span></p>
          <h2 className="en-only">A design system built to survive real delivery pressure.</h2>
          <h2 className="es-only">Un sistema de diseno construido para sobrevivir la presion real de entrega.</h2>
          <p className="micro-note en-only">
            Not a component dump. A product language with defined tokens, contract-ready schemas,
            and a visual hierarchy that holds discipline across docs, vault, and every runtime surface.
          </p>
          <p className="micro-note es-only">
            No es un dump de componentes. Es un lenguaje de producto con tokens definidos, schemas
            listos para contratos y una jerarquia visual que mantiene disciplina en docs, vault y cada runtime.
          </p>
        </div>
        <div className="signature-grid">
          {signaturePrinciples.map((item, index) => (
            <article key={item.label} className={`signature-card ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
              <p className="signature-label"><span className="en-only">{item.label}</span><span className="es-only">{item.labelEs}</span></p>
              <h3 className="en-only">{item.title}</h3>
              <h3 className="es-only">{item.titleEs}</h3>
              <p className="en-only">{item.body}</p>
              <p className="es-only">{item.bodyEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card landing-section">
        <div className="section-headline">
          <p className="section-label"><span className="en-only">Documentation</span><span className="es-only">Documentacion</span></p>
          <h2 className="en-only">Docs that teach the system, not just list the API.</h2>
          <h2 className="es-only">Documentacion que ensena el sistema, no solo lista la API.</h2>
          <p className="micro-note en-only">
            Start Here orients you in under 5 minutes. Component docs show exact schema and behavior.
            The Runtime Guide tells you what is stable, what is alpha, and how to pick the right path.
          </p>
          <p className="micro-note es-only">
            Start Here te orienta en menos de 5 minutos. Los docs de componentes muestran el schema exacto
            y comportamiento. La Guia de Runtimes te dice que esta estable, que esta en alpha y como elegir.
          </p>
        </div>
        <div className="docs-lane-grid">
          {documentationLanes.map((lane, index) => (
            <Link key={lane.title} href={lane.href} className={`docs-lane-card ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
              <div className="docs-lane-top">
                <p className="docs-lane-kicker"><span className="en-only">{lane.title}</span><span className="es-only">{lane.titleEs}</span></p>
                <h3 className="en-only">{lane.title}</h3>
                <h3 className="es-only">{lane.titleEs}</h3>
              </div>
              <p className="en-only">{lane.body}</p>
              <p className="es-only">{lane.bodyEs}</p>
              <span className="docs-lane-link en-only">Open {lane.cta}</span>
              <span className="docs-lane-link es-only">Abrir {lane.titleEs}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label"><span className="en-only">Product Flow</span><span className="es-only">Flujo del Producto</span></p>
          <h2 className="en-only">How teams should read the product</h2>
          <h2 className="es-only">Como deberian leer el producto los equipos</h2>
          <ol className="clarity-list en-only">
            {englishFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <ol className="clarity-list es-only">
            {spanishFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label"><span className="en-only">Architecture</span><span className="es-only">Arquitectura</span></p>
          <h2 className="en-only">One design system, multiple delivery surfaces.</h2>
          <h2 className="es-only">Un sistema de diseno, multiples superficies de entrega.</h2>
          <ul className="architecture-list en-only">
            {architectureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="architecture-list es-only">
            {architectureItemsEs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-actions compact">
            <Link href="/docs/start-here" className="btn ghost"><span className="en-only">Open Start Here</span><span className="es-only">Abrir Empieza Aqui</span></Link>
            <Link href="/docs/multi-runtime" className="btn ghost btn-runtime"><span className="en-only">Open Runtime Guide</span><span className="es-only">Abrir Guia de Runtimes</span></Link>
            <Link href="/examples" className="btn ghost btn-showcase"><span className="en-only">See Examples</span><span className="es-only">Ver Ejemplos</span></Link>
          </div>
        </article>
        <section className="terminal landing-terminal">
          <div className="term-head"><span className="en-only">Quick Start</span><span className="es-only">Inicio Rapido</span></div>
          <pre><code>{commandBlock}</code></pre>
        </section>
      </section>

      <section className="card landing-section">
        <div className="section-headline">
          <p className="section-label"><span className="en-only">Runtime Surface</span><span className="es-only">Superficie de Runtimes</span></p>
          <h2 className="en-only">Present the range as a premium system, not a spreadsheet.</h2>
          <h2 className="es-only">Presenta el alcance como un sistema premium, no como una hoja de calculo.</h2>
          <p className="micro-note en-only">
            React stays stable and first-class. Every other runtime is shown with the right level of
            honesty so buyers see ambition without confusing maturity.
          </p>
          <p className="micro-note es-only">
            React se mantiene estable y de primera clase. Cada otro runtime se muestra con el nivel
            correcto de honestidad para que los compradores vean ambicion sin confundir madurez.
          </p>
        </div>
        <div className="runtime-card-grid">
          {runtimeCards.map((runtime) => (
            <article key={runtime.name} className={`runtime-showcase-card ${runtime.tone}`}>
              <div className="runtime-showcase-top">
                <h3>{runtime.name}</h3>
                <span className={`payment-chip ready ${runtime.tone}`}>{runtime.status}</span>
              </div>
              <p className="en-only">{runtime.summary}</p>
              <p className="es-only">{runtime.summaryEs}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions compact">
          <Link href="/multi-framework" className="btn primary"><span className="en-only">Open Full Runtime Matrix</span><span className="es-only">Abrir Matriz Completa de Runtimes</span></Link>
          <Link href="/docs/multi-runtime" className="btn ghost"><span className="en-only">Docs Guide</span><span className="es-only">Guia de Docs</span></Link>
        </div>
      </section>

      <section className="card landing-section">
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="free-rich-panel">
              <div className="free-rich-copy">
                <p className="tier-mini-label"><span className="en-only">Public foundation</span><span className="es-only">Base publica</span></p>
                <h4 className="en-only">The free layer should feel trustworthy before users ever pay.</h4>
                <h4 className="es-only">La capa gratuita debe sentirse confiable antes de que alguien pague.</h4>
                <p className="en-only">
                  A stronger landing page makes the open surface more credible: clearer docs, better
                  navigation, and a visible product map that makes the premium ladder easier to trust.
                </p>
                <p className="es-only">
                  Una landing mas fuerte hace la superficie abierta mas creible: docs mas claros,
                  mejor navegacion y un mapa visible del producto que hace mas facil confiar en la escalera premium.
                </p>
              </div>
              <div className="free-signal-grid" aria-label="Free landing signals">
                {[
                  { value: 'Docs', label: 'Visible first' },
                  { value: 'Free', label: 'Trust layer' },
                  { value: 'Pro', label: 'Delivery value' },
                  { value: 'Full', label: 'Top finish' },
                ].map((signal, index) => (
                  <div key={signal.label} className={`free-signal ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                    <strong>{signal.value}</strong>
                    <span className="en-only">{signal.label}</span>
                    <span className="es-only">
                      {signal.label === 'Visible first' ? 'Visible primero' : signal.label === 'Trust layer' ? 'Capa de confianza' : signal.label === 'Delivery value' ? 'Valor de entrega' : 'Acabado superior'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="payment-meta" aria-label="Landing trust signals">
              <span className="payment-chip free accent-cyan"><span className="en-only">Free docs stay public</span><span className="es-only">Los docs gratis siguen publicos</span></span>
              <span className="payment-chip manual accent-amber"><span className="en-only">Premium stays protected</span><span className="es-only">Lo premium sigue protegido</span></span>
              <span className="payment-chip alt accent-violet"><span className="en-only">Clear upgrade story</span><span className="es-only">Ruta de upgrade clara</span></span>
            </div>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label"><span className="en-only">Why this matters</span><span className="es-only">Por que importa</span></p>
            <h4 className="en-only">Clarity is part of the product quality, not a separate marketing task.</h4>
            <h4 className="es-only">La claridad es parte de la calidad del producto, no una tarea aparte de marketing.</h4>
            <ul className="free-proof-list">
              <li className="en-only">Better navigation reduces confusion for first-time visitors.</li>
              <li className="en-only">Bilingual separation makes the product easier to read for both audiences.</li>
              <li className="en-only">The premium ladder feels stronger when the public layer already looks complete.</li>
              <li className="es-only">Una mejor navegacion reduce confusion para visitantes nuevos.</li>
              <li className="es-only">La separacion por idioma hace el producto mas facil de leer para ambas audiencias.</li>
              <li className="es-only">La escalera premium se siente mas fuerte cuando la capa publica ya luce completa.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="premium-stage">
        <article className="premium-stage-card pro">
          <p className="section-label"><span className="en-only">Pro Focus</span><span className="es-only">Enfoque Pro</span></p>
          <h2 className="en-only">Pro is the paid tier where delivery starts to feel substantial.</h2>
          <h2 className="es-only">Pro es la capa pagada donde la entrega empieza a sentirse solida.</h2>
          <p className="micro-note en-only">
            Reusable protected assets, team-facing structure, and a stronger month-to-month value story.
          </p>
          <p className="micro-note es-only">
            Assets protegidos reutilizables, estructura para equipos y una historia de valor mensual mas fuerte.
          </p>
          <div className="premium-stage-list">
            {['Protected kits', 'Team-ready assets', 'Premium operators'].map((item, index) => (
              <span key={item} className={`tier-pill ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                <span className="en-only">{item}</span>
                <span className="es-only">{item === 'Protected kits' ? 'Kits protegidos' : item === 'Team-ready assets' ? 'Assets listos para equipo' : 'Operadores premium'}</span>
              </span>
            ))}
          </div>
        </article>
        <article className="premium-stage-card full">
          <p className="section-label"><span className="en-only">Full Focus</span><span className="es-only">Enfoque Full</span></p>
          <h2 className="en-only">Full Signature is the top-tier package that should feel unmistakably complete.</h2>
          <h2 className="es-only">Full Signature es el paquete mas alto y debe sentirse inequivamente completo.</h2>
          <p className="micro-note en-only">
            Executive-facing polish, broader exclusive surfaces, and the highest-finish presentation in the stack.
          </p>
          <p className="micro-note es-only">
            Pulido para nivel ejecutivo, superficies exclusivas mas amplias y la presentacion de mayor acabado del stack.
          </p>
          <div className="premium-stage-list">
            {['Full-suite exclusives', 'Boardroom-grade finish', 'Highest polish'].map((item, index) => (
              <span key={item} className={`tier-pill ${homepageAccentCycle[(index + 2) % homepageAccentCycle.length]}`}>
                <span className="en-only">{item}</span>
                <span className="es-only">{item === 'Full-suite exclusives' ? 'Exclusivos full-suite' : item === 'Boardroom-grade finish' ? 'Acabado de boardroom' : 'Maximo pulido'}</span>
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="tier-grid">
        {paidPlans.map((plan, index) => {
          const classes = `card ${plan.kind === 'paid' ? 'highlight' : ''}`;
          const hasDirectCheckout = plan.paymentActions.some((action) => action.tone !== 'ghost');
          const tierHighlights = homepageTierFocus[plan.id] ?? [];
          const ribbon =
            index === 0 ? 'Premium Entry' : index === 1 ? 'Best Balance' : 'Full Suite';

          const content = (
            <>
              <div className="tier-head">
                <div className="tier-title-block">
                  <p className="plan-tier">{foundersOffer.label}</p>
                  <h3>{plan.name}</h3>
                  <p>{plan.audience}</p>
                </div>
                <span className="tier-badge">{ribbon}</span>
              </div>
              <p className="price-label compact">{plan.priceLabel}</p>
              <p>{plan.summary}</p>
              {tierHighlights.length > 0 ? (
                <div className="tier-pill-grid compact" aria-label={`Highlights for ${plan.name}`}>
                  {tierHighlights.map((item, itemIndex) => (
                    <span
                      key={`${plan.id}-${item}`}
                      className={`tier-pill ${homepageAccentCycle[(itemIndex + index) % homepageAccentCycle.length]}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="payment-meta" aria-label={`Summary checkout for ${plan.name}`}>
                <span
                  className={`payment-chip ${hasDirectCheckout ? 'ready' : 'manual'}`}
                >
                  {hasDirectCheckout ? 'Checkout ready' : 'Manual checkout'}
                </span>
                {plan.paymentActions.some((action) => action.tone === 'paypal') ? (
                  <span className="payment-chip alt">PayPal backup</span>
                ) : null}
              </div>
              <p className="plan-note">{plan.checkoutHint}</p>
              <span
                className={`btn ${plan.paymentActions[0]?.tone === 'paypal' ? 'paypal' : plan.kind === 'paid' ? 'primary' : 'ghost'} button-like`}
              >
                {plan.paymentActions[0]?.label ?? plan.ctaLabel}
              </span>
            </>
          );

          return plan.external ? (
            <a key={plan.id} href={plan.href} target="_blank" rel="noreferrer" className={`${classes} tier-card ${plan.id}`}>
              {content}
            </a>
          ) : (
            <Link key={plan.id} href={plan.href} className={`${classes} tier-card ${plan.id}`}>
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label"><span className="en-only">Next Step</span><span className="es-only">Siguiente Paso</span></p>
          <h2 className="en-only">Try the demos, read the docs, then open the vault when you are ready.</h2>
          <h2 className="es-only">Prueba los demos, lee los docs, luego abre el vault cuando estes listo.</h2>
          <p className="micro-note en-only">
            Three interactive demos show the system at work before you commit to anything.
            The free layer is substantial enough to build real trust.
          </p>
          <p className="micro-note es-only">
            Tres demos interactivos muestran el sistema en accion antes de comprometerte con algo.
            La capa gratuita es lo suficientemente solida para construir confianza real.
          </p>
          <div className="hero-actions compact">
            <Link href="/demo" className="btn primary"><span className="en-only">Open Live Demos</span><span className="es-only">Abrir Demos en Vivo</span></Link>
            <Link href="/docs/start-here" className="btn ghost"><span className="en-only">Start Here</span><span className="es-only">Empieza Aqui</span></Link>
            <Link href={vaultHref} className="btn ghost btn-vault"><span className="en-only">Open Vault</span><span className="es-only">Abrir Vault</span></Link>
          </div>
        </article>
        <article className="card">
          <p className="section-label"><span className="en-only">Sales</span><span className="es-only">Comercial</span></p>
          <h2 className="en-only">Ready to close when the buyer is ready.</h2>
          <h2 className="es-only">Listo para cerrar cuando el comprador lo este.</h2>
          <p className="micro-note en-only">
            The public experience is clearer now, but the premium close path remains direct for qualified buyers.
          </p>
          <p className="micro-note es-only">
            La experiencia publica ahora es mas clara, pero la ruta de cierre premium sigue directa para compradores calificados.
          </p>
          <pre><code>pnpm.cmd run prep:first-sale</code></pre>
          <div className="hero-actions compact">
            <Link href="/pricing" className="btn primary btn-pricing"><span className="en-only">Open Pricing</span><span className="es-only">Abrir Precios</span></Link>
            <a href={salesLinks.contact} className="btn ghost" target="_blank" rel="noreferrer"><span className="en-only">Contact Sales</span><span className="es-only">Contactar Ventas</span></a>
          </div>
        </article>
      </section>

      <footer className="footer">
        <p>LotOS UI | 2026 | Lotos Technologies</p>
        <div>
          <Link href="/docs"><span className="en-only">Docs</span><span className="es-only">Documentacion</span></Link>
          <Link href="/examples"><span className="en-only">Examples</span><span className="es-only">Ejemplos</span></Link>
          <Link href="/pricing"><span className="en-only">Pricing</span><span className="es-only">Precios</span></Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
