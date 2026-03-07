import React from 'react';
import { Table as LotosTable } from '@lotosui/claude-arm';

export type TableProps = React.ComponentProps<typeof LotosTable>;

export function Table(props: TableProps) {
    return <LotosTable {...props} />;
}
