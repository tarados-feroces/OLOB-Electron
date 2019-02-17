import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface AuthProps {
    nickname: string;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {
    public render() {
        const { nickname } = this.props;

        return (
            <div className={b()}>
                <p>{nickname}</p>
            </div>
        );
    }
}
