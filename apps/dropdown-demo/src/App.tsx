import { useState } from 'react';
import { Dropdown, Button } from '@lotosui/claude-arm';
import type { DropdownItem } from '@lotosui/claude-arm';
import { applyTheme } from '@lotosui/core';

// ─── Inline SVG icons (no external dep) ──────────────────────────────────────

function EditIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.667 13 2 14l1-3.667L11.333 2Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M2 4h12M5.333 4V2.667a.667.667 0 0 1 .667-.667h4a.667.667 0 0 1 .667.667V4M12.667 4l-.667 9.333a.667.667 0 0 1-.667.667H4.667a.667.667 0 0 1-.667-.667L3.333 4" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <rect x="2" y="2" width="12" height="3.333" rx="0.667" />
      <path d="M3.333 5.333v7.334a.667.667 0 0 0 .667.666h8a.667.667 0 0 0 .667-.666V5.333M6 8h4" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <circle cx="12.667" cy="2.667" r="1.333" />
      <circle cx="12.667" cy="13.333" r="1.333" />
      <circle cx="3.333" cy="8" r="1.333" />
      <path d="M4.6 7.273 11.4 3.394M4.6 8.727l6.8 3.879" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="5.333" r="2.667" />
      <path d="M2 13.333s.667-4 6-4 6 4 6 4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.333v1.334M8 13.333v1.334M3.286 3.286l.943.943M11.771 11.771l.943.943M1.333 8h1.334M13.333 8h1.334M3.286 12.714l.943-.943M11.771 4.229l.943-.943" />
    </svg>
  );
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light';

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--lotos-border-strong)] px-4 py-1.5 text-sm text-[var(--lotos-fg-secondary)] transition-colors hover:border-[var(--lotos-accent)] hover:text-[var(--lotos-accent)]"
    >
      {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--lotos-fg-muted)]">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lastAction, setLastAction] = useState('—');

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  }

  function handle(value: string) {
    setLastAction(value);
  }

  // ── Item sets ────────────────────────────────────────────────────────────────

  const basicItems: DropdownItem[] = [
    { value: 'edit',      label: 'Edit' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'archive',   label: 'Archive' },
    { value: 'delete',    label: 'Delete', separator: true, destructive: true },
    { value: 'noop',      label: 'Disabled item', disabled: true },
  ];

  const withIconsItems: DropdownItem[] = [
    { value: 'edit',    label: 'Edit',              icon: <EditIcon /> },
    { value: 'copy',    label: 'Copy link',         icon: <CopyIcon /> },
    { value: 'archive', label: 'Archive',           icon: <ArchiveIcon /> },
    { value: 'share',   label: 'Share',             icon: <ShareIcon /> },
    { value: 'delete',  label: 'Delete permanently',icon: <TrashIcon />, separator: true, destructive: true },
  ];

  const profileItems: DropdownItem[] = [
    { value: 'profile',  label: 'My profile',  icon: <UserIcon /> },
    { value: 'settings', label: 'Settings',    icon: <SettingsIcon /> },
    { value: 'signout',  label: 'Sign out',    separator: true },
  ];

  const placementItems: DropdownItem[] = [
    { value: 'option-a', label: 'Option A' },
    { value: 'option-b', label: 'Option B' },
    { value: 'option-c', label: 'Option C' },
  ];

  return (
    <div className="min-h-screen px-8 py-12">
      <div className="mx-auto max-w-2xl space-y-12">

        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--lotos-accent)]">
              @lotosui/claude-arm
            </p>
            <h1 className="text-3xl font-bold text-[var(--lotos-fg-primary)]">
              Dropdown — Demo
            </h1>
            <p className="mt-1 text-sm text-[var(--lotos-fg-muted)]">
              Keyboard navigation · ARIA · accessible items · icons · placements
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* 1 — Basic */}
        <Section title="Basic usage">
          <Dropdown
            label="Document options"
            trigger={<Button type="button" variant="primary" size="md">Options</Button>}
            items={basicItems}
            onSelect={(v) => handle(v)}
          />
          <Dropdown
            label="Secondary menu"
            trigger={<Button type="button" variant="secondary" size="md">Secondary</Button>}
            items={basicItems}
            onSelect={(v) => handle(v)}
          />
          <Dropdown
            label="Ghost menu"
            trigger={<Button type="button" variant="ghost" size="md">Ghost ▾</Button>}
            items={basicItems}
            onSelect={(v) => handle(v)}
          />
          <Dropdown
            label="Outline menu"
            trigger={<Button type="button" variant="outline" size="md">Outline ▾</Button>}
            items={basicItems}
            onSelect={(v) => handle(v)}
          />
        </Section>

        {/* 2 — Icons */}
        <Section title="Items with icons">
          <Dropdown
            label="Actions with icons"
            trigger={<Button type="button" variant="primary" size="md">Actions</Button>}
            items={withIconsItems}
            onSelect={(v) => handle(v)}
          />
        </Section>

        {/* 3 — Placements */}
        <Section title="Placement variants">
          {(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const).map((p) => (
            <Dropdown
              key={p}
              label={`${p} menu`}
              placement={p}
              trigger={<Button type="button" variant="outline" size="sm">{p}</Button>}
              items={placementItems}
              onSelect={(v) => handle(`${p}:${v}`)}
            />
          ))}
        </Section>

        {/* 4 — Custom trigger (not a Button) */}
        <Section title="Custom trigger (any ReactNode)">
          <Dropdown
            label="Profile menu"
            placement="bottom-end"
            trigger={
              <span
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--lotos-border-strong)] px-3 py-1.5 text-sm text-[var(--lotos-fg-primary)] transition-colors hover:border-[var(--lotos-accent)]"
              >
                <UserIcon />
                Victor
                <svg className="h-3 w-3 opacity-60" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </span>
            }
            items={profileItems}
            onSelect={(v) => handle(v)}
          />

          <Dropdown
            label="Context menu"
            trigger={
              <button
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--lotos-border)] text-[var(--lotos-fg-secondary)] transition-colors hover:border-[var(--lotos-accent)] hover:text-[var(--lotos-accent)]"
                aria-label="More options"
              >
                ⋯
              </button>
            }
            items={withIconsItems}
            onSelect={(v) => handle(v)}
          />
        </Section>

        {/* 5 — Width strategy */}
        <Section title="Width: trigger">
          <div style={{ width: 220 }}>
            <Dropdown
              label="Full-width menu"
              width="trigger"
              trigger={
                <Button type="button" variant="secondary" size="md" fullWidth>
                  Full-width trigger
                </Button>
              }
              items={basicItems}
              onSelect={(v) => handle(v)}
            />
          </div>
        </Section>

        {/* Last action feedback */}
        <div className="rounded-lg border border-[var(--lotos-border)] px-5 py-4 text-sm text-[var(--lotos-fg-muted)]">
          Last selected value:{' '}
          <code className="font-mono text-[var(--lotos-accent)]">{lastAction}</code>
        </div>

        {/* Keyboard reference */}
        <section className="rounded-lg border border-[var(--lotos-border)] px-5 py-4">
          <p className="mb-3 text-sm font-semibold text-[var(--lotos-fg-primary)]">
            Keyboard interactions
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--lotos-fg-secondary)]">
            {[
              ['Enter / Space / ↓', 'Open menu & focus first item'],
              ['↑', 'Open menu & focus last item'],
              ['↓ / ↑', 'Navigate items (wraps)'],
              ['Home / End', 'Jump to first / last item'],
              ['Enter / Space', 'Select focused item'],
              ['Escape', 'Close menu'],
              ['Tab', 'Close menu'],
            ].map(([key, desc]) => (
              <li key={key} className="flex items-baseline gap-3">
                <kbd className="shrink-0 rounded border border-[var(--lotos-border-strong)] px-1.5 py-0.5 font-mono text-xs text-[var(--lotos-fg-primary)]">
                  {key}
                </kbd>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
