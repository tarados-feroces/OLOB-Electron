import { Reducer } from 'redux';

import { UserTypes } from '../constants/User';
import { User } from '../../typings/UserTypings';

export interface HistoryGame {
    opponent: User;
    side: string;
    winner: string;
}
export interface UserState {
    isAuthorized?: boolean | null;
    user?: User;
    error?: boolean;
    newAvatar?: string;
    gameList: HistoryGame[];
}

const initialState: UserState = {
    isAuthorized: null,
    error: false,
    gameList: []
};

const user: Reducer<UserState> = (state = initialState, action) => {
    switch (action.type) {
    case UserTypes.SET_USER:
        return {
            ...state,
            user: action.payload
        };

    case UserTypes.SET_ERROR:
        return { ...state, error: true };

    case UserTypes.RESET_ERROR:
        return { ...state, error: false };

    case UserTypes.SET_GAMES_HISTORY:
        return { ...state, gameList: action.payload.games };

    case UserTypes.SET_USER_AUTHORIZED:
        return { ...state, isAuthorized: true };

    case UserTypes.SET_NEW_AVATAR:
        return { ...state, newAvatar: action.payload.avatar };

    case UserTypes.RESET_USER_AUTHORIZED:
        return {
            ...state,
            isAuthorized: false,
            user: {}
        };

    default:
        return state;
    }
};

export default user;
