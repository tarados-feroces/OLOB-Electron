import { GameTypes } from '../constants/Game';
import { GameType, GameInfo, Step, Navigation } from '../../typings/GameTypings';

import { User } from '../../typings/UserTypings';

interface StartGameState {
    opponent: User;
}

interface EndGameState {
    winner: number;
}

interface GameStepEvent {
    step: Step;
    info: GameInfo;
    currentUser: number;
}

interface GameUpdateEvent {
    info: GameInfo;
    currentUser: number;
    possibleSteps?: Navigation[];
    fen: string;
}

function compareCoords(firstCoords: Navigation, secondCoords: Navigation) {
    return firstCoords.x === secondCoords.x && firstCoords.y === secondCoords.y;
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
export function getPossibleSteps(possibleSteps: Navigation[]) {
    return async (dispatch, getState) => {
        const game: GameUpdateEvent = getState().gameReducer.game;

        dispatch(updateGameState({
            ...game,
            possibleSteps
        }));
    };
}

/**
 * Сбрасывает возможные ходы, которые может сделать фигура
 */
export function resetPossibleSteps() {
    return async (dispatch, getState) => {
        const game: GameUpdateEvent = getState().gameReducer.game;

        dispatch(updateGameState({
            ...game,
            possibleSteps: []
        }));
    };
}

export function closeGame() {
    return { type: GameTypes.CLOSE_GAME };
}

/**
 * Обновляет информацию об игре
 * @param newGameState Новое состояние игры
 */
export function updateGameState(newGameState: GameUpdateEvent) {
    const data = newGameState.fen.split(' ')[0].split('/').reverse();
    delete newGameState.fen;
    const result: GameType = { ...newGameState, state: data.map((item) => item.split('')) };

    return { type: GameTypes.UPDATE_GAME_STATE, payload: result };
}
