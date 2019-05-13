import * as React from 'react';
import { block } from 'bem-cn';

import * as PathConstants from '../../constants/PathsConstants';
import WebSocketApi from '../../modules/WebSocketApi';
import { User } from '../../typings/UserTypings';
import Game from '../../containers/GameContainer';
import { GameType } from '../../typings/GameTypings';
import { GameMessages } from '../../redux/constants/Game';
import { History } from 'history';

import './index.scss';

import { WS_DOMEN } from '../../constants/WebSocketConstants';
import { Message } from '../../typings/Chat';
import PlayerInfo from '../PlayerInfo';

import UserInfo from '../../containers/UserInfoContainer';
import IconButton from '../../ui/IconButton';
import { RightContent } from '../RightContent';
import { LeftContent } from '../LeftContent';
import GameApi from '../../modules/GameApi';
import { Icon } from '../../ui/Icon';

export enum ContentTypes {
    HOME = 'HOME',
    SETTINGS = 'SETTINGS',
    ABOUT = 'ABOUT'
}

interface OwnProps {
    history?: History;
}

interface ReduxProps {
    onGameStarted?(state: object): void;
    onGameEnd?(): void;
    onGameEndPopup?(data: object): void;
    onOpenInfoPopup?(description: string, data: object): void;
    onCloseGame?(): void;
    onSnapshot?(state: object): void;
    onReceiveMessage(message: Message): void;
    onGetPossibleSteps?(state: object): void;
    onResetPossibleSteps?(): void;
    onSignoutUser?(): void;
    onOpponentDisconnected?(): void;
    onDisconnect?(): void;
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
    currentContent: ContentTypes;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps, AuthState> {
    public state = {
        loading: false,
        currentContent: ContentTypes.HOME
    };

    public componentDidMount() {
        const { onGameStarted, isAuthorized } = this.props;

        if (isAuthorized) {
            WebSocketApi.open(WS_DOMEN);
            WebSocketApi.registerHandler(GameMessages.STARTED, onGameStarted);
            WebSocketApi.registerHandler(GameMessages.FINISHED, this.onGameEnd);
        }
    }

    private getMainContent = () => {
        const { user, game } = this.props;
        switch (this.state.currentContent) {
        case ContentTypes.HOME:
            return game ? (
                <div className={b('game')}>
                    <Game user={user} game={game} />
                </div>
            ) : (
                <div>Main content</div>
            );
        case ContentTypes.SETTINGS:
            return <UserInfo />;
        case ContentTypes.ABOUT:
            return <div />;
        default:
            return <div />;
        }
    }

    private changeContent = (event: React.MouseEvent) => {
        this.setState({
            currentContent: event.currentTarget.getAttribute('id') as ContentTypes
        });
    }

    public render() {
        const { user, isAuthorized, game, onSignoutUser, onDisconnect } = this.props;

        if (!isAuthorized) {
            this.props.history.push(PathConstants.LOGIN);
        }

        if (!user) {
            return (<h1>LOADING...</h1>);
        }

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('content-left')} />
                    <div className={b('content-center')}>
                        <IconButton
                            className={b('header-icon')}
                            id={ContentTypes.SETTINGS}
                            icon={'setting_icon'}
                            size={'inherit'}
                            onClick={this.changeContent}
                        />
                        <IconButton
                            className={b('header-icon', { main: true })}
                            id={ContentTypes.HOME}
                            icon={'home_icon'}
                            size={'inherit'}
                            onClick={this.changeContent}
                        />
                        <IconButton
                            className={b('header-icon')}
                            id={ContentTypes.ABOUT}
                            icon={'info_icon'}
                            size={'inherit'}
                            onClick={this.changeContent}
                        />
                    </div>
                    <div className={b('content-right')} />
                </div>
                <div className={b('content')}>
                    <div className={b('content-left')}>
                        <LeftContent user={user} loading={this.state.loading} game={game} />
                    </div>
                    <div className={b('content-center')}>
                        <div className={b('center-data', { game: Boolean(game) })}>
                            {this.getMainContent()}
                        </div>
                    </div>
                    <div className={b('content-right')}>
                        <RightContent user={user} game={game} onSignoutUser={onSignoutUser} />
                    </div>
                </div>
                <div className={b('footer')}>
                    <div className={b('content-left')}>
                        <IconButton
                            size={'xl'}
                            icon={'surrender_icon'}
                            onClick={onDisconnect.bind(this, this.handleDisconnect)}
                            disabled={!game}
                        />
                        <IconButton size={'xl'} icon={'draw_icon'} disabled={!game} />
                    </div>
                    <div className={b('content-center')}>
                        <Icon size={'xl'} id={'home_icon'} />
                    </div>
                    <div className={b('content-right')} />
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

    private handleDisconnect = () => {
        GameApi.disconnect();
        this.props.onCloseGame();
    }
}
