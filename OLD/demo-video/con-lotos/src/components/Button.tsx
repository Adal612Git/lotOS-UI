import React from 'react';
import { Button as LotosButton } from '@lotosui/claude-arm';

export type ButtonProps = React.ComponentProps<typeof LotosButton>;

export function Button(props: ButtonProps) {
    return <LotosButton {...props} />;
}
