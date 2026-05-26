import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export const lotosSignatureTokens = {
  themes: ['obsidian-ops', 'academic-aurora', 'porcelain-pro'],
  radius: { sm: 8, md: 12, lg: 18, xl: 24 },
  focus: '0 0 0 3px rgba(101,216,255,0.18), 0 0 0 1px rgba(101,216,255,0.58)',
} as const;

export type LotOSSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type LotOSSelectProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  options: LotOSSelectOption[];
  onChange?: (value: string) => void;
};

export function LotOSSelect({ label, value, defaultValue, options, onChange }: LotOSSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const selectedValue = value ?? internalValue;
  const selected = options.find((option) => option.value === selectedValue);

  return (
    <label className="lotos-react-field">
      {label ? <span>{label}</span> : null}
      <div className="lotos-react-select">
        <button type="button">{selected?.label ?? 'Select option'}</button>
        <div className="lotos-react-select-menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                setInternalValue(option.value);
                onChange?.(option.value);
              }}
            >
              {option.label}
              {option.description ? <small>{option.description}</small> : null}
            </button>
          ))}
        </div>
      </div>
    </label>
  );
}

export type DataGridColumn<T> = {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  cell?: (row: T) => ReactNode;
};

export type DataGridProProps<T> = {
  rows: T[];
  columns: DataGridColumn<T>[];
  getRowId: (row: T) => string;
  title?: string;
  searchPlaceholder?: string;
};

function renderCell<T>(row: T, column: DataGridColumn<T>) {
  if (column.cell) return column.cell(row);
  if (column.accessor instanceof Function) return column.accessor(row);
  return row[column.accessor] as ReactNode;
}

export function DataGridPro<T>({ rows, columns, getRowId, title, searchPlaceholder = 'Search...' }: DataGridProProps<T>) {
  const [search, setSearch] = useState('');
  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        columns.some((column) => String(renderCell(row, column) ?? '').toLowerCase().includes(search.toLowerCase())),
      ),
    [columns, rows, search],
  );

  return (
    <section className="lotos-react-grid">
      {title ? <h2>{title}</h2> : null}
      <input value={search} placeholder={searchPlaceholder} onChange={(event) => setSearch(event.target.value)} />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => (
                <td key={column.id}>{renderCell(row, column)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export type CommandShellProps = {
  productName: string;
  title: string;
  navItems: Array<{ id: string; label: string }>;
  activeItemId?: string;
  children: ReactNode;
};

export function CommandShell({ productName, title, navItems, activeItemId, children }: CommandShellProps) {
  return (
    <section className="lotos-react-shell">
      <aside>
        <strong>{productName}</strong>
        <nav>
          {navItems.map((item) => (
            <button key={item.id} type="button" data-active={item.id === activeItemId ? 'true' : 'false'}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main>
        <header>
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </section>
  );
}

export type ReportCard = {
  id: string;
  title: string;
  kpi: string;
  summary: string;
  recommendation: string;
};

export type ReportSurfaceProps = {
  title: string;
  summary?: string;
  reports: ReportCard[];
};

export function ReportSurface({ title, summary, reports }: ReportSurfaceProps) {
  return (
    <section className="lotos-react-report">
      <h2>{title}</h2>
      {summary ? <p>{summary}</p> : null}
      <div>
        {reports.map((report) => (
          <article key={report.id}>
            <strong>{report.kpi}</strong>
            <h3>{report.title}</h3>
            <p>{report.summary}</p>
            <small>{report.recommendation}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
