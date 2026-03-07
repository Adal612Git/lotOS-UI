import React from 'react';
import { Input as LotosInput } from '@lotosui/claude-arm';

export type InputProps = React.ComponentProps<typeof LotosInput>;

export function Input(props: InputProps) {
    return <LotosInput {...props} />;
}
