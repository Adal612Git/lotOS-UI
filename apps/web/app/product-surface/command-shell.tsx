'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LotOSSelect, type LotOSSelectOption } from './lotos-select';

export type CommandShellNavItem = {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
};

export type CommandShellAction = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  onSelect?: () => void;
};

export type CommandShellActivity = {
  label: string;
  body: string;
};

export type CommandShellProps = {
  productName: string;
  subtitle?: string;
  title: string;
  description?: string;
  navItems: CommandShellNavItem[];
  activeItemId?: string;
  breadcrumbs?: string[];
  workspaces?: LotOSSelectOption[];
  defaultWorkspace?: string;
  user?: {
    name: string;
    role: string;
    initials: string;
  };
  quickActions?: CommandShellAction[];
  activities?: CommandShellActivity[];
  actions?: ReactNode;
  theme?: 'obsidian' | 'academic' | 'porcelain';
  children: ReactNode;
};

export function CommandShell({
  productName,
  subtitle,
  title,
  description,
  navItems,
  activeItemId,
  breadcrumbs = [],
  workspaces = [],
  defaultWorkspace,
  user = { name: 'QA Operator', role: 'Product reviewer', initials: 'QA' },
  quickActions = [],
  activities = [],
  actions,
  theme = 'obsidian',
  children,
}: CommandShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteActions = useMemo(
    () => [
      ...quickActions,
      ...navItems.map((item) => ({ id: `nav-${item.id}`, label: `Go to ${item.label}`, description: 'Navigate inside this surface', icon: item.icon })),
    ],
    [navItems, quickActions],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !isTyping) {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function runAction(action: CommandShellAction) {
    action.onSelect?.();
    setPaletteOpen(false);
    setMobileOpen(false);
  }

  return (
    <section className={`lotos-command-shell lotos-theme-${theme}`} data-mobile-open={mobileOpen ? 'true' : 'false'}>
      <aside className="lotos-command-shell__sidebar" aria-label={`${productName} navigation`}>
        <div className="lotos-command-shell__brand">
          <strong>{productName}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
        {workspaces.length > 0 ? (
          <LotOSSelect
            label="Workspace"
            size="sm"
            density="compact"
            defaultValue={defaultWorkspace ?? workspaces[0]?.value}
            options={workspaces}
          />
        ) : null}
        <nav className="lotos-command-shell__nav">
          {navItems.map((item) => (
            <button key={item.id} type="button" data-active={item.id === activeItemId ? 'true' : 'false'} onClick={() => setMobileOpen(false)}>
              <span aria-hidden="true">{item.icon ?? '*'}</span>
              <span>{item.label}</span>
              {item.badge ? <small>{item.badge}</small> : null}
            </button>
          ))}
        </nav>
        <div className="lotos-command-shell__rail">
          {quickActions.slice(0, 3).map((action) => (
            <button key={action.id} type="button" className="lotos-btn" onClick={() => runAction(action)}>
              <span aria-hidden="true">{action.icon ?? '+'}</span>
              {action.label}
            </button>
          ))}
          {activities.slice(0, 3).map((activity) => (
            <article key={`${activity.label}-${activity.body}`} className="lotos-command-shell__activity">
              <span>{activity.label}</span>
              <p>{activity.body}</p>
            </article>
          ))}
          <div className="lotos-command-shell__user">
            <span className="lotos-command-shell__avatar">{user.initials}</span>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="lotos-command-shell__main">
        <header className="lotos-command-shell__topbar">
          <button className="lotos-btn lotos-command-shell__mobile-toggle" type="button" onClick={() => setMobileOpen((next) => !next)}>
            Menu
          </button>
          <div className="lotos-command-shell__title">
            {breadcrumbs.length > 0 ? (
              <div className="lotos-command-shell__breadcrumbs">
                {breadcrumbs.map((item, index) => (
                  <span key={`${item}-${index}`}>{index === 0 ? item : `/ ${item}`}</span>
                ))}
              </div>
            ) : null}
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </div>
          <div className="lotos-command-shell__actions">
            <button className="lotos-btn" type="button" onClick={() => setPaletteOpen(true)}>
              Cmd K
            </button>
            {actions}
          </div>
        </header>
        <div className="lotos-command-shell__content">{children}</div>
      </div>

      {paletteOpen ? (
        <div className="lotos-command-shell__palette" role="dialog" aria-modal="true" aria-label="Command palette">
          <div className="lotos-command-shell__palette-panel lotos-theme-obsidian">
            <input className="lotos-input" autoFocus placeholder="Search commands, routes, or quick actions..." />
            <div className="lotos-command-shell__palette-list">
              {paletteActions.slice(0, 8).map((action) => (
                <button key={action.id} type="button" onClick={() => runAction(action)}>
                  <span aria-hidden="true">{action.icon ?? '>'}</span>
                  <span>
                    <strong>{action.label}</strong>
                    {action.description ? <small>{action.description}</small> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
