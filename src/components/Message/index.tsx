import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface MessageProps {
    owner: boolean;
    text: string;
}

const b = block('olob-message');

export default class Message extends React.Component<MessageProps> {
    public render() {
        const { text, owner } = this.props;

        return (
            <div className={b()}>
                <div className={b('baloon', { owner })}>
                    <div className={b('text')}>
                        {text}
                    </div>
                </div>
            </div>
        );
    }
}
