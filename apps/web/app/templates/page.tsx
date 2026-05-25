import Link from 'next/link';
import { lotosManifest } from '@lotosui/registry';
import { buildRouteMetadata } from '../../lib/seo';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Template Gallery',
  description: 'Registry-governed product templates with tiers, runtimes, AI prompts, and deploy checklists.',
  path: '/templates',
});

const tiers = Array.from(new Set(lotosManifest.templates.map((template) => template.tier)));
const industries = Array.from(new Set(lotosManifest.templates.flatMap((template) => template.industry))).sort();
const implemented = lotosManifest.templates.filter((template) => template.previewRoute);
const planned = lotosManifest.templates.filter((template) => !template.previewRoute);

function maturityClass(maturity: string) {
  return `template-pill template-pill--${maturity.replace('_', '-')}`;
}

export default function TemplateGalleryPage() {
  return (
    <main className="template-page">
      <header className="template-top">
        <Link href="/">LotOS UI</Link>
        <nav>
          <Link href="/ai">AI Console</Link>
          <Link href="/multi-framework">Runtimes</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="template-hero">
        <div>
          <p className="template-kicker">Registry template matrix</p>
          <h1>Industry kits that agents can read, generate, and verify.</h1>
          <p>
            Every template is governed by the registry with tier, maturity, runtimes, included components,
            install command, AI prompt, and deploy checklist. Planned templates stay marked as planned until
            previews and tests exist.
          </p>
        </div>
        <aside>
          <strong>{lotosManifest.templates.length}</strong>
          <span>templates registered</span>
          <p>{implemented.length} have preview routes. {planned.length} are roadmap-ready stubs.</p>
        </aside>
      </section>

      <section className="template-filters" aria-label="Template filters">
        <div>
          <span>Tiers</span>
          <p>{tiers.join(' / ')}</p>
        </div>
        <div>
          <span>Industries</span>
          <p>{industries.slice(0, 12).join(' / ')}</p>
        </div>
        <div>
          <span>CLI</span>
          <code>pnpm --filter @lotosui/cli exec lotos-ui templates</code>
        </div>
      </section>

      <section className="template-grid" aria-label="Template cards">
        {lotosManifest.templates.map((template) => (
          <article key={template.id} className="template-card">
            <div>
              <div className="template-card-head">
                <span className="template-tier">{template.tier}</span>
                <span className={maturityClass(template.maturity)}>{template.maturity}</span>
              </div>
              <h2>{template.name}</h2>
              <p>{template.description}</p>
            </div>

            <div className="template-meta">
              <div>
                <span>Runtimes</span>
                <p>{template.runtimes.join(' / ')}</p>
              </div>
              <div>
                <span>Components</span>
                <p>{template.includedComponents.join(' / ')}</p>
              </div>
              <div>
                <span>Deploy</span>
                <ul>
                  {template.deployChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="template-command">
              <code>{template.installCommand}</code>
            </div>

            <div className="template-prompt">
              <span>AI prompt</span>
              <p>{template.aiPrompt}</p>
            </div>

            <div className="template-actions">
              {template.previewRoute ? (
                <Link href={template.previewRoute}>Open preview</Link>
              ) : (
                <span>Preview planned</span>
              )}
              <code>{template.id}</code>
            </div>
          </article>
        ))}
      </section>

      <style>{`
        .template-page {
          min-height: 100vh;
          padding: 24px 20px 64px;
          color: #16231f;
          background:
            linear-gradient(90deg, rgba(50, 78, 89, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(11, 107, 91, 0.07) 1px, transparent 1px),
            linear-gradient(145deg, #f8fbf8, #edf6f2 52%, #fff5df);
          background-size: 34px 34px, 34px 34px, auto;
        }
        .template-top,
        .template-hero,
        .template-filters,
        .template-grid {
          max-width: 1240px;
          margin: 0 auto;
        }
        .template-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
        }
        .template-top a {
          color: #16231f;
          text-decoration: none;
          font-weight: 900;
        }
        .template-top nav {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .template-top nav a {
          color: #36514b;
          font-size: 14px;
        }
        .template-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 290px;
          gap: 18px;
          align-items: stretch;
          margin-top: 44px;
        }
        .template-kicker {
          margin: 0 0 10px;
          color: #087f6f;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
        }
        .template-hero h1 {
          max-width: 860px;
          margin: 0;
          font-size: 58px;
          line-height: 1;
          letter-spacing: 0;
        }
        .template-hero p {
          max-width: 780px;
          margin: 18px 0 0;
          color: #41564f;
          font-size: 18px;
          line-height: 1.58;
        }
        .template-hero aside,
        .template-filters > div,
        .template-card {
          border: 1px solid rgba(22, 35, 31, 0.14);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 18px 42px rgba(40, 55, 50, 0.1);
        }
        .template-hero aside {
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .template-hero aside strong {
          color: #a35b00;
          font-size: 68px;
          line-height: 0.9;
        }
        .template-hero aside span {
          margin-top: 10px;
          font-weight: 900;
        }
        .template-hero aside p {
          margin-top: 8px;
          font-size: 14px;
        }
        .template-filters {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
          margin-top: 20px;
        }
        .template-filters > div {
          padding: 14px;
        }
        .template-filters span,
        .template-meta span,
        .template-prompt span {
          display: block;
          margin-bottom: 6px;
          color: #087f6f;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
        }
        .template-filters p,
        .template-meta p,
        .template-prompt p {
          margin: 0;
          color: #40554f;
          font-size: 13px;
          line-height: 1.45;
        }
        .template-filters code,
        .template-command code,
        .template-actions code {
          display: block;
          border: 1px solid rgba(11, 107, 91, 0.18);
          border-radius: 8px;
          background: rgba(11, 107, 91, 0.08);
          color: #0b4f45;
          padding: 8px 9px;
          font-size: 12px;
          overflow-wrap: anywhere;
        }
        .template-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 14px;
        }
        .template-card {
          min-height: 520px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }
        .template-card-head,
        .template-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .template-card h2 {
          margin: 14px 0 0;
          font-size: 24px;
          line-height: 1.12;
          letter-spacing: 0;
        }
        .template-card > div > p {
          margin: 10px 0 0;
          color: #40554f;
          line-height: 1.48;
        }
        .template-tier,
        .template-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 8px;
          color: #1f2937;
          background: #e5e7eb;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .template-tier {
          color: #573804;
          background: rgba(242, 181, 68, 0.2);
        }
        .template-pill--stable {
          color: #064e3b;
          background: #d1fae5;
        }
        .template-pill--prototype {
          color: #713f12;
          background: #fef3c7;
        }
        .template-pill--planned {
          color: #334155;
          background: #e2e8f0;
        }
        .template-meta {
          display: grid;
          gap: 10px;
        }
        .template-meta ul {
          margin: 0;
          padding-left: 18px;
          color: #40554f;
          font-size: 13px;
          line-height: 1.45;
        }
        .template-prompt {
          border-left: 3px solid #f2b544;
          padding-left: 10px;
        }
        .template-actions a,
        .template-actions > span {
          border-radius: 8px;
          border: 1px solid rgba(20, 33, 31, 0.16);
          padding: 9px 10px;
          color: #ffffff;
          background: #0b6b5b;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }
        .template-actions > span {
          color: #334155;
          background: #e2e8f0;
        }
        @media (max-width: 1100px) {
          .template-grid,
          .template-filters {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 820px) {
          .template-page {
            padding-inline: 14px;
          }
          .template-top,
          .template-card-head,
          .template-actions {
            align-items: flex-start;
          }
          .template-top,
          .template-hero,
          .template-grid,
          .template-filters {
            grid-template-columns: 1fr;
          }
          .template-hero h1 {
            font-size: 40px;
          }
          .template-top {
            display: grid;
          }
        }
      `}</style>
    </main>
  );
}
