import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { AuthAction } from '../auth-action';
import { examplesProofPoints, premiumExamples } from './gallery-data';

const toneClass: Record<(typeof premiumExamples)[number]['tone'], string> = {
  teal: 'ex-tone-teal',
  amber: 'ex-tone-amber',
  violet: 'ex-tone-violet',
  rose: 'ex-tone-rose',
  blue: 'ex-tone-blue',
  emerald: 'ex-tone-emerald',
};

export default async function ExamplesPage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;

  return (
    <main className="examples-page">
      <section className="examples-hero">
        <div className="examples-copy">
          <p className="examples-kicker">LotOS UI Examples</p>
          <div className="examples-pill-row" aria-label="Examples signals">
            <span>Built with LotOS UI</span>
            <span>Premium without extra chrome</span>
            <span>Public proof + private upside</span>
          </div>
          <h1>
            What you can build with LotOS UI alone.
            <span>Not just components. Actual product surfaces.</span>
          </h1>
          <p className="examples-lead">
            This page exists to answer the most important product question fast: what does LotOS UI
            feel like when it is used seriously? These are not random widgets. They are premium,
            believable surfaces built from the same system language.
          </p>
          <div className="examples-actions">
            <Link href="/docs/start-here" className="examples-btn examples-btn-primary">Start Here</Link>
            <Link href="/pricing" className="examples-btn examples-btn-ghost">Open Pricing</Link>
            <Link href="/multi-framework" className="examples-btn examples-btn-ghost">Runtime Matrix</Link>
            {signedInEmail ? (
              <Link href="/vault" className="examples-btn examples-btn-ghost">Open Vault</Link>
            ) : (
              <AuthAction mode="signin" callbackUrl="/vault" className="examples-btn examples-btn-ghost">
                Sign In With Google
              </AuthAction>
            )}
          </div>
        </div>

        <aside className="examples-preview">
          <div className="examples-preview-window">
            <div className="examples-window-top">
              <span />
              <span />
              <span />
              <small>LotOS Signature Board</small>
            </div>
            <div className="examples-preview-body">
              <div className="examples-score-row">
                <article>
                  <strong>06</strong>
                  <span>surface types</span>
                </article>
                <article>
                  <strong>01</strong>
                  <span>language system</span>
                </article>
                <article>
                  <strong>Premium</strong>
                  <span>finish target</span>
                </article>
              </div>
              <div className="examples-preview-card">
                <p className="mini-label">Why this page matters</p>
                <h2>Product proof beats abstract promises.</h2>
                <p>
                  A better examples surface makes LotOS UI easier to trust, easier to sell, and
                  much easier to imagine in real teams.
                </p>
              </div>
              <div className="examples-proof-grid">
                {examplesProofPoints.map((point) => (
                  <div key={point} className="examples-proof-chip">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="examples-mosaic">
        {premiumExamples.map((example) => (
          <article key={example.slug} className={`example-card ${toneClass[example.tone]}`}>
            <div className="example-card-top">
              <div>
                <p className="mini-label">{example.category}</p>
                <h2>{example.title}</h2>
                <p className="example-runtime">{example.runtime}</p>
              </div>
              <span className="example-badge">LotOS UI</span>
            </div>

            <p className="example-summary">{example.summary}</p>

            <div className="example-metrics" aria-label={`Metrics for ${example.title}`}>
              {example.metrics.map((metric) => (
                <div key={metric.label} className="example-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="example-shell">
              <div className="example-shell-rail">
                <span>overview</span>
                <span>signals</span>
                <span>actions</span>
              </div>
              <div className="example-shell-main">
                <div className="example-shell-strip" />
                <div className="example-shell-stack">
                  {example.highlights.map((highlight) => (
                    <div key={highlight} className="example-shell-line">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="example-payoff">
              <p className="mini-label">Why it matters</p>
              <p>{example.payoff}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="examples-bottom">
        <article className="examples-bottom-card">
          <p className="mini-label">Use this next</p>
          <h2>Pick the first surface you want the buyer or team to feel.</h2>
          <p>
            Start with the public layer if you need trust. Start with a premium surface if you need
            monetizable differentiation. The point is to build with a product language, not with
            disconnected screens.
          </p>
        </article>
        <article className="examples-bottom-card">
          <p className="mini-label">Suggested order</p>
          <ol>
            <li>Read Start Here.</li>
            <li>Inspect these examples.</li>
            <li>Open the runtime matrix only after the product direction feels clear.</li>
            <li>Use pricing and vault when protected value is actually needed.</li>
          </ol>
        </article>
      </section>

      <style>{`
        .examples-page {
          min-height: 100vh;
          padding: 40px 22px 68px;
          color: #f6fbff;
          background:
            radial-gradient(960px 420px at 8% -6%, rgba(20, 184, 166, 0.18), transparent 46%),
            radial-gradient(780px 420px at 100% 0%, rgba(249, 115, 22, 0.2), transparent 46%),
            linear-gradient(155deg, #07131f 0%, #0d2135 46%, #102944 100%);
          font-family: 'Manrope', 'Segoe UI', sans-serif;
        }
        .examples-hero,
        .examples-mosaic,
        .examples-bottom {
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
        }
        .examples-hero {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
          align-items: start;
        }
        .examples-kicker,
        .mini-label {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 11px;
          font-weight: 800;
          color: #77f0df;
        }
        .examples-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }
        .examples-pill-row span,
        .example-badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 10px;
          border: 1px solid rgba(173, 225, 255, 0.16);
          background: rgba(255, 255, 255, 0.06);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .examples-copy h1 {
          margin: 18px 0 0;
          font-size: clamp(40px, 7vw, 78px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-family: 'Space Grotesk', 'Manrope', sans-serif;
          max-width: 10ch;
        }
        .examples-copy h1 span {
          display: block;
          margin-top: 8px;
          background: linear-gradient(120deg, #6ee7f9, #96a7ff 54%, #f8a1da);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .examples-lead {
          margin: 18px 0 0;
          max-width: 660px;
          color: rgba(233, 244, 255, 0.82);
          font-size: 18px;
          line-height: 1.68;
        }
        .examples-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }
        .examples-btn {
          text-decoration: none;
          border-radius: 999px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 800;
          transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
          border: 1px solid transparent;
        }
        .examples-btn:hover {
          transform: translateY(-1px);
        }
        .examples-btn-primary {
          background: linear-gradient(120deg, #14b8a6, #2563eb);
          color: #fff;
        }
        .examples-btn-ghost {
          background: rgba(255, 255, 255, 0.05);
          color: #edf7ff;
          border-color: rgba(173, 225, 255, 0.14);
        }
        .examples-preview-window,
        .examples-bottom-card,
        .example-card {
          border-radius: 28px;
          border: 1px solid rgba(173, 225, 255, 0.14);
          background: rgba(7, 18, 30, 0.56);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(12px);
        }
        .examples-window-top {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(173, 225, 255, 0.12);
        }
        .examples-window-top span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .examples-window-top span:nth-child(1) { background: #fb7185; }
        .examples-window-top span:nth-child(2) { background: #fbbf24; }
        .examples-window-top span:nth-child(3) { background: #34d399; }
        .examples-window-top small {
          margin-left: auto;
          color: rgba(216, 234, 255, 0.78);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
          font-weight: 800;
        }
        .examples-preview-body {
          display: grid;
          gap: 14px;
          padding: 18px;
        }
        .examples-score-row {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .examples-score-row article,
        .example-metric {
          border-radius: 18px;
          border: 1px solid rgba(173, 225, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          display: grid;
          gap: 4px;
        }
        .examples-score-row strong,
        .example-metric strong {
          font-size: 22px;
          line-height: 1;
          color: #fff;
        }
        .examples-score-row span,
        .example-metric span,
        .example-runtime {
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 11px;
          color: rgba(209, 229, 255, 0.74);
        }
        .examples-preview-card {
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(11, 32, 52, 0.9), rgba(30, 62, 97, 0.74));
          padding: 18px;
        }
        .examples-preview-card h2,
        .example-card h2,
        .examples-bottom-card h2 {
          margin: 8px 0 0;
          font-size: 28px;
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .examples-preview-card p,
        .examples-bottom-card p,
        .example-summary,
        .example-payoff p {
          margin: 10px 0 0;
          color: rgba(229, 242, 255, 0.8);
          line-height: 1.65;
        }
        .examples-proof-grid {
          display: grid;
          gap: 8px;
        }
        .examples-proof-chip {
          border-radius: 14px;
          border: 1px solid rgba(173, 225, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          padding: 10px 12px;
          line-height: 1.55;
          color: rgba(225, 239, 255, 0.84);
        }
        .examples-mosaic {
          margin-top: 22px;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(280px, 1fr));
        }
        .example-card {
          padding: 20px;
          display: grid;
          gap: 16px;
        }
        .example-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: start;
        }
        .example-card h2 {
          font-size: 34px;
        }
        .example-summary {
          margin-top: 0;
        }
        .example-metrics {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .example-shell {
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 10px;
          min-height: 180px;
        }
        .example-shell-rail,
        .example-shell-main {
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.05);
        }
        .example-shell-rail {
          padding: 12px;
          display: grid;
          align-content: start;
          gap: 8px;
        }
        .example-shell-rail span,
        .example-shell-line {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #f1f7ff;
        }
        .example-shell-main {
          padding: 14px;
          display: grid;
          gap: 12px;
          align-content: start;
        }
        .example-shell-strip {
          width: 48%;
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.12));
        }
        .example-shell-stack {
          display: grid;
          gap: 10px;
        }
        .example-payoff {
          border-radius: 18px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }
        .examples-bottom {
          margin-top: 20px;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(260px, 1fr));
        }
        .examples-bottom-card {
          padding: 20px;
        }
        .examples-bottom-card ol {
          margin: 12px 0 0;
          padding-left: 18px;
          color: rgba(229, 242, 255, 0.82);
          line-height: 1.7;
        }
        .ex-tone-teal {
          background:
            radial-gradient(circle at top right, rgba(45, 212, 191, 0.18), transparent 32%),
            linear-gradient(160deg, rgba(7, 18, 30, 0.72), rgba(10, 50, 61, 0.72));
        }
        .ex-tone-amber {
          background:
            radial-gradient(circle at top right, rgba(251, 191, 36, 0.18), transparent 30%),
            linear-gradient(160deg, rgba(22, 16, 9, 0.76), rgba(69, 41, 19, 0.72));
        }
        .ex-tone-violet {
          background:
            radial-gradient(circle at top right, rgba(167, 139, 250, 0.18), transparent 30%),
            linear-gradient(160deg, rgba(14, 10, 28, 0.76), rgba(43, 28, 83, 0.72));
        }
        .ex-tone-rose {
          background:
            radial-gradient(circle at top right, rgba(251, 113, 133, 0.18), transparent 30%),
            linear-gradient(160deg, rgba(26, 10, 18, 0.76), rgba(77, 23, 40, 0.72));
        }
        .ex-tone-blue {
          background:
            radial-gradient(circle at top right, rgba(96, 165, 250, 0.18), transparent 30%),
            linear-gradient(160deg, rgba(8, 18, 35, 0.76), rgba(19, 47, 84, 0.72));
        }
        .ex-tone-emerald {
          background:
            radial-gradient(circle at top right, rgba(74, 222, 128, 0.18), transparent 30%),
            linear-gradient(160deg, rgba(8, 24, 24, 0.76), rgba(19, 72, 56, 0.72));
        }
        @media (max-width: 980px) {
          .examples-hero,
          .examples-mosaic,
          .examples-bottom {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 700px) {
          .examples-page {
            padding: 28px 16px 52px;
          }
          .example-metrics,
          .examples-score-row,
          .example-shell {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
