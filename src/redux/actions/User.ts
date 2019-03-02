import { httpApi, LoginData, SignupData } from '../../modules/HttpApi';

import { UserState } from '../reducers/User';
import { ActionTypes } from '../constants/User';

const setUser = (user: UserState) => ({
    type: ActionTypes.SET_USER,
    payload: user
});

const setUserAuthorized = () => ({ type: ActionTypes.SET_USER_AUTHORIZED });
const resetUserAuthorized = () => ({ type: ActionTypes.RESET_USER_AUTHORIZED });

export function getUser() {
    return async (dispatch) => {
        const response = await httpApi.getUser();

        if (response.ok) {
            const json = await response.json();
            dispatch(setUserAuthorized());
            dispatch(setUser(json));
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
