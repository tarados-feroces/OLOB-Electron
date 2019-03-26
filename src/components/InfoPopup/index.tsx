import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface InfoPopupProps {
    text: string;
    buttonText: string;
    onClick(): void;
}

const b = block('olob-info-popup');

export const InfoPopup: React.FunctionComponent<InfoPopupProps> = ({ text, buttonText, onClick }) => {
    return (
        <div className={b()}>
            <p className={b('info')}>{text}</p>
            <button className={b('submit')} onClick={onClick}>{buttonText}</button>
        </div>
    );
};
