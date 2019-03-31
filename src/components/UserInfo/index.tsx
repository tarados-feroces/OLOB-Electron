import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface UserInfoProps {
    onSubmit(): void;
    onAvatarLoad(avatar: string): void;
    login: string;
}

const b = block('olob-user-info');

export const UserInfo: React.FunctionComponent<UserInfoProps> = ({ onSubmit, onAvatarLoad }) => {
    return (
        <div className={b()}>
            <div className={b('content')}>
                <div className={b('item')}>
                </div>
                <div className={b('item')}>
                </div>
            </div>
        </div>
    );
};
