import * as React from 'react';
import { block } from 'bem-cn';

import { Button, Image, Input } from 'semantic-ui-react';
import Form from '../../ui/Form';

import './index.scss';

interface UserInfoProps {
    onSubmit(): void;
    login: string;
    avatar: string;
}

interface UserInfoState {
    login?: string;
    avatar?: string;
}

const b = block('olob-user-info');
const f = block('ui-form');

export default class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
    public state = {
        login: this.props.login,
        avatar: this.props.avatar
    };

    public render() {
        // const { onSubmit, onAvatarLoad, login, avatar } = this.props;

        return (
            <div className={b()}>
                <div className={b('content')}>
                    <div className={b('content-item')}>
                        <Image className={b('avatar').toString()} src={'./images/team.jpg'} />
                    </div>
                    {/* <Form>
                        <input className={f('item').toString()} placeholder={'Введите логин'} value={login} />
                    </Form>
                    <div className={b('content-item')}>
                    </div> */}
                </div>
            </div>
        );
    }
}
