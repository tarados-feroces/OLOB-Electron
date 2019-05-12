import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Modal } from 'semantic-ui-react';
import Button from '../../ui/Button';

interface ConfirmPopupProps {
    text: string;
    confirmButtonText?: string;
    declineButtonText?: string;
    onAccept(): void;
    onDecline(): void;
}

const b = block('olob-confirm-popup');

export const ConfirmPopup: React.FunctionComponent<ConfirmPopupProps> =
    ({ text, confirmButtonText, declineButtonText, onAccept, onDecline }) => {
        return (
            <Modal>
                <Modal.Header>{text}</Modal.Header>
                <Modal.Content>
                    <div className={b('button-row')}>
                        <Button className={b('button').toString()} onClick={onAccept}>{confirmButtonText || 'Ок'}</Button>
                        <Button className={b('button').toString()} onClick={onDecline}>{declineButtonText || 'Неа'}</Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    };
