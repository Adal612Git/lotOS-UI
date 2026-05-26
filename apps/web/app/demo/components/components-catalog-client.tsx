'use client';

import Link from 'next/link';
import {
  CommandShell,
  DataGridPro,
  LotOSSelect,
  ReportSurface,
  componentQualityRows,
  surfaceQualityHighlights,
  type DataGridColumn,
} from '../../product-surface';

type AssetRow = {
  id: string;
  surface: string;
  tier: string;
  status: string;
  export: string;
};

const selectOptions = [
  { label: 'Foundation', value: 'foundation', description: 'Base components and tokens' },
  { label: 'Pro Studio', value: 'pro', description: 'Surfaces, kits, protected delivery assets' },
  { label: 'Full Signature', value: 'full', description: 'Highest-finish vault and executive handoff' },
];

const assetRows: AssetRow[] = [
  { id: 'SUR-001', surface: 'Student Control', tier: 'Full Signature', status: 'Stable', export: 'CSV/Print' },
  { id: 'SUR-002', surface: 'Operator Cockpit', tier: 'Pro Studio', status: 'Stable', export: 'CSV' },
  { id: 'SUR-003', surface: 'Spreadsheet Ops', tier: 'Pro Studio', status: 'Preview', export: 'CSV' },
  { id: 'SUR-004', surface: 'Executive Briefing', tier: 'Full Signature', status: 'Preview', export: 'Print' },
];

const assetColumns: DataGridColumn<AssetRow>[] = [
  { id: 'id', header: 'ID', accessor: 'id', sortable: true, hideOnMobile: true, width: '110px' },
  { id: 'surface', header: 'Surface', accessor: 'surface', sortable: true },
  {
    id: 'tier',
    header: 'Tier',
    accessor: 'tier',
    sortable: true,
    filterOptions: [
      { label: 'Pro Studio', value: 'Pro Studio' },
      { label: 'Full Signature', value: 'Full Signature' },
    ],
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    filterOptions: [
      { label: 'Stable', value: 'Stable' },
      { label: 'Preview', value: 'Preview' },
    ],
    cell: (row) => (
      <span className="lotos-badge" data-tone={row.status === 'Stable' ? 'good' : 'warn'}>
        {row.status}
      </span>
    ),
  },
  { id: 'export', header: 'Export', accessor: 'export', sortable: true },
];

export function ComponentsCatalogClient() {
  return (
    <div className="demo-body">
      <p className="demo-section-label">Premium component catalog with honest status</p>
      <h1 className="demo-page-title">Components are the foundation. Product surfaces are the premium product.</h1>
      <p className="demo-page-subtitle">
        This catalog shows the real surfaces behind the premium story: custom Select, DataGridPro,
        CommandShell, ReportSurface, honest status, keyboard notes, responsive behavior, and export readiness.
      </p>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">Free vs Pro availability</p>
        <div className="demo-comp-grid-3">
          {[
            ['Foundation', 'Base components, public demos, previews, and documentation.'],
            ['Pro Studio', 'DataGridPro, CommandShell, ReportSurface, kits, and protected downloads.'],
            ['Full Signature', 'Full-only surfaces, vault exports, and highest-finish handoff assets.'],
          ].map(([title, body]) => (
            <article key={title} className="demo-scard">
              <p className="demo-scard-title">{title}</p>
              <p className="demo-scard-body">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">Component Quality Matrix</p>
        <DataGridPro
          title="Quality matrix"
          rows={componentQualityRows}
          columns={[
            { id: 'component', header: 'Component', accessor: 'component', sortable: true },
            {
              id: 'status',
              header: 'Status',
              accessor: 'status',
              sortable: true,
              filterOptions: [
                { label: 'Stable', value: 'Stable' },
                { label: 'Preview', value: 'Preview' },
                { label: 'Needs polish', value: 'Needs polish' },
                { label: 'Roadmap', value: 'Roadmap' },
              ],
              cell: (row) => (
                <span
                  className="lotos-badge"
                  data-tone={row.status === 'Stable' ? 'good' : row.status === 'Needs polish' ? 'warn' : undefined}
                >
                  {row.status}
                </span>
              ),
            },
            { id: 'keyboard', header: 'Keyboard', accessor: 'keyboard', sortable: true },
            { id: 'responsive', header: 'Responsive', accessor: 'responsive', sortable: true },
            { id: 'theme', header: 'Theme', accessor: 'theme', sortable: true },
            { id: 'ssr', header: 'SSR/client', accessor: 'ssr', sortable: true },
            { id: 'exportReady', header: 'Export', accessor: 'exportReady', sortable: true },
            { id: 'note', header: 'Note', accessor: 'note', hideOnMobile: true },
          ]}
          getRowId={(row) => row.component}
          initialDensity="dense"
          csvFilename="lotos-component-quality.csv"
        />
      </section>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">LotOSSelect / Combobox</p>
        <div className="demo-comp-grid-3">
          <LotOSSelect label="Plan surface" defaultValue="pro" options={selectOptions} helper="Custom listbox with keyboard basics." />
          <LotOSSelect label="Density" defaultValue="compact" options={[{ label: 'Comfortable', value: 'comfortable' }, { label: 'Compact', value: 'compact' }, { label: 'Dense', value: 'dense' }]} />
          <LotOSSelect label="Disabled example" defaultValue="foundation" options={selectOptions} disabled helper="Disabled state keeps visual polish." />
        </div>
      </section>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">DataGridPro real preview</p>
        <DataGridPro
          title="Product surface assets"
          rows={assetRows}
          columns={assetColumns}
          getRowId={(row) => row.id}
          initialDensity="compact"
          csvFilename="lotos-surface-assets.csv"
          rowActions={[{ label: 'Open', tone: 'primary', onClick: () => undefined }]}
        />
      </section>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">CommandShell real preview</p>
        <CommandShell
          productName="LotOS Studio"
          subtitle="Surface builder preview"
          title="Command surface for AI-built apps"
          description="Sidebar, workspace switcher, command palette, quick actions, activity feed, and content slots."
          breadcrumbs={['Catalog', 'CommandShell']}
          activeItemId="surfaces"
          navItems={[
            { id: 'surfaces', label: 'Surfaces', icon: '01', badge: '4' },
            { id: 'quality', label: 'Quality', icon: '02', badge: 'Matrix' },
            { id: 'vault', label: 'Vault', icon: '03' },
          ]}
          workspaces={selectOptions}
          defaultWorkspace="pro"
          quickActions={[
            { id: 'open-flagship', label: 'Open flagship', description: 'View Student Control', icon: 'Go' },
            { id: 'export', label: 'Export matrix', description: 'Use DataGridPro CSV', icon: 'CSV' },
          ]}
          activities={[
            { label: 'Now stable', body: 'DataGridPro, CommandShell, ReportSurface, and LotOSSelect are available as real product surfaces.' },
            { label: 'Next audit', body: 'Tooltip, popover, and modal focus trap remain preview-quality work.' },
          ]}
          actions={<Link className="lotos-btn lotos-btn--primary" href="/demo/student-control">Open flagship</Link>}
        >
          <div className="demo-comp-grid-3">
            {surfaceQualityHighlights.map((item) => (
              <article key={item.component} className="demo-scard">
                <p className="demo-scard-title">{item.component}</p>
                <p className="demo-scard-body">{item.note}</p>
                <span className="lotos-badge" data-tone="good">{item.status}</span>
              </article>
            ))}
          </div>
        </CommandShell>
      </section>

      <section className="demo-comp-section">
        <p className="demo-comp-section-label">ReportSurface real preview</p>
        <ReportSurface
          title="Surface quality report"
          summary="A report-ready component for executive proof, academic summaries, and operational reviews."
          reports={[
            {
              id: 'quality',
              title: 'Quality coverage',
              summary: 'Stable product surfaces now exist beyond static component cards.',
              kpi: '4',
              trend: 'stable',
              confidence: 'High',
              threshold: 88,
              tone: 'good',
              recommendation: 'Use these as the top row of public demos and package exports.',
            },
            {
              id: 'polish',
              title: 'Polish debt',
              summary: 'Some overlay primitives remain preview until full keyboard/focus audits land.',
              kpi: '2',
              trend: 'preview',
              confidence: 'Medium',
              threshold: 62,
              tone: 'watch',
              recommendation: 'Keep Tooltip/Popover marked Needs polish in public quality copy.',
            },
            {
              id: 'package',
              title: 'React package readiness',
              summary: 'The public package can be prepared without publishing blindly.',
              kpi: 'Prep',
              trend: 'no publish',
              confidence: 'Medium',
              threshold: 70,
              tone: 'watch',
              recommendation: 'Ship package structure, README, and exports first; publish only with token and release gate.',
            },
          ]}
          footerTitle="Evidence over claim"
          footerBody="Accessibility-conscious components. Formal audit pending."
        />
      </section>

      <div className="demo-btn-row">
        <Link href="/demo/student-control" className="demo-btn primary">Open flagship demo</Link>
        <Link href="/playground" className="demo-btn ghost">Open playground</Link>
        <Link href="/pricing" className="demo-btn ghost">See Pro Studio</Link>
      </div>
    </div>
  );
}
