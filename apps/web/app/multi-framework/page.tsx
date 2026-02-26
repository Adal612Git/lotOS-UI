'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type TrackStatus = 'stable' | 'prototype' | 'alpha' | 'planned';
type ViewMode = 'table' | 'cards';
type StatusFilter = 'all' | TrackStatus;

interface RuntimeTrack {
  runtime: string;
  language: string;
  designStatus: TrackStatus;
  functionalStatus: TrackStatus;
  designOutput: string;
  functionalOutput: string;
  strength: string;
  primaryUse: string;
}

interface DesignDirection {
  id: string;
  name: string;
  summary: string;
  visualDNA: string;
  bestFor: string;
  palette: [string, string, string];
}

const runtimeTracks: RuntimeTrack[] = [
  {
    runtime: 'React',
    language: 'TypeScript / JavaScript',
    designStatus: 'stable',
    functionalStatus: 'stable',
    designOutput: 'Tokens + complete pattern implementation',
    functionalOutput: '@lotosui/claude-arm',
    strength: 'Fastest route to production quality',
    primaryUse: 'SaaS control center and product dashboards',
  },
  {
    runtime: 'Web Components',
    language: 'TypeScript',
    designStatus: 'prototype',
    functionalStatus: 'prototype',
    designOutput: 'Token-aligned primitives',
    functionalOutput: '@lotosui/web-components',
    strength: 'Best interoperability across UI stacks',
    primaryUse: 'Cross-framework feature modules',
  },
  {
    runtime: 'Laravel Blade',
    language: 'PHP',
    designStatus: 'alpha',
    functionalStatus: 'alpha',
    designOutput: 'Blueprint + Blade component shape',
    functionalOutput: 'lotos-laravel skeleton',
    strength: 'Strong server-rendered product foundations',
    primaryUse: 'Admin panels and business control planes',
  },
  {
    runtime: 'Django Templates',
    language: 'Python',
    designStatus: 'alpha',
    functionalStatus: 'planned',
    designOutput: 'Pattern mapping from core runtime hints',
    functionalOutput: 'Adapter pipeline',
    strength: 'Operations-focused UX path',
    primaryUse: 'Backoffice workflows and analytics',
  },
  {
    runtime: 'Flask / Jinja',
    language: 'Python',
    designStatus: 'alpha',
    functionalStatus: 'planned',
    designOutput: 'Lean server-template recipes',
    functionalOutput: 'Adapter pipeline',
    strength: 'Low-overhead integration',
    primaryUse: 'Internal tools and data ops consoles',
  },
  {
    runtime: 'Spring + Thymeleaf',
    language: 'Java',
    designStatus: 'alpha',
    functionalStatus: 'planned',
    designOutput: 'Enterprise section architecture',
    functionalOutput: 'Adapter pipeline',
    strength: 'Audit-friendly design constraints',
    primaryUse: 'Enterprise operations suites',
  },
  {
    runtime: '.NET Razor / Blazor',
    language: 'C# / .NET',
    designStatus: 'alpha',
    functionalStatus: 'planned',
    designOutput: 'Forms + data command pattern map',
    functionalOutput: 'Adapter pipeline',
    strength: 'Business app form ergonomics',
    primaryUse: 'Line-of-business tooling',
  },
  {
    runtime: 'Go + templ',
    language: 'Go',
    designStatus: 'alpha',
    functionalStatus: 'planned',
    designOutput: 'Timeline and incident blueprint mapping',
    functionalOutput: 'Adapter pipeline',
    strength: 'Lightweight runtime + fast server output',
    primaryUse: 'Monitoring and high-load dashboards',
  },
  {
    runtime: 'C + ncurses',
    language: 'C',
    designStatus: 'prototype',
    functionalStatus: 'planned',
    designOutput: 'Terminal token bridge blueprint',
    functionalOutput: 'TUI adapter pipeline',
    strength: 'No-browser operational interface',
    primaryUse: 'Restricted environments and terminals',
  },
  {
    runtime: 'C++ (Qt / ImGui)',
    language: 'C++',
    designStatus: 'prototype',
    functionalStatus: 'planned',
    designOutput: 'Desktop token bridge blueprint',
    functionalOutput: 'Native adapter pipeline',
    strength: 'High-control desktop tooling UX',
    primaryUse: 'Tooling-heavy desktop products',
  },
  {
    runtime: 'Mojo (experimental)',
    language: 'Mojo',
    designStatus: 'prototype',
    functionalStatus: 'planned',
    designOutput: 'Exploratory runtime pattern track',
    functionalOutput: 'Experimental adapter pipeline',
    strength: 'Future-facing compute UX experiments',
    primaryUse: 'Experimental internal prototyping',
  },
];

const designDirections: DesignDirection[] = [
  {
    id: 'operator-grid',
    name: 'Operator Grid',
    summary: 'Dense operational surface with command-first focus.',
    visualDNA: 'tight spacing, status rails, high-contrast controls',
    bestFor: 'Incident rooms and support command desks',
    palette: ['#0e1a2b', '#17bebb', '#ff9f1c'],
  },
  {
    id: 'executive-brief',
    name: 'Executive Brief',
    summary: 'Narrative metric storytelling with decisive hierarchy.',
    visualDNA: 'large KPI moments, controlled whitespace, restrained accents',
    bestFor: 'Leadership dashboards and planning sessions',
    palette: ['#13213c', '#fca311', '#e5e5e5'],
  },
  {
    id: 'craft-studio',
    name: 'Craft Studio',
    summary: 'Creative workflow shell balancing expressiveness and precision.',
    visualDNA: 'modular cards, rich typography contrast, context side panels',
    bestFor: 'Design system workbenches and feature labs',
    palette: ['#1f2041', '#4b3f72', '#ffc857'],
  },
  {
    id: 'minimal-control',
    name: 'Minimal Control',
    summary: 'Calm, highly legible UI for long sessions and low fatigue.',
    visualDNA: 'soft surfaces, strict rhythm, muted semantic layering',
    bestFor: 'Long-horizon planning and data review workflows',
    palette: ['#1d2d44', '#748cab', '#f0ebd8'],
  },
];

const statusLabel: Record<TrackStatus, string> = {
  stable: 'Stable',
  prototype: 'Prototype',
  alpha: 'Alpha',
  planned: 'Planned',
};

const statusOrder: TrackStatus[] = ['stable', 'prototype', 'alpha', 'planned'];

export default function MultiFrameworkPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeDirectionId, setActiveDirectionId] = useState(designDirections[0].id);

  const activeDirection = useMemo(
    () => designDirections.find((item) => item.id === activeDirectionId) ?? designDirections[0],
    [activeDirectionId],
  );

  const filteredTracks = useMemo(() => {
    return runtimeTracks.filter((track) => {
      const searchable = `${track.runtime} ${track.language} ${track.strength} ${track.primaryUse}`.toLowerCase();
      const queryPass = searchable.includes(query.toLowerCase());
      const statusPass = statusFilter === 'all'
        ? true
        : track.designStatus === statusFilter || track.functionalStatus === statusFilter;
      return queryPass && statusPass;
    });
  }, [query, statusFilter]);

  const counts = useMemo(() => {
    const result = { stable: 0, prototype: 0, alpha: 0, planned: 0 };
    for (const track of runtimeTracks) {
      result[track.functionalStatus] += 1;
    }
    return result;
  }, []);

  return (
    <main className="mf-page">
      <section className="mf-hero">
        <p className="mf-kicker">LotOS UI Multi-Runtime Control Room</p>
        <h1>Design richness plus functional execution, runtime by runtime.</h1>
        <p className="mf-sub">
          This surface now works as a product cockpit: explore status, filter ecosystems, compare design directions, and
          move directly into implementation docs.
        </p>

        <div className="mf-actions">
          <Link href="/docs/multi-runtime" className="mf-button mf-button--primary">Open Runtime Guide</Link>
          <Link href="/design-lab" className="mf-button mf-button--ghost">Open Design Lab</Link>
          <Link href="/architecture-map.html" className="mf-button mf-button--ghost">Open Architecture Map</Link>
        </div>
      </section>

      <section className="mf-panel mf-filters">
        <div className="mf-filter-row">
          <label htmlFor="runtime-query">Search runtime, language, or use-case</label>
          <input
            id="runtime-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: Django, desktop, incident, enterprise"
          />
        </div>
        <div className="mf-filter-row">
          <span>Status filter</span>
          <div className="mf-chip-row">
            <button type="button" className={`mf-chip ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
            {statusOrder.map((status) => (
              <button
                key={status}
                type="button"
                className={`mf-chip ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {statusLabel[status]}
              </button>
            ))}
          </div>
        </div>
        <div className="mf-filter-row">
          <span>View mode</span>
          <div className="mf-chip-row">
            <button type="button" className={`mf-chip ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Table</button>
            <button type="button" className={`mf-chip ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>Cards</button>
          </div>
        </div>
      </section>

      <section className="mf-panel mf-stats">
        <article>
          <h3>{runtimeTracks.length}</h3>
          <p>Total runtime tracks</p>
        </article>
        <article>
          <h3>{counts.stable}</h3>
          <p>Functional stable</p>
        </article>
        <article>
          <h3>{counts.prototype}</h3>
          <p>Functional prototype</p>
        </article>
        <article>
          <h3>{counts.alpha}</h3>
          <p>Functional alpha</p>
        </article>
        <article>
          <h3>{counts.planned}</h3>
          <p>Functional planned</p>
        </article>
      </section>

      <section className="mf-panel">
        <div className="mf-section-head">
          <h2>Design Directions</h2>
          <p>Use one direction as visual intent, then map it to runtime implementation constraints.</p>
        </div>
        <div className="mf-direction-grid">
          {designDirections.map((direction) => (
            <button
              type="button"
              key={direction.id}
              onClick={() => setActiveDirectionId(direction.id)}
              className={`mf-direction-card ${activeDirectionId === direction.id ? 'active' : ''}`}
            >
              <div className="mf-direction-swatches">
                {direction.palette.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </div>
              <h3>{direction.name}</h3>
              <p>{direction.summary}</p>
              <small>{direction.bestFor}</small>
            </button>
          ))}
        </div>
        <div className="mf-direction-preview">
          <p><strong>Visual DNA:</strong> {activeDirection.visualDNA}</p>
          <pre>
            <code>{`pattern: ${activeDirection.name}
runtime: choose from matrix
tokens: keep semantic mapping strict
goal: design intent + valid implementation`}</code>
          </pre>
        </div>
      </section>

      <section className="mf-panel">
        <div className="mf-section-head">
          <h2>Runtime Coverage Matrix</h2>
          <p>{filteredTracks.length} track(s) shown after filtering.</p>
        </div>

        {viewMode === 'table' ? (
          <div className="mf-table-wrap">
            <table className="mf-table">
              <thead>
                <tr>
                  <th>Runtime</th>
                  <th>Language</th>
                  <th>Design</th>
                  <th>Functional</th>
                  <th>Strength</th>
                  <th>Primary use</th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track) => (
                  <tr key={track.runtime}>
                    <td>{track.runtime}</td>
                    <td>{track.language}</td>
                    <td><span className={`mf-pill mf-pill--${track.designStatus}`}>{statusLabel[track.designStatus]}</span></td>
                    <td><span className={`mf-pill mf-pill--${track.functionalStatus}`}>{statusLabel[track.functionalStatus]}</span></td>
                    <td>{track.strength}</td>
                    <td>{track.primaryUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mf-runtime-grid">
            {filteredTracks.map((track) => (
              <article className="mf-runtime-card" key={track.runtime}>
                <header>
                  <h3>{track.runtime}</h3>
                  <p>{track.language}</p>
                </header>
                <div className="mf-pill-row">
                  <span className={`mf-pill mf-pill--${track.designStatus}`}>Design: {statusLabel[track.designStatus]}</span>
                  <span className={`mf-pill mf-pill--${track.functionalStatus}`}>Functional: {statusLabel[track.functionalStatus]}</span>
                </div>
                <p><strong>Output:</strong> {track.designOutput}</p>
                <p><strong>Track:</strong> {track.functionalOutput}</p>
                <p><strong>Strength:</strong> {track.strength}</p>
                <p><strong>Best use:</strong> {track.primaryUse}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mf-panel mf-velocity">
        <div className="mf-section-head">
          <h2>Velocity Upgrades Added</h2>
        </div>
        <ul>
          <li>Filterable runtime matrix for faster decision cycles.</li>
          <li>Design direction selector to prevent generic repetitive layouts.</li>
          <li>Status-separated design/functional signals for execution clarity.</li>
          <li>Direct bridge to docs and architecture map from same surface.</li>
        </ul>
      </section>

      <style>{`
        .mf-page {
          --mf-bg-0: #070f1c;
          --mf-bg-1: #10223b;
          --mf-bg-2: #1c3556;
          --mf-text: #ebf5ff;
          --mf-text-sub: #c2d8ef;
          --mf-border: rgba(194, 216, 239, 0.24);
          --mf-card-bg: rgba(7, 15, 28, 0.56);
          --mf-accent-a: #33c1cc;
          --mf-accent-b: #ff8c42;
          --mf-accent-c: #5aa9ff;
          min-height: 100vh;
          margin: 0;
          padding: 42px 20px 64px;
          color: var(--mf-text);
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at 12% -16%, rgba(51, 193, 204, 0.2), transparent 44%),
            radial-gradient(circle at 86% -18%, rgba(255, 140, 66, 0.2), transparent 44%),
            linear-gradient(145deg, var(--mf-bg-0), var(--mf-bg-1) 48%, var(--mf-bg-2));
        }
        .mf-hero,
        .mf-panel {
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
        }
        .mf-kicker {
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 12px;
          color: var(--mf-accent-a);
        }
        .mf-hero h1 {
          margin: 0;
          font-family: 'Space Grotesk', 'Manrope', sans-serif;
          font-size: clamp(34px, 6vw, 62px);
          line-height: 1.03;
          max-width: 980px;
          letter-spacing: -0.02em;
        }
        .mf-sub {
          margin: 14px 0 0;
          max-width: 780px;
          color: var(--mf-text-sub);
          font-size: 18px;
          line-height: 1.6;
        }
        .mf-actions {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .mf-button {
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 13px;
          border: 1px solid transparent;
          transition: transform 170ms ease, border-color 170ms ease, background 170ms ease;
        }
        .mf-button:hover {
          transform: translateY(-1px);
        }
        .mf-button--primary {
          background: linear-gradient(120deg, var(--mf-accent-c), var(--mf-accent-a));
          color: #041321;
        }
        .mf-button--ghost {
          border-color: var(--mf-border);
          color: var(--mf-text);
          background: rgba(7, 15, 28, 0.4);
        }
        .mf-panel {
          margin-top: 16px;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid var(--mf-border);
          background: var(--mf-card-bg);
          backdrop-filter: blur(10px);
          animation: mf-rise 440ms ease both;
        }
        .mf-section-head h2 {
          margin: 0;
          font-size: 24px;
        }
        .mf-section-head p {
          margin: 7px 0 0;
          color: var(--mf-text-sub);
        }
        .mf-filters {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 10px;
        }
        .mf-filter-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mf-filter-row label,
        .mf-filter-row span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--mf-text-sub);
          font-weight: 700;
        }
        .mf-filter-row input {
          border-radius: 10px;
          border: 1px solid rgba(194, 216, 239, 0.24);
          background: rgba(7, 15, 28, 0.66);
          color: var(--mf-text);
          padding: 10px 12px;
          outline: none;
          transition: border-color 170ms ease;
        }
        .mf-filter-row input:focus {
          border-color: rgba(90, 169, 255, 0.8);
        }
        .mf-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .mf-chip {
          border-radius: 999px;
          border: 1px solid rgba(194, 216, 239, 0.24);
          background: rgba(7, 15, 28, 0.5);
          color: var(--mf-text-sub);
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .mf-chip.active {
          color: #06182a;
          border-color: rgba(51, 193, 204, 0.8);
          background: linear-gradient(120deg, rgba(51, 193, 204, 0.95), rgba(90, 169, 255, 0.9));
        }
        .mf-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(120px, 1fr));
          gap: 8px;
        }
        .mf-stats article {
          border-radius: 10px;
          border: 1px solid rgba(194, 216, 239, 0.18);
          background: rgba(7, 15, 28, 0.44);
          padding: 10px;
        }
        .mf-stats h3 {
          margin: 0;
          font-size: 28px;
          line-height: 1;
          color: #83d8ff;
        }
        .mf-stats p {
          margin: 7px 0 0;
          font-size: 12px;
          color: var(--mf-text-sub);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .mf-direction-grid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
        }
        .mf-direction-card {
          text-align: left;
          border-radius: 12px;
          border: 1px solid rgba(194, 216, 239, 0.18);
          background: rgba(7, 15, 28, 0.46);
          color: var(--mf-text);
          padding: 12px;
          cursor: pointer;
          transition: border-color 170ms ease, transform 170ms ease, box-shadow 170ms ease;
        }
        .mf-direction-card:hover {
          transform: translateY(-1px);
          border-color: rgba(90, 169, 255, 0.5);
        }
        .mf-direction-card.active {
          border-color: rgba(51, 193, 204, 0.7);
          box-shadow: 0 0 0 1px rgba(51, 193, 204, 0.35) inset;
        }
        .mf-direction-swatches {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }
        .mf-direction-swatches span {
          width: 26px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }
        .mf-direction-card h3 {
          margin: 0;
          font-size: 17px;
        }
        .mf-direction-card p {
          margin: 7px 0 0;
          font-size: 13px;
          color: var(--mf-text-sub);
          line-height: 1.5;
        }
        .mf-direction-card small {
          margin-top: 8px;
          display: block;
          color: #9cd0ff;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .mf-direction-preview {
          margin-top: 10px;
          border-radius: 12px;
          border: 1px solid rgba(194, 216, 239, 0.16);
          background: rgba(7, 15, 28, 0.45);
          padding: 12px;
        }
        .mf-direction-preview p {
          margin: 0 0 8px;
          color: var(--mf-text-sub);
        }
        .mf-direction-preview pre {
          margin: 0;
          padding: 10px;
          border-radius: 10px;
          background: rgba(7, 15, 28, 0.7);
          border: 1px solid rgba(194, 216, 239, 0.14);
          font-family: 'JetBrains Mono', 'Cascadia Mono', monospace;
          font-size: 12px;
          line-height: 1.5;
          color: #cce5ff;
          overflow: auto;
        }
        .mf-table-wrap {
          overflow: auto;
          margin-top: 12px;
        }
        .mf-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
        }
        .mf-table th,
        .mf-table td {
          text-align: left;
          border-bottom: 1px solid rgba(194, 216, 239, 0.12);
          padding: 10px;
          vertical-align: top;
          font-size: 13px;
        }
        .mf-table th {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--mf-text-sub);
        }
        .mf-runtime-grid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 9px;
        }
        .mf-runtime-card {
          border: 1px solid rgba(194, 216, 239, 0.16);
          border-radius: 12px;
          background: rgba(7, 15, 28, 0.46);
          padding: 12px;
        }
        .mf-runtime-card header h3 {
          margin: 0;
          font-size: 19px;
        }
        .mf-runtime-card header p {
          margin: 3px 0 0;
          color: var(--mf-text-sub);
          font-size: 13px;
        }
        .mf-runtime-card p {
          margin: 7px 0 0;
          color: #d8e9fb;
          line-height: 1.5;
          font-size: 13px;
        }
        .mf-pill-row {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .mf-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid transparent;
          width: fit-content;
        }
        .mf-pill--stable {
          background: rgba(51, 193, 204, 0.2);
          border-color: rgba(51, 193, 204, 0.42);
          color: #8ce6ee;
        }
        .mf-pill--prototype {
          background: rgba(90, 169, 255, 0.2);
          border-color: rgba(90, 169, 255, 0.44);
          color: #c3deff;
        }
        .mf-pill--alpha {
          background: rgba(255, 140, 66, 0.2);
          border-color: rgba(255, 140, 66, 0.44);
          color: #ffd2b5;
        }
        .mf-pill--planned {
          background: rgba(194, 216, 239, 0.18);
          border-color: rgba(194, 216, 239, 0.32);
          color: #dceaff;
        }
        .mf-velocity ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #dbe9fb;
          line-height: 1.62;
        }
        .mf-velocity li + li {
          margin-top: 7px;
        }
        @keyframes mf-rise {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 980px) {
          .mf-filters {
            grid-template-columns: 1fr;
          }
          .mf-stats {
            grid-template-columns: repeat(2, minmax(120px, 1fr));
          }
        }
        @media (max-width: 680px) {
          .mf-page {
            padding-top: 28px;
          }
          .mf-sub {
            font-size: 16px;
          }
          .mf-section-head h2 {
            font-size: 21px;
          }
        }
      `}</style>
    </main>
  );
}
