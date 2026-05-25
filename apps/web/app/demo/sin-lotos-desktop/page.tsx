import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Sin LotOS UI — ControlDeck Desktop (before)',
  description: 'Panel de control de escritorio construido sin sistema de diseño. Raw HTML + estilos genéricos.',
};

const services = [
  { name: 'API Gateway',     cpu: 42, mem: 61, status: 'OK',   uptime: '99.98%' },
  { name: 'Base de datos',   cpu: 28, mem: 74, status: 'OK',   uptime: '100%'   },
  { name: 'Servicio de pagos', cpu: 87, mem: 89, status: 'WARN', uptime: '99.1%' },
  { name: 'Cache Redis',     cpu: 15, mem: 30, status: 'OK',   uptime: '100%'   },
  { name: 'Microservicio Auth', cpu: 33, mem: 45, status: 'OK',uptime: '100%'   },
];

export default function SinLotosDesktopPage() {
  return (
    <main className="sin-shell" style={{ background: '#2d2d2d', color: '#f0f0f0', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      {/* Simulated desktop window */}
      <div style={{ maxWidth: 1100, margin: '24px auto', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        {/* Window title bar — generic OS chrome */}
        <div style={{ background: '#3c3c3c', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #555', borderRadius: '6px 6px 0 0' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f56', border: '1px solid #e0443e' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#ffbd2e', border: '1px solid #dea123' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#27c93f', border: '1px solid #1aab29' }} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 13, color: '#ccc' }}>ControlDeck v1.2 — Monitor de Servicios</span>
          <span style={{ fontSize: 11, color: '#888' }}>Python 3.12 · localhost:8080</span>
        </div>

        {/* App layout */}
        <div style={{ display: 'flex', minHeight: 620, background: '#1e1e1e' }}>
          {/* Sidebar — raw, no system */}
          <div style={{ width: 190, background: '#252526', borderRight: '1px solid #444', padding: '12px 0' }}>
            <div style={{ padding: '0 12px 8px', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
              NAVEGACIÓN
            </div>
            {[
              { icon: '📊', label: 'Dashboard',    active: true },
              { icon: '⚙', label: 'Servicios',    active: false },
              { icon: '📋', label: 'Logs',         active: false },
              { icon: '🔔', label: 'Alertas (3)',  active: false },
              { icon: '👥', label: 'Usuarios',     active: false },
              { icon: '🔒', label: 'Seguridad',    active: false },
              { icon: '📁', label: 'Archivos',     active: false },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '9px 14px', cursor: 'pointer', fontSize: 13,
                background: item.active ? '#37373d' : 'transparent',
                borderLeft: item.active ? '2px solid #0078d4' : '2px solid transparent',
                color: item.active ? '#cce4ff' : '#ccc',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
            <div style={{ margin: '12px 12px', height: 1, background: '#444' }} />
            <div style={{ padding: '0 12px 8px', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
              SISTEMA
            </div>
            <div style={{ padding: '9px 14px', fontSize: 13, color: '#ccc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚡</span> Acciones rápidas
            </div>
            <div style={{ padding: '9px 14px', fontSize: 13, color: '#ccc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📈</span> Métricas
            </div>
          </div>

          {/* Main area */}
          <div style={{ flex: 1, padding: 18, overflow: 'auto', background: '#1e1e1e' }}>
            {/* Tabs — raw */}
            <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: 16 }}>
              {['Resumen', 'Servicios', 'Logs', 'Config'].map((t, i) => (
                <button key={t} style={{
                  padding: '7px 16px', background: 'none', border: 'none',
                  borderBottom: i === 0 ? '2px solid #0078d4' : '2px solid transparent',
                  color: i === 0 ? '#cce4ff' : '#888', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'Segoe UI, Arial, sans-serif',
                  marginBottom: -1,
                }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Stats row — raw */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'CPU Total', value: '41%', color: '#0078d4' },
                { label: 'Memoria', value: '59%', color: '#e8a33a' },
                { label: 'Red I/O', value: '1.2 GB/s', color: '#4caf50' },
                { label: 'Incidentes', value: '1 WARN', color: '#e8503a' },
              ].map((s) => (
                <div key={s.label} style={{ background: '#2d2d2d', border: '1px solid #444', borderRadius: 4, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 'bold', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Alert */}
            <div style={{ background: '#3d2b00', border: '1px solid #e8a33a', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#ffc966', marginBottom: 14 }}>
              ⚠ Servicio de pagos: CPU al 87%, memoria al 89%. Revisión recomendada.
            </div>

            {/* Services table */}
            <div style={{ background: '#252526', border: '1px solid #444', borderRadius: 4, marginBottom: 14 }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #444', fontSize: 13, fontWeight: 'bold', color: '#ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Servicios activos</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ background: '#0078d4', color: '#fff', border: 'none', borderRadius: 3, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>+ Agregar</button>
                  <button style={{ background: '#2d2d2d', color: '#ccc', border: '1px solid #555', borderRadius: 3, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>↻ Refrescar</button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#2a2a2a' }}>
                    {['#', 'Servicio', 'CPU %', 'Mem %', 'Estado', 'Uptime', 'Acciones'].map((h) => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#888', borderBottom: '1px solid #444', fontWeight: 'normal', fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, i) => (
                    <tr key={s.name} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '10px 12px', color: '#666' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', color: '#e0e0e0', fontWeight: 'bold' }}>{s.name}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ color: s.cpu > 80 ? '#e8503a' : s.cpu > 60 ? '#e8a33a' : '#4caf50' }}>{s.cpu}%</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ color: s.mem > 80 ? '#e8503a' : s.mem > 60 ? '#e8a33a' : '#4caf50' }}>{s.mem}%</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 'bold',
                          background: s.status === 'OK' ? 'rgba(76,175,80,0.2)' : 'rgba(232,163,58,0.2)',
                          color: s.status === 'OK' ? '#81c784' : '#ffd54f',
                          border: `1px solid ${s.status === 'OK' ? '#4caf50' : '#e8a33a'}`,
                        }}>{s.status}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#888', fontSize: 12 }}>{s.uptime}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <button style={{ background: 'none', border: '1px solid #555', color: '#ccc', borderRadius: 3, padding: '3px 9px', fontSize: 11, cursor: 'pointer', marginRight: 4 }}>Ver</button>
                        <button style={{ background: 'none', border: '1px solid #e8503a', color: '#e8503a', borderRadius: 3, padding: '3px 9px', fontSize: 11, cursor: 'pointer' }}>Stop</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Progress bars — raw */}
            <div style={{ background: '#252526', border: '1px solid #444', borderRadius: 4, padding: '14px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#ccc', marginBottom: 12 }}>Uso de recursos</div>
              {[
                { label: 'CPU promedio', value: 41 },
                { label: 'Memoria total', value: 59 },
                { label: 'Disco I/O', value: 23 },
                { label: 'Ancho de banda', value: 76 },
              ].map((p) => (
                <div key={p.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
                    <span>{p.label}</span><span>{p.value}%</span>
                  </div>
                  <div style={{ height: 10, background: '#3c3c3c', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.value}%`, background: p.value > 70 ? '#e8503a' : '#0078d4' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Form: raw config panel */}
            <div style={{ background: '#252526', border: '1px solid #444', borderRadius: 4, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#ccc', marginBottom: 12, borderBottom: '1px solid #444', paddingBottom: 8 }}>Configuración de umbral</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Umbral CPU (%)</label>
                  <input defaultValue="80" style={{ width: '100%', background: '#1e1e1e', border: '1px solid #555', color: '#f0f0f0', padding: '6px 10px', borderRadius: 3, fontSize: 13, fontFamily: 'Segoe UI, Arial' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Umbral Memoria (%)</label>
                  <input defaultValue="85" style={{ width: '100%', background: '#1e1e1e', border: '1px solid #555', color: '#f0f0f0', padding: '6px 10px', borderRadius: 3, fontSize: 13, fontFamily: 'Segoe UI, Arial' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Canal de alerta</label>
                  <select style={{ width: '100%', background: '#1e1e1e', border: '1px solid #555', color: '#f0f0f0', padding: '6px 10px', borderRadius: 3, fontSize: 13, fontFamily: 'Segoe UI, Arial' }}>
                    <option>Email</option>
                    <option>Slack</option>
                    <option>Webhook</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Intervalo de chequeo</label>
                  <select style={{ width: '100%', background: '#1e1e1e', border: '1px solid #555', color: '#f0f0f0', padding: '6px 10px', borderRadius: 3, fontSize: 13, fontFamily: 'Segoe UI, Arial' }}>
                    <option>30 segundos</option>
                    <option>1 minuto</option>
                    <option>5 minutos</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 12 }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: 12, color: '#ccc' }}>Activar notificaciones automáticas</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#0078d4', color: '#fff', border: 'none', borderRadius: 3, padding: '7px 18px', fontSize: 13, cursor: 'pointer' }}>Guardar configuración</button>
                <button style={{ background: 'none', color: '#ccc', border: '1px solid #555', borderRadius: 3, padding: '7px 18px', fontSize: 13, cursor: 'pointer' }}>Restablecer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ background: '#007acc', padding: '3px 16px', display: 'flex', gap: 20, fontSize: 11, color: '#fff', borderRadius: '0 0 6px 6px' }}>
          <span>● Conectado</span>
          <span>5 servicios monitoreados</span>
          <span>Última actualización: hace 12s</span>
          <span style={{ marginLeft: 'auto' }}>Python 3.12 · ControlDeck sin LotOS UI</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 0 24px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: '#888' }}>
          ¿Quieres esto pero 10× mejor? →{' '}
          <Link href="/demo/con-lotos-desktop" style={{ color: '#0078d4' }}>Ver CON LotOS UI →</Link>
        </div>
        <Link href="/demo" style={{ fontSize: 13, color: '#0078d4' }}>← Todos los demos</Link>
      </div>
    </main>
  );
}
