import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LotOS UI — The AI-native UI Component Ecosystem',
  description:
    'Build UI with shared design and functional contracts. React stable today, multi-runtime expansion with explicit maturity labels.',
};

export default function HomePage() {
  return (
    <main className="lotos-home">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="lotos-nav" aria-label="Main navigation">
        <div className="lotos-nav__inner">
          <Link href="/" className="lotos-nav__logo" aria-label="LotOS UI home">
            <span className="lotos-nav__logo-icon" aria-hidden="true">⬡</span>
            <span className="lotos-nav__logo-text">LotOS UI</span>
          </Link>
          <div className="lotos-nav__links">
            <Link href="/docs" className="lotos-nav__link">Docs</Link>
            <Link href="/docs/components/button" className="lotos-nav__link">Components</Link>
            <Link href="/docs/multi-runtime" className="lotos-nav__link">Multi Runtime</Link>
            <a
              href="https://github.com/lotos-technologies/lotos-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="lotos-nav__link"
            >
              GitHub
            </a>
            <Link href="/docs/installation" className="lotos-nav__cta">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="lotos-hero" aria-labelledby="hero-heading">
        <div className="lotos-hero__badge">
          <span className="lotos-hero__badge-dot" aria-hidden="true" />
          Now in Early Access — Solo license from $149
        </div>

        <h1 id="hero-heading" className="lotos-hero__title">
          The UI Kit<br />
          <span className="lotos-hero__title-accent">your AI agent</span><br />
          actually understands
        </h1>

        <p className="lotos-hero__subtitle">
          LotOS UI is built for teams shipping with AI agents.
          MCP-powered schemas + JSX examples + anti-hallucination rules —
          so design intent and functional implementation stay aligned from day one.
        </p>

        <div className="lotos-hero__actions">
          <Link href="/docs/installation" className="lotos-btn lotos-btn--primary">
            Start building free
          </Link>
          <Link href="/docs" className="lotos-btn lotos-btn--ghost">
            View docs →
          </Link>
        </div>

        {/* Code snippet preview */}
        <div className="lotos-hero__code" role="region" aria-label="Code example">
          <div className="lotos-hero__code-header">
            <span className="lotos-code-dot lotos-code-dot--red" aria-hidden="true" />
            <span className="lotos-code-dot lotos-code-dot--yellow" aria-hidden="true" />
            <span className="lotos-code-dot lotos-code-dot--green" aria-hidden="true" />
            <span className="lotos-hero__code-label">terminal</span>
          </div>
          <pre className="lotos-hero__code-body">
            <code>
              <span className="lotos-code-comment">{`# Install`}</span>{'\n'}
              <span className="lotos-code-cmd">{'$ '}</span>
              <span className="lotos-code-text">{'npm install @lotosui/claude-arm'}</span>{'\n\n'}
              <span className="lotos-code-comment">{`# Use in your app`}</span>{'\n'}
              <span className="lotos-code-keyword">{'import '}</span>
              <span className="lotos-code-text">{'{ Button, Input, Modal } '}</span>
              <span className="lotos-code-keyword">{'from '}</span>
              <span className="lotos-code-string">{"'@lotosui/claude-arm'"}</span>{'\n\n'}
              <span className="lotos-code-tag">{'<Button '}</span>
              <span className="lotos-code-attr">{'variant'}</span>
              <span className="lotos-code-text">{'='}</span>
              <span className="lotos-code-string">{'"primary"'}</span>
              <span className="lotos-code-tag">{'>'}</span>
              <span className="lotos-code-text">{'Get Started'}</span>
              <span className="lotos-code-tag">{'</Button>'}</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="lotos-stats" aria-label="Key metrics">
        {[
          { value: '15', label: 'React Components' },
          { value: 'WCAG AAA', label: 'Accessibility' },
          { value: '11', label: 'Runtime Tracks' },
          { value: 'MCP', label: 'AI-native' },
        ].map(({ value, label }) => (
          <div key={label} className="lotos-stat">
            <span className="lotos-stat__value">{value}</span>
            <span className="lotos-stat__label">{label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="lotos-features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="lotos-section-title">
          Built for the agentic era
        </h2>
        <div className="lotos-features__grid">
          {[
            {
              icon: '🤖',
              title: 'MCP Server',
              desc: 'Your AI agent reads component schemas, JSX examples, and anti-hallucination rules directly — no more guessing API surfaces.',
            },
            {
              icon: '♿',
              title: 'WCAG 2.2 AAA',
              desc: 'Focus traps, keyboard navigation, aria attributes, and reduced-motion support ship by default, not as afterthoughts.',
            },
            {
              icon: '🛡️',
              title: 'Sentinel Guard',
              desc: 'Runtime warnings catch misuse before your users see it. The AI learns your guardrails, not just your API.',
            },
            {
              icon: '🌙',
              title: 'Dark Mode + RTL',
              desc: 'CSS custom properties for dark/light/system modes. Logical properties for RTL layouts. Global or per-component.',
            },
            {
              icon: '⚡',
              title: 'Multi-runtime visibility',
              desc: 'One design system with explicit maturity labels per runtime: stable, prototype, alpha, planned.',
            },
            {
              icon: '🔒',
              title: 'Type-safe by design',
              desc: 'Every component prop is a Zod schema. TypeScript types auto-generated. No runtime surprises.',
            },
          ].map(({ icon, title, desc }) => (
            <article key={title} className="lotos-feature-card">
              <span className="lotos-feature-card__icon" aria-hidden="true">{icon}</span>
              <h3 className="lotos-feature-card__title">{title}</h3>
              <p className="lotos-feature-card__desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="lotos-cta" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="lotos-cta__title">
          Ready to build with LotOS?
        </h2>
        <p className="lotos-cta__subtitle">
          Start with the React production arm, then scale with runtime-specific expansion tracks.
        </p>
        <div className="lotos-cta__actions">
          <Link href="/docs/installation" className="lotos-btn lotos-btn--primary lotos-btn--lg">
            Read the docs
          </Link>
          <a
            href="https://github.com/lotos-technologies/lotos-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="lotos-btn lotos-btn--ghost lotos-btn--lg"
          >
            ⭐ Star on GitHub
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="lotos-footer">
        <div className="lotos-footer__inner">
          <p className="lotos-footer__copy">
            © 2026 LotOS Technologies · Built with ❤️ by Ricardo
          </p>
          <nav className="lotos-footer__links" aria-label="Footer links">
            <Link href="/docs">Docs</Link>
            <a href="https://github.com/lotos-technologies/lotos-ui" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com/lotos_ui" target="_blank" rel="noopener noreferrer">Twitter</a>
          </nav>
        </div>
      </footer>

      <style>{`
        /* ─── Layout ─── */
        .lotos-home {
          min-height: 100vh;
          background: linear-gradient(135deg, #1A1A2E 0%, #0F3460 50%, #1A1A2E 100%);
        }

        /* ─── Nav ─── */
        .lotos-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(26, 26, 46, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .lotos-nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lotos-nav__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-family: var(--lotos-font-display, 'Outfit', sans-serif);
          font-weight: 700;
          font-size: 1.25rem;
          color: #fff;
        }
        .lotos-nav__logo-icon {
          font-size: 1.5rem;
          color: #E94560;
        }
        .lotos-nav__links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .lotos-nav__link {
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 200ms;
        }
        .lotos-nav__link:hover { color: #fff; }
        .lotos-nav__cta {
          background: #E94560;
          color: #fff;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 200ms, transform 100ms;
        }
        .lotos-nav__cta:hover { background: #FF5A78; transform: translateY(-1px); }

        /* ─── Hero ─── */
        .lotos-hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 1.5rem 4rem;
          text-align: center;
        }
        .lotos-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(233, 69, 96, 0.12);
          border: 1px solid rgba(233, 69, 96, 0.3);
          color: #E94560;
          border-radius: 9999px;
          padding: 0.4rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 2rem;
        }
        .lotos-hero__badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #E94560;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .lotos-hero__title {
          font-family: var(--lotos-font-display, 'Outfit', sans-serif);
          font-size: clamp(2.5rem, 7vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 1.5rem;
          letter-spacing: -0.03em;
        }
        .lotos-hero__title-accent {
          background: linear-gradient(135deg, #E94560, #FF5A78);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lotos-hero__subtitle {
          font-size: 1.25rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.68);
          max-width: 640px;
          margin: 0 auto 2.5rem;
        }
        .lotos-hero__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
        }

        /* ─── Buttons (used in landing) ─── */
        .lotos-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border-radius: 10px;
          padding: 0.75rem 1.75rem;
          font-size: 1rem;
          text-decoration: none;
          transition: all 150ms;
          cursor: pointer;
          border: none;
        }
        .lotos-btn--primary {
          background: #E94560;
          color: #fff;
        }
        .lotos-btn--primary:hover { background: #FF5A78; transform: translateY(-2px); }
        .lotos-btn--ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .lotos-btn--ghost:hover { background: rgba(255,255,255,0.1); }
        .lotos-btn--lg { padding: 1rem 2.5rem; font-size: 1.1rem; }

        /* ─── Code Preview ─── */
        .lotos-hero__code {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          text-align: left;
        }
        .lotos-hero__code-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.75rem 1rem;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lotos-code-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
        }
        .lotos-code-dot--red    { background: #FF5F57; }
        .lotos-code-dot--yellow { background: #FEBC2E; }
        .lotos-code-dot--green  { background: #28C840; }
        .lotos-hero__code-label {
          margin-left: auto;
          color: rgba(255,255,255,0.3);
          font-size: 0.75rem;
          font-family: var(--lotos-font-mono, monospace);
        }
        .lotos-hero__code-body {
          padding: 1.5rem;
          margin: 0;
          font-family: var(--lotos-font-mono, monospace);
          font-size: 0.875rem;
          line-height: 1.8;
          overflow-x: auto;
        }
        .lotos-code-comment { color: rgba(255,255,255,0.3); }
        .lotos-code-cmd     { color: #E94560; }
        .lotos-code-text    { color: rgba(255,255,255,0.85); }
        .lotos-code-keyword { color: #C792EA; }
        .lotos-code-string  { color: #C3E88D; }
        .lotos-code-tag     { color: #89DDFF; }
        .lotos-code-attr    { color: #FFCB6B; }

        /* ─── Stats ─── */
        .lotos-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 3rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
        }
        .lotos-stat { text-align: center; }
        .lotos-stat__value {
          display: block;
          font-family: var(--lotos-font-display, 'Outfit', sans-serif);
          font-size: 2rem;
          font-weight: 800;
          color: #E94560;
        }
        .lotos-stat__label {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
        }

        /* ─── Features ─── */
        .lotos-features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }
        .lotos-section-title {
          font-family: var(--lotos-font-display, 'Outfit', sans-serif);
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          color: #fff;
          margin: 0 0 3rem;
        }
        .lotos-features__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .lotos-feature-card {
          background: rgba(15, 52, 96, 0.3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: border-color 200ms, transform 200ms;
        }
        .lotos-feature-card:hover {
          border-color: rgba(233,69,96,0.3);
          transform: translateY(-3px);
        }
        .lotos-feature-card__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 1rem;
        }
        .lotos-feature-card__title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.5rem;
        }
        .lotos-feature-card__desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }

        /* ─── CTA ─── */
        .lotos-cta {
          max-width: 700px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
          text-align: center;
        }
        .lotos-cta__title {
          font-family: var(--lotos-font-display, 'Outfit', sans-serif);
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 1rem;
        }
        .lotos-cta__subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          margin: 0 0 2.5rem;
        }
        .lotos-cta__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ─── Footer ─── */
        .lotos-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem 1.5rem;
        }
        .lotos-footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .lotos-footer__copy {
          color: rgba(255,255,255,0.4);
          font-size: 0.875rem;
          margin: 0;
        }
        .lotos-footer__links {
          display: flex;
          gap: 1.5rem;
        }
        .lotos-footer__links a {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 200ms;
        }
        .lotos-footer__links a:hover { color: rgba(255,255,255,0.8); }

        @media (max-width: 640px) {
          .lotos-nav__links .lotos-nav__link { display: none; }
          .lotos-stats { gap: 1.5rem; }
        }
      `}</style>
    </main>
  );
}
