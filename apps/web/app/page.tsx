import Link from 'next/link';
import { getServerSession } from 'next-auth';
import './lotos-landing.css';
import { authOptions } from '../auth-options';
import { AuthAction } from './auth-action';
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
    title: 'A visual language with operational discipline.',
    titleEs: 'Un lenguaje visual con disciplina operativa.',
    body: 'LotOS UI is not a loose component dump. It is a product language meant to hold shape across documentation, delivery, and premium surfaces.',
  },
  {
    label: 'Clarity',
    title: 'Premium without hiding the map.',
    titleEs: 'Premium sin esconder el mapa.',
    body: 'The interface should feel elevated and still explain itself fast: where to start, what is stable, and where the protected value begins.',
  },
  {
    label: 'Range',
    title: 'React first. Expansion built in.',
    titleEs: 'React primero. Expansion integrada.',
    body: 'The system starts with the strongest runtime today and keeps the same product language ready for backend and desktop growth.',
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
          <Link href="/docs">Docs</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/multi-framework">Runtime Matrix</Link>
          {signedInEmail ? (
            <>
              <Link href="/vault">Vault</Link>
              <a href="/api/auth/signout?callbackUrl=/">Sign Out</a>
            </>
          ) : (
            <Link href="/login">Sign In</Link>
          )}
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero home-hero">
        <div className="home-hero-grid">
          <div className="hero-copy-stack">
            <p className="kicker">{foundersOffer.label} from MX$59 / mes | public docs + premium ladder</p>
            <div className="hero-pill-row" aria-label="Landing signals">
              <span className="tier-pill accent-cyan">React Stable</span>
              <span className="tier-pill accent-emerald">Docs First</span>
              <span className="tier-pill accent-amber">AI-safe contracts</span>
              <span className="tier-pill accent-violet">Full Signature ready</span>
            </div>
            <h1>
              The public face now carries the same discipline as the premium product.
              <span className="hero-subline">Structured, credible, and unmistakably built like LotOS UI.</span>
            </h1>
            <p className="lead">
              LotOS UI should feel like a real system the moment it opens: a clearer public entry,
              stronger documentation, a visible free trust layer, and a premium path that scales
              from proof to full-suite delivery without losing visual authority.
            </p>
            {signedInEmail ? (
              <p className="lead lead-compact">
                Signed in as {signedInEmail}. Your vault, docs, and pricing path are connected from here.
              </p>
            ) : (
              <p className="lead lead-compact">
                The public layer stays open so teams can validate the system before paying for protected surfaces.
              </p>
            )}
            <div className="hero-language-grid">
              <article className="language-panel">
                <p className="section-label">English</p>
                <h2>Start with clarity, not friction.</h2>
                <p>
                  The landing page now behaves like an operating surface: docs are easier to find,
                  the interface explains what is public versus premium, and the product range is
                  framed without forcing users through a wall of text.
                </p>
              </article>
              <article className="language-panel es">
                <p className="section-label">Espanol</p>
                <h2>Empieza con claridad, no con friccion.</h2>
                <p>
                  La landing ahora se comporta como una superficie operativa: la documentacion se
                  encuentra mas facil, la interfaz explica que es publico y que es premium, y el
                  rango del producto se entiende sin empujar al usuario a un muro de texto.
                </p>
              </article>
            </div>
            <div className="hero-actions">
              <Link href="/docs/start-here" className="btn primary">Get Started / Empezar</Link>
              <Link href="/docs" className="btn ghost">Open Docs</Link>
              <Link href="/pricing" className="btn ghost">Pricing / Precios</Link>
              {signedInEmail ? (
                <Link href="/vault" className="btn ghost">Open Vault</Link>
              ) : (
                <AuthAction mode="signin" callbackUrl="/vault" className="btn ghost">Sign In With Google</AuthAction>
              )}
              <Link href="/examples" className="btn ghost">Examples</Link>
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
                    <p>Onboarding, components, runtime guidance, and spreadsheet context are visible before checkout pressure.</p>
                    <div className="preview-code-strip">start-here | installation | components | runtime</div>
                  </div>
                  <div className="preview-surface-card secondary">
                    <div className="preview-surface-head">
                      <h3>Premium ladder</h3>
                      <span className="payment-chip alt accent-violet">Clear</span>
                    </div>
                    <p>Solo proves value, Pro carries delivery weight, and Full closes at the top tier.</p>
                  </div>
                </div>
                <div className="hero-preview-rail">
                  <p className="preview-rail-label">Navigation</p>
                  {documentationLanes.map((lane, index) => (
                    <div key={lane.title} className={`preview-rail-item ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                      <strong>{lane.title}</strong>
                      <span>{lane.titleEs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="stats">
        <article><strong>27</strong><span>React Components</span></article>
        <article><strong>4</strong><span>Web Primitives</span></article>
        <article><strong>10</strong><span>Stack Templates</span></article>
        <article><strong>8</strong><span>Desktop Templates</span></article>
      </section>

      <section className="card landing-section examples-band">
        <div className="section-headline">
          <p className="section-label">Examples / Ejemplos</p>
          <h2>Show the product as finished surfaces, not isolated parts.</h2>
          <p className="micro-note">
            A stronger examples layer makes the system easier to imagine in real work: command rooms,
            narrative dashboards, spreadsheet upgrades, and premium vault experiences.
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
          <Link href="/examples" className="btn primary">Open All Examples</Link>
          <Link href="/pricing" className="btn ghost">See Premium Ladder</Link>
        </div>
      </section>

      <section className="card landing-section signature-band">
        <div className="signature-band-copy">
          <p className="section-label">Product Signal / Senal de Producto</p>
          <h2>This home now behaves like a flagship surface, not a placeholder entry.</h2>
          <p className="micro-note">
            The message is simple even when the system is broad: this is a serious UI platform with
            a defined language, real delivery paths, and premium-grade presentation from the first screen.
          </p>
        </div>
        <div className="signature-grid">
          {signaturePrinciples.map((item, index) => (
            <article key={item.label} className={`signature-card ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
              <p className="signature-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <p className="lane-es">{item.titleEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card landing-section">
        <div className="section-headline">
          <p className="section-label">Documentation / Documentacion</p>
          <h2>Faster orientation, better trust, less guesswork.</h2>
          <p className="micro-note">
            The public home should answer where to start, what is stable, and how to upgrade before
            the user ever opens a sales conversation.
          </p>
        </div>
        <div className="docs-lane-grid">
          {documentationLanes.map((lane, index) => (
            <Link key={lane.title} href={lane.href} className={`docs-lane-card ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
              <div className="docs-lane-top">
                <p className="docs-lane-kicker">{lane.titleEs}</p>
                <h3>{lane.title}</h3>
              </div>
              <p>{lane.body}</p>
              <p className="lane-es">{lane.bodyEs}</p>
              <span className="docs-lane-link">Open {lane.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">English Flow</p>
          <h2>How teams should read the product</h2>
          <ol className="clarity-list">
            {englishFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article className="card">
          <p className="section-label">Flujo en Espanol</p>
          <h2>Como deberia leerse el producto</h2>
          <ol className="clarity-list">
            {spanishFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Architecture / Arquitectura</p>
          <h2>One design system, multiple delivery surfaces.</h2>
          <ul className="architecture-list">
            {architectureItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-actions compact">
            <Link href="/docs/start-here" className="btn ghost">Open Start Here</Link>
            <Link href="/docs/multi-runtime" className="btn ghost">Open Runtime Guide</Link>
            <Link href="/examples" className="btn ghost">See Examples</Link>
          </div>
        </article>
        <section className="terminal landing-terminal">
          <div className="term-head">Quick Start / Comandos</div>
          <pre><code>{commandBlock}</code></pre>
        </section>
      </section>

      <section className="card landing-section">
        <div className="section-headline">
          <p className="section-label">Runtime Surface / Superficie</p>
          <h2>Present the range as a premium system, not a spreadsheet.</h2>
          <p className="micro-note">
            React stays stable and first-class. Every other runtime is shown with the right level of
            honesty so buyers see ambition without confusing maturity.
          </p>
        </div>
        <div className="runtime-card-grid">
          {runtimeCards.map((runtime) => (
            <article key={runtime.name} className={`runtime-showcase-card ${runtime.tone}`}>
              <div className="runtime-showcase-top">
                <h3>{runtime.name}</h3>
                <span className={`payment-chip ready ${runtime.tone}`}>{runtime.status}</span>
              </div>
              <p>{runtime.summary}</p>
              <p className="lane-es">{runtime.summaryEs}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions compact">
          <Link href="/multi-framework" className="btn primary">Open Full Runtime Matrix</Link>
          <Link href="/docs/multi-runtime" className="btn ghost">Docs Guide</Link>
        </div>
      </section>

      <section className="card landing-section">
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="free-rich-panel">
              <div className="free-rich-copy">
                <p className="tier-mini-label">Public foundation</p>
                <h4>The free layer should feel trustworthy before users ever pay.</h4>
                <p>
                  A stronger landing page makes the open surface more credible: clearer docs, better
                  navigation, and a visible product map that makes the premium ladder easier to trust.
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
                    <span>{signal.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="payment-meta" aria-label="Landing trust signals">
              <span className="payment-chip free accent-cyan">Free docs stay public</span>
              <span className="payment-chip manual accent-amber">Premium stays protected</span>
              <span className="payment-chip alt accent-violet">Clear upgrade story</span>
            </div>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label">Why this matters</p>
            <h4>Clarity is part of the product quality, not a separate marketing task.</h4>
            <ul className="free-proof-list">
              <li>Better navigation reduces confusion for first-time visitors.</li>
              <li>Bilingual separation makes the product easier to read for both audiences.</li>
              <li>The premium ladder feels stronger when the public layer already looks complete.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="premium-stage">
        <article className="premium-stage-card pro">
          <p className="section-label">Pro Focus</p>
          <h2>Pro is the paid tier where delivery starts to feel substantial.</h2>
          <p className="micro-note">
            Reusable protected assets, team-facing structure, and a stronger month-to-month value story.
          </p>
          <div className="premium-stage-list">
            {['Protected kits', 'Team-ready assets', 'Premium operators'].map((item, index) => (
              <span key={item} className={`tier-pill ${homepageAccentCycle[index % homepageAccentCycle.length]}`}>
                {item}
              </span>
            ))}
          </div>
        </article>
        <article className="premium-stage-card full">
          <p className="section-label">Full Focus</p>
          <h2>Full Signature is the top-tier package that should feel unmistakably complete.</h2>
          <p className="micro-note">
            Executive-facing polish, broader exclusive surfaces, and the highest-finish presentation in the stack.
          </p>
          <div className="premium-stage-list">
            {['Full-suite exclusives', 'Boardroom-grade finish', 'Highest polish'].map((item, index) => (
              <span key={item} className={`tier-pill ${homepageAccentCycle[(index + 2) % homepageAccentCycle.length]}`}>
                {item}
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
          <p className="section-label">Next Step / Siguiente Paso</p>
          <h2>Use the docs first, then open the right commercial lane.</h2>
          <p className="micro-note">
            The landing page now routes users in the correct order: understanding first, protected value second.
          </p>
          <div className="hero-actions compact">
            <Link href="/docs/start-here" className="btn primary">Open Start Here</Link>
            <Link href={vaultHref} className="btn ghost">Open Vault Surface</Link>
          </div>
        </article>
        <article className="card">
          <p className="section-label">Sales / Comercial</p>
          <h2>Ready to close when the buyer is ready.</h2>
          <p className="micro-note">
            The public experience is clearer now, but the premium close path remains direct for qualified buyers.
          </p>
          <pre><code>pnpm.cmd run prep:first-sale</code></pre>
          <div className="hero-actions compact">
            <Link href="/pricing" className="btn primary">Open Pricing</Link>
            <a href={salesLinks.contact} className="btn ghost" target="_blank" rel="noreferrer">Contact Sales</a>
          </div>
        </article>
      </section>

      <footer className="footer">
        <p>LotOS UI | 2026 | Lotos Technologies</p>
        <div>
          <Link href="/docs">Docs</Link>
          <Link href="/examples">Examples</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
