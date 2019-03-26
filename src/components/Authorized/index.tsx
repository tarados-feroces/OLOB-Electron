import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import * as PathConstants from '../../constants/PathsConstants';
import WebSocketApi from '../../modules/WebSocketApi';
import { Button } from 'semantic-ui-react';
import { User } from '../../typings/UserTypings';
import Game from '../../components/Game';
import { GameType, Navigation } from '../../typings/GameTypings';
import { GameMessages } from '../../redux/constants/Game';

import { WS_DOMEN } from '../../constants/WebSocketConstants';

interface AuthProps {
    onGameStarted(state): void;
    onGameEnd(state): void;
    onOpenPopup(data): void;
    onGameClose(): void;
    onSnapshot(state): void;
    onGetPossibleSteps(state): void;
    onResetPossibleSteps(): void;
    onSignoutUser(): void;
    isAuthorized: boolean;
    isFinished: boolean;
    opponent?: User;
    game?: GameType;
    winner?: number;
    user: User;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {

    public componentDidMount() {
        const { onGameStarted, isAuthorized } = this.props;

        if (isAuthorized) {
            WebSocketApi.open(WS_DOMEN);
            WebSocketApi.registerHandler(GameMessages.STARTED, onGameStarted);
            WebSocketApi.registerHandler(GameMessages.FINISHED, this.onGameEnd);
        }
    }

    public render() {
        const { user, game, isAuthorized, onSignoutUser, onOpenPopup, ...restProps } = this.props;

        if (!isAuthorized) {
            return (
                <Redirect to={PathConstants.LOGIN} />
            );
        }

        if (!user) {
            return (<h1>LOADING...</h1>);
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('signout-btn')} onClick={onSignoutUser}>Выйти</div>
                    <p className={b('header_login')}>{user.login}</p>
                </div>
                <div className={b('container')}>
                    <Button onClick={this.sendSearchGameRequest} size={'massive'} color={'vk'} fluid={false}>
                        Найти игру
                    </Button>
                    <Button onClick={this.openPopup} size={'massive'} color={'vk'} fluid={false}>
                        Открыть попапчик
                    </Button>
                </div>
                {game && <Game user={user} game={game} {...restProps} />}
            </div>
        );
    }

    private openPopup = () => {
        this.props.onOpenPopup({ text: 'lol', buttonText: 'kek' });
    }

    private onGameEnd = (data) => {
        console.log('ENDED');
        this.props.onOpenPopup({ text: data.winner, buttonText: 'kek' });
    }

    public sendSearchGameRequest = (): void => {
        WebSocketApi.sendMessage({}, GameMessages.SEARCH);
    }
}
