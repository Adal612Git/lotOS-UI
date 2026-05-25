'use client';

import Link from 'next/link';
import { type KeyboardEvent, useMemo, useState } from 'react';
import {
  categoryLabels,
  categoryOrder,
  cliStarters,
  componentCatalog,
  inventoryItems,
  type Accent,
  type ComponentCatalogItem,
  type InventoryCategory,
  type InventoryItem,
} from './home-data';

const initialVisibleCount = 24;

function statusLabel(status: InventoryItem['status']) {
  const labels: Record<InventoryItem['status'], string> = {
    ready: 'Ready',
    live: 'Live',
    stable: 'Stable',
    alpha: 'Alpha',
    preview: 'Preview',
    premium: 'Premium',
    'full-only': 'Full-only',
    gated: 'Gated',
  };
  return labels[status];
}

function categoryLabel(category: InventoryCategory) {
  return categoryLabels[category];
}

function ctaLabel(item: InventoryItem) {
  if (!item.href) {
    return item.category === 'cli-starter' ? 'Comando abajo' : 'Preview protegido';
  }
  if (item.category === 'demo') return 'Abrir demo';
  if (item.category === 'component') return 'Ver componente';
  if (item.category === 'premium-asset') return item.status === 'full-only' ? 'Full Signature' : 'Ver preview';
  if (item.category === 'runtime') return 'Ver matriz';
  return 'Abrir ruta';
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const body = (
    <>
      <div className="home-inventory-card__top">
        <span className="home-inventory-card__category">{categoryLabel(item.category)}</span>
        <span className={`home-status home-status--${item.status}`}>{statusLabel(item.status)}</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <strong>{item.simpleValue}</strong>
      <div className="home-tag-row">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={`${item.id}-${tag}`}>{tag}</span>
        ))}
      </div>
      <span className="home-card-cta">{ctaLabel(item)}</span>
    </>
  );

  const className = `home-inventory-card home-accent-${item.accent}`;
  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {body}
      </Link>
    );
  }

  return <article className={`${className} is-static`}>{body}</article>;
}

export function CollectionExplorer() {
  const [activeCategory, setActiveCategory] = useState<InventoryCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return inventoryItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const haystack = [item.name, item.description, item.simpleValue, ...item.tags].join(' ').toLowerCase();
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const remaining = Math.max(filteredItems.length - visibleItems.length, 0);

  function chooseCategory(category: InventoryCategory | 'all') {
    setActiveCategory(category);
    setVisibleCount(initialVisibleCount);
  }

  function updateQuery(next: string) {
    setQuery(next);
    setVisibleCount(initialVisibleCount);
  }

  return (
    <section className="home-section home-collection" id="coleccion">
      <div className="home-section__eyebrow">Coleccion completa</div>
      <div className="home-section__split">
        <div>
          <h2>Explora todo lo que trae LotOS UI.</h2>
          <p>
            Rutas, demos, componentes, runtimes, starters y assets premium en una sola vista.
            Busca una pieza, abre una demo o identifica que puedes copiar para tu siguiente entrega.
          </p>
        </div>
        <div className="home-collection__summary">
          <strong>{inventoryItems.length}</strong>
          <span>items organizados</span>
        </div>
      </div>

      <div className="home-collection__tools">
        <div className="home-tab-row" role="tablist" aria-label="Filtrar coleccion">
          {categoryOrder.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={activeCategory === category ? 'is-active' : undefined}
              onClick={() => chooseCategory(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
        <label className="home-search">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Buscar ruta, componente, starter..."
          />
        </label>
      </div>

      <div className="home-inventory-grid" aria-live="polite">
        {visibleItems.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      <div className="home-collection__footer">
        <span>
          Mostrando {visibleItems.length} de {filteredItems.length}
        </span>
        {remaining > 0 ? (
          <button type="button" className="home-btn home-btn--soft" onClick={() => setVisibleCount((count) => count + 24)}>
            Mostrar mas
          </button>
        ) : null}
      </div>
    </section>
  );
}

function previewRows(component: ComponentCatalogItem) {
  if (component.category === 'Data') return ['Revenue', 'Churn risk', 'Active demos'];
  if (component.category === 'Forms') return ['Plan', 'Runtime', 'Delivery notes'];
  if (component.category === 'Feedback') return ['Sync complete', 'Review needed', 'Ready'];
  if (component.category === 'Navigation') return ['Overview', 'Assets', 'Vault'];
  return ['Primary action', 'Secondary state', 'Context'];
}

function ComponentVisualPreview({ component }: { component: ComponentCatalogItem }) {
  return (
    <div className={`home-component-preview home-accent-${component.accent}`}>
      <div className="home-component-preview__chrome">
        <span />
        <span />
        <span />
        <strong>{component.name}</strong>
      </div>
      <div className="home-component-preview__surface">
        {previewRows(component).map((row, index) => (
          <div key={`${component.id}-${row}`} className="home-preview-row">
            <span className="home-preview-dot" />
            <div>
              <strong>{row}</strong>
              <small>{index === 0 ? component.what : index === 1 ? component.where : component.why}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComponentShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeComponent = componentCatalog[activeIndex] ?? componentCatalog[0];

  if (!activeComponent) {
    return null;
  }

  function goTo(index: number) {
    const next = (index + componentCatalog.length) % componentCatalog.length;
    setActiveIndex(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      goTo(componentCatalog.length - 1);
    }
  }

  return (
    <section
      className="home-section home-component-carousel"
      aria-label="Carrusel de componentes React"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="home-section__eyebrow">Componentes React</div>
      <div className="home-section__split">
        <div>
          <h2>27 componentes React, explicados uno por uno.</h2>
          <p>
            Cada slide dice que hace, donde se usa y por que importa. No es una lista para presumir:
            es una coleccion de piezas que puedes convertir en pantallas reales.
          </p>
        </div>
        <div className="home-carousel-controls">
          <button type="button" aria-label="Componente anterior" onClick={() => goTo(activeIndex - 1)}>
            Prev
          </button>
          <span>
            {activeIndex + 1} / {componentCatalog.length}
          </span>
          <button type="button" aria-label="Siguiente componente" onClick={() => goTo(activeIndex + 1)}>
            Next
          </button>
        </div>
      </div>

      <div className={`home-component-slide home-accent-${activeComponent.accent}`} aria-live="polite">
        <ComponentVisualPreview component={activeComponent} />
        <div className="home-component-slide__copy">
          <div className="home-component-slide__meta">
            <span>{activeComponent.category}</span>
            <span>{activeComponent.tier === 'free' ? 'Free' : 'Pro'}</span>
          </div>
          <h3>{activeComponent.name}</h3>
          <dl>
            <div>
              <dt>Que hace</dt>
              <dd>{activeComponent.what}</dd>
            </div>
            <div>
              <dt>Donde se usa</dt>
              <dd>{activeComponent.where}</dd>
            </div>
            <div>
              <dt>Por que importa</dt>
              <dd>{activeComponent.why}</dd>
            </div>
          </dl>
          <pre>
            <code>{activeComponent.snippet}</code>
          </pre>
          <div className="home-tag-row">
            {activeComponent.props.map((prop) => (
              <span key={`${activeComponent.id}-${prop}`}>{prop}</span>
            ))}
          </div>
          <Link href={activeComponent.href} className="home-btn home-btn--primary">
            Ver componente
          </Link>
        </div>
      </div>

      <div className="home-component-thumbs" aria-label="Componentes disponibles">
        {componentCatalog.map((component, index) => (
          <button
            key={component.id}
            type="button"
            className={index === activeIndex ? 'is-active' : undefined}
            onClick={() => goTo(index)}
            aria-label={`Ver ${component.name}`}
            aria-current={index === activeIndex}
          >
            {component.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function CopyCommandButton({ command, accent }: { command: string; accent: Accent }) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={`home-copy-button home-accent-${accent}`} onClick={copyCommand}>
      {copied ? 'Copiado' : 'Copiar comando'}
    </button>
  );
}

export function CliStartersShowcase() {
  const [family, setFamily] = useState<'all' | 'stack' | 'desktop'>('all');
  const starters = family === 'all' ? cliStarters : cliStarters.filter((starter) => starter.family === family);

  return (
    <section className="home-section home-cli-showcase">
      <div className="home-section__eyebrow">Starters CLI</div>
      <div className="home-section__split">
        <div>
          <h2>18 starters para arrancar con una base real.</h2>
          <p>
            Elige stack, copia el comando y empieza con estructura. Esto es lo que acelera a devs,
            agencias y equipos pequenos cuando necesitan entregar sin armar todo desde cero.
          </p>
        </div>
        <div className="home-mini-tabs" role="group" aria-label="Filtrar starters">
          {(['all', 'stack', 'desktop'] as const).map((option) => (
            <button key={option} type="button" className={family === option ? 'is-active' : undefined} onClick={() => setFamily(option)}>
              {option === 'all' ? 'Todos' : option === 'stack' ? 'Stacks' : 'Desktop'}
            </button>
          ))}
        </div>
      </div>
      <div className="home-cli-grid">
        {starters.map((starter) => (
          <article key={starter.id} className={`home-cli-card home-accent-${starter.accent}`}>
            <div className="home-cli-card__top">
              <span>{starter.family === 'stack' ? 'Stack starter' : 'Desktop starter'}</span>
              <strong>{starter.startTime}</strong>
            </div>
            <h3>{starter.name}</h3>
            <p>{starter.useCase}</p>
            <code>{starter.command}</code>
            <div className="home-cli-card__footer">
              <span>{starter.stack}</span>
              <CopyCommandButton command={starter.command} accent={starter.accent} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
