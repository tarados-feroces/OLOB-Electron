import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Player } from '../../typings/GameTypings';
import { Avatar } from '../../ui/Avatar';

interface CardProps {
    user: Player;
}

const b = block('olob-opponent-card');

export default class UserCard extends React.Component<CardProps> {
    public render() {
        const { user } = this.props;

        return (
            <div className={b()}>
                <div className={b('avatar')}>
                    <Avatar className={b('avatar-content')} src={user.avatar} />
                </div>
                <div className={b('name')}>
                    {user.login}
                </div>
            </div>
        );
    }
}
