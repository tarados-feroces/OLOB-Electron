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
 * Получает новый ход и обновляет информацию об игре
 * @param event Новый ход
 */
export function getNewStep(event: GameStepEvent) {
    return async (dispatch, getState) => {
        const game: GameType = getState().gameReducer.game;

        // удаляем съеденные и перемещенную фигуры
        const newFigures = game.figures.filter((figure) =>
            !compareCoords(figure.position, event.step.nextPos) &&
            !compareCoords(figure.position, event.step.prevPos)
        );

        const updatedFigure = game.figures.filter((figure) => compareCoords(figure.position, event.step.prevPos))[0];

        if (!updatedFigure) {
            return;
        }

        updatedFigure.position = event.step.nextPos;

        newFigures.push(updatedFigure);

        dispatch(updateGameState({
            figures: newFigures,
            info: event.info,
            currentUser: event.currentUser
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

// export function getPossibleSteps(position: Navigation) {
//     return { type: GameTypes.UPDATE_GAME_STATE, payload: newGameState };
// }
