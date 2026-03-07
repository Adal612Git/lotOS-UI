import React from 'react';
import { Modal as LotosModal } from '@lotosui/claude-arm';

export type ModalProps = React.ComponentProps<typeof LotosModal>;

export function Modal(props: ModalProps) {
    return <LotosModal {...props} />;
}
