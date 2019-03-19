import { Reducer } from 'redux';

import { GameTypes } from '../constants/Game';
import { Figure, GameType } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';

export interface GameState {
    game?: GameType;
    opponent?: User;
    isFinished: boolean;
    winner?: boolean;
}

const initialState: GameState = {
    isFinished: true
};

const gameReducer: Reducer<GameState> = (state = initialState,  action) => {
    switch (action.type) {
    case GameTypes.START_GAME:
        return {
            ...state,
            ...action.payload,
            isFinished: false
        };

    case GameTypes.UPDATE_GAME_STATE:
        return {
            ...state,
            game: action.payload
        };

    case GameTypes.END_GAME:
        return {
            ...state,
            ...action.payload,
            isFinished: true
        };
    case GameTypes.CLOSE_GAME:
        return {
            ...state,
            game: null
        };
    default:
        return state;
    }
};

export default gameReducer;
