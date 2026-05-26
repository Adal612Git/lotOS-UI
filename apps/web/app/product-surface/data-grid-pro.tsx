'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LotOSSelect, type LotOSSelectOption } from './lotos-select';

export type DataGridDensity = 'comfortable' | 'compact' | 'dense';

export type DataGridColumn<T> = {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => ReactNode);
  value?: (row: T) => string | number | boolean | null | undefined;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  filterOptions?: LotOSSelectOption[];
  filterValue?: (row: T) => string;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
  width?: string;
};

export type DataGridAction<T> = {
  label: string;
  tone?: 'neutral' | 'primary' | 'danger';
  onClick: (row: T) => void;
};

export type DataGridBulkAction<T> = {
  label: string;
  tone?: 'neutral' | 'primary' | 'danger';
  onClick: (rows: T[]) => void;
};

export type DataGridProProps<T> = {
  title?: string;
  rows: T[];
  columns: DataGridColumn<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  loading?: boolean;
  error?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  rowActions?: DataGridAction<T>[];
  bulkActions?: DataGridBulkAction<T>[];
  initialDensity?: DataGridDensity;
  initialHiddenColumns?: string[];
  csvFilename?: string;
};

type SortState = {
  columnId: string;
  direction: 'asc' | 'desc';
} | null;

function stringify(value: ReactNode): string {
  if (value === null || value === undefined || typeof value === 'boolean') return value === true ? 'true' : '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(stringify).join(' ');
  return '';
}

function cellValue<T>(row: T, column: DataGridColumn<T>): ReactNode {
  if (column.cell) return column.cell(row);
  if (column.accessor instanceof Function) return column.accessor(row);
  if (column.accessor) return row[column.accessor] as ReactNode;
  if (column.value) return column.value(row) as ReactNode;
  return null;
}

function rawValue<T>(row: T, column: DataGridColumn<T>) {
  if (column.value) return column.value(row);
  return stringify(cellValue(row, column));
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function DataGridPro<T>({
  title,
  rows,
  columns,
  getRowId,
  searchPlaceholder = 'Search rows...',
  loading = false,
  error,
  emptyTitle = 'No records match this view',
  emptyDescription = 'Adjust search, filters, or create a new record.',
  rowActions = [],
  bulkActions = [],
  initialDensity = 'comfortable',
  initialHiddenColumns = [],
  csvFilename = 'lotos-export.csv',
}: DataGridProProps<T>) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const [density, setDensity] = useState<DataGridDensity>(initialDensity);
  const [filterState, setFilterState] = useState<Record<string, string>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => new Set(initialHiddenColumns));
  const [showColumns, setShowColumns] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const visibleColumns = useMemo(() => columns.filter((column) => !hiddenColumns.has(column.id)), [columns, hiddenColumns]);
  const searchableColumns = useMemo(() => columns.filter((column) => column.id !== 'actions'), [columns]);
  const filterColumns = useMemo(() => columns.filter((column) => column.filterOptions?.length), [columns]);
  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(getRowId(row))), [getRowId, rows, selectedIds]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        searchableColumns.some((column) => String(rawValue(row, column) ?? '').toLowerCase().includes(query));

      if (!matchesSearch) return false;

      return filterColumns.every((column) => {
        const active = filterState[column.id];
        if (!active || active === 'all') return true;
        return (column.filterValue?.(row) ?? String(rawValue(row, column) ?? '')) === active;
      });
    });

    if (!sort) return filtered;
    const column = columns.find((item) => item.id === sort.columnId);
    if (!column) return filtered;

    return [...filtered].sort((a, b) => {
      const av = rawValue(a, column);
      const bv = rawValue(b, column);
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.direction === 'asc' ? av - bv : bv - av;
      }
      const result = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sort.direction === 'asc' ? result : -result;
    });
  }, [columns, filterColumns, filterState, rows, search, searchableColumns, sort]);

  function toggleSort(column: DataGridColumn<T>) {
    if (!column.sortable) return;
    setSort((current) => {
      if (!current || current.columnId !== column.id) return { columnId: column.id, direction: 'asc' };
      if (current.direction === 'asc') return { columnId: column.id, direction: 'desc' };
      return null;
    });
  }

  function toggleColumn(columnId: string) {
    setHiddenColumns((current) => {
      const next = new Set(current);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }

  function toggleRow(row: T) {
    const id = getRowId(row);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allSelected = filteredRows.length > 0 && filteredRows.every((row) => next.has(getRowId(row)));
      filteredRows.forEach((row) => {
        const id = getRowId(row);
        if (allSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }

  function exportCsv() {
    const exportColumns = visibleColumns.filter((column) => column.id !== 'select' && column.id !== 'actions');
    const header = exportColumns.map((column) => csvEscape(column.header)).join(',');
    const body = filteredRows
      .map((row) => exportColumns.map((column) => csvEscape(String(rawValue(row, column) ?? ''))).join(','))
      .join('\n');
    const blob = new Blob([[header, body].filter(Boolean).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFilename;
    link.click();
    URL.revokeObjectURL(url);
  }

  const densityOptions: LotOSSelectOption[] = [
    { label: 'Comfortable', value: 'comfortable' },
    { label: 'Compact', value: 'compact' },
    { label: 'Dense', value: 'dense' },
  ];

  return (
    <section className="lotos-grid-pro" data-density={density} aria-label={title ?? 'DataGridPro'}>
      <div className="lotos-grid-pro__toolbar">
        <div className="lotos-field">
          {title ? <span className="lotos-field__label">{title}</span> : null}
          <input
            className="lotos-input"
            value={search}
            placeholder={searchPlaceholder}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="lotos-grid-pro__filters">
          {filterColumns.map((column) => (
            <LotOSSelect
              key={column.id}
              className="lotos-grid-pro__filter"
              label={column.header}
              size="sm"
              density="compact"
              value={filterState[column.id] ?? 'all'}
              options={[{ label: 'All', value: 'all' }, ...(column.filterOptions ?? [])]}
              onChange={(next) => setFilterState((current) => ({ ...current, [column.id]: next }))}
            />
          ))}
        </div>
        <LotOSSelect
          label="Density"
          size="sm"
          density="compact"
          value={density}
          options={densityOptions}
          onChange={(next) => setDensity(next as DataGridDensity)}
        />
        <div className="lotos-grid-pro__toolbar-group">
          <div className="lotos-grid-pro__columns">
            <button className="lotos-btn" type="button" onClick={() => setShowColumns((next) => !next)}>
              Columns
            </button>
            {showColumns ? (
              <div className="lotos-grid-pro__column-menu">
                {columns
                  .filter((column) => column.id !== 'select' && column.id !== 'actions')
                  .map((column) => (
                    <label key={column.id}>
                      <input type="checkbox" checked={!hiddenColumns.has(column.id)} onChange={() => toggleColumn(column.id)} />
                      {column.header}
                    </label>
                  ))}
              </div>
            ) : null}
          </div>
          <button className="lotos-btn" type="button" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {bulkActions.length > 0 && selectedIds.size > 0 ? (
        <div className="lotos-grid-pro__bulk">
          <strong>{selectedIds.size} selected</strong>
          <div className="lotos-grid-pro__bulk-actions">
            {bulkActions.map((action) => (
              <button
                key={action.label}
                className={`lotos-btn ${action.tone === 'primary' ? 'lotos-btn--primary' : action.tone === 'danger' ? 'lotos-btn--danger' : ''}`}
                type="button"
                onClick={() => action.onClick(selectedRows)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="lotos-grid-pro__state">
          <strong>Loading product surface</strong>
          <div className="lotos-grid-pro__skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : error ? (
        <div className="lotos-grid-pro__state">
          <strong>Data source needs attention</strong>
          <span>{error}</span>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="lotos-grid-pro__state">
          <strong>{emptyTitle}</strong>
          <span>{emptyDescription}</span>
        </div>
      ) : (
        <>
          <div className="lotos-grid-pro__table-wrap">
            <table>
              <thead>
                <tr>
                  {bulkActions.length > 0 ? (
                    <th style={{ width: 42 }}>
                      <input
                        type="checkbox"
                        checked={filteredRows.length > 0 && filteredRows.every((row) => selectedIds.has(getRowId(row)))}
                        onChange={toggleAllVisible}
                        aria-label="Select all visible rows"
                      />
                    </th>
                  ) : null}
                  {visibleColumns.map((column) => (
                    <th key={column.id} style={{ width: column.width }} className={column.align ? `lotos-grid-pro__align-${column.align}` : undefined}>
                      {column.sortable ? (
                        <button className="lotos-grid-pro__sort" type="button" onClick={() => toggleSort(column)}>
                          {column.header}
                          <span aria-hidden="true">{sort?.columnId === column.id ? (sort.direction === 'asc' ? 'ASC' : 'DESC') : 'SORT'}</span>
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                  {rowActions.length > 0 ? <th className="lotos-grid-pro__align-right">Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <tr key={id}>
                      {bulkActions.length > 0 ? (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(id)}
                            onChange={() => toggleRow(row)}
                            aria-label={`Select row ${id}`}
                          />
                        </td>
                      ) : null}
                      {visibleColumns.map((column) => (
                        <td key={column.id} className={column.align ? `lotos-grid-pro__align-${column.align}` : undefined}>
                          {cellValue(row, column)}
                        </td>
                      ))}
                      {rowActions.length > 0 ? (
                        <td className="lotos-grid-pro__align-right">
                          <div className="lotos-grid-pro__row-actions">
                            {rowActions.map((action) => (
                              <button
                                key={action.label}
                                className={`lotos-btn ${action.tone === 'primary' ? 'lotos-btn--primary' : action.tone === 'danger' ? 'lotos-btn--danger' : ''}`}
                                type="button"
                                onClick={() => action.onClick(row)}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="lotos-grid-pro__mobile">
            {filteredRows.map((row) => {
              const id = getRowId(row);
              return (
                <article key={id} className="lotos-grid-pro__mobile-card">
                  {visibleColumns
                    .filter((column) => !column.hideOnMobile)
                    .map((column) => (
                      <div key={column.id} className="lotos-grid-pro__mobile-row">
                        <span>{column.header}</span>
                        <strong>{cellValue(row, column)}</strong>
                      </div>
                    ))}
                  {rowActions.length > 0 ? (
                    <div className="lotos-grid-pro__row-actions">
                      {rowActions.map((action) => (
                        <button
                          key={action.label}
                          className={`lotos-btn ${action.tone === 'primary' ? 'lotos-btn--primary' : action.tone === 'danger' ? 'lotos-btn--danger' : ''}`}
                          type="button"
                          onClick={() => action.onClick(row)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
