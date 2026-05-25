import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Con LotOS UI — Hoja de Cálculo (after)',
  description: 'La misma hoja transformada con el macro LotOS. KPI ribbon, command strip, queue table. Excel + LibreOffice Calc.',
};

export default function ConLotosHojaPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Spreadsheet Theme
        </div>
        <div className="demo-header-center">
          <span className="demo-badge violet">VBA / Basic</span>
          <span className="demo-badge green">Excel + LibreOffice</span>
          <span className="demo-badge blue">1 macro · 2 plataformas</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo/sin-lotos-hoja">← Sin LotOS</Link>
          <Link href="/demo">← Demos</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Con LotOS UI · Hoja de Cálculo — Excel + LibreOffice Calc</p>
        <h1 className="demo-page-title">La misma hoja. Decisiones en 3 segundos.</h1>
        <p className="demo-page-subtitle">
          Un macro VBA (Excel) o Basic (LibreOffice Calc) transforma la hoja plana en un dashboard operacional oscuro.
          KPI ribbon, command strip, queue table con formato condicional, alert rail.
        </p>

        {/* Platform tabs visual */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 2, background: 'rgba(240,244,255,0.04)', border: '1px solid rgba(240,244,255,0.08)', borderRadius: 10, padding: 3 }}>
            <div style={{ padding: '6px 18px', borderRadius: 8, background: 'rgba(233,69,96,0.18)', color: '#FDA4AF', fontSize: 12, fontWeight: 800 }}>Microsoft Excel</div>
            <div style={{ padding: '6px 18px', borderRadius: 8, color: 'rgba(240,244,255,0.42)', fontSize: 12, fontWeight: 700 }}>LibreOffice Calc</div>
          </div>
          <span className="demo-badge amber">Misma lógica, mismos resultados</span>
        </div>

        {/* The transformed spreadsheet simulation */}
        <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', marginBottom: 24, border: '1px solid rgba(240,244,255,0.08)' }}>
          {/* Excel titlebar */}
          <div style={{ background: '#107c10', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>📊 operaciones-q1.xlsx — Microsoft Excel</span>
            <span className="demo-badge green" style={{ fontSize: 9 }}>LotOS Theme Applied</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {['─', '□', '✕'].map(b => <button key={b} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', padding: '2px 8px' }}>{b}</button>)}
            </div>
          </div>

          {/* Ribbon (dark themed now) */}
          <div style={{ background: '#0C1A2A', borderBottom: '1px solid #1E3451', padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              {['File', 'View', 'Tools', 'Macros'].map((t, i) => (
                <div key={t} style={{ padding: '6px 12px', fontSize: 12, color: i === 0 ? '#22D3EE' : '#9CB6D6', borderBottom: i === 0 ? '2px solid #22D3EE' : '2px solid transparent', cursor: 'pointer' }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
              <div style={{ fontSize: 11, color: '#9CB6D6' }}>ApplyLotosTheme ▸</div>
              <div style={{ fontSize: 11, color: '#9CB6D6' }}>RefreshDashboard ▸</div>
              <div style={{ fontSize: 11, color: '#9CB6D6' }}>OpenDetailPanel ▸</div>
            </div>
          </div>

          {/* Formula bar */}
          <div style={{ background: '#0C1A2A', borderBottom: '1px solid #1E3451', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
            <span style={{ color: '#22D3EE', width: 60 }}>A1</span>
            <span style={{ color: '#9CB6D6' }}>fx</span>
            <span style={{ color: '#E8F1FF', flex: 1 }}>= LOTOS_KPI_REVENUE</span>
          </div>

          {/* The dark spreadsheet */}
          <div className="sheet-wrap">
            <div className="lotos-sheet" style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 700 }}>
                <thead>
                  <tr>
                    <th className="row-num"></th>
                    {['A','B','C','D','E','F','G','H'].map(c => (
                      <th key={c} style={{ background: '#08111C', border: '1px solid #1A2E46', padding: '2px 4px', width: 90, textAlign: 'center', fontSize: 10, color: '#29456B', fontWeight: 'normal' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Kicker */}
                  <tr>
                    <td className="row-num">1</td>
                    <td className="cell-hero-kicker" colSpan={3} style={{ border: '1px solid #22D3EE' }}>
                      LOTOS CALC MODERNIZATION SURFACE
                    </td>
                    {Array(5).fill(0).map((_, i) => <td key={i} style={{ background: '#08111C', border: '1px solid #1A2E46' }} />)}
                  </tr>
                  {/* Row 2: Title */}
                  <tr>
                    <td className="row-num">2</td>
                    <td className="cell-hero-title" colSpan={8}>
                      ControlRoom Dashboard — same spreadsheet, premium operation
                    </td>
                  </tr>
                  {/* Row 3: Subtitle */}
                  <tr>
                    <td className="row-num">3</td>
                    <td className="cell-hero-sub" colSpan={8}>
                      Contract-ready layout with KPI ribbon, action strip, queue table, and alert rail.
                    </td>
                  </tr>
                  {/* Row 4: Spacer */}
                  <tr>
                    <td className="row-num">4</td>
                    {Array(8).fill(0).map((_, i) => <td key={i} style={{ background: '#08111C', border: '1px solid #1A2E46', height: 8 }} />)}
                  </tr>
                  {/* Row 5: KPI Ribbon label */}
                  <tr>
                    <td className="row-num">5</td>
                    <td className="cell-strip-label" colSpan={8}>KPI RIBBON</td>
                  </tr>
                  {/* Rows 6-7: KPI Cards */}
                  {[6, 7].map(r => (
                    <tr key={r}>
                      <td className="row-num">{r}</td>
                      <td className="cell-kpi" colSpan={2}>
                        {r === 6 ? <><div style={{ fontSize: 18, fontWeight: 800 }}>$1.8M</div><div className="cell-kpi-label">NET REVENUE</div></> : <div style={{ height: 20 }} />}
                      </td>
                      <td className="cell-kpi" colSpan={2}>
                        {r === 6 ? <><div style={{ fontSize: 18, fontWeight: 800 }}>14</div><div className="cell-kpi-label">ESCALATIONS</div></> : <div style={{ height: 20 }} />}
                      </td>
                      <td className="cell-kpi" colSpan={2}>
                        {r === 6 ? <><div style={{ fontSize: 18, fontWeight: 800, color: '#86EFAC' }}>93%</div><div className="cell-kpi-label">SLA HEALTH</div></> : <div style={{ height: 20 }} />}
                      </td>
                      <td className="cell-kpi" colSpan={2}>
                        {r === 6 ? <><div style={{ fontSize: 18, fontWeight: 800 }}>08</div><div className="cell-kpi-label">PENDING REVIEWS</div></> : <div style={{ height: 20 }} />}
                      </td>
                    </tr>
                  ))}
                  {/* Rows 8-9: Spacer */}
                  <tr>
                    <td className="row-num">8</td>
                    {Array(8).fill(0).map((_, i) => <td key={i} style={{ background: '#08111C', border: '1px solid #1A2E46', height: 8 }} />)}
                  </tr>
                  {/* Row 9: Spacer */}
                  <tr>
                    <td className="row-num">9</td>
                    {Array(8).fill(0).map((_, i) => <td key={i} style={{ background: '#08111C', border: '1px solid #1A2E46', height: 8 }} />)}
                  </tr>
                  {/* Row 10: Command strip label */}
                  <tr>
                    <td className="row-num">10</td>
                    <td className="cell-strip-label" colSpan={8}>ACTION STRIP</td>
                  </tr>
                  {/* Row 11: Commands */}
                  <tr>
                    <td className="row-num">11</td>
                    <td className="cell-cmd" colSpan={2}>SYNC</td>
                    <td className="cell-cmd" colSpan={2}>INSPECT</td>
                    <td className="cell-cmd" colSpan={2}>ESCALATE</td>
                    <td className="cell-cmd" colSpan={2}>CLEAR</td>
                  </tr>
                  {/* Row 12: Spacer */}
                  <tr>
                    <td className="row-num">12</td>
                    {Array(8).fill(0).map((_, i) => <td key={i} style={{ background: '#08111C', border: '1px solid #1A2E46', height: 8 }} />)}
                  </tr>
                  {/* Row 13: Queue table label */}
                  <tr>
                    <td className="row-num">13</td>
                    <td className="cell-q-label" colSpan={6}>QUEUE TABLE</td>
                    <td className="cell-alert" rowSpan={5} colSpan={2} style={{ verticalAlign: 'top', lineHeight: 1.7 }}>
                      ALERT RAIL{'\n\n'}Critical: Pending Vendor Sync{'\n'}Watch: Inventory Drift Review{'\n'}Hook: OpenAlertInspector
                    </td>
                  </tr>
                  {/* Row 14: Queue headers */}
                  <tr>
                    <td className="row-num">14</td>
                    {['OWNER','REGION','QUEUE','RISK','STATUS'].map(h => (
                      <td key={h} className="cell-q-hdr">{h}</td>
                    ))}
                    <td style={{ background: '#08111C', border: '1px solid #1A2E46' }} />
                  </tr>
                  {/* Rows 15-17: Queue data */}
                  {[
                    ['Monica', 'North', 'Receivables', 'High', 'Needs Review', 'review'],
                    ['Alberto', 'West', 'Renewals', 'Low', 'Healthy', 'ok'],
                    ['Priya', 'LATAM', 'Collections', 'Medium', 'Watch', 'watch'],
                  ].map(([owner, region, queue, risk, status, cls]) => (
                    <tr key={owner}>
                      <td className="row-num">{owner === 'Monica' ? 15 : owner === 'Alberto' ? 16 : 17}</td>
                      {[owner, region, queue, risk].map((v, i) => (
                        <td key={i} className="cell-q-body">{v}</td>
                      ))}
                      <td className={`status-${cls === 'ok' ? 'ok' : cls === 'watch' ? 'watch' : 'review'}`}>{status}</td>
                      <td style={{ background: '#08111C', border: '1px solid #1A2E46' }} />
                    </tr>
                  ))}
                  {/* Footer */}
                  <tr>
                    <td className="row-num">20</td>
                    <td className="cell-footer" colSpan={8}>
                      LotOS modernization layer: same spreadsheet, better operation.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ background: '#08111C', borderTop: '1px solid #1A2E46', padding: '3px 10px', display: 'flex', gap: 2 }}>
              <div style={{ padding: '3px 14px', background: '#132338', border: '1px solid #29456B', borderBottom: 'none', borderRadius: '4px 4px 0 0', fontSize: 11, color: '#22D3EE', cursor: 'pointer' }}>ControlRoom</div>
              <div style={{ padding: '3px 14px', color: '#9CB6D6', fontSize: 11, cursor: 'pointer' }}>Hoja2</div>
            </div>
          </div>
        </div>

        {/* Code + Download section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Excel VBA */}
          <div className="demo-card">
            <div className="demo-card-head">
              <p className="demo-card-title">Microsoft Excel — VBA</p>
              <span className="demo-lang-label vba">VBA</span>
            </div>
            <div className="demo-code">{`' lotos_excel_demo.bas
Public Sub ApplyLotosTheme()
    Dim ws As Worksheet
    Set ws = EnsureSheet("Dashboard")
    PrepareCanvas ws   ' → bg #08111C, Segoe UI
    BuildHeader ws     ' → título + subtítulo
    BuildKpiRibbon ws  ' → $1.8M · 14 · 93% · 08
    BuildCommandStrip ws ' → 4 botones shape
    BuildOperationsTable ws ' → owner/region/queue
    BuildDetailPanel ws    ' → sidebar derecho
    ApplyStatusFormatting ws ' → conditional format
    DefineNamedRanges ws     ' → LOTOS_KPI_REVENUE...
    MsgBox "LotOS Excel demo theme applied."
End Sub

' Named ranges definidos:
'   LOTOS_KPI_REVENUE → A4
'   LOTOS_KPI_RISK    → C4
'   LOTOS_FILTER_REGION → B11
'   LOTOS_GRID_SOURCE → A13:E15`}</div>
            <div className="demo-salert info" style={{ fontSize: 11, marginTop: 10 }}>
              Abre Excel → Alt+F11 → Insertar módulo → Pegar código → F5
            </div>
          </div>

          {/* LibreOffice Basic */}
          <div className="demo-card">
            <div className="demo-card-head">
              <p className="demo-card-title">LibreOffice / OpenOffice Calc — Basic</p>
              <span className="demo-lang-label vba">Basic</span>
            </div>
            <div className="demo-code">{`' lotos_calc_demo.bas
Sub ApplyLotosThemeCalc()
    Dim doc As Object
    Dim sh As Object
    doc = ThisComponent
    sh = EnsureSheet(doc, "ControlRoom")

    ClearSheet sh          ' → limpiar canvas
    SetupLotosCanvas sh    ' → bg #08111C, Segoe UI
    BuildHero sh           ' → kicker + título
    BuildKpiRibbon sh      ' → $1.8M · 14 · 93% · 08
    BuildCommandStrip sh   ' → SYNC · INSPECT · ESCALATE
    BuildQueueTable sh, ...  ' → tabla con datos
    BuildAlertRail sh, ... ' → sidebar alertas
    BuildFooter sh, ...    ' → pie de página
    DefineNamedRangesSafe doc, queueCount

    MsgBox "LotOS Pro theme applied."
End Sub

' Named ranges:
'   LOTOS_ALERT_COUNT  · LOTOS_QUEUE_SOURCE
'   LOTOS_OWNER_FILTER · LOTOS_ACTION_TARGET`}</div>
            <div className="demo-salert info" style={{ fontSize: 11, marginTop: 10 }}>
              Herramientas → Macros → Editar macros → Pegar → Ejecutar
            </div>
          </div>
        </div>

        {/* Macro hooks explanation */}
        <div className="demo-card" style={{ marginBottom: 24 }}>
          <div className="demo-card-head">
            <p className="demo-card-title">Hooks de macro — funciones que puedes extender</p>
            <span className="demo-badge violet">Integrables con tus datos</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { name: 'RefreshDashboard', desc: 'Recarga datos desde fuente externa o API', badge: 'blue' as const },
              { name: 'OpenDetailPanel', desc: 'Abre panel lateral con info del row seleccionado', badge: 'violet' as const },
              { name: 'ApplyStatusTheme', desc: 'Re-aplica formato condicional a toda la tabla', badge: 'green' as const },
              { name: 'SyncControlRoom', desc: 'Sincroniza datos con backend o base de datos', badge: 'amber' as const },
            ].map(h => (
              <div key={h.name} className="demo-action-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#A5B4FC' }}>{h.name}()</div>
                <div style={{ fontSize: 12, color: 'rgba(240,244,255,0.55)', lineHeight: 1.5 }}>{h.desc}</div>
                <span className={`demo-badge ${h.badge}`}>Macro hook</span>
              </div>
            ))}
          </div>
        </div>

        {/* Named ranges */}
        <div className="demo-card" style={{ marginBottom: 24 }}>
          <div className="demo-card-head">
            <p className="demo-card-title">Named ranges — integra con fórmulas y otras hojas</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { excel: 'LOTOS_KPI_REVENUE',  calc: 'LOTOS_KPI_REVENUE',  desc: 'Valor KPI — Net Revenue' },
              { excel: 'LOTOS_KPI_RISK',     calc: 'LOTOS_ALERT_COUNT',  desc: 'Contador de alertas activas' },
              { excel: 'LOTOS_FILTER_REGION',calc: 'LOTOS_OWNER_FILTER', desc: 'Filtro de región/owner' },
              { excel: 'LOTOS_GRID_SOURCE',  calc: 'LOTOS_QUEUE_SOURCE', desc: 'Rango de datos de la cola' },
            ].map(r => (
              <div key={r.excel} style={{ display: 'flex', gap: 10, padding: '10px', borderRadius: 8, background: 'rgba(240,244,255,0.03)', border: '1px solid rgba(240,244,255,0.06)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#FDA4AF' }}>=&nbsp;{r.excel}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#9CB6D6', marginTop: 2 }}>=&nbsp;{r.calc} <span style={{ color: 'rgba(240,244,255,0.25)', fontSize: 9 }}>(Calc)</span></div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(240,244,255,0.45)', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After comparison mini */}
        <div className="demo-card">
          <div className="demo-card-head">
            <p className="demo-card-title">Transformación — antes vs después</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Before mini */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(240,244,255,0.35)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ANTES — CreateBeforeSheet()</div>
              <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', border: '1px solid #ddd' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: 11 }}>
                  {[
                    ['A1', 'operaciones q1'],
                    ['A2', 'hoja utilitaria sin sistema visual'],
                    ['A4', 'owner | B4: region | C4: queue | D4: risk | E4: status'],
                    ['A5', 'Monica | North | Receivables | High | Needs Review'],
                    ['A6', 'Alberto | West | Renewals | Low | Healthy'],
                    ['A7', 'Priya | LATAM | Collections | Medium | Watch'],
                  ].map(([ref, val]) => (
                    <tr key={ref} style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '3px 6px', background: '#f3f3f3', color: '#888', width: 36, fontSize: 10 }}>{ref}</td>
                      <td style={{ padding: '3px 6px', color: '#1a1a1a' }}>{val}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            {/* After mini */}
            <div>
              <div style={{ fontSize: 11, color: '#22D3EE', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>DESPUÉS — ApplyLotosTheme()</div>
              <div style={{ background: '#08111C', borderRadius: 6, overflow: 'hidden', border: '1px solid #29456B' }}>
                <div style={{ padding: '4px 10px', background: '#0E2439', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: '#22D3EE', textAlign: 'center', borderBottom: '1px solid #22D3EE' }}>LOTOS CALC MODERNIZATION SURFACE</div>
                <div style={{ padding: '6px 10px', background: '#0C1A2A', fontSize: 13, fontWeight: 800, color: '#E8F1FF', textAlign: 'center', borderBottom: '1px solid #29456B' }}>ControlRoom Dashboard</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                  {[['$1.8M', 'Net Revenue'], ['14', 'Escalations'], ['93%', 'SLA Health'], ['08', 'Reviews']].map(([v, l]) => (
                    <div key={l} style={{ padding: '6px 4px', background: '#132338', border: '1px solid #345E8F', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#E8F1FF' }}>{v}</div>
                      <div style={{ fontSize: 8, color: '#9CB6D6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                  {['SYNC', 'INSPECT', 'ESCALATE', 'CLEAR'].map(cmd => (
                    <div key={cmd} style={{ padding: '5px', background: '#14283E', border: '1px solid #5A84B5', textAlign: 'center', fontSize: 9, fontWeight: 800, color: '#E8F1FF', letterSpacing: '0.08em', cursor: 'pointer' }}>{cmd}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 0 }}>
                  {['OWNER', 'REGION', 'QUEUE', 'RISK', 'STATUS'].map(h => (
                    <div key={h} style={{ padding: '4px 4px', background: '#0E1927', border: '1px solid #305282', fontSize: 8, color: '#9CB6D6', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>{h}</div>
                  ))}
                </div>
                {[['Monica', 'North', 'Recv.', 'High', 'review'], ['Alberto', 'West', 'Renew.', 'Low', 'ok'], ['Priya', 'LATAM', 'Coll.', 'Med.', 'watch']].map(([o, r, q, ri, s]) => (
                  <div key={o} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 0 }}>
                    {[o, r, q, ri].map((v, i) => <div key={i} style={{ padding: '3px 4px', background: '#0B1827', border: '1px solid #23384E', fontSize: 9, color: '#E8F1FF' }}>{v}</div>)}
                    <div style={{ padding: '3px 4px', border: '1px solid', fontSize: 9, fontWeight: 800, textAlign: 'center', ...(s === 'ok' ? { background: '#0A231C', color: '#A7F3D0', borderColor: '#34D399' } : s === 'watch' ? { background: '#281D08', color: '#FDE68A', borderColor: '#F59E0B' } : { background: '#2D101A', color: '#FBCFE8', borderColor: '#FB7185' }) }}>
                      {s === 'ok' ? 'Healthy' : s === 'watch' ? 'Watch' : 'Review'}
                    </div>
                  </div>
                ))}
                <div style={{ padding: '4px 8px', background: '#08111C', border: '1px solid #1E3451', fontSize: 9, color: '#7F93B8', textAlign: 'center', letterSpacing: '0.04em' }}>LotOS modernization layer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-status-strip">
          <div className="demo-status-item"><span className="demo-status-dot green" />Excel VBA compatible</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />LibreOffice Basic compatible</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Named ranges para hooks</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />Formato condicional automático</div>
          <div className="demo-status-item" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.3)' }}>Full Signature preview</span>
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/demo/sin-lotos-hoja" className="demo-btn ghost">← Ver sin LotOS (hoja plana)</Link>
          <Link href="/demo/con-lotos-desktop-langs" className="demo-btn ghost">Ver Desktop 5 langs</Link>
          <Link href="/demo" className="demo-btn primary">← Todos los demos</Link>
          <Link href="/pricing" className="demo-btn violet">Ver planes →</Link>
        </div>
      </div>
    </main>
  );
}
