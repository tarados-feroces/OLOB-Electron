import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import ws from '../../modules/WebSocketApi';
import { Button } from 'semantic-ui-react';

interface AuthProps {
    login: string;
    isAuthorized: boolean;
    onSignoutUser(): void;
    onGameRequest(): void;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {
    public render() {
        const { login, onSignoutUser } = this.props;

        if (!this.props.isAuthorized) {
            return (
                <Redirect to={PathConstants.LOGIN} />
            );
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('signout-btn')} onClick={onSignoutUser}>Выйти</div>
                    <p className={b('header_login')}>{login}</p>
                </div>
                <div className={b('container')}>
                    <Button onClick={this.findGame} size={'massive'} color={'vk'} fluid={false}>Найти игру</Button>
                </div>
                <div className={b('container')}>
                    <Button onClick={this.game} size={'massive'} color={'green'} fluid={false}>Игра</Button>
                </div>
            </div>
        );
    }

    public findGame() {
        ws.sendMessage({ text: 'hello' }, 'init');
    }

    public game() {
        ws.sendMessage({ gameID: 'lol' }, 'GAME_INITED');
    }
}
