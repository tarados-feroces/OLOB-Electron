import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Icon } from '../../ui/Icon';
import Chat from '../../containers/Chat';
import GameHistory from '../../containers/GameHistory';
import gameAPI from '../../modules/GameApi';
import { User } from '../../typings/UserTypings';
import { GameType, Navigation } from '../../typings/GameTypings';
import IconButton from '../../ui/IconButton';
import { GameMessages } from '../../redux/constants/Game';
import { store } from '../../store/store';
import ws from '../../modules/WebSocketApi';
import USBConnector from '../../modules/USB/USBConnector';
import UserCard from '../UserCard';
import boardManager from '../../modules/BoardManager';

export enum RightContentTypes {
    CHAT = 'CHAT',
    HISTORY = 'HISTORY'
}

interface RightContentProps {
    user: User;
    game: GameType;
    opponent?: User;
    onSignoutUser?(): void;
}

interface RightContentState {
    rightContent: RightContentTypes;
}

const b = block('right-content');

export class RightContent extends React.Component<RightContentProps, RightContentState> {
    public state = {
        rightContent: RightContentTypes.CHAT
    };

    private getRightContent = () => {
        const { game, user } = this.props;

        switch (this.state.rightContent) {
        case RightContentTypes.CHAT:
            return (
                <Chat onSendMessage={gameAPI.sendMessage} active={Boolean(game)} />
            );
        case RightContentTypes.HISTORY:
            return <GameHistory user={user} />;
        default:
            return <div />;
        }
    }

    public render() {
        const { onSignoutUser, game, opponent } = this.props;

        return (
            <div className={b()}>
                {game && opponent ?
                    <div className={b('opponent')}>
                        <UserCard user={opponent} />
                    </div> :
                    <div className={b('crutch')} />
                }
                <div className={b('container')}>
                    <div className={b('data')}>
                        {this.getRightContent()}
                    </div>
                    <div className={b('menu')}>
                        <div className={b('tabs')}>
                            <div
                                id={RightContentTypes.CHAT}
                                onClick={this.changeRightContent}
                                className={b('tab', { active: this.state.rightContent === RightContentTypes.CHAT })}
                            >
                                <Icon id={'message_icon'} size={'xl'} />
                            </div>
                            <div
                                id={RightContentTypes.HISTORY}
                                onClick={this.changeRightContent}
                                className={b('tab', { active: this.state.rightContent === RightContentTypes.HISTORY })}
                            >
                                <Icon id={'gamelist_icon'} size={'xl'} />
                            </div>
                        </div>
                        <div className={b('controls')}>
                            <IconButton icon={'connect_icon'} onClick={this.onConnect} />
                            <IconButton icon={'logout_icon'} onClick={onSignoutUser} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onConnect = () => {
        boardManager.init();
    }

    private changeRightContent = (event: React.MouseEvent) => {
        this.setState({
            rightContent: event.currentTarget.getAttribute('id') as RightContentTypes
        });
    }

}
