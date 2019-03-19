import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import ws from '../../modules/WebSocketApi';
import { Button } from 'semantic-ui-react';
import { User } from '../../typings/UserTypings';
import Game from '../../components/Game';
import GameApi from '../../modules/GameApi';
import { GameType } from '../../typings/GameTypings';
import { WS_DOMEN } from '../../constants/WebSocketConstants';

interface AuthProps {
    onGameStarted(state): void;
    onGameEnd(state): void;
    onNewStep(step): void;
    onSnapshot(state): void;
    onSignoutUser(): void;
    isAuthorized: boolean;
    isFinished: boolean;
    opponent?: User;
    game?: GameType;
    winner?: number;
    user?: User;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {

    public componentDidMount() {
        const { onGameStarted, onGameEnd, onNewStep, onSnapshot, isAuthorized } = this.props;

        if (isAuthorized) {
            ws.open(WS_DOMEN);
            GameApi.init({ onGameStarted, onGameEnd, onGameUpdate: onNewStep, onReceiveSnapshot: onSnapshot });
        }
    }

    public render() {
        const { user, isAuthorized, onSignoutUser, ...restProps } = this.props;

        if (!(isAuthorized || user)) {
            return (
                <Redirect to={PathConstants.LOGIN} />
            );
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('signout-btn')} onClick={onSignoutUser}>Выйти</div>
                    <p className={b('header_login')}>{user.login}</p>
                </div>
                <div className={b('container')}>
                    <Button onClick={GameApi.sendSearchGameRequest} size={'massive'} color={'vk'} fluid={false}>
                        Найти игру
                    </Button>
                </div>
                <Game user={user} {...restProps} />
            </div>
        );
    }
}
