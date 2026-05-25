import Link from 'next/link';
import { lotosManifest } from '@lotosui/registry';
import { buildRouteMetadata } from '../../lib/seo';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI AI Console',
  description: 'Agent-ready project map, MCP tools, templates, runtimes, release readiness, and validation commands for LotOS UI.',
  path: '/ai',
});

const contextFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.ai/lotos.project-map.json',
  '.ai/lotos.components.json',
  '.ai/lotos.templates.json',
  '.ai/lotos.runtimes.json',
  '.ai/lotos.release-readiness.json',
  'packages/registry/src/lotos.manifest.ts',
];

const componentsByTier = {
  free: lotosManifest.components.filter((entry) => entry.tier === 'free'),
  pro: lotosManifest.components.filter((entry) => entry.tier === 'pro'),
};

const runtimeCounts = {
  stable: lotosManifest.runtimes.filter((entry) => entry.maturity === 'stable').length,
  alpha: lotosManifest.runtimes.filter((entry) => entry.maturity === 'alpha').length,
  prototype: lotosManifest.runtimes.filter((entry) => entry.maturity === 'prototype').length,
  planned: lotosManifest.runtimes.filter((entry) => entry.maturity === 'planned').length,
};

const agentRuntimes = lotosManifest.runtimes.filter((entry) => entry.category === 'agent');
const featuredTemplates = lotosManifest.templates.slice(0, 10);
const visibleThemes = lotosManifest.themes.slice(0, 6);
const promptCards = lotosManifest.templates.slice(0, 6);

function maturityClass(maturity: string) {
  return `ai-pill ai-pill--${maturity.replace('_', '-')}`;
}

export default function AiControlLayerPage() {
  return (
    <main className="ai-page">
      <section className="ai-hero">
        <div>
          <p className="ai-kicker">LotOS UI 2.0</p>
          <h1>AI console for the universal UI platform.</h1>
          <p className="ai-lead">
            A registry-governed control surface for Codex, Claude Code, Gemini, and future agents:
            templates, runtimes, MCP tools, commercial boundaries, release readiness, and prompts.
          </p>
          <div className="ai-actions">
            <Link href="/templates">Template Gallery</Link>
            <Link href="/multi-framework">Runtime Matrix</Link>
            <Link href="/design-lab">Theme Lab</Link>
            <Link href="/architecture-map.html">Architecture Map</Link>
          </div>
        </div>
        <aside className="ai-readiness" aria-label="Release readiness">
          <span>{lotosManifest.releaseReadiness.score}</span>
          <strong>{lotosManifest.releaseReadiness.status}</strong>
          <p>Release readiness score from the registry. Blockers stay visible until humans resolve accounts, secrets, legal data, and premium storage.</p>
        </aside>
      </section>

      <section className="ai-dashboard" aria-label="Registry metrics">
        <article>
          <span>{lotosManifest.components.length}</span>
          <strong>component contracts</strong>
          <p>{componentsByTier.free.length} free, {componentsByTier.pro.length} pro</p>
        </article>
        <article>
          <span>{lotosManifest.templates.length}</span>
          <strong>industry templates</strong>
          <p>Each with tier, runtimes, prompt, and deploy checklist</p>
        </article>
        <article>
          <span>{lotosManifest.runtimes.length}</span>
          <strong>runtime targets</strong>
          <p>{runtimeCounts.stable} stable, {runtimeCounts.alpha} alpha, {runtimeCounts.prototype} prototype, {runtimeCounts.planned} planned</p>
        </article>
        <article>
          <span>{lotosManifest.mcpTools.length}</span>
          <strong>MCP tools</strong>
          <p>Registry-backed facts for agent planning and generation</p>
        </article>
      </section>

      <section className="ai-grid">
        <article className="ai-panel ai-panel--wide">
          <div className="ai-panel-head">
            <div>
              <p className="ai-label">Agent context</p>
              <h2>Read these before scanning the repo.</h2>
            </div>
            <Link href="/architecture-map.html">Open map</Link>
          </div>
          <div className="ai-code-grid">
            {contextFiles.map((file) => (
              <code key={file}>{file}</code>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">MCP explorer</p>
          <h2>Tools an agent can call.</h2>
          <div className="ai-tool-list">
            {lotosManifest.mcpTools.map((tool) => (
              <div key={tool.id} className="ai-tool-row">
                <code>{tool.endpoint}</code>
                <span className={maturityClass(tool.maturity)}>{tool.maturity}</span>
                <p>{tool.purpose}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">Release readiness</p>
          <h2>What still blocks go-live.</h2>
          <div className="ai-success-list">
            <span>Wide sales: {lotosManifest.releaseReadiness.lifecycleValidation.wide_sales_ready ? 'ready' : 'blocked'}</span>
            <span>Supabase remote: {lotosManifest.releaseReadiness.lifecycleValidation.supabase_remote_validated ? 'validated' : 'pending'}</span>
            <span>Lemon remote: {lotosManifest.releaseReadiness.lifecycleValidation.lemon_remote_validated ? 'validated' : 'pending'}</span>
          </div>
          <ul className="ai-clean-list">
            {lotosManifest.releaseReadiness.blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
          <div className="ai-success-list">
            {lotosManifest.releaseReadiness.passingSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </article>

        <article className="ai-panel ai-panel--wide">
          <div className="ai-panel-head">
            <div>
              <p className="ai-label">Template gallery</p>
              <h2>Product kits with AI prompts and deploy metadata.</h2>
            </div>
            <Link href="/templates">View all</Link>
          </div>
          <div className="ai-template-grid">
            {featuredTemplates.map((template) => (
              <article key={template.id} className="ai-template-card">
                <div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
                <div className="ai-chip-row">
                  <span className="ai-chip">{template.tier}</span>
                  <span className={maturityClass(template.maturity)}>{template.maturity}</span>
                </div>
                <div className="ai-mini-line">{template.runtimes.join(' / ')}</div>
              </article>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">Runtime matrix</p>
          <h2>Honest support by maturity.</h2>
          <div className="ai-runtime-stack">
            {lotosManifest.runtimes.slice(0, 14).map((runtime) => (
              <div key={runtime.id} className="ai-runtime-row">
                <div>
                  <strong>{runtime.label}</strong>
                  <p>{runtime.category} / {runtime.language}</p>
                </div>
                <span className={maturityClass(runtime.maturity)}>{runtime.maturity}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">Agent runtimes</p>
          <h2>Where AI workflows plug in.</h2>
          <div className="ai-agent-flow">
            {agentRuntimes.map((runtime, index) => (
              <div key={runtime.id} className="ai-flow-step">
                <span>{index + 1}</span>
                <div>
                  <strong>{runtime.label}</strong>
                  <p>{runtime.agentGuidance}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">Theme catalog</p>
          <h2>Visual modes for generated products.</h2>
          <div className="ai-theme-stack">
            {visibleThemes.map((theme) => (
              <div key={theme.id} className="ai-theme-row">
                <div className="ai-swatches" aria-hidden="true">
                  <span style={{ background: theme.tokens.bg }} />
                  <span style={{ background: theme.tokens.accent }} />
                  <span style={{ background: theme.tokens.accentAlt }} />
                </div>
                <div>
                  <strong>{theme.name}</strong>
                  <p>{theme.bestFor.join(' / ')}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel">
          <p className="ai-label">Prompt library</p>
          <h2>Golden starts for generation.</h2>
          <div className="ai-prompt-stack">
            {promptCards.map((template) => (
              <div key={template.id} className="ai-prompt-card">
                <strong>{template.name}</strong>
                <code>{template.aiPrompt}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="ai-panel ai-panel--wide">
          <p className="ai-label">Validation commands</p>
          <h2>The checks agents must keep green.</h2>
          <div className="ai-code-grid">
            {lotosManifest.validation.map((command) => (
              <code key={command}>{command}</code>
            ))}
          </div>
        </article>

        <article className="ai-panel ai-panel--wide">
          <p className="ai-label">Commercial guardrails</p>
          <h2>Rules that keep the product sellable.</h2>
          <div className="ai-rules">
            {lotosManifest.aiRules.map((rule) => (
              <span key={rule}>{rule}</span>
            ))}
          </div>
        </article>
      </section>

      <style>{`
        .ai-page {
          min-height: 100vh;
          padding: 34px 20px 64px;
          color: #14211f;
          background:
            linear-gradient(90deg, rgba(11, 107, 91, 0.08) 1px, transparent 1px),
            linear-gradient(180deg, rgba(50, 78, 89, 0.07) 1px, transparent 1px),
            linear-gradient(140deg, #f7fbf8, #eef5f2 54%, #fbf0d6);
          background-size: 36px 36px, 36px 36px, auto;
        }
        .ai-hero,
        .ai-dashboard,
        .ai-grid {
          max-width: 1220px;
          margin: 0 auto;
        }
        .ai-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 18px;
          align-items: stretch;
        }
        .ai-kicker,
        .ai-label {
          margin: 0 0 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          color: #087f6f;
        }
        .ai-hero h1 {
          max-width: 880px;
          margin: 0;
          font-size: 64px;
          line-height: 0.98;
          letter-spacing: 0;
        }
        .ai-lead {
          max-width: 790px;
          margin: 18px 0 0;
          color: #40554f;
          font-size: 18px;
          line-height: 1.58;
        }
        .ai-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }
        .ai-actions a,
        .ai-panel-head a {
          color: #ffffff;
          background: #0b6b5b;
          border: 1px solid rgba(19, 32, 30, 0.12);
          border-radius: 8px;
          padding: 10px 13px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }
        .ai-actions a:nth-child(2) {
          background: #324e59;
        }
        .ai-actions a:nth-child(3) {
          background: #f2b544;
          color: #201704;
        }
        .ai-actions a:nth-child(4),
        .ai-panel-head a {
          background: transparent;
          color: #14211f;
          border-color: rgba(20, 33, 31, 0.22);
        }
        .ai-readiness,
        .ai-dashboard article,
        .ai-panel {
          border: 1px solid rgba(19, 32, 30, 0.14);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 18px 42px rgba(40, 55, 50, 0.12);
          backdrop-filter: blur(14px);
          border-radius: 8px;
        }
        .ai-readiness {
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .ai-readiness span {
          font-size: 76px;
          line-height: 0.9;
          color: #a35b00;
          font-weight: 950;
        }
        .ai-readiness strong {
          margin-top: 10px;
          font-size: 18px;
          text-transform: capitalize;
        }
        .ai-readiness p,
        .ai-dashboard p,
        .ai-panel p {
          margin: 8px 0 0;
          color: #40554f;
          line-height: 1.5;
        }
        .ai-dashboard {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }
        .ai-dashboard article {
          padding: 16px;
        }
        .ai-dashboard span {
          display: block;
          color: #0b6b5b;
          font-size: 38px;
          line-height: 1;
          font-weight: 950;
        }
        .ai-dashboard strong {
          display: block;
          margin-top: 8px;
          font-size: 14px;
        }
        .ai-dashboard p {
          font-size: 13px;
        }
        .ai-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 14px;
        }
        .ai-panel {
          padding: 18px;
        }
        .ai-panel--wide {
          grid-column: 1 / -1;
        }
        .ai-panel h2 {
          margin: 0;
          font-size: 24px;
          line-height: 1.16;
          letter-spacing: 0;
        }
        .ai-panel h3 {
          margin: 0;
          font-size: 17px;
          letter-spacing: 0;
        }
        .ai-panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .ai-code-grid,
        .ai-rules,
        .ai-template-grid {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }
        .ai-code-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .ai-code-grid code,
        .ai-tool-row code,
        .ai-prompt-card code {
          border-radius: 8px;
          border: 1px solid rgba(11, 107, 91, 0.18);
          background: rgba(11, 107, 91, 0.08);
          color: #0b4f45;
          padding: 8px 9px;
          font-size: 12px;
          overflow-wrap: anywhere;
        }
        .ai-tool-list,
        .ai-runtime-stack,
        .ai-agent-flow,
        .ai-theme-stack,
        .ai-prompt-stack {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }
        .ai-tool-row,
        .ai-runtime-row,
        .ai-flow-step,
        .ai-theme-row,
        .ai-prompt-card,
        .ai-template-card {
          border: 1px solid rgba(20, 33, 31, 0.12);
          background: #ffffff;
          border-radius: 8px;
          padding: 12px;
        }
        .ai-tool-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
        }
        .ai-tool-row p {
          grid-column: 1 / -1;
          font-size: 13px;
        }
        .ai-pill,
        .ai-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          color: #1f2937;
          background: #e5e7eb;
        }
        .ai-pill--stable {
          color: #064e3b;
          background: #d1fae5;
        }
        .ai-pill--alpha,
        .ai-pill--prototype {
          color: #713f12;
          background: #fef3c7;
        }
        .ai-pill--planned {
          color: #334155;
          background: #e2e8f0;
        }
        .ai-template-grid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .ai-template-card {
          min-height: 184px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .ai-template-card p,
        .ai-mini-line {
          font-size: 13px;
        }
        .ai-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }
        .ai-mini-line {
          margin-top: 10px;
          color: #58706a;
          overflow-wrap: anywhere;
        }
        .ai-runtime-row,
        .ai-flow-step,
        .ai-theme-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .ai-runtime-row p,
        .ai-flow-step p,
        .ai-theme-row p {
          font-size: 13px;
        }
        .ai-flow-step {
          justify-content: flex-start;
        }
        .ai-flow-step > span {
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #ffffff;
          background: #324e59;
          font-weight: 900;
          font-size: 12px;
        }
        .ai-swatches {
          display: flex;
          gap: 4px;
          flex: 0 0 auto;
        }
        .ai-swatches span {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid rgba(20, 33, 31, 0.18);
        }
        .ai-clean-list {
          margin: 14px 0 0;
          padding-left: 18px;
          color: #314944;
          line-height: 1.65;
        }
        .ai-success-list,
        .ai-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        .ai-success-list span,
        .ai-rules span {
          border-radius: 8px;
          border: 1px solid rgba(11, 107, 91, 0.18);
          background: rgba(11, 107, 91, 0.08);
          color: #0b4f45;
          padding: 7px 9px;
          font-size: 12px;
        }
        .ai-rules span {
          border-color: rgba(178, 107, 0, 0.22);
          background: rgba(242, 181, 68, 0.16);
          color: #573804;
        }
        .ai-prompt-card {
          display: grid;
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .ai-dashboard,
          .ai-template-grid,
          .ai-code-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 820px) {
          .ai-page {
            padding-inline: 14px;
          }
          .ai-hero,
          .ai-grid,
          .ai-dashboard,
          .ai-template-grid,
          .ai-code-grid {
            grid-template-columns: 1fr;
          }
          .ai-hero h1 {
            font-size: 42px;
          }
          .ai-panel-head {
            display: grid;
          }
          .ai-readiness {
            min-height: 220px;
          }
        }
      `}</style>
    </main>
  );
}
