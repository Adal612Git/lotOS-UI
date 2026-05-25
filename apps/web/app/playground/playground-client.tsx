'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Tier } from './playground-cases';
import { playgroundCases } from './playground-cases';

function CodeBlock({ code, locked = false }: { code: string; locked?: boolean }) {
  return (
    <div className={`playground-code${locked ? ' locked' : ''}`}>
      <pre><code>{code}</code></pre>
      {locked ? <div className="playground-code-mask">PRO source hidden until purchase</div> : null}
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="playground-action-btn"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? 'Copied' : 'Copy code'}
    </button>
  );
}

export function PlaygroundClient() {
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | Tier>('all');
  const [selectedId, setSelectedId] = useState(playgroundCases[0]!.id);

  const filtered = useMemo(() => {
    return playgroundCases.filter((item) => {
      const passesTier = tierFilter === 'all' ? true : item.tier === tierFilter;
      const searchable = `${item.label} ${item.summary} ${item.packageName}`.toLowerCase();
      const passesQuery = searchable.includes(query.toLowerCase());
      return passesTier && passesQuery;
    });
  }, [query, tierFilter]);

  const selected = filtered.find((item) => item.id === selectedId)
    ?? playgroundCases.find((item) => item.id === selectedId)
    ?? playgroundCases[0]!;

  return (
    <main className="playground-page">
      <header className="playground-topbar">
        <div>
          <p className="kicker">LotOS UI Playground</p>
          <h1>Component-by-component proof without cloning the repo.</h1>
          <p className="playground-lead">
            Left: plain HTML or React. Right: the same job with LotOS UI. Free components copy immediately. Pro components stay runnable in-browser but keep the package and source behind checkout.
          </p>
        </div>
        <div className="playground-cta-stack">
          <Link href="/pricing" className="btn primary">Unlock PRO</Link>
          <Link href="/vault" className="btn ghost">Open Vault</Link>
        </div>
      </header>

      <section className="playground-shell">
        <aside className="playground-sidebar">
          <div className="playground-filter-block">
            <label htmlFor="playground-search">Search component</label>
            <input
              id="playground-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="button, modal, table..."
            />
          </div>
          <div className="playground-filter-row">
            <button type="button" className={tierFilter === 'all' ? 'active' : ''} onClick={() => setTierFilter('all')}>All</button>
            <button type="button" className={tierFilter === 'free' ? 'active' : ''} onClick={() => setTierFilter('free')}>FREE</button>
            <button type="button" className={tierFilter === 'pro' ? 'active' : ''} onClick={() => setTierFilter('pro')}>PRO</button>
          </div>
          <nav className="playground-nav" aria-label="Component catalog">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`playground-nav-item${selected.id === item.id ? ' selected' : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.label}</span>
                <span className={`tier-pill ${item.tier === 'free' ? 'accent-cyan' : 'accent-amber'}`}>{item.tier.toUpperCase()}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="playground-main">
          <div className="playground-summary-card">
            <div>
              <p className="section-label">Selected</p>
              <h2>{selected.label}</h2>
              <p>{selected.summary}</p>
            </div>
            <div className="playground-summary-meta">
              <span className={`tier-pill ${selected.tier === 'free' ? 'accent-cyan' : 'accent-amber'}`}>{selected.tier.toUpperCase()}</span>
              <code>{selected.packageName}</code>
            </div>
          </div>

          <div className="playground-preview-grid">
            <article className="playground-panel">
              <header>
                <p className="section-label">Without LotOS UI</p>
                <h3>Plain HTML / React</h3>
              </header>
              <div className="playground-preview">{selected.renderPlain()}</div>
              <CodeBlock code={selected.plainCode} />
            </article>

            <article className="playground-panel premium">
              <header>
                <p className="section-label">With LotOS UI</p>
                <h3>{selected.packageName}</h3>
              </header>
              <div className="playground-preview">{selected.renderLotos()}</div>
              <div className="playground-panel-actions">
                {selected.tier === 'free' ? (
                  <>
                    <CopyButton code={selected.lotosCode} />
                    <span className="playground-inline-note">Install with `npm install @lotosui/claude-arm`</span>
                  </>
                ) : (
                  <>
                    <Link href="/pricing" className="playground-action-btn upgrade">Unlock PRO</Link>
                    <span className="playground-inline-note">Visible live, but package and source unlock after purchase.</span>
                  </>
                )}
              </div>
              <CodeBlock code={selected.lotosCode} locked={selected.tier === 'pro'} />
            </article>
          </div>

          <section className="playground-package-grid">
            <article className="playground-package-card free">
              <p className="section-label">Public npm package</p>
              <h3>@lotosui/claude-arm</h3>
              <p>Ships the free adoption layer: Button, Input, Alert, Badge, Card, Spinner, Divider and EmptyState.</p>
              <pre><code>npm install @lotosui/claude-arm</code></pre>
            </article>
            <article className="playground-package-card pro">
              <p className="section-label">Premium npm package</p>
              <h3>@lotosui/claude-arm-pro</h3>
              <p>Ships the protected component layer, richer interaction patterns and the surfaces that are expensive to rebuild.</p>
              <pre><code>npm install @lotosui/claude-arm-pro</code></pre>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}
