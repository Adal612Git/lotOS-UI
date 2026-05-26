export type ComponentStatus = 'Stable' | 'Preview' | 'Needs polish' | 'Roadmap';

export type ComponentQuality = {
  component: string;
  status: ComponentStatus;
  keyboard: string;
  responsive: string;
  theme: string;
  ssr: string;
  formReady: string;
  exportReady: string;
  note: string;
};

export const componentQualityRows: ComponentQuality[] = [
  {
    component: 'LotOSSelect',
    status: 'Stable',
    keyboard: 'Basic',
    responsive: 'Yes',
    theme: 'Dark/light',
    ssr: 'Client',
    formReady: 'Hidden input',
    exportReady: 'N/A',
    note: 'Custom listbox replaces native select in public premium demos.',
  },
  {
    component: 'DataGridPro',
    status: 'Stable',
    keyboard: 'Sort/search',
    responsive: 'Mobile cards',
    theme: 'Dark/light',
    ssr: 'Client',
    formReady: 'Filters',
    exportReady: 'CSV',
    note: 'Search, filters, sorting, density, column visibility, row actions, and CSV export.',
  },
  {
    component: 'CommandShell',
    status: 'Stable',
    keyboard: 'Cmd/Ctrl K',
    responsive: 'Drawer',
    theme: 'Dark/light',
    ssr: 'Client',
    formReady: 'Slots',
    exportReady: 'N/A',
    note: 'Sidebar, topbar, workspace switcher, command palette, quick actions, and activity feed.',
  },
  {
    component: 'ReportSurface',
    status: 'Stable',
    keyboard: 'Print action',
    responsive: 'Cards',
    theme: 'Dark/light',
    ssr: 'Client',
    formReady: 'Data props',
    exportReady: 'Print',
    note: 'KPI report cards, trends, thresholds, confidence, recommendations, and print view.',
  },
  {
    component: 'Modal',
    status: 'Preview',
    keyboard: 'Partial',
    responsive: 'Yes',
    theme: 'Dark/light',
    ssr: 'Client',
    formReady: 'Yes',
    exportReady: 'N/A',
    note: 'Used in Student Control; next pass should add full focus trap tests.',
  },
  {
    component: 'Button',
    status: 'Stable',
    keyboard: 'Yes',
    responsive: 'Yes',
    theme: 'Dark/light',
    ssr: 'Yes',
    formReady: 'Yes',
    exportReady: 'N/A',
    note: 'Foundation action component.',
  },
  {
    component: 'Input',
    status: 'Stable',
    keyboard: 'Yes',
    responsive: 'Yes',
    theme: 'Dark/light',
    ssr: 'Yes',
    formReady: 'Yes',
    exportReady: 'N/A',
    note: 'Foundation field component.',
  },
  {
    component: 'Tooltip/Popover',
    status: 'Needs polish',
    keyboard: 'Partial',
    responsive: 'Partial',
    theme: 'Dark',
    ssr: 'Client',
    formReady: 'N/A',
    exportReady: 'N/A',
    note: 'Visible in demos, but not promoted as fully audited yet.',
  },
];

export const surfaceQualityHighlights = componentQualityRows.filter((row) =>
  ['LotOSSelect', 'DataGridPro', 'CommandShell', 'ReportSurface'].includes(row.component),
);
