import { GameTypes } from '../constants/Game';
import { GameType, GameSituations, PossibleSteps, Side } from '../../typings/GameTypings';
import { ThunkAction } from '../../store/store';
import { Message } from '../../typings/Chat';
import boardManager from '../../modules/BoardManager';
import { User } from '../../typings/UserTypings';

interface UserData {
    _id: string;
    avatar: string;
    email: string;
}

interface StartGameState {
    opponent: UserData;
    situation: GameSituations;
    currentUser: string;
    fen: string;
    side: Side;
    messages: Message[];
    steps: HistoryStep[];
}

interface EndGameState {
    winner: string;
}

export interface HistoryStep {
    from: string;
    to: string;
    side: string;
    figure: string;
}

interface GameUpdateEvent {
    situation: GameSituations;
    currentUser: string;
    fen: string;
    step: HistoryStep;
}

/**
 * Принимает сообщение о начале игры по веб-сокету
 * @param state Объект с состоянием начала игры
 */
export function startGame(state: StartGameState) {
    const game: GameType = {
        state: parseFEN(state.fen),
        situation: state.situation,
        currentUser: state.currentUser,
        possibleSteps: [],
        side: state.side,
        steps: state.steps
    };

    return { type: GameTypes.START_GAME, payload: {
        opponent: { ...state.opponent, id: state.opponent._id, connected: true  },
        history: {
            messages: state.messages
        },
        game
    } };
}

/**
 * Принимает сообщение о конце игры по веб-сокету
 * @param state Объект с состоянием конца игры
 */
export function endGame(state: EndGameState) {
    return { type: GameTypes.END_GAME, payload: state };
}

/**
 * Получает и записывает возможные ходы, которые может сделать фигура
 * @param possibleSteps Возможные ходы
 */
export function receivePossibleSteps(data: { steps: PossibleSteps[] }): ThunkAction {
    return async (dispatch, getState) => {
        const game = getState().game.game;

        delete game.possibleSteps;

        boardManager.sendPossibleSteps(data.steps.map((item) =>
            ({ ...item, color: item.captured ? '#bc0100' : '#51bd3c' })));

        dispatch(updateGameState({
            ...game,
            possibleSteps: data.steps
        }));
    };
}

/**
 * Сбрасывает возможные ходы, которые может сделать фигура
 */
export function resetPossibleSteps(): ThunkAction {
    return async (dispatch, getState) => {
        const game: GameType = getState().game.game;

        dispatch(updateGameState({
            ...game,
            possibleSteps: []
        }));

        boardManager.resetPossibleSteps();
    };
}

export function closeGame() {
    return { type: GameTypes.CLOSE_GAME };
}

export function receiveSnapshot(snapshot: GameUpdateEvent): ThunkAction {
    return async (dispatch, getState) => {
        const game: GameType = getState().game.game;
        const user: User = getState().user.user;

        const steps = game.steps || [];
        steps.push(snapshot.step);

        if (game.currentUser !== user.id) {
            boardManager.sendOpponentStep(transpileStepsToCoords(snapshot.step));
        }

        dispatch(updateGameState({
            ...game,
            ...snapshot,
            steps,
            state: parseFEN(snapshot.fen)
        }));
    };
}

export function opponentDisconnected() {
    return { type: GameTypes.OPPONENT_DISCONNECTED };
}

export function receiveMessage(message: Message) {
    return { type: GameTypes.RESEIVE_MESSAGE, payload: { message } };
}

/**
 * Обновляет информацию об игре
 * @param newGameState Новое состояние игры
 */
export function updateGameState(newGameState: GameType) {
    return { type: GameTypes.UPDATE_GAME_STATE, payload: newGameState };
}

function parseFEN(fen: string): string[][] {
    // if (!fen) {
    //     return;
    // }

    const data = fen.split(' ')[0].split('/');
    const result = data.map((item) => {
        const line = [];
        for (const letter of item) {
            const digit = parseInt(letter, 10);
            isNaN(digit) ? line.push(letter) : line.push(...Array(digit).keys());
        }

        return line;
    });

    return result;
}

function transpileStepsToCoords(item: { from: string, to: string }) {
    return {
        prevPos: {
            x: item.from[0].charCodeAt(0) - 97,
            y: Number(item.from[1]) - 1
        },
        nextPos: {
            x: item.to[0].charCodeAt(0) - 97,
            y: Number(item.to[1]) - 1
        }
    };
}
