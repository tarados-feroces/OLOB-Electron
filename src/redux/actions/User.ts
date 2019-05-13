import { httpApi, LoginData, SignupData, UpdateUserData, AvatarChangeOptions } from '../../modules/HttpApi';

import { UserTypes } from '../constants/User';

import { startGame, closeGame } from './Game';
import { ThunkAction } from '../../store/store';
import { HistoryGame } from '../reducers/User';

interface UserData {
    _id: string;
    avatar: string;
    email: string;
}

const setUser = (user: UserData) => ({
    type: UserTypes.SET_USER,
    payload: {
        ...user,
        id: user._id
    }
});

const setGamesHistory = (games: HistoryGame[]) => ({
    type: UserTypes.SET_GAMES_HISTORY,
    payload: {
        games
    }
});

const setUserNewAvatar = (avatar: string) => ({
    type: UserTypes.SET_NEW_AVATAR,
    payload: {
        avatar
    }
});

const setUserAuthorized = () => ({ type: UserTypes.SET_USER_AUTHORIZED });
const resetUserAuthorized = () => ({ type: UserTypes.RESET_USER_AUTHORIZED });
const setError = () => ({ type: UserTypes.SET_ERROR });
const resetError = () => ({ type: UserTypes.RESET_ERROR });

export function getUser(): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.getUser();

        if (response.ok) {
            const json = await response.json();
            dispatch(setUser(json.user));
            dispatch(setGamesHistory(json.user.games));

            if (json.game) {
                dispatch(startGame(json.game));
            }

            dispatch(setUserAuthorized());
        } else {
            dispatch(resetUserAuthorized());
        }
    };
}

export function loginUser(data: LoginData): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.loginUser(data);
        const json = await response.json();

        if (response.ok) {
            if (json.game) {
                dispatch(startGame(json.game));
            }

            dispatch(setUser(json.user));
            dispatch(setGamesHistory(json.user.games));

            dispatch(setUserAuthorized());
            dispatch(resetError());

        } else {
            dispatch(setError());
        }
    };
}

export function updateUser(data: UpdateUserData): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.updateUser(data);
        const json = await response.json();
        if (response.ok) {
            dispatch(setUser(json));
            dispatch(resetError());
        } else {
            dispatch(setError());
        }
    };
}

export function signupUser(data: SignupData): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.signupUser(data);
        const json = await response.json();
        if (response.ok) {
            dispatch(setUserAuthorized());
            dispatch(resetError());
            dispatch(setUser(json));
        } else {
            dispatch(setError());
        }
    };
}

export function signoutUser(): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.signoutUser();
        if (response.ok) {
            dispatch(resetUserAuthorized());
            dispatch(closeGame());
        }
    };
}

export function changeUserAvatar(newAvatar: string, options?: AvatarChangeOptions): ThunkAction {
    return async (dispatch) => {
        if (!newAvatar) {
            dispatch(setUserNewAvatar(newAvatar));
        }

        const response = await httpApi.changeAvatar(newAvatar, options);
        const json = await response.json();
        if (response.ok) {
            dispatch(setUserNewAvatar(json.avatar));
        } else {
            dispatch(setError());
        }
    };
}
