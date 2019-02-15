import * as HttpConstants from '../../constants/HttpConstants';
import transport from '../../modules/Transport/Transport';

import {
    SET_USER, LOGIN_USER, SIGNUP_USER
} from '../constants/User';

export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    };
}

export function getUser() {
    return async (dispatch) => {
        dispatch(setUser({ isAuthorized: null }));
        const response = await transport.doGet(HttpConstants.GET_USER);

        const json = await response.json();

        dispatch(
            setUser(
                response.ok ? ({ ...json, isAuthorized: true }) : { isAuthorized: false }
            )
        );
    };
}

export function loginUser(data) {
    return async (dispatch) => {
        const response = await transport.doPost(HttpConstants.LOGIN, data);
        const json = await response.json();
        if (response.ok) {
            dispatch(login({ ...json, isAuthorized: true }));
        }
    };
}

function login(data) {
    return {
        type: LOGIN_USER,
        payload: data
    };
}

export function signupUser(data) {
    return async (dispatch) => {
        const response = await transport.doPost(HttpConstants.SIGNUP, data);
        const json = await response.json();
        if (response.ok) {
            dispatch(signup({ ...json, isAuthorized: true }));
        }
    };
}

function signup(data) {
    return {
        type: SIGNUP_USER,
        payload: data
    };
}
