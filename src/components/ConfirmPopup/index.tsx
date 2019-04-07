import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Button } from 'semantic-ui-react';

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
            <div className={b()}>
                <div className={b('text')}>
                    <p className={b('info')}>{text}</p>
                </div>
                <div className={b('button-row')}>
                    <Button className={b('button').toString()} onClick={onAccept}>{confirmButtonText || 'Ок'}</Button>
                    <Button className={b('button').toString()} onClick={onDecline}>{declineButtonText || 'Неа'}</Button>
                </div>
            </div>
        );
    };
