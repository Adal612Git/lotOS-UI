import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth-options';
import { AuthAction } from './auth-action';
import { LangToggle } from './lang-toggle';
import './docs-home.css';

export const metadata: Metadata = {
  title: 'LotOS UI Docs - React-first Multi-runtime Platform',
  description:
    'Official docs portal for LotOS UI: a React-first, multi-runtime UI platform with AI-safe contracts, premium starters, and expansion-ready guides.',
};

const runtimeCards = [
  {
    name: 'React',
    status: 'Stable',
    tone: 'stable',
    summary: 'Production arm with the fastest route to polished shipping.',
    summaryEs: 'Brazo productivo con la ruta mas rapida para enviar UI pulida.',
  },
  {
    name: 'Laravel / Django / Flask',
    status: 'Alpha',
    tone: 'alpha',
    summary: 'Server-side stacks with Mongo-ready generators and contract-first expansion.',
    summaryEs: 'Stacks server-side con generadores listos para Mongo y expansion basada en contratos.',
  },
  {
    name: 'Spring / .NET / Go',
    status: 'Alpha',
    tone: 'alpha',
    summary: 'Enterprise and operational paths generated from one design language.',
    summaryEs: 'Rutas enterprise y operativas generadas desde un solo lenguaje visual.',
  },
  {
    name: 'Python / Java Desktop',
    status: 'Alpha',
    tone: 'desktop',
    summary: 'Desktop shells for control rooms, internal tools, and premium dashboards.',
    summaryEs: 'Shells desktop para cuartos de control, herramientas internas y dashboards premium.',
  },
  {
    name: 'C / C++ Desktop',
    status: 'Prototype / Alpha',
    tone: 'proto',
    summary: 'Lightweight native shells for high-control or embedded environments.',
    summaryEs: 'Shells nativos ligeros para entornos embebidos o de alto control.',
  },
  {
    name: 'Web Components',
    status: 'Prototype',
    tone: 'proto',
    summary: 'Cross-framework primitives to keep the visual system portable.',
    summaryEs: 'Primitivas cross-framework para mantener portable el sistema visual.',
  },
];

const pillars = [
  {
    title: 'AI-safe contracts',
    titleEs: 'Contratos seguros para AI',
    body:
      'MCP endpoints, schema-safe components, and implementation rules reduce hallucinations and broken output.',
    bodyEs:
      'Endpoints MCP, componentes con schema seguro y reglas de implementacion reducen alucinaciones y output roto.',
  },
  {
    title: 'One design system, many runtimes',
    titleEs: 'Un sistema visual, muchos runtimes',
    body:
      'Start in React with the stable arm, then expand into backend and desktop tracks without rewriting your product language.',
    bodyEs:
      'Empieza en React con el brazo estable y luego expande a rutas backend y desktop sin reescribir el lenguaje de tu producto.',
  },
  {
    title: 'Starter velocity',
    titleEs: 'Velocidad de arranque',
    body:
      'Use stack-init and desktop-init to generate real foundations, not empty marketing promises.',
    bodyEs:
      'Usa stack-init y desktop-init para generar bases reales, no promesas vacias de marketing.',
  },
  {
    title: 'Built with LotOS UI',
    titleEs: 'Hecho con LotOS UI',
    body:
      'This docs home uses the same contract language, hierarchy, and visual discipline the platform ships to customers.',
    bodyEs:
      'Esta home de docs usa el mismo lenguaje de contratos, jerarquia y disciplina visual que la plataforma entrega a clientes.',
  },
];

const learningTracks = [
  {
    title: 'App UI first',
    titleEs: 'Primero UI de app',
    href: '/docs/start-here',
    body: 'Use this if your goal is to install the right npm package and ship UI without getting lost in the larger runtime map.',
    bodyEs: 'Usa esto si tu meta es instalar el paquete correcto de npm y enviar UI sin perderte en el mapa grande de runtimes.',
    tone: 'stable',
  },
  {
    title: 'React production setup',
    titleEs: 'Setup productivo en React',
    href: '/docs/installation',
    body: 'Go here once you are ready to install the stable arm and wire styles, components, and first commands.',
    bodyEs: 'Ve aqui cuando ya estes listo para instalar el brazo estable y conectar estilos, componentes y primeros comandos.',
    tone: 'desktop',
  },
  {
    title: 'Spreadsheet modernization',
    titleEs: 'Modernizacion de spreadsheets',
    href: '/docs/start-here',
    body: 'This path explains where Excel and Calc macros fit so teams do not confuse premium workflow upgrades with the default package path.',
    bodyEs: 'Esta ruta explica donde entran las macros de Excel y Calc para no confundir upgrades premium de workflows con la ruta normal del paquete.',
    tone: 'proto',
  },
];

const commands = `pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`;

export default async function DocsHomePage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;

  return (
    <main className="lotos-docs-home">
      <section className="hero-shell">
        <div className="hero-copy">
          <div className="hero-lang-row">
            <LangToggle />
            <p className="eyebrow">
              <span className="en-only">LotOS UI Docs</span>
              <span className="es-only">LotOS UI Documentacion</span>
            </p>
          </div>
          <div className="hero-badges" aria-label="Product status">
            <span className="hero-badge badge-stable"><span className="en-only">React Stable</span><span className="es-only">React Estable</span></span>
            <span className="hero-badge badge-proof"><span className="en-only">Built with LotOS UI</span><span className="es-only">Hecho con LotOS UI</span></span>
            <span className="hero-badge badge-active"><span className="en-only">Expansion Active</span><span className="es-only">Expansion Activa</span></span>
          </div>
          <h1>
            <span className="en-only">Ship premium UI in React today</span>
            <span className="es-only">Entrega UI premium en React hoy</span>
            <span className="en-only">Expand across your stack tomorrow</span>
            <span className="es-only">Expande por todo tu stack manana</span>
          </h1>
          <p className="lead en-only">
            LotOS UI gives you a production-ready React entry point, then carries the same visual
            language into Laravel, Django, Java, .NET, Go, and desktop runtimes.
          </p>
          <p className="lead es-only">
            LotOS UI te da una entrada lista para produccion en React y luego lleva el mismo
            lenguaje visual a Laravel, Django, Java, .NET, Go y runtimes desktop.
          </p>
          <p className="hero-proof">
            <span className="en-only">
              This page is dogfooded on the same product discipline it sells: structured hierarchy,
              contract-safe messaging, and reusable UI surfaces.
            </span>
            <span className="es-only">
              Esta pagina se dog-foodea sobre la misma disciplina del producto que vende: jerarquia
              estructurada, mensajeria segura en contratos y superficies UI reutilizables.
            </span>
          </p>
          <div className="hero-actions">
            <Link href="/docs/start-here" className="lotos-btn lotos-btn--primary">
              <span className="en-only">Get Started</span>
              <span className="es-only">Empezar</span>
            </Link>
            <Link href="/docs/multi-runtime" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Runtime Guide</span>
              <span className="es-only">Guia de Runtimes</span>
            </Link>
            <Link href="/examples" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Examples</span>
              <span className="es-only">Ejemplos</span>
            </Link>
            <Link href="/pricing" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Pricing</span>
              <span className="es-only">Precios</span>
            </Link>
            {signedInEmail ? (
              <Link href="/vault" className="lotos-btn lotos-btn--ghost">
                <span className="en-only">Open Vault</span>
                <span className="es-only">Abrir Vault</span>
              </Link>
            ) : (
              <AuthAction mode="signin" callbackUrl="/vault" className="lotos-btn btn-google">
                <span className="en-only">Sign In With Google</span>
                <span className="es-only">Entrar con Google</span>
              </AuthAction>
            )}
            <Link href="/docs/components/button" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Components</span>
              <span className="es-only">Componentes</span>
            </Link>
          </div>
        </div>

        <div className="hero-preview" aria-label="LotOS UI visual preview">
          <div className="preview-window">
            <div className="window-top">
              <span />
              <span />
              <span />
              <small>LotOS Command Surface</small>
            </div>
            <div className="preview-grid">
              <aside className="preview-nav">
                <div className="preview-kicker"><span className="en-only">Control room</span><span className="es-only">Cuarto de control</span></div>
                <button className="chip active">React</button>
                <button className="chip">Laravel</button>
                <button className="chip">Desktop</button>
                <button className="chip">MCP</button>
              </aside>
              <section className="preview-main">
                <div className="stats-row">
                  <article>
                    <strong>27</strong>
                    <span>React</span>
                  </article>
                  <article>
                    <strong>10</strong>
                    <span>Stacks</span>
                  </article>
                  <article>
                    <strong>4</strong>
                    <span>Web</span>
                  </article>
                </div>
                <div className="surface-card">
                  <div className="surface-head">
                    <h3><span className="en-only">Operator Build Flow</span><span className="es-only">Flujo de Construccion Operativa</span></h3>
                    <span className="pill stable"><span className="en-only">Stable</span><span className="es-only">Estable</span></span>
                  </div>
                  <p><span className="en-only">Generate a backend stack, then overlay premium UI contracts.</span><span className="es-only">Genera un stack backend y luego superpone contratos premium de UI.</span></p>
                  <div className="code-strip">stack-init | desktop-init | MCP render</div>
                  <div className="action-row">
                    <button className="btn-mini primary"><span className="en-only">Deploy</span><span className="es-only">Desplegar</span></button>
                    <button className="btn-mini ghost"><span className="en-only">Inspect</span><span className="es-only">Inspeccionar</span></button>
                  </div>
                </div>
                <div className="surface-card muted">
                  <div className="surface-head">
                    <h3>Sentinel Guard</h3>
                    <span className="pill proto"><span className="en-only">Guardrails</span><span className="es-only">Guardrails</span></span>
                  </div>
                  <p><span className="en-only">Warnings catch invalid composition before users ever see it.</span><span className="es-only">Las advertencias detectan composicion invalida antes de que el usuario la vea.</span></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="band stats-band">
        <article><strong>27</strong><span><span className="en-only">React components</span><span className="es-only">Componentes React</span></span></article>
        <article><strong>4</strong><span><span className="en-only">Web primitives</span><span className="es-only">Primitivas web</span></span></article>
        <article><strong>10</strong><span><span className="en-only">Stack templates</span><span className="es-only">Templates de stack</span></span></article>
        <article><strong>8</strong><span><span className="en-only">Desktop templates</span><span className="es-only">Templates desktop</span></span></article>
      </section>

      <section className="band proof-band">
        <div className="proof-card">
          <p className="eyebrow">
            <span className="en-only">Dogfooding / Credibility</span>
            <span className="es-only">Dogfooding / Credibilidad</span>
          </p>
          <h2 className="en-only">This docs portal is part of the product proof, not separate from it.</h2>
          <h2 className="es-only">Este portal de docs es parte de la prueba del producto, no algo separado.</h2>
          <p className="en-only">
            LotOS UI is not presenting a disconnected marketing shell. The docs are being used as a
            live showcase for the same visual rules, hierarchy, and reusable surfaces the platform
            exposes to teams.
          </p>
          <p className="es-only">
            LotOS UI no esta mostrando una capa de marketing desconectada. Los docs funcionan como
            una demostracion viva de las mismas reglas visuales, jerarquia y superficies reutilizables
            que la plataforma expone a los equipos.
          </p>
        </div>
      </section>

      <section className="section light">
        <div className="section-head">
          <p className="eyebrow">
            <span className="en-only">Language support</span>
            <span className="es-only">Soporte de idioma</span>
          </p>
          <h2 className="en-only">Choose your shell language, then move into the right depth.</h2>
          <h2 className="es-only">Elige el idioma de la interfaz y luego entra a la profundidad correcta.</h2>
          <p className="en-only">
            The landing surfaces, navigation, and guidance now respect English or Spanish. Deep technical
            references still stay in English while the bilingual layer keeps orientation clear.
          </p>
          <p className="es-only">
            Las superficies de entrada, la navegacion y la guia ya respetan ingles o espanol. La referencia
            tecnica profunda sigue en ingles mientras la capa bilingue mantiene clara la orientacion.
          </p>
        </div>
        <div className="runtime-grid">
          <article className="runtime-card stable">
            <div className="runtime-top">
              <h3 className="en-only">Public shell</h3>
              <h3 className="es-only">Capa publica</h3>
              <span className="pill stable"><span className="en-only">Bilingual</span><span className="es-only">Bilingue</span></span>
            </div>
            <p className="en-only">Home, navigation, calls to action, and docs guidance are separated cleanly by language choice.</p>
            <p className="es-only">La home, la navegacion, los llamados a la accion y la guia de docs quedan separados limpiamente por idioma.</p>
          </article>
          <article className="runtime-card desktop">
            <div className="runtime-top">
              <h3 className="en-only">Operator path</h3>
              <h3 className="es-only">Ruta operativa</h3>
              <span className="pill desktop"><span className="en-only">Guided</span><span className="es-only">Guiada</span></span>
            </div>
            <p className="en-only">Start Here, Installation, and Runtime Guide now behave like the shortest path into real use.</p>
            <p className="es-only">Empieza Aqui, Instalacion y Guia de Runtimes ahora funcionan como la ruta mas corta hacia uso real.</p>
          </article>
          <article className="runtime-card proto">
            <div className="runtime-top">
              <h3 className="en-only">Deep reference</h3>
              <h3 className="es-only">Referencia profunda</h3>
              <span className="pill proto"><span className="en-only">English first</span><span className="es-only">English first</span></span>
            </div>
            <p className="en-only">Component specs and deep technical pages remain English-first until full translations are expanded.</p>
            <p className="es-only">Las especificaciones de componentes y las paginas tecnicas profundas siguen primero en ingles mientras se amplian las traducciones.</p>
          </article>
        </div>
      </section>

      <section className="section light">
        <div className="section-head">
          <p className="eyebrow">
            <span className="en-only">Start paths</span>
            <span className="es-only">Rutas de inicio</span>
          </p>
          <h2 className="en-only">One clear entry per kind of user.</h2>
          <h2 className="es-only">Una entrada clara por tipo de usuario.</h2>
          <p className="en-only">
            The docs should teach users how to approach the product, not just list what exists.
          </p>
          <p className="es-only">
            Los docs deben ensenarte como acercarte al producto, no solo listar lo que existe.
          </p>
        </div>
        <div className="runtime-grid">
          {learningTracks.map((track) => (
            <Link key={track.title} href={track.href} className={`runtime-card ${track.tone}`}>
              <div className="runtime-top">
                <h3 className="en-only">{track.title}</h3>
                <h3 className="es-only">{track.titleEs}</h3>
                <span className={`pill ${track.tone}`}>Start</span>
              </div>
              <p className="en-only">{track.body}</p>
              <p className="es-only">{track.bodyEs}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="section-head">
          <p className="eyebrow">
            <span className="en-only">Why LotOS UI</span>
            <span className="es-only">Por que LotOS UI</span>
          </p>
          <h2 className="en-only">React first. Contracts everywhere.</h2>
          <h2 className="es-only">React primero. Contratos en todas partes.</h2>
          <p className="en-only">
            The stable entry point is React. The advantage is that your design language can keep
            moving after React instead of getting trapped there.
          </p>
          <p className="es-only">
            El punto de entrada estable es React. La ventaja es que tu lenguaje de diseno puede
            seguir evolucionando despues de React en lugar de quedar atrapado ahi.
          </p>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <h3 className="en-only">{pillar.title}</h3>
              <h3 className="es-only">{pillar.titleEs}</h3>
              <p className="en-only">{pillar.body}</p>
              <p className="es-only">{pillar.bodyEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section light">
        <div className="section-head">
          <p className="eyebrow">
            <span className="en-only">Runtime Matrix</span>
            <span className="es-only">Matriz de Runtimes</span>
          </p>
          <h2 className="en-only">Cards, not spreadsheets.</h2>
          <h2 className="es-only">Tarjetas, no hojas de calculo.</h2>
          <p className="en-only">
            Your product already has range. The docs should frame that range like a premium system,
            not like a gray internal spreadsheet.
          </p>
          <p className="es-only">
            Tu producto ya tiene alcance. Los docs deben enmarcar ese alcance como un sistema premium,
            no como una hoja de calculo gris interna.
          </p>
        </div>
        <div className="runtime-grid">
          {runtimeCards.map((card) => (
            <article key={card.name} className={`runtime-card ${card.tone}`}>
              <div className="runtime-top">
                <h3>{card.name}</h3>
                <span className={`pill ${card.tone}`}>{card.status}</span>
              </div>
              <p className="en-only">{card.summary}</p>
              <p className="es-only">{card.summaryEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="section-head">
          <p className="eyebrow">
            <span className="en-only">Quick Start</span>
            <span className="es-only">Inicio Rapido</span>
          </p>
          <h2 className="en-only">Real commands. Real starters.</h2>
          <h2 className="es-only">Comandos reales. Starters reales.</h2>
          <p className="en-only">
            The surface looks premium, but the proof still lands in executable commands and starter
            generators your team can run now.
          </p>
          <p className="es-only">
            La superficie se ve premium, pero la prueba sigue aterrizando en comandos ejecutables y
            generadores de starters que tu equipo puede correr ahora.
          </p>
        </div>
        <div className="terminal">
          <div className="terminal-top">
            <span />
            <span />
            <span />
            <small>terminal</small>
          </div>
          <pre>
            <code>{commands}</code>
          </pre>
        </div>
      </section>

      <section className="section light cta-shell">
        <div className="cta-card">
          <div>
            <p className="eyebrow">
              <span className="en-only">Next step</span>
              <span className="es-only">Siguiente paso</span>
            </p>
            <h2 className="en-only">Use the docs as the command center, not just a reference page.</h2>
            <h2 className="es-only">Usa los docs como centro de comando, no solo como pagina de referencia.</h2>
            <p className="en-only">
              Start free, validate your architecture, and move into premium templates when you need
              more velocity without lowering your product bar.
            </p>
            <p className="es-only">
              Empieza gratis, valida tu arquitectura y pasa a templates premium cuando necesites
              mas velocidad sin bajar el nivel de tu producto.
            </p>
          </div>
          <div className="hero-actions">
            <Link href="/docs/installation" className="lotos-btn lotos-btn--primary">
              <span className="en-only">Installation</span>
              <span className="es-only">Instalacion</span>
            </Link>
            <Link href="/docs/multi-runtime" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Open Runtime Guide</span>
              <span className="es-only">Guia de Runtimes</span>
            </Link>
            <Link href="/pricing" className="lotos-btn lotos-btn--ghost">
              <span className="en-only">Pricing</span>
              <span className="es-only">Precios</span>
            </Link>
            {signedInEmail ? (
              <Link href="/vault" className="lotos-btn lotos-btn--ghost">Vault</Link>
            ) : (
              <Link href="/login" className="lotos-btn lotos-btn--ghost">Login</Link>
            )}
            <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer" className="lotos-btn lotos-btn--ghost">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
