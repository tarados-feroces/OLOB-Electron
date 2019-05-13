import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import Button from '../../ui/Button';

interface InfoPopupProps {
    text: string;
    buttonText?: string;
    onClick(): void;
}

const b = block('olob-info-popup');

export const InfoPopup: React.FunctionComponent<InfoPopupProps> = ({ text, buttonText, onClick }) => {
    return (
        <div className={b()}>
            <div className={b('text')}>
                <p className={b('info')}>{text}</p>
            </div>
            <div className={b('button-row')}>
                <Button className={b('button').toString()} onClick={onClick}>{buttonText || 'Ок'}</Button>
            </div>
        </div>
    );
};
