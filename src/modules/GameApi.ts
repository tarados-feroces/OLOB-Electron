import ws from './WebSocketApi';

import { GameMessages } from '../redux/constants/Game';
import { Step, Navigation } from '../typings/GameTypings';
import USBConnector from './USB/serialport';
import { store } from '../store/store';

class GameApi {
    public init({ onReceiveSnapshot, onGetPossibleSteps, onOpponentDisconnected }) {
        ws.registerHandler(GameMessages.UPDATE, onGetPossibleSteps);
        ws.registerHandler(GameMessages.SNAPSHOT, onReceiveSnapshot);
        ws.registerHandler(GameMessages.OPPONENT_DISCONNECTED, onOpponentDisconnected);

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
                // console.log(newGameState);

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

    public clear() {
        ws.deleteHandler(GameMessages.UPDATE);
        ws.deleteHandler(GameMessages.SNAPSHOT);
        ws.deleteHandler(GameMessages.OPPONENT_DISCONNECTED);
    }

    public makeStep(step: Step) {
        ws.sendMessage({ step }, GameMessages.STEP);
    }

    public sendSnapshotRequest() {
        ws.sendMessage({}, GameMessages.SNAPSHOT);
    }

    public sendSearchGameRequest() {
        ws.sendMessage({}, GameMessages.SEARCH);
    }

    public sendPossibleMovesRequest(position: Navigation) {
        ws.sendMessage({ position }, GameMessages.AREAS);
    }

    public disconnect() {
        ws.sendMessage({}, GameMessages.DISCONNECT);
        this.clear();
    }

    public sendMessage(text: string) {
        const clearText = text.trim();

        ws.sendMessage({ text: clearText }, GameMessages.MESSAGE);
    }
}

const gameAPI = new GameApi();
export default gameAPI;
