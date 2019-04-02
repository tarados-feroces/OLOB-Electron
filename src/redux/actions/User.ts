import { httpApi, LoginData, SignupData, UpdateUserData } from '../../modules/HttpApi';

import { UserTypes } from '../constants/User';
import { User } from '../../typings/UserTypings';

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

const setUserAuthorized = () => ({ type: UserTypes.SET_USER_AUTHORIZED });
const resetUserAuthorized = () => ({ type: UserTypes.RESET_USER_AUTHORIZED });
const setError = () => ({ type: UserTypes.SET_ERROR });
const resetError = () => ({ type: UserTypes.RESET_ERROR });

export function getUser() {
    return async (dispatch) => {
        const response = await httpApi.getUser();

        if (response.ok) {
            const json = await response.json();
            dispatch(setUser(json));
            dispatch(setUserAuthorized());
        } else {
            dispatch(resetUserAuthorized());
        }
    };
}

export function loginUser(data: LoginData) {
    return async (dispatch) => {
        const response = await httpApi.loginUser(data);
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

export function updateUser(data: UpdateUserData) {
    return async (dispatch) => {
        const response = await httpApi.updateUser(data);
        const json = await response.json();
        if (response.ok) {
            dispatch(setUser(json));
        }
    };
}

export function signupUser(data: SignupData) {
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

export function signoutUser() {
    return async (dispatch) => {
        const response = await httpApi.signoutUser();
        if (response.ok) {
            dispatch(resetUserAuthorized());
        }
    };
}
