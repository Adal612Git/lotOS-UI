import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Sin LotOS UI — ClearCRM (before)',
  description: 'A realistic CRM admin panel built without any design system. Generic, inconsistent, raw.',
};

const contacts = [
  { id: 1, name: 'María García', email: 'garcia@empresa.mx', company: 'Fabricaciones MX', status: 'active', deal: '$18,400', owner: 'R. Medina' },
  { id: 2, name: 'Carlos Vega',  email: 'cvega@logistica.com', company: 'Logística Norte', status: 'pending', deal: '$7,200', owner: 'A. Torres' },
  { id: 3, name: 'Sandra López', email: 's.lopez@retail.mx',  company: 'Retail Express',  status: 'active', deal: '$31,000', owner: 'R. Medina' },
  { id: 4, name: 'Jorge Ruiz',   email: 'j.ruiz@tech.io',     company: 'TechSol',         status: 'inactive', deal: '$0', owner: 'L. Soto' },
  { id: 5, name: 'Ana Castillo', email: 'castillo@fintech.mx',company: 'FinTech MX',      status: 'active', deal: '$52,600', owner: 'A. Torres' },
];

export default function SinLotosWebPage() {
  return (
    <main className="sin-shell">
      <header className="sin-header">
        <div className="sin-logo">ClearCRM</div>
        <nav className="sin-nav">
          <a href="#">Contactos</a>
          <a href="#">Tratos</a>
          <a href="#">Reportes</a>
          <a href="#">Configuración</a>
          <a href="#">Ayuda</a>
        </nav>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="sin-btn secondary sin-btn" style={{ fontSize: 12 }}>demo@company.test</button>
          <button className="sin-btn danger" style={{ fontSize: 12 }}>Cerrar sesión</button>
        </div>
      </header>

      <div className="sin-body">
        {/* Breadcrumbs */}
        <div className="sin-breadcrumbs">
          <a href="#">Inicio</a> &gt; <a href="#">CRM</a> &gt; Contactos
        </div>

        {/* Tabs */}
        <div className="sin-tabs">
          <button className="sin-tab active">Resumen</button>
          <button className="sin-tab">Contactos</button>
          <button className="sin-tab">Tratos</button>
          <button className="sin-tab">Reportes</button>
          <button className="sin-tab">Ajustes</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 className="sin-page-title">Panel de Contactos</h1>
            <p className="sin-page-sub">Gestiona clientes, tratos y actividad de ventas.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="sin-btn secondary">Exportar</button>
            <button className="sin-btn primary">+ Nuevo contacto</button>
          </div>
        </div>

        {/* Alerts */}
        <div className="sin-alert warn">⚠ Tienes 3 tareas vencidas. Revisa tu lista de seguimiento.</div>

        {/* Stats */}
        <div className="sin-grid-4" style={{ marginBottom: 16 }}>
          <div className="sin-stat">
            <strong>$109,200</strong>
            <span>Ingresos totales</span>
          </div>
          <div className="sin-stat">
            <strong>5</strong>
            <span>Contactos activos</span>
          </div>
          <div className="sin-stat">
            <strong>3</strong>
            <span>Tratos abiertos</span>
          </div>
          <div className="sin-stat">
            <strong>68%</strong>
            <span>Tasa de cierre</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          {/* Left: Table */}
          <div className="sin-card">
            <div className="sin-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Contactos ({contacts.length})</span>
              <input className="sin-input" style={{ width: 180, fontSize: 12 }} placeholder="Buscar..." />
            </div>
            <table className="sin-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Nombre</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                  <th>Trato</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{ fontWeight: 'bold', fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{c.email}</div>
                    </td>
                    <td>{c.company}</td>
                    <td>
                      <span className={`sin-status ${c.status === 'active' ? 'active' : c.status === 'pending' ? 'pending' : 'inactive'}`}>
                        {c.status === 'active' ? 'Activo' : c.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{c.deal}</td>
                    <td>{c.owner}</td>
                    <td>
                      <button className="sin-btn secondary sin-btn small" style={{ marginRight: 4 }}>Ver</button>
                      <button className="sin-btn danger sin-btn small">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: '#888' }}>
              <span>Mostrando 5 de 5 resultados</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="sin-btn secondary sin-btn small">‹ Anterior</button>
                <button className="sin-btn secondary sin-btn small">Siguiente ›</button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Progreso de pipeline */}
            <div className="sin-card">
              <div className="sin-card-title">Pipeline de ventas</div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Prospecto</div>
              <div className="sin-progress"><div className="sin-progress-bar" style={{ width: '85%' }} /></div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Propuesta enviada</div>
              <div className="sin-progress"><div className="sin-progress-bar green" style={{ width: '60%' }} /></div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Negociación</div>
              <div className="sin-progress"><div className="sin-progress-bar orange" style={{ width: '40%' }} /></div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Cierre</div>
              <div className="sin-progress"><div className="sin-progress-bar" style={{ width: '25%' }} /></div>
            </div>

            {/* Add contact form */}
            <div className="sin-card">
              <div className="sin-card-title">Agregar contacto</div>
              <div className="sin-form-group">
                <label className="sin-label">Nombre completo</label>
                <input className="sin-input" type="text" placeholder="Nombre Apellido" />
              </div>
              <div className="sin-grid-2">
                <div className="sin-form-group">
                  <label className="sin-label">Email</label>
                  <input className="sin-input" type="email" placeholder="email@empresa.com" />
                </div>
                <div className="sin-form-group">
                  <label className="sin-label">Teléfono</label>
                  <input className="sin-input" type="tel" placeholder="+52 55 0000 0000" />
                </div>
              </div>
              <div className="sin-form-group">
                <label className="sin-label">Empresa</label>
                <input className="sin-input" type="text" placeholder="Nombre de la empresa" />
              </div>
              <div className="sin-form-group">
                <label className="sin-label">Plan de interés</label>
                <select className="sin-input sin-select">
                  <option>Solo — MX$59/mo</option>
                  <option>Pro — MX$129/mo</option>
                  <option>Full Signature — MX$249/mo</option>
                </select>
              </div>
              <div className="sin-form-group">
                <label className="sin-label">Notas</label>
                <textarea className="sin-input" rows={3} placeholder="Notas del contacto..." style={{ resize: 'none' }} />
              </div>
              {/* Checkboxes */}
              <div className="sin-form-group">
                <label className="sin-label">Opciones</label>
                <div className="sin-checkbox-row"><input type="checkbox" defaultChecked /> Enviar bienvenida por email</div>
                <div className="sin-checkbox-row"><input type="checkbox" /> Añadir a campaña activa</div>
                <div className="sin-checkbox-row"><input type="checkbox" /> Asignar a responsable actual</div>
              </div>
              {/* Radio */}
              <div className="sin-form-group">
                <label className="sin-label">Prioridad</label>
                <div className="sin-radio-row"><input type="radio" name="priority" defaultChecked /> Alta</div>
                <div className="sin-radio-row"><input type="radio" name="priority" /> Media</div>
                <div className="sin-radio-row"><input type="radio" name="priority" /> Baja</div>
              </div>
              {/* Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 13, color: '#444' }}>
                <div className="sin-switch on" />
                Notificar al equipo de ventas
              </div>
              <button className="sin-btn primary" style={{ width: '100%' }}>Guardar contacto</button>
            </div>

            {/* Accordion */}
            <div className="sin-accordion">
              <div className="sin-accordion-trigger">
                ▼ Configuración rápida
              </div>
              <div className="sin-accordion-content">
                Activa o desactiva funciones del módulo de contactos desde aquí.
              </div>
            </div>
            <div className="sin-accordion">
              <div className="sin-accordion-trigger">
                ► Preguntas frecuentes
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: more components */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          {/* Loading states */}
          <div className="sin-card">
            <div className="sin-card-title">Cargando datos...</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13, color: '#888' }}>
              <span className="sin-spinner" /> Sincronizando con servidor...
            </div>
            <div className="sin-skeleton" style={{ width: '80%' }} />
            <div className="sin-skeleton" style={{ width: '60%' }} />
            <div className="sin-skeleton" style={{ width: '70%' }} />
          </div>

          {/* Dropdown + tooltip + empty + modal */}
          <div className="sin-card">
            <div className="sin-card-title">Más componentes</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Menú de acciones (dropdown abierto):</div>
              <div className="sin-dropdown">
                <div className="sin-dropdown-item">✏ Editar contacto</div>
                <div className="sin-dropdown-item">📋 Copiar enlace</div>
                <div className="sin-dropdown-item">📤 Exportar datos</div>
                <div style={{ borderTop: '1px solid #eee', margin: '3px 0' }} />
                <div className="sin-dropdown-item danger">🗑 Eliminar</div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Tooltip:</div>
              <div className="sin-tooltip-wrap">
                <button className="sin-btn secondary">Más info</button>
                <div className="sin-tooltip">Información adicional del contacto</div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Empty state:</div>
              <div className="sin-empty">
                📭 No se encontraron resultados.<br />
                <button className="sin-btn primary" style={{ marginTop: 8 }}>+ Agregar registro</button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Toast / notificación:</div>
              <div className="sin-toast">✓ Contacto guardado correctamente.</div>
            </div>
          </div>
        </div>

        {/* Modal (shown statically) */}
        <div style={{ marginTop: 14 }}>
          <div className="sin-card">
            <div className="sin-card-title">Modal de confirmación (vista previa)</div>
            <div className="sin-modal-wrap">
              <div className="sin-modal">
                <div className="sin-modal-title">¿Eliminar contacto?</div>
                <div className="sin-modal-body">
                  Esta acción eliminará a <strong>Carlos Vega</strong> y todos sus registros de trato asociados.
                  Esta acción no se puede deshacer.
                </div>
                <div className="sin-modal-actions">
                  <button className="sin-btn secondary">Cancelar</button>
                  <button className="sin-btn danger">Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#888' }}>
            <span>¿Demasiado trabajo construir esto? → </span>
            <Link href="/demo/con-lotos-web" style={{ color: '#0066cc' }}>Ver lo mismo CON LotOS UI →</Link>
          </div>
          <Link href="/demo" style={{ fontSize: 13, color: '#0066cc' }}>← Todos los demos</Link>
        </div>
      </div>
    </main>
  );
}
