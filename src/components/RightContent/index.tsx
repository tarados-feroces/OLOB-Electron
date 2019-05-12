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
import USBConnector from '../../modules/USB/serialport';

export enum RightContentTypes {
    CHAT = 'CHAT',
    HISTORY = 'HISTORY'
}

interface RightContentProps {
    user: User;
    game: GameType;
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
        const { onSignoutUser } = this.props;

        return (
            <div className={b()}>
                <div className={b('data')}>
                    {this.getRightContent()}
                </div>
                <div className={b('menu')}>
                    <div className={b('tabs')}>
                    <div
                        id={RightContentTypes.CHAT}
                        onClick={this.changeRightContent}
                        className={this.state.rightContent === RightContentTypes.CHAT ?
                            b('tab', { active: true }) :
                            b('tab') }
                    >
                        <Icon id={'message_icon'} size={'xl'} />
                    </div>
                    <div
                        id={RightContentTypes.HISTORY}
                        onClick={this.changeRightContent}
                        className={this.state.rightContent === RightContentTypes.HISTORY ?
                            b('tab', { active: true }) :
                            b('tab') }
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
        );
    }

    private onConnect = () => {
        const USBConnection = new USBConnector();
        USBConnection.registerHandler(GameMessages.SNAPSHOT, (usbData) => {
            const data = usbData.trim().split(' ');

            if (data.length === 8) {

                const newGameState = data
                    .reverse()
                    .map((val) => parseInt(val, 16))
                    .map((val, i) => {
                        const arr = [ 8 - i ];
                        for (let x = 0; x < 8; ++x) {
                            arr.push((val & (0x80 >> x) ? 1 : 0));
                        }

                        return arr;
                    });

                const gameState = store.getState().game.game.state;
                const diffIndexes: {
                    [flag: number]: Navigation
                } = [];

                gameState.forEach((row, rowIndex: number) => {
                    row.forEach((item, itemIndex: number) => {
                        if (item !== newGameState[rowIndex][itemIndex]) {
                            diffIndexes[item ? 0 : 1] = { x: rowIndex, y: itemIndex };
                        }
                    });
                });

                if (Object.keys(diffIndexes).length === 1) {
                    ws.sendMessage({ position: diffIndexes[0] }, GameMessages.AREAS);
                }

                if (Object.keys(diffIndexes).length === 2) {
                    ws.sendMessage({ step: { nextPos: diffIndexes[1], prevPos: diffIndexes[0] } }, GameMessages.STEP);
                }

            }
        });
    }

    private changeRightContent = (event: React.MouseEvent) => {
        this.setState({
            rightContent: event.currentTarget.getAttribute('id') as RightContentTypes
        });
    }

}
