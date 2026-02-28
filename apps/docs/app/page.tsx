import Link from 'next/link';
import type { Metadata } from 'next';

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

const commands = `pnpm --filter @lotosui/cli exec lotos-ui stacks
pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel
pnpm --filter @lotosui/cli exec lotos-ui desktop-templates
pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/python-control-center`;

export default function DocsHomePage() {
  return (
    <main className="lotos-docs-home">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">LotOS UI Docs | English + Espanol</p>
          <div className="hero-badges" aria-label="Product status">
            <span className="hero-badge badge-stable">React Stable</span>
            <span className="hero-badge badge-proof">Built with LotOS UI</span>
            <span className="hero-badge badge-active">Expansion Active</span>
          </div>
          <h1>
            Ship premium UI in React today
            <span>Expand across your stack tomorrow</span>
          </h1>
          <p className="lead">
            LotOS UI gives you a production-ready React entry point, then carries the same visual
            language into Laravel, Django, Java, .NET, Go, and desktop runtimes.
          </p>
          <p className="lead lead-es">
            LotOS UI te da una entrada lista para produccion en React y luego lleva el mismo
            lenguaje visual a Laravel, Django, Java, .NET, Go y runtimes desktop.
          </p>
          <p className="hero-proof">
            This page is dogfooded on the same product discipline it sells: structured hierarchy,
            contract-safe messaging, and reusable UI surfaces.
          </p>
          <div className="hero-actions">
            <Link href="/docs/installation" className="btn btn-primary">Get Started / Empezar</Link>
            <Link href="/docs/multi-runtime" className="btn btn-ghost">Runtime Guide / Guia</Link>
            <Link href="/docs/components/button" className="btn btn-ghost">Components / Componentes</Link>
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
                <div className="preview-kicker">Control room</div>
                <button className="chip active">React</button>
                <button className="chip">Laravel</button>
                <button className="chip">Desktop</button>
                <button className="chip">MCP</button>
              </aside>
              <section className="preview-main">
                <div className="stats-row">
                  <article>
                    <strong>20+</strong>
                    <span>Components</span>
                  </article>
                  <article>
                    <strong>10</strong>
                    <span>Stacks</span>
                  </article>
                  <article>
                    <strong>MCP</strong>
                    <span>Active</span>
                  </article>
                </div>
                <div className="surface-card">
                  <div className="surface-head">
                    <h3>Operator Build Flow</h3>
                    <span className="pill stable">Stable</span>
                  </div>
                  <p>Generate a backend stack, then overlay premium UI contracts.</p>
                  <div className="code-strip">stack-init | desktop-init | MCP render</div>
                  <div className="action-row">
                    <button className="btn-mini primary">Deploy</button>
                    <button className="btn-mini ghost">Inspect</button>
                  </div>
                </div>
                <div className="surface-card muted">
                  <div className="surface-head">
                    <h3>Sentinel Guard</h3>
                    <span className="pill proto">Guardrails</span>
                  </div>
                  <p>Warnings catch invalid composition before users ever see it.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="band stats-band">
        <article><strong>20+</strong><span>Components / Componentes</span></article>
        <article><strong>10</strong><span>Stack templates</span></article>
        <article><strong>5</strong><span>Desktop starters</span></article>
        <article><strong>Dogfood</strong><span>Built with own contracts</span></article>
      </section>

      <section className="band proof-band">
        <div className="proof-card">
          <p className="eyebrow">Dogfooding / Credibilidad</p>
          <h2>This docs portal is part of the product proof, not separate from it.</h2>
          <p>
            LotOS UI is not presenting a disconnected marketing shell. The docs are being used as a
            live showcase for the same visual rules, hierarchy, and reusable surfaces the platform
            exposes to teams.
          </p>
          <p className="es">
            LotOS UI no esta mostrando una capa de marketing desconectada. Los docs funcionan como
            una demostracion viva de las mismas reglas visuales, jerarquia y superficies reutilizables
            que la plataforma expone a los equipos.
          </p>
        </div>
      </section>

      <section className="section dark">
        <div className="section-head">
          <p className="eyebrow">Why LotOS UI / Por que LotOS UI</p>
          <h2>React first. Contracts everywhere.</h2>
          <p>
            The stable entry point is React. The advantage is that your design language can keep
            moving after React instead of getting trapped there.
          </p>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <p className="es">{pillar.titleEs}: {pillar.bodyEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section light">
        <div className="section-head">
          <p className="eyebrow">Runtime Matrix / Matriz</p>
          <h2>Cards, not spreadsheets.</h2>
          <p>
            Your product already has range. The docs should frame that range like a premium system,
            not like a gray internal spreadsheet.
          </p>
        </div>
        <div className="runtime-grid">
          {runtimeCards.map((card) => (
            <article key={card.name} className={`runtime-card ${card.tone}`}>
              <div className="runtime-top">
                <h3>{card.name}</h3>
                <span className={`pill ${card.tone}`}>{card.status}</span>
              </div>
              <p>{card.summary}</p>
              <p className="es">{card.summaryEs}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="section-head">
          <p className="eyebrow">Quick Start / Inicio Rapido</p>
          <h2>Real commands. Real starters.</h2>
          <p>
            The surface looks premium, but the proof still lands in executable commands and starter
            generators your team can run now.
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
            <p className="eyebrow">Next step / Siguiente paso</p>
            <h2>Use the docs as the command center, not just a reference page.</h2>
            <p>
              Start free, validate your architecture, and move into premium templates when you need
              more velocity without lowering your product bar.
            </p>
          </div>
          <div className="hero-actions">
            <Link href="/docs/installation" className="btn btn-primary">Installation</Link>
            <Link href="/docs/multi-runtime" className="btn btn-ghost">Open Runtime Guide</Link>
            <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer" className="btn btn-ghost">
              GitHub
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .lotos-docs-home {
          min-height: 100vh;
          color: #ecf3ff;
          background:
            radial-gradient(920px 480px at 12% 8%, rgba(15, 118, 110, 0.22), transparent 50%),
            radial-gradient(860px 540px at 88% 0%, rgba(37, 99, 235, 0.22), transparent 50%),
            linear-gradient(160deg, #020617 0%, #09162a 42%, #0d1b31 100%);
          font-family: var(--font-inter), "Segoe UI", sans-serif;
        }
        .hero-shell,
        .band,
        .section {
          max-width: 1180px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
        .hero-shell {
          display: grid;
          gap: 24px;
          grid-template-columns: 1.05fr .95fr;
          padding-top: 42px;
          padding-bottom: 54px;
          align-items: center;
        }
        .eyebrow {
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: .1em;
          font-size: 12px;
          color: #67e8f9;
          font-weight: 800;
        }
        .hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 7px 10px;
          border: 1px solid transparent;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .badge-stable {
          background: rgba(20,184,166,0.16);
          border-color: rgba(45, 212, 191, 0.3);
          color: #99f6e4;
        }
        .badge-proof {
          background: rgba(129,140,248,0.16);
          border-color: rgba(165, 180, 252, 0.3);
          color: #dbeafe;
        }
        .badge-active {
          background: rgba(244,114,182,0.14);
          border-color: rgba(244,114,182,0.28);
          color: #fbcfe8;
        }
        .hero-copy h1 {
          margin: 0;
          font-family: var(--font-outfit), "Segoe UI", sans-serif;
          font-size: clamp(42px, 7vw, 84px);
          line-height: .96;
          letter-spacing: -.03em;
          max-width: 760px;
        }
        .hero-copy h1 span {
          display: block;
          background: linear-gradient(120deg, #67e8f9, #818cf8 60%, #f472b6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .lead {
          margin: 18px 0 0;
          max-width: 650px;
          color: rgba(236, 243, 255, 0.8);
          font-size: 18px;
          line-height: 1.65;
        }
        .lead-es,
        .es {
          color: rgba(182, 205, 236, 0.85);
        }
        .hero-proof {
          margin: 16px 0 0;
          max-width: 650px;
          color: rgba(191, 219, 254, 0.76);
          font-size: 13px;
          line-height: 1.7;
          letter-spacing: .01em;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-primary {
          background: linear-gradient(120deg, #14b8a6, #2563eb);
          color: #fff;
          border: 1px solid transparent;
        }
        .btn-ghost {
          color: #ecf3ff;
          border: 1px solid rgba(236, 243, 255, 0.14);
          background: rgba(236, 243, 255, 0.04);
        }
        .hero-preview {
          position: relative;
        }
        .preview-window {
          border-radius: 22px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.7));
          box-shadow:
            0 28px 65px rgba(2, 6, 23, 0.48),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }
        .window-top {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        }
        .window-top span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .window-top span:nth-child(1) { background: #fb7185; }
        .window-top span:nth-child(2) { background: #fbbf24; }
        .window-top span:nth-child(3) { background: #34d399; }
        .window-top small {
          margin-left: auto;
          color: rgba(191, 219, 254, 0.8);
          font-size: 12px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: 180px 1fr;
          min-height: 430px;
        }
        .preview-nav {
          border-right: 1px solid rgba(148, 163, 184, 0.12);
          padding: 18px;
          display: grid;
          align-content: start;
          gap: 10px;
        }
        .preview-kicker {
          color: rgba(191, 219, 254, 0.7);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 6px;
        }
        .chip {
          text-align: left;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background: rgba(255,255,255,0.03);
          color: rgba(236, 243, 255, 0.86);
          padding: 8px 10px;
          font-size: 13px;
          font-weight: 700;
        }
        .chip.active {
          background: linear-gradient(120deg, rgba(20,184,166,0.22), rgba(37,99,235,0.24));
          border-color: rgba(103, 232, 249, 0.34);
        }
        .preview-main {
          padding: 18px;
          display: grid;
          gap: 14px;
          align-content: start;
        }
        .stats-row {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(90px, 1fr));
        }
        .stats-row article {
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(255,255,255,0.035);
          padding: 12px;
        }
        .stats-row strong {
          display: block;
          font-size: 24px;
          color: #fff;
        }
        .stats-row span {
          font-size: 11px;
          color: rgba(191, 219, 254, 0.72);
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .surface-card {
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.64), rgba(15, 23, 42, 0.42));
          padding: 16px;
        }
        .surface-card.muted {
          background: rgba(255,255,255,0.03);
        }
        .surface-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .surface-head h3 {
          margin: 0;
          font-size: 18px;
          color: #fff;
        }
        .surface-card p {
          margin: 8px 0 0;
          color: rgba(214, 228, 255, 0.8);
          line-height: 1.55;
          font-size: 14px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .pill.stable {
          background: rgba(20,184,166,0.18);
          color: #99f6e4;
          border: 1px solid rgba(20,184,166,0.32);
        }
        .pill.alpha {
          background: rgba(244,114,182,0.18);
          color: #fbcfe8;
          border: 1px solid rgba(244,114,182,0.28);
        }
        .pill.proto {
          background: rgba(59,130,246,0.18);
          color: #bfdbfe;
          border: 1px solid rgba(59,130,246,0.3);
        }
        .pill.desktop {
          background: rgba(251,191,36,0.16);
          color: #fde68a;
          border: 1px solid rgba(251,191,36,0.28);
        }
        .code-strip {
          margin-top: 10px;
          border-radius: 10px;
          background: rgba(2, 6, 23, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.14);
          padding: 10px 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          color: #c7d7f7;
        }
        .action-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .btn-mini {
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid transparent;
        }
        .btn-mini.primary {
          background: linear-gradient(120deg, #14b8a6, #2563eb);
          color: #fff;
        }
        .btn-mini.ghost {
          background: rgba(255,255,255,0.04);
          color: #d7e7ff;
          border-color: rgba(148, 163, 184, 0.14);
        }
        .band.stats-band {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(130px, 1fr));
          padding-bottom: 24px;
        }
        .stats-band article {
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(255,255,255,0.04);
          padding: 14px;
        }
        .stats-band strong {
          display: block;
          font-size: 28px;
          color: #fff;
        }
        .stats-band span {
          color: rgba(191, 219, 254, 0.78);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .proof-band {
          padding-bottom: 12px;
        }
        .proof-card {
          border-radius: 24px;
          border: 1px solid rgba(103, 232, 249, 0.14);
          background:
            linear-gradient(135deg, rgba(14, 116, 144, 0.14), rgba(76, 29, 149, 0.14)),
            rgba(255,255,255,0.035);
          box-shadow:
            0 20px 44px rgba(2, 6, 23, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.05);
          padding: 20px;
          backdrop-filter: blur(10px);
        }
        .proof-card h2 {
          margin: 0;
          font-family: var(--font-outfit), "Segoe UI", sans-serif;
          font-size: clamp(24px, 4vw, 40px);
          line-height: 1.06;
          letter-spacing: -.02em;
          color: #fff;
          max-width: 820px;
        }
        .proof-card p {
          margin: 12px 0 0;
          max-width: 860px;
          color: rgba(214, 228, 255, 0.82);
          font-size: 15px;
          line-height: 1.7;
        }
        .section {
          padding-top: 34px;
          padding-bottom: 34px;
        }
        .section.dark {
          color: #ecf3ff;
        }
        .section.light {
          color: #14263d;
        }
        .section.light .section-head h2,
        .section.light .runtime-card h3,
        .section.light .cta-card h2 {
          color: #10253f;
        }
        .section-head {
          max-width: 760px;
        }
        .section-head h2 {
          margin: 0;
          font-family: var(--font-outfit), "Segoe UI", sans-serif;
          font-size: clamp(28px, 5vw, 52px);
          line-height: 1.03;
          letter-spacing: -.02em;
        }
        .section-head p {
          margin: 12px 0 0;
          font-size: 17px;
          line-height: 1.6;
          color: inherit;
          opacity: .8;
        }
        .pillar-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(220px, 1fr));
          margin-top: 18px;
        }
        .pillar-card {
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(255,255,255,0.04);
          padding: 16px;
        }
        .pillar-card h3 {
          margin: 0;
          font-size: 18px;
          color: #fff;
        }
        .pillar-card p {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(214, 228, 255, 0.82);
        }
        .pillar-card .es {
          color: rgba(167, 191, 226, 0.86);
        }
        .section.light {
          border-radius: 30px;
          background:
            radial-gradient(900px 380px at 0% 0%, rgba(196, 247, 239, 0.85), transparent 48%),
            radial-gradient(820px 420px at 100% 0%, rgba(206, 230, 255, 0.92), transparent 46%),
            linear-gradient(180deg, rgba(247,250,255,0.98), rgba(236,243,252,0.98));
          box-shadow: 0 24px 50px rgba(2, 6, 23, 0.1);
          margin-top: 12px;
        }
        .runtime-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(220px, 1fr));
          margin-top: 18px;
        }
        .runtime-card {
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background: rgba(255,255,255,0.82);
          padding: 16px;
          box-shadow: 0 18px 28px rgba(15, 23, 42, 0.06);
        }
        .runtime-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: start;
        }
        .runtime-card h3 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
        }
        .runtime-card p {
          margin: 9px 0 0;
          color: #49627f;
          line-height: 1.6;
          font-size: 14px;
        }
        .runtime-card .es {
          color: #6784a3;
        }
        .terminal {
          margin-top: 18px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(2, 6, 23, 0.7);
          box-shadow: 0 24px 48px rgba(2, 6, 23, 0.28);
        }
        .terminal-top {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }
        .terminal-top span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .terminal-top span:nth-child(1) { background: #fb7185; }
        .terminal-top span:nth-child(2) { background: #fbbf24; }
        .terminal-top span:nth-child(3) { background: #34d399; }
        .terminal-top small {
          margin-left: auto;
          color: rgba(191, 219, 254, 0.72);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .terminal pre {
          margin: 0;
          padding: 16px;
          overflow: auto;
          color: #dbe7ff;
          font-size: 12px;
          line-height: 1.65;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .cta-shell {
          padding-top: 18px;
          padding-bottom: 42px;
        }
        .cta-card {
          border-radius: 22px;
          border: 1px solid rgba(15, 118, 110, 0.14);
          background:
            linear-gradient(135deg, rgba(248, 252, 255, 0.95), rgba(238, 245, 255, 0.95));
          box-shadow: 0 24px 40px rgba(15, 23, 42, 0.08);
          padding: 20px;
        }
        .cta-card p {
          margin: 10px 0 0;
          color: #4a627f;
          line-height: 1.6;
        }
        @media (max-width: 980px) {
          .hero-shell {
            grid-template-columns: 1fr;
          }
          .preview-grid {
            grid-template-columns: 1fr;
          }
          .preview-nav {
            border-right: none;
            border-bottom: 1px solid rgba(148, 163, 184, 0.12);
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .band.stats-band {
            grid-template-columns: repeat(2, minmax(130px, 1fr));
          }
          .pillar-grid,
          .runtime-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .hero-shell,
          .band,
          .section {
            padding-left: 16px;
            padding-right: 16px;
          }
          .hero-shell {
            padding-top: 28px;
            padding-bottom: 36px;
          }
          .hero-copy h1 {
            font-size: clamp(34px, 12vw, 54px);
          }
          .preview-nav {
            grid-template-columns: 1fr 1fr;
          }
          .band.stats-band {
            grid-template-columns: 1fr 1fr;
          }
          .hero-badges {
            gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}
