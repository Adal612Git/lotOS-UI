import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Sin LotOS UI — Desktop Multi-Lenguaje (before)',
  description: 'Cómo se ve una app de escritorio en Python, Rust, Java, C y C++ sin sistema de diseño.',
};

export default function SinLotosDesktopLangsPage() {
  return (
    <main className="sin-shell" style={{ background: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
              Sin LotOS UI · Desktop Multi-Lenguaje
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#e0e0e0', letterSpacing: '-0.02em' }}>
              Sin sistema de diseño — 5 lenguajes
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#888' }}>
              Cada lenguaje tiene su propio look nativo genérico. Cada app parece diferente. Cero identidad compartida.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/demo/con-lotos-desktop-langs" style={{ background: '#0078d4', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
              Ver CON LotOS →
            </Link>
            <Link href="/demo" style={{ color: '#888', textDecoration: 'none', fontSize: 12, padding: '8px 0' }}>← Demos</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>

          {/* Python / Tkinter */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="demo-lang-label python">Python</span>
              <span style={{ fontSize: 12, color: '#888' }}>pywebview · Tkinter-style look</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>app.py + requirements.txt</span>
            </div>
            <div className="sin-lang-panel sin-tkinter">
              <div className="sin-tkinter-title">
                <span>● ● ●</span>
                <span>ControlDeck — Python Desktop App</span>
                <span>─ □ ✕</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#f0f0f0' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {['File', 'View', 'Tools', 'Help'].map(m => (
                    <span key={m} className="sin-tkinter-label" style={{ cursor: 'pointer' }}>{m}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  <button className="sin-tkinter-btn">Refresh</button>
                  <button className="sin-tkinter-btn">Add</button>
                  <button className="sin-tkinter-btn">Delete</button>
                  <div style={{ flex: 1 }} />
                  <button className="sin-tkinter-btn">Help</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                  {/* Left frame */}
                  <div style={{ border: '1px solid #888', padding: 8, background: '#f0f0f0' }}>
                    <div className="sin-tkinter-label" style={{ marginBottom: 6, fontWeight: 'bold' }}>Services</div>
                    {['API Gateway', 'Database', 'Payment Svc', 'Cache', 'Auth'].map((s, i) => (
                      <div key={s} style={{ padding: '4px 6px', background: i === 0 ? '#0066cc' : '#fff', color: i === 0 ? '#fff' : '#000', fontSize: 12, borderBottom: '1px solid #ddd', cursor: 'pointer' }}>{s}</div>
                    ))}
                  </div>
                  {/* Right area */}
                  <div>
                    <div style={{ border: '1px solid #888', padding: 8, marginBottom: 8, background: '#fff' }}>
                      <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>Service Details</div>
                      <table style={{ fontSize: 11, width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                          <th style={{ background: '#ddd', border: '1px solid #999', padding: '2px 6px', textAlign: 'left' }}>Property</th>
                          <th style={{ background: '#ddd', border: '1px solid #999', padding: '2px 6px', textAlign: 'left' }}>Value</th>
                        </tr></thead>
                        <tbody>
                          {[['CPU', '42%'], ['Memory', '61%'], ['Status', 'OK'], ['Uptime', '99.98%']].map(([k, v]) => (
                            <tr key={k}><td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>{k}</td><td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>{v}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11 }}>Search:</span>
                      <input className="sin-tkinter-entry" style={{ flex: 1 }} placeholder="" />
                      <button className="sin-tkinter-btn">Find</button>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 8, padding: '4px 6px', background: '#e0e0e0', border: '1px inset #999', fontSize: 11, color: '#555' }}>
                  Ready | 5 services loaded | Python 3.12
                </div>
              </div>
            </div>
          </div>

          {/* Rust / egui */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="demo-lang-label rust">Rust</span>
              <span style={{ fontSize: 12, color: '#888' }}>wry · egui minimal style</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>Cargo.toml + src/main.rs</span>
            </div>
            <div className="sin-lang-panel sin-egui">
              <div className="sin-egui-title">
                <span>ControlDeck - Rust Desktop</span>
                <span>─ □ ✕</span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button className="sin-egui-btn">Services</button>
                  <button className="sin-egui-btn" style={{ background: '#4a4a4a', borderColor: '#888' }}>Metrics</button>
                  <button className="sin-egui-btn">Logs</button>
                  <button className="sin-egui-btn">Config</button>
                </div>
                <div className="sin-egui-separator" />
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input className="sin-egui-input" placeholder="Search services..." style={{ flex: 1 }} />
                  <button className="sin-egui-btn">+ Add</button>
                </div>
                <div style={{ background: '#1c1c1c', border: '1px solid #444', fontSize: 12, marginBottom: 8 }}>
                  {[['API Gateway', '42%', '61%', 'OK'], ['Database', '28%', '74%', 'OK'], ['Payment Svc', '87%', '89%', 'WARN'], ['Cache', '15%', '30%', 'OK']].map(([n, c, m, s]) => (
                    <div key={n} style={{ display: 'flex', gap: 0, borderBottom: '1px solid #333', padding: '5px 10px', color: s === 'WARN' ? '#ffd54f' : '#e0e0e0', fontSize: 11 }}>
                      <span style={{ flex: 2 }}>{n}</span>
                      <span style={{ flex: 1, color: '#9e9e9e' }}>CPU: {c}</span>
                      <span style={{ flex: 1, color: '#9e9e9e' }}>Mem: {m}</span>
                      <span style={{ flex: 1, fontWeight: 'bold', color: s === 'WARN' ? '#ffd54f' : '#81c784' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="sin-egui-separator" />
                <div style={{ fontSize: 11, color: '#777' }}>wry 0.45 · No design system</div>
              </div>
            </div>
          </div>

          {/* Java / Swing */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="demo-lang-label java">Java</span>
              <span style={{ fontSize: 12, color: '#888' }}>JavaFX WebEngine · Swing Metal LAF</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>App.java</span>
            </div>
            <div className="sin-lang-panel sin-swing">
              <div className="sin-swing-title">
                <span>ControlDeck</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ background: '#c8d4de', border: '1px solid #8899a6', borderRadius: 3, padding: '1px 8px', fontSize: 10, cursor: 'pointer' }}>─</button>
                  <button style={{ background: '#c8d4de', border: '1px solid #8899a6', borderRadius: 3, padding: '1px 8px', fontSize: 10, cursor: 'pointer' }}>□</button>
                  <button style={{ background: '#c8d4de', border: '1px solid #8899a6', borderRadius: 3, padding: '1px 8px', fontSize: 10, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
              <div style={{ padding: '8px', background: '#d6dbe0' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  <button className="sin-swing-btn">Refresh</button>
                  <button className="sin-swing-btn">Add Service</button>
                  <button className="sin-swing-btn">Export</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 6 }}>
                  <div className="sin-swing-panel">
                    <div className="sin-swing-panel-title">Navigation</div>
                    {['Dashboard', 'Services', 'Logs', 'Alerts', 'Settings'].map((n, i) => (
                      <div key={n} style={{ padding: '4px 6px', background: i === 0 ? '#4a90d9' : 'transparent', color: i === 0 ? '#fff' : '#333', fontSize: 11, cursor: 'pointer' }}>{n}</div>
                    ))}
                  </div>
                  <div className="sin-swing-panel">
                    <div className="sin-swing-panel-title">Service Monitor</div>
                    <table className="sin-swing-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>
                        <th>Service</th><th>CPU</th><th>Memory</th><th>Status</th>
                      </tr></thead>
                      <tbody>
                        {[['API Gateway', '42%', '61%', 'OK'], ['Database', '28%', '74%', 'OK'], ['Payments', '87%', '89%', 'WARN']].map(([n,c,m,s]) => (
                          <tr key={n}><td>{n}</td><td>{c}</td><td>{m}</td><td style={{ color: s === 'WARN' ? '#c45000' : '#006400', fontWeight: 'bold' }}>{s}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ marginTop: 6, padding: '3px 6px', background: '#bac5cc', border: '1px solid #8899a6', fontSize: 10, color: '#444' }}>
                  Ready | JavaFX 21 | No design system
                </div>
              </div>
            </div>
          </div>

          {/* C / Win32 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="demo-lang-label c">C</span>
              <span style={{ fontSize: 12, color: '#888' }}>webview.h · Win32 dialog style</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>main.c</span>
            </div>
            <div className="sin-lang-panel sin-win32">
              <div className="sin-win32-title">
                <span>ControlDeck</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {['─', '□', '✕'].map(b => <button key={b} style={{ background: '#c4c0b4', border: '2px solid', borderColor: '#fff #888 #888 #fff', padding: '1px 6px', fontSize: 10, cursor: 'pointer', fontFamily: 'Tahoma' }}>{b}</button>)}
                </div>
              </div>
              <div style={{ padding: 10, background: '#ece9d8' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  <button className="sin-win32-btn">Refresh</button>
                  <button className="sin-win32-btn">Add</button>
                  <div style={{ flex: 1 }} />
                  <button className="sin-win32-btn">Help</button>
                </div>
                <div className="sin-win32-group" style={{ marginBottom: 10 }}>
                  <span className="sin-win32-group-label">Service Status</span>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'Tahoma' }}>
                    <thead><tr>
                      {['Name', 'CPU%', 'Mem%', 'Status'].map(h => <th key={h} style={{ background: '#d4d0c8', border: '1px solid #999', padding: '2px 6px', textAlign: 'left' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {[['API Gateway','42','61','Running'],['Database','28','74','Running'],['Payments','87','89','Warning']].map(([n,c,m,s])=> (
                        <tr key={n}>{[n,c+'%',m+'%',s].map((v,i)=><td key={i} style={{ border: '1px solid #ccc', padding: '2px 6px', background: '#fff', color: s==='Warning'&&i===3?'#c45000':'#000' }}>{v}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="sin-win32-group">
                  <span className="sin-win32-group-label">Options</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, fontFamily: 'Tahoma' }}>
                    <label><input type="checkbox" defaultChecked /> Auto-refresh</label>
                    <label><input type="checkbox" /> Sound alerts</label>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <button className="sin-win32-btn">OK</button>
                  <button className="sin-win32-btn">Cancel</button>
                  <button className="sin-win32-btn">Apply</button>
                </div>
              </div>
            </div>
          </div>

          {/* C++ / Qt */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="demo-lang-label cpp">C++</span>
              <span style={{ fontSize: 12, color: '#888' }}>webview C++ wrapper · Qt Fusion style</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666' }}>main.cpp</span>
            </div>
            <div className="sin-lang-panel sin-qt">
              <div className="sin-qt-title">
                <span>ControlDeck — C++ Application</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ background: '#5a5a5a', border: 'none', color: '#fff', borderRadius: 3, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>─</button>
                  <button style={{ background: '#5a5a5a', border: 'none', color: '#fff', borderRadius: 3, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>□</button>
                  <button style={{ background: '#c0392b', border: 'none', color: '#fff', borderRadius: 3, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', height: 200, background: '#f0f0f0' }}>
                <div style={{ width: 140, borderRight: '1px solid #ccc', padding: 8, background: '#fafafa' }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: '#444', marginBottom: 8, fontFamily: '"Segoe UI"' }}>NAVIGATION</div>
                  {['Dashboard', 'Services', 'Logs', 'Config'].map((n, i) => (
                    <div key={n} style={{ padding: '5px 8px', background: i === 0 ? '#e8f0fe' : 'transparent', borderRadius: 4, fontSize: 12, color: i === 0 ? '#1a73e8' : '#333', cursor: 'pointer', marginBottom: 2 }}>{n}</div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: 10 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    <button className="sin-qt-btn">Refresh</button>
                    <button className="sin-qt-btn">Add Service</button>
                    <input className="sin-qt-input" placeholder="Filter..." style={{ flex: 1 }} />
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead><tr>
                      {['Service','CPU','Memory','Status'].map(h=><th key={h} style={{ background: '#e8eaed', border: '1px solid #ccc', padding: '4px 8px', textAlign: 'left' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {[['API Gateway','42%','61%','Running'],['Database','28%','74%','Running'],['Payments','87%','89%','Warning'],['Cache','15%','30%','Running']].map(([n,c,m,s])=>(
                        <tr key={n}>{[n,c,m,s].map((v,i)=><td key={i} style={{ border: '1px solid #e0e0e0', padding: '4px 8px', color: s==='Warning'&&i===3?'#e67e22':'#333' }}>{v}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ background: '#e8eaed', border: '1px solid #ccc', padding: '3px 10px', display: 'flex', gap: 16, fontSize: 11, color: '#666' }}>
                <span>Ready</span><span>|</span><span>4 services</span><span>|</span><span>No design system</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ marginTop: 20, padding: '14px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#888' }}>5 lenguajes. 5 looks diferentes. Cero identidad. → </span>
          <Link href="/demo/con-lotos-desktop-langs" style={{ background: '#0078d4', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
            Ver con LotOS UI — 5 lenguajes, 1 sistema →
          </Link>
        </div>
      </div>
    </main>
  );
}
