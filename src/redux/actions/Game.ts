import { GameTypes } from '../constants/Game';
import { GameType, GameSituations, Navigation } from '../../typings/GameTypings';

import { User } from '../../typings/UserTypings';

interface StartGameState {
    opponent: User;
}

interface EndGameState {
    winner: string;
}

interface GameUpdateEvent {
    situation: GameSituations;
    currentUser: string;
    fen: string;
}

/**
 * Принимает сообщение о начале игры по веб-сокету
 * @param state Объект с состоянием начала игры
 */
export function startGame(state: StartGameState) {
    return { type: GameTypes.START_GAME, payload: state };
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
export function receivePossibleSteps(steps: Navigation[]) {
    return async (dispatch, getState) => {
        const game = getState().gameReducer.game;

        dispatch(updateGameState({
            ...game,
            possibleSteps: steps
        }));
    };
}

/**
 * Сбрасывает возможные ходы, которые может сделать фигура
 */
export function resetPossibleSteps() {
    return async (dispatch, getState) => {
        const game: GameType = getState().gameReducer.game;

        dispatch(updateGameState({
            ...game,
            possibleSteps: []
        }));
    };
}

export function closeGame() {
    return { type: GameTypes.CLOSE_GAME };
}

export function receiveSnapshot(snapshot: GameUpdateEvent) {
    return async (dispatch, getState) => {
        const game: GameType = getState().gameReducer.game;

        const data = snapshot.fen.split(' ')[0].split('/').reverse();

        dispatch(updateGameState({
            ...game,
            situation: snapshot.situation,
            state: data.map((item) => item.split(''))
        }));
    };
}

/**
 * Обновляет информацию об игре
 * @param newGameState Новое состояние игры
 */
export function updateGameState(newGameState: GameType) {
    return { type: GameTypes.UPDATE_GAME_STATE, payload: newGameState };
}
