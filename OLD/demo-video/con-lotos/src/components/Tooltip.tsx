import React from 'react';
import { Tooltip as LotosTooltip } from '@lotosui/claude-arm';

export type TooltipProps = React.ComponentProps<typeof LotosTooltip>;

export function Tooltip(props: TooltipProps) {
    return <LotosTooltip {...props} />;
}
