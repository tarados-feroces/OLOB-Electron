import { Reducer } from 'redux';

import { GameTypes } from '../constants/Game';
import { GameType, Player } from '../../typings/GameTypings';
import { MessageHistory } from '../../typings/Chat';

export interface GameState {
    isFinished: boolean;
    history: MessageHistory;
    game?: GameType;
    opponent?: Player;
    winner?: string;
}

const initialState: GameState = {
    isFinished: true,
    history: {
        messages: []
    }
};

const game: Reducer<GameState> = (state = initialState, action) => {
    switch (action.type) {
    case GameTypes.START_GAME:
        return {
            ...action.payload,
            isFinished: false
        };

    case GameTypes.UPDATE_GAME_STATE:
        return {
            ...state,
            game: action.payload
        };

    case GameTypes.OPPONENT_DISCONNECTED:
        return {
            ...state,
            opponent: {
                ...state.opponent,
                connected: false
            }
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
    case GameTypes.RESEIVE_MESSAGE:
        const messageHistory = state.history ? state.history.messages : [];
        messageHistory.push(action.payload.message);

        return {
            ...state,
            history: {
                messages: messageHistory
            }
        };
    default:
        return state;
    }
};

export default game;
