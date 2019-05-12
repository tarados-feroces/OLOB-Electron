import { httpApi, LoginData, SignupData, UpdateUserData, AvatarChangeOptions } from '../../modules/HttpApi';

import { UserTypes } from '../constants/User';

import { startGame, closeGame } from './Game';
import { ThunkAction } from '../../store/store';

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
        if (response.ok) {
            const json = await response.json();
            dispatch(setUserAuthorized());
            dispatch(resetError());
            dispatch(setUser(json));
        } else {
            dispatch(setError());
        }
    };
}

export function updateUser(data: UpdateUserData): ThunkAction {
    return async (dispatch) => {
        const response = await httpApi.updateUser(data);
        if (response.ok) {
            const json = await response.json();
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
        if (response.ok) {
            const json = await response.json();
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
