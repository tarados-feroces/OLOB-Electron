import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Icon } from '../../ui/Icon';
import Chat from '../../containers/Chat';
import GameHistory from '../../containers/GameHistory';
import gameAPI from '../../modules/GameApi';
import { User } from '../../typings/UserTypings';
import { GameType } from '../../typings/GameTypings';
import IconButton from '../../ui/IconButton';
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
    onOpenInfoPopup?(description: string, data: object): void;
}

interface RightContentState {
    rightContent: RightContentTypes;
    boardActive: boolean;
}

const b = block('right-content');

export class RightContent extends React.Component<RightContentProps, RightContentState> {
    public state = {
        rightContent: RightContentTypes.CHAT,
        boardActive: false
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
                            {<IconButton
                                icon={this.state.boardActive ? 'connect_icon_yes' : 'connect_icon'}
                                onClick={this.onConnect}
                            />}
                            <IconButton icon={'logout_icon'} onClick={onSignoutUser} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onConnect = () => {
        boardManager.init();
        if (boardManager.getConnectedState()) {
            this.setState({
                boardActive: true
            });
        } else {
            this.props.onOpenInfoPopup('Ошибка подключения доски',
                { text: 'Похоже, наш проект опять не работает, или Вы не подключили доску :(' });
        }
    }

    private changeRightContent = (event: React.MouseEvent) => {
        this.setState({
            rightContent: event.currentTarget.getAttribute('id') as RightContentTypes
        });
    }

}
