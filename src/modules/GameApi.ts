import ws from './WebSocketApi';

import { GameMessages } from '../redux/constants/Game';
import { Step, Navigation, Figure } from '../typings/GameTypings';

class GameApi {
    public init({ onReceiveSnapshot, onGetPossibleSteps, onOpponentDisconnected, onFigureChange }) {
        ws.registerHandler(GameMessages.UPDATE, onGetPossibleSteps);
        ws.registerHandler(GameMessages.SNAPSHOT, onReceiveSnapshot);
        ws.registerHandler(GameMessages.OPPONENT_DISCONNECTED, onOpponentDisconnected);
        ws.registerHandler(GameMessages.CHANGE_FIGURE, onFigureChange);
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

    public sendFigureChange(figure: Figure) {
        ws.sendMessage({ figure }, GameMessages.CHANGE_FIGURE);
    }

    public disconnect() {
        ws.sendMessage({}, GameMessages.DISCONNECT);
        this.clear();
    }

    public sendMessage(text: string) {
        const clearText = text.trim();

        if (!clearText) {
            return;
        }

        ws.sendMessage({ text: clearText }, GameMessages.MESSAGE);
    }
}

const gameAPI = new GameApi();
export default gameAPI;
