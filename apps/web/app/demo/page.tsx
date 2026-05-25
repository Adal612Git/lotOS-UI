import Link from 'next/link';
import '../demo/demo.css';

export const metadata = {
  title: 'LotOS UI — Live Demos',
  description: 'Three production-quality demo surfaces built with LotOS UI.',
};

export default function DemoIndexPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI
        </div>
        <nav className="demo-nav">
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vault">Vault</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Interactive Demos</p>
        <h1 className="demo-page-title">Three surfaces. One design system.</h1>
        <p className="demo-page-subtitle">
          Every demo is built entirely with LotOS UI components, tokens, and design language.
          No external libraries. No theme overrides.
        </p>

        <div className="demo-index-grid">
          <Link href="/demo/operator" className="demo-index-card">
            <span className="demo-index-num">01</span>
            <h2 className="demo-index-card-title">Operator Command Center</h2>
            <p className="demo-index-card-body">
              A high-pressure enterprise dashboard for support, risk, and dispatch teams.
              Signal-first KPIs, incident queue, real-time status.
            </p>
            <span className="demo-index-cta">Open demo →</span>
          </Link>

          <Link href="/demo/components" className="demo-index-card violet">
            <span className="demo-index-num">02</span>
            <h2 className="demo-index-card-title">Component Showcase</h2>
            <p className="demo-index-card-body">
              All 27 production React components in one dark-theme gallery.
              Buttons, cards, badges, inputs, progress, stats, and alerts.
            </p>
            <span className="demo-index-cta" style={{ color: '#A78BFA' }}>Open demo →</span>
          </Link>

          <Link href="/demo/vault" className="demo-index-card green">
            <span className="demo-index-num">03</span>
            <h2 className="demo-index-card-title">Full Signature Vault</h2>
            <p className="demo-index-card-body">
              Premium gated experience for Full Signature buyers. Six unlocked asset packs,
              tier routing, and protected delivery surfaces.
            </p>
            <span className="demo-index-cta" style={{ color: '#4ADE80' }}>Open demo →</span>
          </Link>
        </div>

        <div className="demo-divider" />

        {/* ── Sin vs Con comparison demos ── */}
        <p className="demo-section-label">Comparativa — Sin LotOS UI vs Con LotOS UI</p>
        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#F0F4FF' }}>
          El mismo producto. La diferencia que hace el sistema de diseño.
        </h2>
        <p className="demo-page-subtitle" style={{ marginBottom: 20 }}>
          Mira exactamente el mismo panel — una vez sin ningún sistema, una vez con los 27 componentes de LotOS UI.
          Web y Desktop. Sin descargar el repo. Solo{' '}
          <code style={{ fontSize: 12, padding: '2px 6px', background: 'rgba(240,244,255,0.07)', borderRadius: 4 }}>npm install @lotosui/claude-arm</code>.
        </p>

        <p className="demo-section-label" style={{ marginBottom: 12 }}>Web — ClearCRM Admin</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
          <Link href="/demo/sin-lotos-web" className="demo-index-card" style={{ borderColor: 'rgba(240,244,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(240,244,255,0.12)' }}>SIN</span>
              <span className="demo-badge red">Before</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Web sin LotOS UI</h2>
            <p className="demo-index-card-body">
              CRM admin construido con HTML genérico, CSS inline, sin tokens ni sistema.
              Arial, azul #0066cc, tablas grises. Funciona, pero no comunica.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Sin sistema', 'Light theme', 'Generic CSS', 'No tokens'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(240,244,255,0.04)', border: '1px solid rgba(240,244,255,0.08)', color: 'rgba(240,244,255,0.38)' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: 'rgba(240,244,255,0.35)' }}>Ver demo →</span>
          </Link>

          <Link href="/demo/con-lotos-web" className="demo-index-card" style={{ borderColor: 'rgba(233,69,96,0.2)', background: 'linear-gradient(135deg, rgba(233,69,96,0.04), rgba(22,24,41,0.95))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(233,69,96,0.25)' }}>CON</span>
              <span className="demo-badge green">After</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Web con LotOS UI</h2>
            <p className="demo-index-card-body">
              El mismo CRM con los 27 componentes: Button, Badge, Card, Table, Avatar, Tabs,
              Modal, Toast, Accordion, Skeleton, Spinner, Tooltip y más. Dark-first, WCAG AAA.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['27 componentes', 'Dark-first', 'WCAG AAA', 'LotOS tokens'].map((t) => (
                <span key={t} className="demo-badge red" style={{ fontSize: 9, padding: '2px 7px' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta">Ver demo →</span>
          </Link>
        </div>

        <p className="demo-section-label" style={{ marginBottom: 12 }}>Desktop — ControlDeck Python</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
          <Link href="/demo/sin-lotos-desktop" className="demo-index-card" style={{ borderColor: 'rgba(240,244,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(240,244,255,0.12)' }}>SIN</span>
              <span className="demo-badge red">Before</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Desktop sin LotOS UI</h2>
            <p className="demo-index-card-body">
              Monitor de servicios en ventana desktop con HTML crudo — genérico, sin tokens,
              sin sistema. Misma funcionalidad, cero identidad visual.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Raw HTML', 'Sin tokens', 'Python App', 'Generic dark'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(240,244,255,0.04)', border: '1px solid rgba(240,244,255,0.08)', color: 'rgba(240,244,255,0.38)' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: 'rgba(240,244,255,0.35)' }}>Ver demo →</span>
          </Link>

          <Link href="/demo/con-lotos-desktop" className="demo-index-card violet" style={{ borderColor: 'rgba(139,92,246,0.22)', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(22,24,41,0.95))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(139,92,246,0.25)' }}>CON</span>
              <span className="demo-badge green">After</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Desktop con LotOS UI</h2>
            <p className="demo-index-card-body">
              El mismo monitor usando el Desktop Shell de LotOS — window chrome, sidebar con tokens,
              todos los 27 componentes. Generado con{' '}
              <code style={{ fontSize: 11 }}>lotos-ui desktop-init</code>.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Desktop Shell', 'Python bridge', '27 componentes', 'lotos-ui CLI'].map((t) => (
                <span key={t} className="demo-badge violet" style={{ fontSize: 9, padding: '2px 7px' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: '#A78BFA' }}>Ver demo →</span>
          </Link>
        </div>

        {/* Desktop multi-lenguaje */}
        <div className="demo-divider" />
        <p className="demo-section-label" style={{ marginBottom: 12 }}>Desktop Multi-Lenguaje — Python · Rust · Java · C · C++</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
          <Link href="/demo/sin-lotos-desktop-langs" className="demo-index-card" style={{ borderColor: 'rgba(240,244,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(240,244,255,0.12)' }}>SIN</span>
              <span className="demo-badge red">Before</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Desktop sin LotOS — 5 lenguajes</h2>
            <p className="demo-index-card-body">
              Python/Tkinter, Rust/egui, Java/Swing, C/Win32 y C++/Qt — cada uno con su look nativo genérico.
              5 apps, 5 diseños distintos, cero identidad compartida.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Python', 'Rust', 'Java', 'C', 'C++'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(240,244,255,0.04)', border: '1px solid rgba(240,244,255,0.08)', color: 'rgba(240,244,255,0.38)' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: 'rgba(240,244,255,0.35)' }}>Ver demo →</span>
          </Link>

          <Link href="/demo/con-lotos-desktop-langs" className="demo-index-card violet" style={{ borderColor: 'rgba(7,139,109,0.25)', background: 'linear-gradient(135deg, rgba(7,139,109,0.05), rgba(22,24,41,0.95))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(7,139,109,0.25)' }}>CON</span>
              <span className="demo-badge green">After</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Desktop con LotOS — 1 shell · 5 langs</h2>
            <p className="demo-index-card-body">
              El mismo <code style={{ fontSize: 11 }}>ui/shell.html</code> (LotOS light theme) para todos.
              Tu app host en Python / Rust / Java / C / C++ abre un WebView de 4-6 líneas.
              <code style={{ fontSize: 11 }}> lotos-ui desktop-init -l python</code>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Python', 'Rust', 'Java', 'C', 'C++', 'CLI'].map((t) => (
                <span key={t} className="demo-badge green" style={{ fontSize: 9, padding: '2px 7px' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: '#86EFAC' }}>Ver demo →</span>
          </Link>
        </div>

        {/* Spreadsheet / Hoja de cálculo */}
        <p className="demo-section-label" style={{ marginBottom: 12 }}>Hoja de Cálculo — Excel + LibreOffice Calc</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
          <Link href="/demo/sin-lotos-hoja" className="demo-index-card" style={{ borderColor: 'rgba(240,244,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(240,244,255,0.12)' }}>SIN</span>
              <span className="demo-badge red">Before</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Hoja sin LotOS</h2>
            <p className="demo-index-card-body">
              Excel/Calc con Arial, fondo blanco, sin KPIs, sin jerarquía.
              Los datos están ahí, pero toman 30 segundos en leer. Sin urgencia, sin contexto.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Excel', 'Calc', 'Sin macro', 'Arial', 'Fondo blanco'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(240,244,255,0.04)', border: '1px solid rgba(240,244,255,0.08)', color: 'rgba(240,244,255,0.38)' }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: 'rgba(240,244,255,0.35)' }}>Ver demo →</span>
          </Link>

          <Link href="/demo/con-lotos-hoja" className="demo-index-card" style={{ borderColor: 'rgba(34,211,238,0.22)', background: 'linear-gradient(135deg, rgba(34,211,238,0.04), rgba(22,24,41,0.95))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="demo-index-num" style={{ fontSize: 28, color: 'rgba(34,211,238,0.2)' }}>CON</span>
              <span className="demo-badge green">After</span>
            </div>
            <h2 className="demo-index-card-title" style={{ fontSize: 16 }}>Hoja con LotOS (VBA / Basic)</h2>
            <p className="demo-index-card-body">
              Macro VBA (Excel) y macro Basic (LibreOffice) transforman la hoja:
              canvas oscuro, KPI ribbon, command strip, queue table con colores de status, alert rail.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['VBA / Basic', 'KPI ribbon', 'Dark canvas', 'Conditional fmt', 'Named ranges'].map((t) => (
                <span key={t} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22D3EE', fontWeight: 700 }}>{t}</span>
              ))}
            </div>
            <span className="demo-index-cta" style={{ color: '#22D3EE' }}>Ver demo →</span>
          </Link>
        </div>

        <div className="demo-divider" />

        <p className="demo-section-label">Instalación — sin descargar el repo</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(240,244,255,0.03)', border: '1px solid rgba(240,244,255,0.08)', fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#A5B4FC' }}>
            # Web / React<br />
            npm install @lotosui/claude-arm
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(240,244,255,0.03)', border: '1px solid rgba(240,244,255,0.08)', fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#A5B4FC' }}>
            # Desktop / CLI<br />
            npm install -g @lotosui/cli<br />
            lotos-ui desktop-init -l python -t control-center-desktop
          </div>
        </div>

        <p className="demo-section-label">Built with</p>
        <div className="demo-comp-row" style={{ gap: 8 }}>
          {['React 19', '27 Components', 'WCAG 2.2 AAA', 'Dark-first tokens', 'CLI scaffolding', 'Zero external deps'].map((tag) => (
            <span key={tag} className="demo-badge violet">{tag}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
