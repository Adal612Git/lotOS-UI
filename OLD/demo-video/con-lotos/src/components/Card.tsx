import React from 'react';
import { Card as LotosCard } from '@lotosui/claude-arm';

export type CardProps = React.ComponentProps<typeof LotosCard>;

export function Card(props: CardProps) {
    return <LotosCard {...props} />;
}
