import * as React from 'react';
import { block } from 'bem-cn';

import * as PathConstants from '../../constants/PathsConstants';
import WebSocketApi from '../../modules/WebSocketApi';
import { Button } from 'semantic-ui-react';
import { User } from '../../typings/UserTypings';
import Game from '../../containers/GameContainer';
import { GameType } from '../../typings/GameTypings';
import { GameMessages } from '../../redux/constants/Game';
import { History } from 'history';

import './index.scss';

import UserCard from '../../containers/UserCardContainer';
import { WS_DOMEN } from '../../constants/WebSocketConstants';
import Chat from '../../containers/Chat';
import gameAPI from '../../modules/GameApi';
import { Message } from '../../typings/Chat';

interface OwnProps {
    history?: History;
}

interface ReduxProps {
    onGameStarted?(state: object): void;
    onGameEnd?(): void;
    onGameEndPopup?(data: object): void;
    onOpenInfoPopup?(description: string, data: object): void;
    onGameClose?(): void;
    onSnapshot?(state: object): void;
    onReceiveMessage(message: Message): void;
    onGetPossibleSteps?(state: object): void;
    onResetPossibleSteps?(): void;
    onSignoutUser?(): void;
    isAuthorized?: boolean;
    isFinished?: boolean;
    opponent?: User;
    game?: GameType;
    winner?: number;
    user?: User;
}

type AuthProps = OwnProps & ReduxProps;

interface AuthState {
    loading: boolean;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps, AuthState> {
    public state = {
        loading: false
    };

    public componentDidMount() {
        const { onGameStarted, isAuthorized } = this.props;

        if (isAuthorized) {
            WebSocketApi.open(WS_DOMEN);
            WebSocketApi.registerHandler(GameMessages.STARTED, onGameStarted);
            WebSocketApi.registerHandler(GameMessages.FINISHED, this.onGameEnd);
        }
    }

    public render() {
        const { user, game, isAuthorized } = this.props;

        if (!isAuthorized) {
            this.props.history.push(PathConstants.LOGIN);
        }

        if (!user) {
            return (<h1>LOADING...</h1>);
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('logo')}>
                        On Line On Board
                    </div>
                    <div className={b('card')}>
                        <UserCard settingDisabled={Boolean(game)} />
                    </div>
                </div>
                <div className={b('content')}>
                        <div className={b('chat')}>
                            <Chat onSendMessage={gameAPI.sendMessage} active={Boolean(game)} />
                        </div>
                        {game ?
                            <div className={b('game')}>
                                <Game user={user} game={game} />
                            </div>
                            :
                            <Button
                                onClick={this.sendSearchGameRequest}
                                size={'huge'}
                                className={b('play-button').toString()}
                                inverted={true}
                                fluid={false}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                            >
                                Найти игру
                            </Button>
                        }
                </div>
            </div>
        );
    }

    private onGameEnd = (data) => {
        const { user, opponent, onGameEndPopup } = this.props;

        let text = '';

        if (data.winner === user.id) {
            text = `Вы выиграли, а ${opponent.login} с грустью уходит с поля боя!`;
        } else {
            text = `${opponent.login} празднует победу, а Вам стоит лучше продумывать тактику!`;
        }

        this.setState({ loading: false });

        onGameEndPopup({ text, buttonText: 'ОК' });
    }

    public sendSearchGameRequest = (): void => {
        this.setState({ loading: true });
        WebSocketApi.sendMessage({}, GameMessages.SEARCH);
    }
}
