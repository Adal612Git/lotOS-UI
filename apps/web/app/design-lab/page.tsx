'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type LabMode = 'dashboard' | 'editorial' | 'operator' | 'minimal';

interface LabPreset {
  id: LabMode;
  name: string;
  headline: string;
  tone: string;
  typography: string;
  layout: string;
  notes: string;
  palette: [string, string, string, string];
}

const presets: LabPreset[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Bold',
    headline: 'High-contrast command center for fast product decisions.',
    tone: 'Direct, energetic, data-forward.',
    typography: 'Space Grotesk + Manrope',
    layout: 'Left rail, dense metric strip, action-focused center canvas',
    notes: 'Use for feature management and growth analytics.',
    palette: ['#0b132b', '#5bc0be', '#fca311', '#ffffff'],
  },
  {
    id: 'editorial',
    name: 'Editorial Narrative',
    headline: 'Story-first surface for strategy and executive communication.',
    tone: 'Calm, premium, narrative.',
    typography: 'Fraunces + Inter',
    layout: 'Long-form blocks with metric callouts and decisive CTA moments',
    notes: 'Use for quarterly reviews and business narratives.',
    palette: ['#1d3557', '#f1faee', '#e63946', '#a8dadc'],
  },
  {
    id: 'operator',
    name: 'Operator Grid',
    headline: 'Operational rhythm optimized for triage and response velocity.',
    tone: 'Utility-first, reliable, no-noise.',
    typography: 'IBM Plex Sans + IBM Plex Mono',
    layout: 'Compact cards, segmented controls, timeline + incident rail',
    notes: 'Use for support desks and incident management.',
    palette: ['#0f172a', '#22d3ee', '#f97316', '#cbd5e1'],
  },
  {
    id: 'minimal',
    name: 'Minimal Focus',
    headline: 'Reduced visual load for long working sessions and planning.',
    tone: 'Quiet, clear, deliberate.',
    typography: 'Sora + Inter',
    layout: 'Wide whitespace, restrained color accents, clear vertical flow',
    notes: 'Use for planning, backlog grooming, and content-heavy UIs.',
    palette: ['#1b263b', '#415a77', '#e0e1dd', '#778da9'],
  },
];

const defaultPreset = presets[0]!;

const uiBlocks = [
  { title: 'Hero direction', detail: 'Primary intent and brand motion' },
  { title: 'Data rhythm', detail: 'Table, chart, and signal density' },
  { title: 'Action hierarchy', detail: 'Primary, secondary, and destructive logic' },
  { title: 'Feedback states', detail: 'Loading, warning, and success tone system' },
];

export default function DesignLabPage() {
  const [mode, setMode] = useState<LabMode>('dashboard');
  const active = useMemo(() => presets.find((item) => item.id === mode) ?? defaultPreset, [mode]);

  return (
    <main className="lab-page">
      <section className="lab-hero">
        <p className="lab-kicker">LotOS UI Design Lab</p>
        <h1>More visual variety, stronger product identity, still fully functional.</h1>
        <p>
          This lab gives teams concrete design directions that remain compatible with runtime constraints and MCP-driven
          implementation. Pick a direction, then ship it through the runtime matrix.
        </p>
        <div className="lab-links">
          <Link href="/multi-framework" className="lab-btn lab-btn-primary">Back to Runtime Matrix</Link>
          <Link href="/docs/multi-runtime" className="lab-btn lab-btn-ghost">Open Docs Guide</Link>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-mode-row">
          {presets.map((preset) => (
            <button
              type="button"
              key={preset.id}
              className={`lab-mode ${mode === preset.id ? 'active' : ''}`}
              onClick={() => setMode(preset.id)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </section>

      <section className="lab-panel lab-preview">
        <article>
          <h2>{active.name}</h2>
          <p>{active.headline}</p>
          <ul>
            <li><strong>Tone:</strong> {active.tone}</li>
            <li><strong>Typography:</strong> {active.typography}</li>
            <li><strong>Layout:</strong> {active.layout}</li>
            <li><strong>Best use:</strong> {active.notes}</li>
          </ul>
        </article>
        <article className="lab-palette">
          <h3>Palette</h3>
          <div className="swatches">
            {active.palette.map((color) => (
              <div key={color} className="swatch" style={{ background: color }}>
                <span>{color}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="lab-panel">
        <div className="lab-grid">
          {uiBlocks.map((block, index) => (
            <article key={block.title} className={`lab-card lab-card-${index + 1}`}>
              <h3>{block.title}</h3>
              <p>{block.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-panel">
        <h2>Speed and quality upgrades</h2>
        <ul className="lab-checklist">
          <li>Render optimization in demo UI with memoized subcomponents and computed lists.</li>
          <li>Runtime matrix upgraded with filter/search tools for faster decision flow.</li>
          <li>Architecture map synced across source and public routes for consistent guidance.</li>
          <li>Build fallback supports constrained Windows environments while preserving core validation.</li>
        </ul>
      </section>

      <style>{`
        .lab-page {
          min-height: 100vh;
          margin: 0;
          padding: 42px 20px 64px;
          color: #f2f7ff;
          font-family: 'Manrope', 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at 14% -12%, rgba(94, 234, 212, 0.18), transparent 40%),
            radial-gradient(circle at 86% -18%, rgba(249, 115, 22, 0.2), transparent 46%),
            linear-gradient(145deg, #091324, #132743 48%, #21436d);
        }
        .lab-hero,
        .lab-panel {
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }
        .lab-kicker {
          margin: 0 0 9px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #5eead4;
          font-weight: 700;
        }
        .lab-hero h1 {
          margin: 0;
          max-width: 900px;
          font-size: clamp(34px, 6vw, 62px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          font-family: 'Space Grotesk', 'Manrope', sans-serif;
        }
        .lab-hero p {
          margin: 14px 0 0;
          max-width: 780px;
          line-height: 1.62;
          color: #c9dcf3;
          font-size: 18px;
        }
        .lab-links {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .lab-btn {
          text-decoration: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 800;
          border: 1px solid transparent;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }
        .lab-btn:hover {
          transform: translateY(-1px);
        }
        .lab-btn-primary {
          background: linear-gradient(120deg, #22d3ee, #60a5fa);
          color: #031325;
        }
        .lab-btn-ghost {
          border-color: rgba(201, 220, 243, 0.24);
          color: #edf5ff;
          background: rgba(9, 19, 36, 0.46);
        }
        .lab-panel {
          margin-top: 16px;
          border-radius: 14px;
          border: 1px solid rgba(201, 220, 243, 0.24);
          background: rgba(9, 19, 36, 0.54);
          backdrop-filter: blur(10px);
          padding: 16px;
        }
        .lab-mode-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .lab-mode {
          border-radius: 999px;
          border: 1px solid rgba(201, 220, 243, 0.24);
          background: rgba(9, 19, 36, 0.48);
          color: #d4e4f8;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .lab-mode.active {
          color: #041426;
          border-color: rgba(94, 234, 212, 0.8);
          background: linear-gradient(120deg, rgba(94, 234, 212, 0.96), rgba(96, 165, 250, 0.92));
        }
        .lab-preview {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 10px;
        }
        .lab-preview h2 {
          margin: 0;
          font-size: 30px;
        }
        .lab-preview p {
          margin: 9px 0 0;
          line-height: 1.6;
          color: #d4e4f8;
        }
        .lab-preview ul {
          margin: 12px 0 0;
          padding-left: 18px;
          line-height: 1.65;
          color: #dbe9fa;
        }
        .lab-palette h3 {
          margin: 0;
          font-size: 20px;
        }
        .swatches {
          margin-top: 10px;
          display: grid;
          gap: 7px;
        }
        .swatch {
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
        }
        .swatch span {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.92);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
        }
        .lab-card {
          border-radius: 12px;
          border: 1px solid rgba(201, 220, 243, 0.2);
          padding: 12px;
          min-height: 120px;
        }
        .lab-card h3 {
          margin: 0;
          font-size: 18px;
        }
        .lab-card p {
          margin: 8px 0 0;
          color: #d4e4f8;
          line-height: 1.55;
        }
        .lab-card-1 { background: linear-gradient(145deg, rgba(12, 26, 50, 0.85), rgba(40, 63, 104, 0.65)); }
        .lab-card-2 { background: linear-gradient(145deg, rgba(18, 44, 56, 0.82), rgba(30, 96, 101, 0.62)); }
        .lab-card-3 { background: linear-gradient(145deg, rgba(58, 36, 22, 0.82), rgba(110, 70, 39, 0.62)); }
        .lab-card-4 { background: linear-gradient(145deg, rgba(37, 31, 62, 0.82), rgba(72, 58, 118, 0.62)); }
        .lab-panel h2 {
          margin: 0;
          font-size: 24px;
        }
        .lab-checklist {
          margin: 10px 0 0;
          padding-left: 18px;
          line-height: 1.65;
          color: #dceafa;
        }
        .lab-checklist li + li {
          margin-top: 7px;
        }
        @media (max-width: 880px) {
          .lab-preview {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .lab-page {
            padding-top: 28px;
          }
          .lab-hero p {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
