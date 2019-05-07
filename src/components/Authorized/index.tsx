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
import { Icon } from '../../ui/Icon';

import './index.scss';

import UserCard from '../../containers/UserCardContainer';
import { WS_DOMEN } from '../../constants/WebSocketConstants';
import Chat from '../../containers/Chat';
import gameAPI from '../../modules/GameApi';
import { Message } from '../../typings/Chat';
import PlayerInfo from '../PlayerInfo';
import UserInfo from '../UserInfo';

export enum ContentTypes {
    HOME = 'HOME',
    SETTINGS = 'SETTINGS',
    ABOUT = 'ABOUT'
}

export enum RightContentTypes {
    CHAT = 'CHAT',
    MOVES = 'MOVES'
}

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
    currentContent: ContentTypes;
    rightContent: RightContentTypes;
}

const b = block('olob-auth');
const right = block('right-content');

export default class Authorized extends React.Component<AuthProps, AuthState> {
    public state = {
        loading: false,
        currentContent: ContentTypes.HOME,
        rightContent: RightContentTypes.CHAT
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
            return <UserInfo login={user.login} avatar={user.avatar}  />;
        case ContentTypes.ABOUT:
            return <div />;
        default:
            return <div />;
        }
    }

    private getRightContent = () => {
        const { user, game } = this.props;
        switch (this.state.rightContent) {
        case RightContentTypes.CHAT:
            return (
                <Chat onSendMessage={gameAPI.sendMessage} active={Boolean(game)} />
            );
        case RightContentTypes.MOVES:
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

    private changeRightContent = (event: React.MouseEvent) => {
        this.setState({
            rightContent: event.currentTarget.getAttribute('id') as RightContentTypes
        });
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
                    <div className={b('header-icon')} id={ContentTypes.SETTINGS} onClick={this.changeContent}>
                        <Icon id={'settings_dark'} size={'inherit'} />
                    </div>
                    <div className={b('header-icon', { main: true })} id={ContentTypes.HOME} onClick={this.changeContent}>
                        <Icon id={'avatar_dark'} size={'inherit'} />
                    </div>
                    <div className={b('header-icon')} id={ContentTypes.ABOUT} onClick={this.changeContent}>
                        <Icon id={'info_dark'} size={'inherit'} />
                    </div>
                </div>
                <div className={b('content')}>
                    <div className={b('content-left')}>
                        <PlayerInfo login={user.login} avatar={user.avatar} active={false} />
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
                    </div>
                    <div className={b('content-center')}>
                        {this.getMainContent()}
                    </div>
                    <div className={b('content-right')}>
                        <div className={right()}>
                            <div className={right('controls').toString()}>
                                <div
                                    id={RightContentTypes.CHAT}
                                    onClick={this.changeRightContent}
                                    className={this.state.rightContent === RightContentTypes.CHAT ?
                                        right('tab', { active: true }) :
                                        right('tab') }
                                >
                                    <Icon id={'message_dark'} size={'xl'} />
                                </div>
                                <div
                                    id={RightContentTypes.MOVES}
                                    onClick={this.changeRightContent}
                                    className={this.state.rightContent === RightContentTypes.MOVES ?
                                        right('tab', { active: true }) :
                                        right('tab') }
                                >
                                    <Icon id={'gamelist_dark'} size={'xl'} />
                                </div>
                            </div>
                            <div className={right('data')}>
                                {this.getRightContent()}
                            </div>
                        </div>
                    </div>
                    <div className={b('content-controls')} />
                </div>
                <div className={b('footer')} />
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
