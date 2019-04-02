import * as React from 'react';
import { block } from 'bem-cn';

import { Avatar } from '../../ui/Avatar';

import './index.scss';

interface PlayerInfoProps {
    login: string;
    avatar: string;
    active: boolean;
    className?: string;
}

const b = block('olob-player-info');

const PlayerInfo: React.FunctionComponent<PlayerInfoProps> = ({ login, avatar, active, className }) => {
    return (
        <div className={b.mix(className)}>
            <p className={b('login', { active })}>{login}</p>
            <Avatar src={avatar} className={b('avatar')} />
        </div>
    );
};

export default PlayerInfo;
