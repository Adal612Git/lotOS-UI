import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Con LotOS UI — ControlDeck Desktop (after)',
  description: 'Panel de control de escritorio construido con LotOS UI Desktop Shell. Todos los 27 componentes. Python + HTML bridge.',
};

const services = [
  { name: 'API Gateway',       cpu: 42, mem: 61, status: 'active'  as const, uptime: '99.98%', initials: 'AG', color: 'blue'  as const },
  { name: 'Base de datos',     cpu: 28, mem: 74, status: 'active'  as const, uptime: '100%',   initials: 'DB', color: 'green' as const },
  { name: 'Servicio de pagos', cpu: 87, mem: 89, status: 'pending' as const, uptime: '99.1%',  initials: 'SP', color: 'amber' as const },
  { name: 'Cache Redis',       cpu: 15, mem: 30, status: 'active'  as const, uptime: '100%',   initials: 'CR', color: 'green' as const },
  { name: 'Auth Service',      cpu: 33, mem: 45, status: 'active'  as const, uptime: '100%',   initials: 'AU', color: ''      as const },
] as const;

const statusBadge = (s: string) => {
  if (s === 'active')  return <span className="demo-badge green">OK</span>;
  if (s === 'pending') return <span className="demo-badge amber">WARN</span>;
  return <span className="demo-badge red">DOWN</span>;
};

export default function ConLotosDesktopPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Desktop Shell — ControlDeck
        </div>
        <div className="demo-header-center">
          <div className="demo-live"><span className="demo-live-pulse" />LIVE</div>
          <span className="demo-time">14:37:22 UTC</span>
          <span className="demo-badge green">Python 3.12 bridge</span>
        </div>
        <div className="demo-header-right">
          <span className="demo-badge amber">1 WARN</span>
          <nav className="demo-nav">
            <Link href="/demo/sin-lotos-desktop">Ver sin LotOS →</Link>
            <Link href="/demo">← Demos</Link>
          </nav>
        </div>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Desktop Template — lotos-ui desktop-init -l python -t control-center-desktop</p>

        {/* Desktop window chrome (LotOS token) */}
        <div className="demo-desktop-window">
          {/* Title bar */}
          <div className="demo-desktop-titlebar">
            <div className="demo-titlebar-dot red" />
            <div className="demo-titlebar-dot amber" />
            <div className="demo-titlebar-dot green" />
            <span className="demo-titlebar-name">ControlDeck — Monitor de Servicios · lotos-ui desktop-init · Python</span>
            <span className="demo-badge violet" style={{ fontSize: 10 }}>Full Signature</span>
          </div>

          {/* Window body */}
          <div className="demo-desktop-body">
            {/* Sidebar */}
            <div className="demo-desktop-sidebar">
              <div className="demo-sidebar-section">
                <div className="demo-sidebar-label">Panel principal</div>
                <div className="demo-sidebar-item active"><span className="demo-sidebar-icon">📊</span>Dashboard</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">⚙</span>Servicios</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">📋</span>Logs</div>
                <div className="demo-sidebar-item">
                  <span className="demo-sidebar-icon">🔔</span>Alertas
                  <span className="demo-badge red" style={{ fontSize: 9, marginLeft: 'auto' }}>3</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(240,244,255,0.06)', margin: '4px 10px' }} />
              <div className="demo-sidebar-section">
                <div className="demo-sidebar-label">Sistema</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">👥</span>Usuarios</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">🔒</span>Seguridad</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">📁</span>Archivos</div>
                <div className="demo-sidebar-item"><span className="demo-sidebar-icon">⚡</span>Acciones</div>
              </div>
              <div style={{ height: 1, background: 'rgba(240,244,255,0.06)', margin: '4px 10px' }} />
              <div className="demo-sidebar-section">
                <div className="demo-sidebar-label">Cuenta</div>
                <div style={{ padding: '8px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="demo-avatar sm">RM</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,244,255,0.75)' }}>R. Medina</div>
                    <div style={{ fontSize: 9, color: 'rgba(240,244,255,0.3)' }}>Owner</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="demo-desktop-main">
              {/* Breadcrumbs + Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <nav className="demo-breadcrumbs">
                  <a href="#">Sistema</a>
                  <span className="demo-breadcrumbs-sep">/</span>
                  <a href="#">Servicios</a>
                  <span className="demo-breadcrumbs-sep">/</span>
                  <span className="current">Dashboard</span>
                </nav>
                <div className="demo-tabs" style={{ fontSize: 12 }}>
                  <button className="demo-tab active" style={{ padding: '5px 12px', fontSize: 12 }}>Resumen</button>
                  <button className="demo-tab" style={{ padding: '5px 12px', fontSize: 12 }}>Servicios</button>
                  <button className="demo-tab" style={{ padding: '5px 12px', fontSize: 12 }}>Logs</button>
                  <button className="demo-tab" style={{ padding: '5px 12px', fontSize: 12 }}>Config</button>
                </div>
              </div>

              {/* Alert */}
              <div className="demo-salert warning">⚠ Servicio de pagos: CPU 87%, mem 89%. Revisa el proceso de cola de transacciones.</div>

              {/* KPI Stats */}
              <div className="demo-kpi-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                <article className="demo-kpi-card blue">
                  <p className="demo-kpi-label">CPU Promedio</p>
                  <p className="demo-kpi-value">41%</p>
                  <p className="demo-kpi-meta"><span className="demo-delta up">▼ -3% vs ayer</span></p>
                </article>
                <article className="demo-kpi-card amber">
                  <p className="demo-kpi-label">Memoria</p>
                  <p className="demo-kpi-value">59%</p>
                  <p className="demo-kpi-meta"><span className="demo-delta down">↑ +7% esta hora</span></p>
                </article>
                <article className="demo-kpi-card green">
                  <p className="demo-kpi-label">Red I/O</p>
                  <p className="demo-kpi-value">1.2 GB/s</p>
                  <p className="demo-kpi-meta"><span className="demo-delta up">Nominal</span></p>
                </article>
                <article className="demo-kpi-card red">
                  <p className="demo-kpi-label">Incidentes</p>
                  <p className="demo-kpi-value">1</p>
                  <p className="demo-kpi-meta"><span className="demo-delta down">WARN activo</span></p>
                </article>
              </div>

              {/* Main grid inside desktop */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
                {/* Services table */}
                <div className="demo-card">
                  <div className="demo-card-head">
                    <p className="demo-card-title">Servicios monitoreados</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <div className="demo-spinner sm" />
                      <span className="demo-badge green">5 activos</span>
                    </div>
                  </div>
                  <table className="demo-table">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>CPU</th>
                        <th>Mem</th>
                        <th>Estado</th>
                        <th>Uptime</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.name}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className={`demo-avatar sm ${s.color}`}>{s.initials}</div>
                              <span style={{ fontWeight: 600 }}>{s.name}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div className="demo-progress-track" style={{ width: 50, height: 4 }}>
                                <div className={`demo-progress-fill ${s.cpu > 70 ? '' : s.cpu > 40 ? 'amber' : 'green'}`} style={{ width: `${s.cpu}%` }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700 }}>{s.cpu}%</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div className="demo-progress-track" style={{ width: 50, height: 4 }}>
                                <div className={`demo-progress-fill ${s.mem > 80 ? '' : s.mem > 60 ? 'amber' : 'green'}`} style={{ width: `${s.mem}%` }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700 }}>{s.mem}%</span>
                            </div>
                          </td>
                          <td>{statusBadge(s.status)}</td>
                          <td style={{ fontSize: 11, color: 'rgba(240,244,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>{s.uptime}</td>
                          <td>
                            {/* Dropdown trigger */}
                            <button className="demo-sbutton ghost" style={{ fontSize: 10, padding: '3px 8px' }}>···</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Dropdown example */}
                  <div style={{ marginTop: 12 }}>
                    <p className="demo-card-title" style={{ marginBottom: 8 }}>Dropdown — acciones de servicio</p>
                    <div className="demo-dropdown-open" style={{ width: 'fit-content' }}>
                      <div className="demo-dropdown-item">▶ Reiniciar servicio</div>
                      <div className="demo-dropdown-item">📋 Ver logs en vivo</div>
                      <div className="demo-dropdown-item">📊 Ver métricas</div>
                      <div className="demo-dropdown-sep" />
                      <div className="demo-dropdown-item danger">■ Detener servicio</div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Resource progress */}
                  <div className="demo-card">
                    <div className="demo-card-head">
                      <p className="demo-card-title">Uso de recursos</p>
                      <span className="demo-badge blue">Tiempo real</span>
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {[
                        { label: 'CPU promedio',  value: 41, color: 'blue'  as const },
                        { label: 'Memoria total', value: 59, color: 'amber' as const },
                        { label: 'Disco I/O',     value: 23, color: 'green' as const },
                        { label: 'Bandwidth',     value: 76, color: ''      as const },
                      ].map((p) => (
                        <div key={p.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: 'rgba(240,244,255,0.55)' }}>{p.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 700 }}>{p.value}%</span>
                          </div>
                          <div className="demo-progress-track">
                            <div className={`demo-progress-fill ${p.color}`} style={{ width: `${p.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skeleton loading */}
                  <div className="demo-card">
                    <div className="demo-card-head">
                      <p className="demo-card-title">Cargando métricas</p>
                      <div className="demo-spinner sm violet" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div className="demo-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="demo-skeleton" style={{ height: 11, width: '75%' }} />
                          <div className="demo-skeleton" style={{ height: 9, width: '45%' }} />
                        </div>
                      </div>
                      <div className="demo-skeleton" style={{ height: 11, width: '88%' }} />
                      <div className="demo-skeleton" style={{ height: 11, width: '63%' }} />
                    </div>
                  </div>

                  {/* Config form: Switch + Checkbox + Radio */}
                  <div className="demo-card">
                    <div className="demo-card-head">
                      <p className="demo-card-title">Configuración rápida</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="demo-switch-row"><div className="demo-switch on" /> Auto-restart en falla</div>
                      <div className="demo-switch-row"><div className="demo-switch on" /> Alertas por email</div>
                      <div className="demo-switch-row"><div className="demo-switch" /> Modo mantenimiento</div>
                      <div className="demo-divider" style={{ margin: '4px 0' }} />
                      <div className="demo-checkbox-row"><div className="demo-checkbox checked">✓</div> Monitoreo 24/7</div>
                      <div className="demo-checkbox-row"><div className="demo-checkbox checked">✓</div> Registrar eventos</div>
                      <div className="demo-checkbox-row"><div className="demo-checkbox" /> Solo errores críticos</div>
                      <div className="demo-divider" style={{ margin: '4px 0' }} />
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.35)', marginBottom: 2 }}>Intervalo de chequeo</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="demo-radio-row"><div className="demo-radio checked" /> 30 segundos</div>
                        <div className="demo-radio-row"><div className="demo-radio" /> 1 minuto</div>
                        <div className="demo-radio-row"><div className="demo-radio" /> 5 minutos</div>
                      </div>
                    </div>
                  </div>

                  {/* Combobox */}
                  <div className="demo-card">
                    <div className="demo-card-head">
                      <p className="demo-card-title">Buscar servicio</p>
                    </div>
                    <div className="demo-combobox">
                      <input className="demo-sinput demo-combobox-input" placeholder="Escribe para filtrar..." style={{ paddingRight: 32 }} />
                      <span className="demo-combobox-icon">⌕</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion — Docs / FAQ */}
              <div>
                <p className="demo-card-title" style={{ marginBottom: 10 }}>Configuración avanzada</p>
                <div className="demo-accordion">
                  <div className="demo-accordion-item">
                    <button className="demo-accordion-trigger">Umbrales de alerta <span className="demo-accordion-chevron">▼</span></button>
                    <div className="demo-accordion-content">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.38)', marginBottom: 6 }}>Umbral CPU (%)</label>
                          <input className="demo-sinput" defaultValue="80" style={{ fontSize: 12, padding: '7px 11px' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.38)', marginBottom: 6 }}>Umbral Memoria (%)</label>
                          <input className="demo-sinput" defaultValue="85" style={{ fontSize: 12, padding: '7px 11px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="demo-accordion-item">
                    <button className="demo-accordion-trigger">Canales de notificación <span className="demo-accordion-chevron">►</span></button>
                  </div>
                  <div className="demo-accordion-item">
                    <button className="demo-accordion-trigger">Políticas de reinicio <span className="demo-accordion-chevron">►</span></button>
                  </div>
                  <div className="demo-accordion-item">
                    <button className="demo-accordion-trigger">Documentación del template <span className="demo-accordion-chevron">►</span></button>
                  </div>
                </div>
              </div>

              {/* Modal */}
              <div>
                <p className="demo-card-title" style={{ marginBottom: 10 }}>Modal — detener servicio</p>
                <div className="demo-modal-wrap">
                  <div className="demo-modal">
                    <p className="demo-modal-title">¿Detener Servicio de Pagos?</p>
                    <p className="demo-modal-body">
                      Esto detendrá el procesamiento de transacciones en vivo.
                      Se creará un checkpoint de respaldo automáticamente antes de detener el proceso.
                    </p>
                    <div className="demo-modal-actions">
                      <button className="demo-sbutton ghost" style={{ fontSize: 12, padding: '7px 14px' }}>Cancelar</button>
                      <button className="demo-sbutton danger" style={{ fontSize: 12, padding: '7px 14px' }}>■ Detener servicio</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toast stack */}
              <div>
                <p className="demo-card-title" style={{ marginBottom: 10 }}>Notificaciones del sistema</p>
                <div className="demo-toast-stack">
                  <div className="demo-toast success">
                    <div className="demo-toast-icon">✓</div>
                    <div><div className="demo-toast-title">Servicio reiniciado</div><div className="demo-toast-body">API Gateway reiniciado correctamente.</div></div>
                  </div>
                  <div className="demo-toast warning">
                    <div className="demo-toast-icon">⚠</div>
                    <div><div className="demo-toast-title">Uso elevado detectado</div><div className="demo-toast-body">Servicio de pagos: CPU al 87%.</div></div>
                  </div>
                  <div className="demo-toast">
                    <div className="demo-toast-icon">ℹ</div>
                    <div><div className="demo-toast-title">Actualización disponible</div><div className="demo-toast-body">lotos-ui CLI v1.3.0 disponible.</div></div>
                  </div>
                </div>
              </div>

              {/* Tooltip row */}
              <div>
                <p className="demo-card-title" style={{ marginBottom: 10 }}>Tooltips de contexto</p>
                <div className="demo-comp-row" style={{ paddingTop: 8 }}>
                  {[
                    { label: 'Ver métricas',    tip: 'Historial de 24h en tiempo real' },
                    { label: 'Ver logs',        tip: 'Últimas 1000 líneas del proceso' },
                    { label: 'Escalar',         tip: 'Aumentar réplicas del servicio' },
                    { label: 'Checkpoint',      tip: 'Crear snapshot del estado actual' },
                  ].map((t) => (
                    <div key={t.label} className="demo-tooltip-wrap">
                      <button className="demo-sbutton ghost" style={{ fontSize: 11, padding: '6px 12px' }}>{t.label} ⓘ</button>
                      <div className="demo-tooltip">{t.tip}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty state */}
              <div className="demo-card">
                <div className="demo-card-head">
                  <p className="demo-card-title">Logs en tiempo real — sin entradas recientes</p>
                </div>
                <div className="demo-empty-state">
                  <div className="demo-empty-icon">📭</div>
                  <p className="demo-empty-title">Sin eventos recientes</p>
                  <p className="demo-empty-body">No se registraron eventos en los últimos 5 minutos. El sistema está funcionando normalmente.</p>
                  <button className="demo-sbutton ghost" style={{ fontSize: 12, padding: '6px 14px' }}>↻ Actualizar ahora</button>
                </div>
              </div>

              {/* Button variants */}
              <div className="demo-comp-section" style={{ marginBottom: 0 }}>
                <p className="demo-comp-section-label">Acciones disponibles — 6 variantes de Button</p>
                <div className="demo-comp-row">
                  <button className="demo-sbutton primary">Guardar config</button>
                  <button className="demo-sbutton secondary">Exportar reporte</button>
                  <button className="demo-sbutton outline">Ver historial</button>
                  <button className="demo-sbutton ghost">Cancelar</button>
                  <button className="demo-sbutton danger">Limpiar alertas</button>
                  <button className="demo-sbutton success">Sistema OK</button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop status bar */}
          <div className="demo-desktop-statusbar">
            <span className="demo-status-dot green" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px rgba(34,197,94,0.6)' }} />
            <span>5 servicios monitoreados</span>
            <span>|</span>
            <span>Última sync: hace 12s</span>
            <span>|</span>
            <span>Python 3.12 · LotOS Desktop Shell</span>
            <span style={{ marginLeft: 'auto' }}>lotos-ui v1.2.0 · 27 componentes activos</span>
          </div>
        </div>

        {/* All alerts */}
        <div className="demo-comp-section" style={{ marginTop: 24 }}>
          <p className="demo-comp-section-label">Alerts — 4 tipos disponibles en el desktop shell</p>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="demo-salert info">ℹ Template desktop disponible: <strong>lotos-ui desktop-init -l python -t control-center-desktop</strong></div>
            <div className="demo-salert success">✓ Build completado — desktop-template.json generado. Host app lista para compilar.</div>
            <div className="demo-salert warning">⚠ Servicio de pagos: CPU 87%. Considera escalar el pool de workers.</div>
            <div className="demo-salert danger">✗ Redis connection timeout. Verificar configuración de red en docker-compose.</div>
          </div>
        </div>

        {/* Status strip */}
        <div className="demo-status-strip">
          <div className="demo-status-item"><span className="demo-status-dot green" />27 componentes renderizados</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Desktop Shell — Python bridge</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />lotos-ui desktop-init activo</div>
          <div className="demo-status-item"><span className="demo-status-dot amber" />Pro tier template</div>
          <div className="demo-status-item" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.3)' }}>Full Signature preview</span>
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/demo/sin-lotos-desktop" className="demo-btn ghost">← Ver sin LotOS</Link>
          <Link href="/demo/con-lotos-web" className="demo-btn ghost">Ver Web CON LotOS</Link>
          <Link href="/demo" className="demo-btn primary">← Todos los demos</Link>
          <Link href="/pricing" className="demo-btn violet">Ver planes →</Link>
        </div>
      </div>
    </main>
  );
}
