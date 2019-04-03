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

interface OwnProps {
    history?: History;
}

interface ReduxProps {
    onGameStarted?(state: object): void;
    onGameEnd?(): void;
    onOpenPopup?(data: object): void;
    onGameClose?(): void;
    onSnapshot?(state: object): void;
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
                        >
                            Найти игру
                        </Button>
                    }
                </div>
            </div>
        );
    }

    private onGameEnd = (data) => {
        this.props.onOpenPopup({ text: data.winner, buttonText: 'kek' });
    }

    public sendSearchGameRequest = (): void => {
        WebSocketApi.sendMessage({}, GameMessages.SEARCH);
    }
}
