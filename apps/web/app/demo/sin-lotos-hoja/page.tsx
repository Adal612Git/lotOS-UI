import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Sin LotOS UI — Hoja de Cálculo (before)',
  description: 'Hoja de cálculo operacional sin sistema de diseño. Excel/Calc genérico, sin formato, sin identidad.',
};

export default function SinLotosHojaPage() {
  return (
    <main className="sin-shell" style={{ background: '#1a1a1a', color: '#ccc', fontFamily: 'Calibri, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>
              Sin LotOS UI · Hoja de Cálculo
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#e0e0e0' }}>
              Operaciones Q1 — sin sistema de diseño
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>
              Esta es la hoja antes de aplicar el macro LotOS. Arial, fondo blanco, sin jerarquía visual.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/demo/con-lotos-hoja" style={{ background: '#0078d4', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
              Ver CON LotOS →
            </Link>
            <Link href="/demo" style={{ color: '#888', textDecoration: 'none', fontSize: 12, padding: '8px 0' }}>← Demos</Link>
          </div>
        </div>

        {/* Excel application window */}
        <div style={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', marginBottom: 24 }}>
          {/* App titlebar */}
          <div style={{ background: '#107c10', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>📊 operaciones-q1.xlsx — Microsoft Excel</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {['─', '□', '✕'].map(b => <button key={b} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', padding: '2px 8px' }}>{b}</button>)}
            </div>
          </div>

          {/* Ribbon */}
          <div style={{ background: '#f3f3f3', borderBottom: '1px solid #ccc', padding: '0 8px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              {['Inicio', 'Insertar', 'Diseño de página', 'Fórmulas', 'Datos', 'Revisar', 'Vista'].map((t, i) => (
                <div key={t} style={{ padding: '6px 14px', fontSize: 12, color: i === 0 ? '#107c10' : '#333', borderBottom: i === 0 ? '2px solid #107c10' : '2px solid transparent', cursor: 'pointer', fontWeight: i === 0 ? 700 : 400 }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '6px 0', alignItems: 'center' }}>
              {[
                { label: 'Pegar', icon: '📋' },
                { label: 'Cortar', icon: '✂' },
                { label: 'Copiar', icon: '⧉' },
              ].map(a => (
                <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 10px', borderRadius: 2, cursor: 'pointer', fontSize: 10, color: '#333' }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  {a.label}
                </div>
              ))}
              <div style={{ width: 1, height: 36, background: '#ccc', margin: '0 4px' }} />
              <select style={{ fontSize: 12, border: '1px solid #ccc', padding: '2px 4px' }}><option>Calibri</option></select>
              <select style={{ fontSize: 12, border: '1px solid #ccc', padding: '2px 4px', width: 50 }}><option>11</option></select>
              <div style={{ width: 1, height: 36, background: '#ccc', margin: '0 4px' }} />
              <span style={{ fontSize: 12, padding: '4px 8px', border: '1px solid transparent', borderRadius: 2 }}>B</span>
              <span style={{ fontSize: 12, padding: '4px 8px', fontStyle: 'italic', border: '1px solid transparent', borderRadius: 2 }}>I</span>
              <span style={{ fontSize: 12, padding: '4px 8px', textDecoration: 'underline', border: '1px solid transparent', borderRadius: 2 }}>S</span>
            </div>
          </div>

          {/* Formula bar */}
          <div className="sheet-formula-bar">
            <input readOnly value="A1" className="sheet-cell-ref" />
            <span style={{ fontSize: 12, color: '#ccc' }}>fx</span>
            <input className="sheet-formula-input" readOnly value="operaciones q1" style={{ color: '#1a1a1a' }} />
          </div>

          {/* Spreadsheet */}
          <div className="sheet-wrap">
            <div className="plain-sheet">
              <table>
                <thead>
                  <tr>
                    <th className="row-num" style={{ background: '#f3f3f3', border: '1px solid #d0d0d0', width: 36, fontSize: 11, color: '#666' }}></th>
                    {['A','B','C','D','E','F','G','H'].map(c => (
                      <th key={c} className="col-hdr">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 - Title */}
                  <tr>
                    <td className="row-num">1</td>
                    <td className="cell sel" colSpan={8} style={{ fontFamily: 'Arial', fontSize: 12, color: '#1a1a1a' }}>operaciones q1</td>
                  </tr>
                  {/* Row 2 - Subtitle */}
                  <tr>
                    <td className="row-num">2</td>
                    <td className="cell" colSpan={8} style={{ fontFamily: 'Arial', fontSize: 11, color: '#666' }}>hoja utilitaria sin sistema visual</td>
                  </tr>
                  {/* Row 3 - Empty */}
                  <tr>
                    <td className="row-num">3</td>
                    {Array(8).fill(0).map((_, i) => <td key={i} className="cell" />)}
                  </tr>
                  {/* Row 4 - Headers */}
                  <tr>
                    <td className="row-num">4</td>
                    <td className="cell hdr">owner</td>
                    <td className="cell hdr">region</td>
                    <td className="cell hdr">queue</td>
                    <td className="cell hdr">risk</td>
                    <td className="cell hdr">status</td>
                    {Array(3).fill(0).map((_, i) => <td key={i} className="cell" />)}
                  </tr>
                  {/* Rows 5-7 - Data */}
                  {[
                    ['Monica', 'North', 'Receivables', 'High', 'Needs Review'],
                    ['Alberto', 'West', 'Renewals', 'Low', 'Healthy'],
                    ['Priya', 'LATAM', 'Collections', 'Medium', 'Watch'],
                  ].map((row, ri) => (
                    <tr key={ri}>
                      <td className="row-num">{ri + 5}</td>
                      {row.map((cell, ci) => (
                        <td key={ci} className="cell" style={{ fontFamily: 'Arial', fontSize: 12 }}>{cell}</td>
                      ))}
                      {Array(3).fill(0).map((_, i) => <td key={i} className="cell" />)}
                    </tr>
                  ))}
                  {/* Empty rows */}
                  {Array(8).fill(0).map((_, ri) => (
                    <tr key={ri + 8}>
                      <td className="row-num">{ri + 8}</td>
                      {Array(8).fill(0).map((_, ci) => <td key={ci} className="cell" />)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sheet tabs */}
            <div className="sheet-tabs-bar">
              <button className="sheet-tab-btn active">ControlRoom</button>
              <button className="sheet-tab-btn">Hoja2</button>
              <button className="sheet-tab-btn">Hoja3</button>
              <span style={{ marginLeft: 8, fontSize: 16, color: '#888', cursor: 'pointer' }}>+</span>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <div style={{ padding: '16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ccc', marginBottom: 10 }}>Lo que tienes ahora:</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', color: '#888', fontSize: 12, lineHeight: 1.8 }}>
              <li>Arial 12px sin jerarquía</li>
              <li>Fondo blanco — todo se ve igual</li>
              <li>Sin KPIs visibles de un vistazo</li>
              <li>Sin formato condicional para status</li>
              <li>Sin botones de acción</li>
              <li>Requiere scroll para entender el contexto</li>
              <li>No comunica urgencia ni prioridad</li>
            </ul>
          </div>
          <div style={{ padding: '16px', borderRadius: 6, background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ccc', marginBottom: 10 }}>El macro LotOS aplica:</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', color: '#93C5FD', fontSize: 12, lineHeight: 1.8 }}>
              <li>Canvas oscuro con tokens LotOS</li>
              <li>KPI ribbon: Revenue, Escalations, SLA, Reviews</li>
              <li>Command strip: SYNC, INSPECT, ESCALATE, CLEAR</li>
              <li>Queue table con formato condicional por status</li>
              <li>Alert rail sidebar</li>
              <li>Named ranges para hooks de macro</li>
              <li>Compatible con Excel Y LibreOffice Calc</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#888' }}>¿Esta hoja te está costando decisiones lentas? →</span>
          <Link href="/demo/con-lotos-hoja" style={{ background: '#0078d4', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
            Aplicar LotOS Theme →
          </Link>
        </div>
      </div>
    </main>
  );
}
