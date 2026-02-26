'use client';
import './neurotask-demo.css';
import { memo, useMemo, useState } from 'react';

/* ─── Data ───────────────────────────────────────────────────────────────── */
const tasksTodo = [
  { id: 1, title: 'Design new onboarding flow with AI suggestions', tags: ['badge-purple', 'Design'], pri: 'High', user: { initials: 'RF', color: '#7c3aed' } },
  { id: 2, title: 'Integrate MCP server with Claude context window', tags: ['badge-blue', 'Backend'], pri: 'Medium', user: { initials: 'VM', color: '#3b82f6' } },
  { id: 3, title: 'Write unit tests for RadioGroup keyboard nav', tags: ['badge-cyan', 'QA'], pri: 'Low', user: { initials: 'AP', color: '#06b6d4' } },
];
const tasksInProgress = [
  { id: 4, title: 'Implement Combobox component with aria-activedescendant', tags: ['badge-amber', 'Frontend'], pri: 'High', user: { initials: 'RF', color: '#7c3aed' }, progress: 65 },
  { id: 5, title: 'Deploy docs site to Vercel with security headers', tags: ['badge-green', 'DevOps'], pri: 'Medium', user: { initials: 'VM', color: '#3b82f6' }, progress: 80 },
];
const tasksDone = [
  { id: 6, title: 'Tabs component — all 12 tests green', tags: ['badge-green', 'Frontend'], pri: 'Done', user: { initials: 'RF', color: '#7c3aed' } },
  { id: 7, title: 'Publish @lotosui/claude-arm v1.0.0 to npm', tags: ['badge-purple', 'Release'], pri: 'Done', user: { initials: 'VM', color: '#3b82f6' } },
];

const faqItems = [
  { q: '¿Qué es el MCP Server de LotOS UI?', a: 'Es un servidor HTTP que expone las APIs de componentes, schemas Zod y ejemplos canónicos — diseñado para reducir alucinaciones en agentes de AI al generar JSX.' },
  { q: '¿Es compatible con React 19?', a: 'Sí. @lotosui/claude-arm requiere React ≥19 como peer dependency y aprovecha los nuevos hooks de concurrent rendering.' },
  { q: '¿Cómo instalo solo los componentes que necesito?', a: 'El paquete tiene sideEffects:false, por lo que el tree-shaking de tu bundler eliminará automáticamente todo lo que no importes.' },
];

const priMeta: Record<string, string> = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-muted' };
const comboOptions = ['Button', 'Badge', 'Card', 'Input', 'Modal', 'Select', 'Checkbox', 'Switch', 'Textarea', 'Tooltip', 'Dropdown', 'RadioGroup', 'Combobox', 'Tabs', 'Accordion'];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const TaskCard = memo(function TaskCard({ task }: { task: typeof tasksTodo[0] & { progress?: number; pri?: string } }) {
  return (
    <div className="task-card animate-fadeup">
      <div className="task-card-title">{task.title}</div>
      {task.progress !== undefined && (
        <div style={{ marginBottom: 8 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${task.progress}%`, background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{task.progress}% complete</div>
        </div>
      )}
      <div className="task-card-meta">
        <div className="task-card-tags">
          <span className={`badge ${task.tags[0]}`}>{task.tags[1]}</span>
          {task.pri && priMeta[task.pri] && (
            <span className={`badge ${priMeta[task.pri]}`}>{task.pri}</span>
          )}
        </div>
        <div className="task-avatar" style={{ background: task.user.color }}>{task.user.initials}</div>
      </div>
    </div>
  );
});

const SidebarItem = memo(function SidebarItem({ icon, label, count, active, onClick }: { icon: string; label: string; count?: number; active?: boolean; onClick?: () => void }) {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''}`} role="button" tabIndex={0} onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      <span className="sidebar-item-icon">{icon}</span>
      {label}
      {count !== undefined && <span className="sidebar-badge">{count}</span>}
    </div>
  );
});

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function NeuroTaskDemo() {
  const [activeSection, setActiveSection] = useState('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [switches, setSwitches] = useState({ ai: true, notif: false, rtl: false });
  const [checks, setChecks] = useState({ a11y: true, tests: true, mcp: false });
  const [radios, setRadios] = useState('pro');
  const [comboOpen, setComboOpen] = useState(false);
  const [comboVal, setComboVal] = useState('');
  const [comboQuery, setComboQuery] = useState('');
  const [activeTab, setActiveTab] = useState('components');
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredCombo = useMemo(
    () => comboOptions.filter(o => o.toLowerCase().includes(comboQuery.toLowerCase())),
    [comboQuery],
  );

  return (
    <div className="app-shell">
      <div className="bg-mesh" />
      <div className="bg-grid" />

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="topbar">
        <a href="#" className="topbar-logo">
          <div className="topbar-logo-mark animate-pulse-glow">L</div>
          LotOS UI
        </a>
        <div className="topbar-sep" />
        <div className="topbar-product">
          NeuroTask <span>/ dev demo</span>
        </div>

        <div style={{ marginLeft: 24, display: 'flex', gap: 8 }}>
          {['Board', 'Analytics', 'Settings'].map(s => (
            <button key={s}
              className={`btn btn-ghost btn-sm ${activeSection === s.toLowerCase() ? 'btn-secondary' : ''}`}
              onClick={() => setActiveSection(s.toLowerCase())}
              style={{ fontSize: 12 }}
            >{s}</button>
          ))}
        </div>

        <div className="topbar-end">
          <div className="mcp-badge"><span className="mcp-dot" /> MCP Active</div>
          <a href="/design-lab" className="btn btn-ghost btn-sm">Design lab</a>
          <a href="/multi-framework" className="btn btn-ghost btn-sm">Expansion status</a>
          <div className="tooltip-wrap">
            <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>+ New Task</button>
            <div className="tooltip-tip">Create a task with AI assist</div>
          </div>
          <div className="task-avatar" style={{ width: 30, height: 30, background: '#7c3aed', fontSize: 11 }}>RF</div>
        </div>
      </header>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <nav className="sidebar">
        <div className="sidebar-section-label">Workspace</div>
        <SidebarItem icon="⬡" label="Dashboard" active={activeSection === 'board'} onClick={() => setActiveSection('board')} />
        <SidebarItem icon="◫" label="Board" count={5} active={activeSection === 'board'} onClick={() => setActiveSection('board')} />
        <SidebarItem icon="◷" label="Timeline" />
        <SidebarItem icon="⊞" label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />

        <div className="sidebar-section-label" style={{ marginTop: 8 }}>Components</div>
        <SidebarItem icon="◉" label="Showcase" active={activeSection === 'showcase'} onClick={() => setActiveSection('showcase')} />
        <SidebarItem icon="⌥" label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />

        <div className="sidebar-footer">
          <SidebarItem icon="◈" label="@lotosui/claude-arm" />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: '6px 10px' }}>
            v1.0.0 · 15 components · 158 tests ✓
          </div>
        </div>
      </nav>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="main-content" style={{ paddingBottom: 48 }}>

        {/* ── KPI Row ─────────────────────────────────────────────────── */}
        <div className="kpi-grid">
          {[
            { icon: '⬡', label: 'Components', value: '15', delta: '+2', up: true, accent: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)' },
            { icon: '✓', label: 'Tests Passing', value: '158', delta: '100%', up: true, accent: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
            { icon: '◷', label: 'Docs Pages', value: '21', delta: '+5', up: true, accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
            { icon: '⚡', label: 'A11Y Score', value: 'AAA', delta: 'WCAG 2.2', up: true, accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
          ].map((k, i) => (
            <div key={k.label} className={`kpi-card animate-fadeup anim-delay-${i + 1}`}
              style={{ ['--kpi-accent' as string]: k.accent, ['--kpi-bg' as string]: k.bg, ['--kpi-border' as string]: k.border }}>
              <div className="kpi-icon" style={{ background: k.bg, borderColor: k.border }}>{k.icon}</div>
              <div className="kpi-value" style={{ color: k.accent }}>{k.value}</div>
              <div className="kpi-label">{k.label}</div>
              <div className={`kpi-delta up`}>▲ {k.delta}</div>
            </div>
          ))}
        </div>

        {/* ── AI Banner ────────────────────────────────────────────────── */}
        <div className="ai-banner animate-fadeup anim-delay-2">
          <div className="ai-banner-icon">🤖</div>
          <div style={{ flex: 1 }}>
            <div className="ai-banner-title">MCP Server activo — Sin alucinaciones garantizadas</div>
            <div className="ai-banner-sub">Los agentes de AI consultan schemas Zod + restricciones antes de generar JSX.
              <span className="code-tag" style={{ marginLeft: 8 }}>GET /components/button</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="btn btn-secondary btn-sm">Ver schemas</button>
            <button className="btn btn-primary btn-sm">Explorar MCP</button>
          </div>
        </div>

        {/* ── Kanban Board ─────────────────────────────────────────────── */}
        <div className="glass-card animate-fadeup anim-delay-3">
          <div className="glass-card-header">
            <div className="glass-card-title">Sprint Board</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm">Filter ▾</button>
              <button className="btn btn-secondary btn-sm">+ Column</button>
            </div>
          </div>
          <div className="kanban-grid">
            {/* To do */}
            <div className="kanban-col">
              <div className="kanban-col-header">
                <span className="kanban-col-dot" style={{ background: 'var(--text-muted)' }} />
                Backlog
                <span className="kanban-col-count">{tasksTodo.length}</span>
              </div>
              {tasksTodo.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
            {/* In progress */}
            <div className="kanban-col">
              <div className="kanban-col-header">
                <span className="kanban-col-dot" style={{ background: 'var(--accent-blue)' }} />
                In Progress
                <span className="kanban-col-count">{tasksInProgress.length}</span>
              </div>
              {tasksInProgress.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
            {/* Done */}
            <div className="kanban-col">
              <div className="kanban-col-header">
                <span className="kanban-col-dot" style={{ background: 'var(--accent-green)' }} />
                Done
                <span className="kanban-col-count">{tasksDone.length}</span>
              </div>
              {tasksDone.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          </div>
        </div>

        {/* ── Component Showcase Tabs ───────────────────────────────────── */}
        <div className="glass-card animate-fadeup anim-delay-4">
          <div className="glass-card-header">
            <div className="glass-card-title">🎨 LotOS UI — Component Showcase</div>
            <span className="badge badge-purple">15 components · live demo</span>
          </div>

          {/* Tabs */}
          <div className="tabs-bar">
            {['components', 'forms', 'overlay', 'navigation'].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>

          {activeTab === 'components' && (
            <div className="showcase-grid">
              {/* Buttons */}
              <div className="component-panel" style={{ ['--panel-glow' as string]: 'rgba(124,58,237,0.12)' }}>
                <div className="component-hero-label">Button.tsx</div>
                <div className="component-panel-label">Button — 5 variants</div>
                <div className="component-row">
                  <button className="btn btn-primary">Primary</button>
                  <button className="btn btn-secondary">Secondary</button>
                  <button className="btn btn-ghost">Ghost</button>
                  <button className="btn btn-destructive">Delete</button>
                  <button className="btn btn-primary btn-sm">Small</button>
                  <button className="btn btn-primary btn-lg">Large</button>
                  <button className="btn btn-primary" disabled>Disabled</button>
                </div>
              </div>

              {/* Badges */}
              <div className="component-panel" style={{ ['--panel-glow' as string]: 'rgba(59,130,246,0.12)' }}>
                <div className="component-hero-label">Badge.tsx</div>
                <div className="component-panel-label">Badge — 6 variants</div>
                <div className="tag-row">
                  <span className="badge badge-purple">✦ Feature</span>
                  <span className="badge badge-blue">◉ In Progress</span>
                  <span className="badge badge-green">✓ Done</span>
                  <span className="badge badge-amber">⚡ High Pri</span>
                  <span className="badge badge-red">⚠ Bug</span>
                  <span className="badge badge-cyan">⊕ New</span>
                  <span className="badge badge-muted">Draft</span>
                </div>
              </div>

              {/* Combobox */}
              <div className="component-panel" style={{ ['--panel-glow' as string]: 'rgba(6,182,212,0.10)' }}>
                <div className="component-hero-label">Combobox.tsx</div>
                <div className="component-panel-label">Combobox — filtrado en tiempo real</div>
                <div className="combobox-wrap">
                  <div className="field-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '7px 12px' }}
                    onClick={() => setComboOpen(o => !o)}>
                    <input className="field-input" style={{ border: 'none', padding: 0, background: 'transparent', width: '100%', cursor: 'pointer' }}
                      placeholder="Search components..." value={comboQuery || comboVal}
                      onChange={e => { setComboQuery(e.target.value); setComboOpen(true); }}
                      onFocus={() => setComboOpen(true)} readOnly={!comboOpen} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{comboOpen ? '▲' : '▼'}</span>
                  </div>
                  {comboOpen && (
                    <div className="combobox-listbox">
                      {filteredCombo.map(o => (
                        <div key={o} className={`combobox-option ${comboVal === o ? 'selected' : ''}`}
                          onMouseDown={() => { setComboVal(o); setComboQuery(''); setComboOpen(false); }}>
                          {comboVal === o && <span style={{ color: 'var(--accent-violet)' }}>✓</span>}
                          <code className="code-tag">{`<${o} />`}</code>
                        </div>
                      ))}
                      {filteredCombo.length === 0 && <div className="combobox-option" style={{ color: 'var(--text-muted)' }}>No components found</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown */}
              <div className="component-panel" style={{ ['--panel-glow' as string]: 'rgba(245,158,11,0.10)' }}>
                <div className="component-hero-label">Dropdown.tsx</div>
                <div className="component-panel-label">Dropdown — role=menu, keyboard nav</div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button className="btn btn-secondary" onClick={() => setDropdownOpen(o => !o)}>
                    Task actions ▾
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50 }}>
                      <div className="dropdown-item">✏️ &nbsp;Edit task</div>
                      <div className="dropdown-item">⎘ &nbsp;Duplicate</div>
                      <div className="dropdown-item">📎 &nbsp;Attach file</div>
                      <div className="dropdown-sep" />
                      <div className="dropdown-item destructive">🗑 &nbsp;Delete task</div>
                    </div>
                  )}
                </div>
                {dropdownOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setDropdownOpen(false)} />}
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div className="showcase-grid">
              {/* Inputs */}
              <div className="component-panel">
                <div className="component-hero-label">Input.tsx</div>
                <div className="component-panel-label">Input — label, error, helper</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="field">
                    <div className="field-label">Task title</div>
                    <input className="field-input" placeholder="Enter task title..." defaultValue="Implement Combobox" />
                  </div>
                  <div className="field">
                    <div className="field-label">Due date</div>
                    <input className="field-input error" type="date" />
                    <div className="field-error">⚠ Due date cannot be in the past</div>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="component-panel">
                <div className="component-hero-label">Textarea.tsx</div>
                <div className="component-panel-label">Textarea — live char counter</div>
                <div className="field">
                  <div className="field-label">Description</div>
                  <textarea className="field-input" rows={4}
                    placeholder="Describe the task..."
                    defaultValue="Implement the Combobox component with ARIA combobox pattern — role=combobox, aria-expanded, aria-activedescendant…"
                    maxLength={200} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="field-helper">Markdown supported</div>
                    <div className="field-helper">142 / 200</div>
                  </div>
                </div>
              </div>

              {/* Select + RadioGroup */}
              <div className="component-panel">
                <div className="component-hero-label">Select.tsx · RadioGroup.tsx</div>
                <div className="component-panel-label">Select & RadioGroup</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <div className="field-label">Assignee</div>
                    <select className="field-input">
                      <option>Ricardo Flores</option>
                      <option>Victor M.</option>
                      <option>Ana P.</option>
                    </select>
                  </div>
                  <div>
                    <div className="field-label" style={{ marginBottom: 8 }}>Priority</div>
                    <div className="radio-group">
                      {[
                        { val: 'high', label: '🔴 High' },
                        { val: 'pro', label: '🟡 Medium' },
                        { val: 'low', label: '🟢 Low' },
                      ].map(r => (
                        <div key={r.val} className="radio-item" onClick={() => setRadios(r.val)}>
                          <div className={`radio-dot ${radios === r.val ? 'checked' : ''}`} />
                          <div className="radio-label">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Switch + Checkbox */}
              <div className="component-panel">
                <div className="component-hero-label">Switch.tsx · Checkbox.tsx</div>
                <div className="component-panel-label">Switch & Checkbox</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { key: 'ai', label: 'AI Suggestions', desc: 'Ask MCP before generating JSX' },
                    { key: 'notif', label: 'Notifications', desc: 'Browser push notifications' },
                    { key: 'rtl', label: 'RTL Mode', desc: 'Right-to-left layout support' },
                  ].map(s => (
                    <div key={s.key} className="switch-wrap"
                      onClick={() => setSwitches(p => ({ ...p, [s.key]: !p[s.key as keyof typeof p] }))}>
                      <div className={`switch-track ${switches[s.key as keyof typeof switches] ? 'on' : ''}`}>
                        <div className="switch-thumb" />
                      </div>
                      <div>
                        <div className="switch-label">{s.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div className="divider" />
                  {[
                    { key: 'a11y', label: 'WCAG 2.2 AAA compliance' },
                    { key: 'tests', label: 'Run tests before publish' },
                    { key: 'mcp', label: 'Enable MCP guardrails' },
                  ].map(c => (
                    <div key={c.key} className="checkbox-wrap"
                      onClick={() => setChecks(p => ({ ...p, [c.key]: !p[c.key as keyof typeof p] }))}>
                      <div className={`checkbox-box ${checks[c.key as keyof typeof checks] ? 'checked' : ''}`}>
                        {checks[c.key as keyof typeof checks] && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                      </div>
                      <div className="checkbox-label">{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overlay' && (
            <div className="showcase-grid">
              {/* Tooltip */}
              <div className="component-panel">
                <div className="component-hero-label">Tooltip.tsx</div>
                <div className="component-panel-label">Tooltip — role=tooltip, hover me</div>
                <div className="component-row" style={{ gap: 12 }}>
                  {['Top', 'Info', 'Danger', 'Success'].map((label, i) => (
                    <div className="tooltip-wrap" key={label}>
                      <button className="btn btn-secondary btn-sm">{label}</button>
                      <div className="tooltip-tip">{['Opens above', 'Extra information here', 'This action is irreversible', 'Component added successfully'][i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal trigger */}
              <div className="component-panel">
                <div className="component-hero-label">Modal.tsx</div>
                <div className="component-panel-label">Modal — focus trap, aria-modal</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    `role="dialog"` + `aria-modal="true"` + focus trap + Escape dismiss + backdrop click dismiss.
                  </p>
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setModalOpen(true)}>
                    Open Task Modal
                  </button>
                </div>
              </div>

              {/* Accordion */}
              <div className="component-panel" style={{ gridColumn: '1 / -1' }}>
                <div className="component-hero-label">Accordion.tsx</div>
                <div className="component-panel-label">Accordion — aria-expanded, role=region, lazy mount</div>
                {faqItems.map((item, i) => (
                  <div key={i} className={`accordion-item ${accordionOpen === i ? 'open' : ''}`}>
                    <button className="accordion-trigger"
                      onClick={() => setAccordionOpen(accordionOpen === i ? null : i)}
                      aria-expanded={accordionOpen === i}>
                      {item.q}
                      <span className="accordion-chevron">▼</span>
                    </button>
                    <div className="accordion-panel">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="showcase-grid">
              {/* Card */}
              <div className="component-panel">
                <div className="component-hero-label">Card.tsx</div>
                <div className="component-panel-label">Card — header, body, footer slots</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>L</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>@lotosui/claude-arm</div>
                    <span className="badge badge-green" style={{ marginLeft: 'auto' }}>v1.0.0</span>
                  </div>
                  <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Accessible React component library built for AI-first development. 15 components, WCAG 2.2 AAA.
                  </div>
                  <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm">npm install</button>
                    <button className="btn btn-ghost btn-sm">View docs</button>
                  </div>
                </div>
              </div>

              {/* Tabs mini */}
              <div className="component-panel">
                <div className="component-hero-label">Tabs.tsx</div>
                <div className="component-panel-label">Tabs — 3 variants, arrow key nav</div>
                {/* Pills variant */}
                <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 4, marginBottom: 12 }}>
                  {['Components', 'Types', 'Examples'].map((t, i) => (
                    <div key={t} style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      background: i === 0 ? 'var(--accent-purple)' : 'transparent',
                      color: i === 0 ? 'white' : 'var(--text-muted)',
                    }}>{t}</div>
                  ))}
                </div>
                {/* Underline variant */}
                <div style={{ borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 0, marginBottom: 8 }}>
                  {['Props', 'Events', 'Slots'].map((t, i) => (
                    <div key={t} style={{
                      padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      color: i === 0 ? 'var(--accent-violet)' : 'var(--text-muted)',
                      borderBottom: i === 0 ? '2px solid var(--accent-violet)' : '2px solid transparent',
                      marginBottom: -1,
                    }}>{t}</div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['label', 'tabs', 'value', 'defaultValue', 'onChange', 'variant', 'orientation'].map(p => (
                      <code key={p} className="code-tag">{p}</code>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="component-panel" style={{ gridColumn: '1 / -1' }}>
                <div className="component-panel-label">Activity Feed — componentes en acción</div>
                {[
                  { user: { initials: 'RF', color: '#7c3aed' }, action: 'published', obj: '@lotosui/claude-arm v1.0.0', time: '2m ago' },
                  { user: { initials: 'VM', color: '#3b82f6' }, action: 'merged', obj: 'Sprint 5 — Tabs + Accordion', time: '18m ago' },
                  { user: { initials: 'AP', color: '#06b6d4' }, action: 'added', obj: '34 new tests (100% pass rate)', time: '1h ago' },
                  { user: { initials: 'RF', color: '#7c3aed' }, action: 'deployed', obj: 'docs site → Vercel (21 SSG pages)', time: '2h ago' },
                ].map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-avatar" style={{ background: a.user.color }}>{a.user.initials}</div>
                    <div className="activity-text">
                      <strong>{a.user.initials === 'RF' ? 'Ricardo' : a.user.initials === 'VM' ? 'Victor' : 'Ana'}</strong>
                      {` ${a.action} `}
                      <span style={{ color: 'var(--accent-violet)' }}>{a.obj}</span>
                    </div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <div className={`modal-backdrop ${modalOpen ? 'open' : ''}`}
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
        onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="modal-dialog">
          <button className="modal-close" aria-label="Close" onClick={() => setModalOpen(false)}>✕</button>
          <div className="modal-title" id="modal-title">✦ Create Task</div>
          <div className="modal-desc">Add a new task to the board. Fields with <span style={{ color: 'var(--accent-red)' }}>*</span> are required.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field">
              <div className="field-label">Title *</div>
              <input className="field-input" placeholder="e.g. Implement Accordion component" />
            </div>
            <div className="field">
              <div className="field-label">Description</div>
              <textarea className="field-input" rows={3} placeholder="What needs to be done?" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field">
                <div className="field-label">Assignee</div>
                <select className="field-input">
                  <option>Ricardo F.</option>
                  <option>Victor M.</option>
                </select>
              </div>
              <div className="field">
                <div className="field-label">Priority</div>
                <select className="field-input" defaultValue="Medium">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="field">
              <div className="field-label">Labels</div>
              <div className="tag-row">
                {['Frontend', 'Backend', 'Design', 'QA', 'DevOps'].map(tag => (
                  <span key={tag} className="badge badge-muted" style={{ cursor: 'pointer' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => setModalOpen(false)}>Create Task ✦</button>
          </div>
        </div>
      </div>

      {/* ── Lotos bar ─────────────────────────────────────────────────────── */}
      <div className="lotos-bar">
        <span>Built with</span>
        <strong>@lotosui/claude-arm</strong>
        <span className="lotos-bar-sep">·</span>
        <span>15 components · 158 tests · WCAG 2.2 AAA</span>
        <span className="lotos-bar-sep">·</span>
        <a href="https://lotos-ui.vercel.app" target="_blank" rel="noopener">View docs →</a>
        <span className="lotos-bar-sep">·</span>
        <a href="https://npmjs.com/package/@lotosui/claude-arm" target="_blank" rel="noopener">npm install @lotosui/claude-arm</a>
      </div>
    </div>
  );
}
