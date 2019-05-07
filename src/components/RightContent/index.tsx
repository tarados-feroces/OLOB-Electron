import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Icon } from '../../ui/Icon';
import Chat from '../../containers/Chat';
import gameAPI from '../../modules/GameApi';
import { User } from '../../typings/UserTypings';
import { GameType } from '../../typings/GameTypings';

export enum RightContentTypes {
    CHAT = 'CHAT',
    MOVES = 'MOVES'
}

interface RightContentProps {
    user: User;
    game: GameType;
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
        const { game } = this.props;
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

    public render() {
        return (
            <div className={b()}>
                <div className={b('controls').toString()}>
                    <div
                        id={RightContentTypes.CHAT}
                        onClick={this.changeRightContent}
                        className={this.state.rightContent === RightContentTypes.CHAT ?
                            b('tab', { active: true }) :
                            b('tab') }
                    >
                        <Icon id={'message_dark'} size={'xl'} />
                    </div>
                    <div
                        id={RightContentTypes.MOVES}
                        onClick={this.changeRightContent}
                        className={this.state.rightContent === RightContentTypes.MOVES ?
                            b('tab', { active: true }) :
                            b('tab') }
                    >
                        <Icon id={'gamelist_dark'} size={'xl'} />
                    </div>
                </div>
                <div className={b('data')}>
                    {this.getRightContent()}
                </div>
            </div>
        );
    }

    private changeRightContent = (event: React.MouseEvent) => {
        this.setState({
            rightContent: event.currentTarget.getAttribute('id') as RightContentTypes
        });
    }

}
