import ws from './WebSocketApi';

import { GameMessages } from '../redux/constants/Game';
import { Step, Navigation } from '../typings/GameTypings';

class GameApi {
    public init({ onReceiveSnapshot, onGetPossibleSteps, onOpponentDisconnected }) {
        ws.registerHandler(GameMessages.UPDATE, onGetPossibleSteps);
        ws.registerHandler(GameMessages.SNAPSHOT, onReceiveSnapshot);
        ws.registerHandler(GameMessages.OPPONENT_DISCONNECTED, onOpponentDisconnected);
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
}

const gameAPI = new GameApi();
export default gameAPI;
