import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Con LotOS UI — ClearCRM (after)',
  description: 'El mismo CRM admin panel, construido con los 27 componentes de LotOS UI. Dark-first, WCAG AAA.',
};

const contacts = [
  { id: 1, name: 'María García',  initials: 'MG', color: '',       email: 'garcia@empresa.mx',    company: 'Fabricaciones MX', status: 'active',   deal: '$18,400', owner: 'RM', ownerColor: '' },
  { id: 2, name: 'Carlos Vega',   initials: 'CV', color: 'blue',   email: 'cvega@logistica.com',  company: 'Logística Norte',  status: 'pending',  deal: '$7,200',  owner: 'AT', ownerColor: 'green' },
  { id: 3, name: 'Sandra López',  initials: 'SL', color: 'green',  email: 's.lopez@retail.mx',    company: 'Retail Express',   status: 'active',   deal: '$31,000', owner: 'RM', ownerColor: '' },
  { id: 4, name: 'Jorge Ruiz',    initials: 'JR', color: 'amber',  email: 'j.ruiz@tech.io',       company: 'TechSol',          status: 'inactive', deal: '—',       owner: 'LS', ownerColor: 'amber' },
  { id: 5, name: 'Ana Castillo',  initials: 'AC', color: '',       email: 'castillo@fintech.mx',  company: 'FinTech MX',       status: 'active',   deal: '$52,600', owner: 'AT', ownerColor: 'green' },
] as const;

const statusBadge = (s: string) => {
  if (s === 'active')   return <span className="demo-badge green">Activo</span>;
  if (s === 'pending')  return <span className="demo-badge amber">Pendiente</span>;
  return <span className="demo-badge red">Inactivo</span>;
};

export default function ConLotosWebPage() {
  return (
    <main className="demo-shell">
      {/* ── 1. Header ── */}
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          ClearCRM — LotOS UI
        </div>
        <div className="demo-header-center">
          {/* Breadcrumbs (component 13) */}
          <nav className="demo-breadcrumbs">
            <a href="#">Inicio</a>
            <span className="demo-breadcrumbs-sep">/</span>
            <a href="#">CRM</a>
            <span className="demo-breadcrumbs-sep">/</span>
            <span className="current">Contactos</span>
          </nav>
        </div>
        <div className="demo-header-right">
          {/* Avatar (component 11) */}
          <div className="demo-tooltip-wrap">
            <div className="demo-avatar sm">RM</div>
            <div className="demo-tooltip">Romero Medina — Owner</div>
          </div>
          <span className="demo-badge violet">Full Signature</span>
          <nav className="demo-nav">
            <Link href="/demo/sin-lotos-web">Ver sin LotOS →</Link>
            <Link href="/demo">← Demos</Link>
          </nav>
        </div>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">CRM Admin — 27 componentes en contexto real</p>

        {/* ── 2. Tabs (component 25) ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 className="demo-page-title">Panel de Contactos</h1>
            <p className="demo-page-subtitle">Gestiona clientes, tratos y actividad de ventas — con LotOS UI.</p>
          </div>
          <div className="demo-tabs">
            <button className="demo-tab active">Resumen</button>
            <button className="demo-tab">Contactos</button>
            <button className="demo-tab">Tratos</button>
            <button className="demo-tab">Reportes</button>
          </div>
        </div>

        {/* ── 3. Alert (component 4) ── */}
        <div className="demo-salert warning" style={{ marginBottom: 20 }}>
          ⚠ Tienes 3 tareas vencidas. Revisa tu lista de seguimiento antes del cierre de día.
        </div>

        {/* ── 4. Stats / KPIs (component 9) ── */}
        <div className="demo-kpi-row" style={{ marginBottom: 24 }}>
          <article className="demo-kpi-card red">
            <p className="demo-kpi-label">Ingresos totales</p>
            <p className="demo-kpi-value">$109.2K</p>
            <p className="demo-kpi-meta"><span className="demo-delta up">↑ 23.4%</span> vs mes anterior</p>
          </article>
          <article className="demo-kpi-card green">
            <p className="demo-kpi-label">Contactos activos</p>
            <p className="demo-kpi-value">5</p>
            <p className="demo-kpi-meta"><span className="demo-live-pulse" style={{ width: 5, height: 5 }} /> <span className="demo-delta up">3 tratos abiertos</span></p>
          </article>
          <article className="demo-kpi-card blue">
            <p className="demo-kpi-label">Tasa de cierre</p>
            <p className="demo-kpi-value">68%</p>
            <p className="demo-kpi-meta"><span className="demo-delta up">↑ 5 pts</span> este trimestre</p>
          </article>
          <article className="demo-kpi-card amber">
            <p className="demo-kpi-label">Tiempo promedio</p>
            <p className="demo-kpi-value">14d</p>
            <p className="demo-kpi-meta"><span className="demo-delta down">↑ 2d</span> ciclo de venta</p>
          </article>
        </div>

        {/* ── Main grid ── */}
        <div className="demo-main-grid">
          {/* ── Left: Table + Avatar + Dropdown ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Contactos — 5 registros</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Combobox (component 15) */}
                  <div className="demo-combobox" style={{ position: 'relative' }}>
                    <input className="demo-sinput demo-combobox-input" placeholder="Buscar contacto..." style={{ width: 200, paddingRight: 32 }} />
                    <span className="demo-combobox-icon">⌕</span>
                  </div>
                  <button className="demo-sbutton primary" style={{ fontSize: 12, padding: '7px 14px' }}>+ Nuevo</button>
                </div>
              </div>

              {/* Table (component 10) + Avatar (11) + Badge (2) */}
              <table className="demo-table">
                <thead>
                  <tr>
                    <th><div className="demo-checkbox checked">✓</div></th>
                    <th>Contacto</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Trato</th>
                    <th>Responsable</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td><div className="demo-checkbox" /></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Avatar */}
                          <div className={`demo-avatar sm ${c.color}`}>{c.initials}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#F0F4FF' }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(240,244,255,0.38)' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{c.company}</td>
                      <td>{statusBadge(c.status)}</td>
                      <td style={{ fontWeight: 700, color: c.deal === '—' ? 'rgba(240,244,255,0.28)' : '#F0F4FF' }}>{c.deal}</td>
                      <td>
                        <div className={`demo-avatar sm ${c.ownerColor}`}>{c.owner}</div>
                      </td>
                      <td>
                        {/* Dropdown trigger (component 17) */}
                        <button className="demo-sbutton ghost" style={{ fontSize: 11, padding: '4px 10px' }}>···</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Dropdown (17) — shown open */}
              <div className="demo-card-head" style={{ marginTop: 16 }}>
                <p className="demo-card-title">Dropdown de acciones (abierto)</p>
              </div>
              <div className="demo-dropdown-open" style={{ width: 'fit-content' }}>
                <div className="demo-dropdown-item">✏ Editar contacto</div>
                <div className="demo-dropdown-item">📋 Copiar enlace</div>
                <div className="demo-dropdown-item">📤 Exportar datos</div>
                <div className="demo-dropdown-sep" />
                <div className="demo-dropdown-item danger">🗑 Eliminar</div>
              </div>

              <div className="demo-divider" />

              {/* Empty State (component 18) */}
              <div className="demo-card-head">
                <p className="demo-card-title">Empty State — sin resultados</p>
              </div>
              <div className="demo-empty-state">
                <div className="demo-empty-icon">🔍</div>
                <p className="demo-empty-title">No se encontraron contactos</p>
                <p className="demo-empty-body">Ajusta los filtros o crea un nuevo contacto para empezar.</p>
                <button className="demo-sbutton primary" style={{ fontSize: 12, padding: '7px 16px' }}>+ Agregar contacto</button>
              </div>
            </div>

            {/* Progress pipeline (component 8) */}
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Pipeline de ventas</p>
                <span className="demo-badge blue">Q1 2026</span>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { label: 'Prospecto',           value: 85, color: 'blue'   as const },
                  { label: 'Propuesta enviada',   value: 60, color: undefined },
                  { label: 'Negociación activa',  value: 40, color: 'amber'  as const },
                  { label: 'Cierre',              value: 25, color: 'green'  as const },
                  { label: 'Meta mensual',        value: 68, color: 'violet' as const },
                ].map((p) => (
                  <div key={p.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.62)' }}>{p.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,244,255,0.75)' }}>{p.value}%</span>
                    </div>
                    <div className="demo-progress-track">
                      <div className={`demo-progress-fill ${p.color ?? ''}`} style={{ width: `${p.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel: All form components ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Card variants (3) */}
            <div className="demo-scard accent">
              <p className="demo-scard-title">🔴 Trato prioritario</p>
              <p className="demo-scard-body">Ana Castillo — $52,600. Cierre estimado: 28 mar.</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="demo-badge red">Alta prioridad</span>
                <span className="demo-badge green">En negociación</span>
              </div>
            </div>

            <div className="demo-scard glass">
              <p className="demo-scard-title">Stat rápido</p>
              <div className="demo-comp-grid-2" style={{ gap: 8 }}>
                <div className="demo-sstat"><strong>$109K</strong><span>Ingresos</span></div>
                <div className="demo-sstat"><strong>68%</strong><span>Tasa cierre</span></div>
              </div>
            </div>

            {/* Form (19) — Input(5), Textarea(6), Select(7), Checkbox(14), Radio(21), Switch(24) */}
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Agregar contacto</p>
                <div className="demo-spinner sm" />
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 6 }}>Nombre</label>
                  {/* Input (5) */}
                  <input className="demo-sinput" placeholder="Nombre Apellido" defaultValue="Ana Castillo" />
                </div>

                <div className="demo-comp-grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 6 }}>Email</label>
                    <input className="demo-sinput" type="email" placeholder="email@empresa.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 6 }}>Teléfono</label>
                    <input className="demo-sinput" type="tel" placeholder="+52 55 0000" />
                  </div>
                </div>

                {/* Select (7) */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 6 }}>Plan de interés</label>
                  <select className="demo-sinput" style={{ cursor: 'pointer' }}>
                    <option>Solo — MX$59/mo</option>
                    <option>Pro — MX$129/mo</option>
                    <option selected>Full Signature — MX$249/mo</option>
                  </select>
                </div>

                {/* Textarea (6) */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 6 }}>Notas</label>
                  <textarea className="demo-sinput" rows={2} placeholder="Notas del contacto..." style={{ resize: 'none' }} />
                </div>

                {/* Checkbox (14) */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 8 }}>Opciones</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="demo-checkbox-row"><div className="demo-checkbox checked">✓</div> Enviar email de bienvenida</div>
                    <div className="demo-checkbox-row"><div className="demo-checkbox" /> Añadir a campaña activa</div>
                    <div className="demo-checkbox-row"><div className="demo-checkbox checked">✓</div> Asignar a responsable</div>
                  </div>
                </div>

                {/* Radio Group (21) */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.42)', marginBottom: 8 }}>Prioridad del trato</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div className="demo-radio-row"><div className="demo-radio checked" /><span className="demo-badge red">Alta</span></div>
                    <div className="demo-radio-row"><div className="demo-radio" /><span className="demo-badge amber">Media</span></div>
                    <div className="demo-radio-row"><div className="demo-radio" /><span className="demo-badge green">Baja</span></div>
                  </div>
                </div>

                {/* Switch (24) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="demo-switch-row"><div className="demo-switch on" /> Notificar al equipo de ventas</div>
                  <div className="demo-switch-row"><div className="demo-switch" /> Modo privado — solo responsable</div>
                </div>

                {/* Button variants (1) */}
                <div className="demo-comp-row" style={{ gap: 6 }}>
                  <button className="demo-sbutton primary" style={{ fontSize: 12, padding: '7px 14px' }}>Guardar</button>
                  <button className="demo-sbutton outline" style={{ fontSize: 12, padding: '7px 14px' }}>Cancelar</button>
                </div>
              </div>
            </div>

            {/* Spinner + Skeleton (22, 23) */}
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Estados de carga</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="demo-spinner" />
                  <div className="demo-spinner violet" />
                  <div className="demo-spinner green" />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="demo-skeleton" style={{ height: 14, width: '85%' }} />
                <div className="demo-skeleton" style={{ height: 14, width: '60%' }} />
                <div className="demo-skeleton" style={{ height: 14, width: '72%' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="demo-skeleton" style={{ height: 36, width: 36, borderRadius: '50%' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="demo-skeleton" style={{ height: 12, width: '70%' }} />
                    <div className="demo-skeleton" style={{ height: 10, width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion (12) */}
            <div className="demo-accordion">
              <div className="demo-accordion-item">
                <button className="demo-accordion-trigger">Configuración rápida <span className="demo-accordion-chevron">▼</span></button>
                <div className="demo-accordion-content">
                  Activa o desactiva funciones del módulo de contactos. Los cambios se aplican en tiempo real.
                </div>
              </div>
              <div className="demo-accordion-item">
                <button className="demo-accordion-trigger">Integraciones disponibles <span className="demo-accordion-chevron">►</span></button>
              </div>
              <div className="demo-accordion-item">
                <button className="demo-accordion-trigger">Preguntas frecuentes <span className="demo-accordion-chevron">►</span></button>
              </div>
            </div>

            {/* Tooltip (27) */}
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Tooltips informativos</p>
              </div>
              <div className="demo-comp-row" style={{ gap: 10, paddingTop: 16 }}>
                {[
                  { label: 'Tasa de apertura', tip: 'Emails abiertos / enviados' },
                  { label: 'Velocidad de ciclo', tip: 'Días promedio para cerrar un trato' },
                  { label: 'Score de lead', tip: 'Calculado por actividad + perfil' },
                ].map((t) => (
                  <div key={t.label} className="demo-tooltip-wrap">
                    <button className="demo-sbutton ghost" style={{ fontSize: 12, padding: '6px 12px' }}>{t.label} ⓘ</button>
                    <div className="demo-tooltip">{t.tip}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toast stack (26) */}
            <div className="demo-card">
              <div className="demo-card-head">
                <p className="demo-card-title">Toast notifications</p>
              </div>
              <div className="demo-toast-stack">
                <div className="demo-toast success">
                  <div className="demo-toast-icon">✓</div>
                  <div><div className="demo-toast-title">Contacto guardado</div><div className="demo-toast-body">Ana Castillo fue añadida al CRM.</div></div>
                </div>
                <div className="demo-toast warning">
                  <div className="demo-toast-icon">⚠</div>
                  <div><div className="demo-toast-title">Sincronización pendiente</div><div className="demo-toast-body">Los datos se sincronizarán en 30s.</div></div>
                </div>
                <div className="demo-toast danger">
                  <div className="demo-toast-icon">✗</div>
                  <div><div className="demo-toast-title">Error de permisos</div><div className="demo-toast-body">No tienes acceso a este módulo.</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal (20) — shown statically */}
        <div style={{ marginTop: 20 }}>
          <div className="demo-card">
            <div className="demo-card-head">
              <p className="demo-card-title">Modal — confirmación de acción destructiva</p>
              <span className="demo-badge violet">Component #20</span>
            </div>
            <div className="demo-modal-wrap">
              <div className="demo-modal">
                <p className="demo-modal-title">¿Eliminar contacto?</p>
                <p className="demo-modal-body">
                  Esta acción eliminará a <strong style={{ color: '#F0F4FF' }}>Carlos Vega</strong> y todos sus
                  registros de trato asociados. Esta acción no se puede deshacer.
                </p>
                <div className="demo-modal-actions">
                  <button className="demo-sbutton ghost" style={{ fontSize: 13, padding: '8px 16px' }}>Cancelar</button>
                  <button className="demo-sbutton danger" style={{ fontSize: 13, padding: '8px 16px' }}>Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All button variants (1) — full set */}
        <div className="demo-comp-section" style={{ marginTop: 24 }}>
          <p className="demo-comp-section-label">Button — 6 variantes completas (component #1)</p>
          <div className="demo-comp-row">
            <button className="demo-sbutton primary">Primary Action</button>
            <button className="demo-sbutton secondary">Secondary</button>
            <button className="demo-sbutton outline">Outlined</button>
            <button className="demo-sbutton ghost">Ghost</button>
            <button className="demo-sbutton danger">Destructive</button>
            <button className="demo-sbutton success">Confirm</button>
          </div>
        </div>

        {/* Alert variants (4) — full set */}
        <div className="demo-comp-section">
          <p className="demo-comp-section-label">Alert — 4 tipos (component #4)</p>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="demo-salert info">ℹ Tu cuenta está en nivel Free. Actualiza para desbloquear superficies premium.</div>
            <div className="demo-salert success">✓ Librería de componentes instalada. Lista para construir.</div>
            <div className="demo-salert warning">⚠ Verificación de entitlement retrasada. El Vault reintentará en 30s.</div>
            <div className="demo-salert danger">✗ Pago fallido. Revisa tu cuenta de Mercado Pago o PayPal.</div>
          </div>
        </div>

        {/* Avatar group + Divider */}
        <div className="demo-comp-section">
          <p className="demo-comp-section-label">Avatar group — equipo activo (component #11) + Divider #16</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="demo-avatar-group">
              <div className="demo-avatar">RM</div>
              <div className="demo-avatar blue">AT</div>
              <div className="demo-avatar green">LS</div>
              <div className="demo-avatar amber">JV</div>
              <div className="demo-avatar" style={{ background: 'rgba(240,244,255,0.1)', fontSize: 12, color: 'rgba(240,244,255,0.5)' }}>+8</div>
            </div>
            <span style={{ fontSize: 13, color: 'rgba(240,244,255,0.45)' }}>12 miembros del equipo activos ahora</span>
          </div>
          <div className="demo-divider" />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div className="demo-avatar lg">RM</div>
            <div className="demo-avatar lg blue">AT</div>
            <div className="demo-avatar lg green">SL</div>
            <div className="demo-avatar lg amber">JR</div>
            <div className="demo-avatar lg" style={{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)' }}>AC</div>
          </div>
        </div>

        {/* Status strip */}
        <div className="demo-status-strip">
          <div className="demo-status-item"><span className="demo-status-dot green" />27 de 27 componentes renderizados</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />WCAG 2.2 AAA</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Dark-first tokens</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Zero deps externas</div>
          <div className="demo-status-item" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.3)' }}>romeromedinar612@gmail.com — Full Signature</span>
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/demo/sin-lotos-web" className="demo-btn ghost">← Ver sin LotOS UI</Link>
          <Link href="/demo/con-lotos-desktop" className="demo-btn primary">Ahora: Desktop CON LotOS →</Link>
          <Link href="/demo" className="demo-btn ghost">Todos los demos</Link>
        </div>
      </div>
    </main>
  );
}
