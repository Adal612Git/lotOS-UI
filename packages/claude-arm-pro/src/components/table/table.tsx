import React from 'react';
import type { TableProps } from '@lotosui/core';

function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

function renderCellValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined) {
        return '-';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
}

export const Table = React.forwardRef<
    HTMLDivElement,
    TableProps
>(
    (
        {
            caption,
            meta,
            columns,
            rows,
            emptyMessage = 'No rows available.',
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedby,
            ...rest
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                data-lotos-ui="table"
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                className={cn('lotos-table-shell', className)}
                style={style}
                {...rest}
            >
                {(caption || meta) && (
                    <header className="lotos-table-shell__toolbar">
                        <div>
                            {caption ? <h3 className="lotos-table-shell__caption">{caption}</h3> : null}
                            {meta ? <p className="lotos-table-shell__meta">{meta}</p> : null}
                        </div>
                        <span className="lotos-table-shell__count">{rows.length} rows</span>
                    </header>
                )}

                <div className="lotos-table-shell__frame">
                    <table className="lotos-table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={cn(
                                            column.align === 'center' && 'lotos-table__align-center',
                                            column.align === 'right' && 'lotos-table__align-right'
                                        )}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length > 0 ? rows.map((row, rowIndex) => (
                                <tr key={`row-${rowIndex}`}>
                                    {columns.map((column) => (
                                        <td
                                            key={`${rowIndex}-${column.key}`}
                                            className={cn(
                                                column.align === 'center' && 'lotos-table__align-center',
                                                column.align === 'right' && 'lotos-table__align-right'
                                            )}
                                        >
                                            {renderCellValue(row[column.key])}
                                        </td>
                                    ))}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={Math.max(columns.length, 1)} className="lotos-table__empty">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);

Table.displayName = 'LotosTable';
