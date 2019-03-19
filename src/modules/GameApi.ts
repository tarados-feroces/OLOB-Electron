import ws from './WebSocketApi';

import { GameMessages } from '../redux/constants/Game';
import { Step, Navigation } from '../typings/GameTypings';

class GameApi {
    public init({ onReceiveSnapshot, onGameStarted, onGameEnd, onGameUpdate }) {
        ws.registerHandler(GameMessages.STARTED, onGameStarted);
        ws.registerHandler(GameMessages.FINISHED, onGameEnd);
        ws.registerHandler(GameMessages.UPDATE, onGameUpdate);
        ws.registerHandler(GameMessages.SNAPSHOT, onReceiveSnapshot);
    }

    public clear() {
        ws.deleteHandler(GameMessages.STARTED);
        ws.deleteHandler(GameMessages.FINISHED);
        ws.deleteHandler(GameMessages.UPDATE);
        ws.deleteHandler(GameMessages.SNAPSHOT);
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

    public sendAccessedAreasRequest(position: Navigation) {
        ws.sendMessage({ position }, GameMessages.AREAS);
    }
}

const gameAPI = new GameApi();
export default gameAPI;
