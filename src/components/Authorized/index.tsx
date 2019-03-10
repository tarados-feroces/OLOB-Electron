import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import LoginContainer from '../../containers/LoginContainer';
import * as PathConstants from '../../constants/PathsConstants';
import ws from '../../modules/WebSocketApi';

interface AuthProps {
    login: string;
    isAuthorized: boolean;
    signoutUser?(): void;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {

    public componentDidMount() {
        this.props.isAuthorized && ws.open('ws://localhost:5001', (msg) => console.log(msg), () => {});
    }

    public render() {
        const { login } = this.props;

        if (!this.props.isAuthorized) {
            return (
                <Redirect to={PathConstants.LOGIN} />
            );
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('signout-btn')} onClick={this.props.signoutUser}>Выйти</div>
                    <p className={b('header_login')}>{login}</p>
                    <button onClick={() => ws.sendMessage('1', {text: 'lol'})}>Send!</button>
                </div>
            </div>
        );
    }
}
