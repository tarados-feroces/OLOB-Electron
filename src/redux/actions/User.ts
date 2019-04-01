import { httpApi, LoginData, SignupData, UpdateUserData } from '../../modules/HttpApi';

import { UserState } from '../reducers/User';
import { UserTypes } from '../constants/User';

const setUser = (user: UserState) => ({
    type: UserTypes.SET_USER,
    payload: user
});

const setUserAuthorized = () => ({ type: UserTypes.SET_USER_AUTHORIZED });
const resetUserAuthorized = () => ({ type: UserTypes.RESET_USER_AUTHORIZED });

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
            dispatch(setUser(json));
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
            dispatch(setUser(json));
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
