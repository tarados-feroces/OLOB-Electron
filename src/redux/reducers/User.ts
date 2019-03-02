import { Reducer } from 'redux';

import { ActionTypes } from '../constants/User';

export interface UserState {
    isAuthorized: boolean | null;
    login: string;
    email?: string;
    password?: string;
}

const initialState: UserState = {
    isAuthorized: null,
    email: '',
    login: ''
};

const userReducer: Reducer<UserState> = (state = initialState,  action) => {
    switch (action.type) {
    case ActionTypes.SET_USER:
        return { ...state, ...action.payload };

    case ActionTypes.SET_USER_AUTHORIZED:
        return { ...state, isAuthorized: true };

    case ActionTypes.RESET_USER_AUTHORIZED:
        return { ...state, isAuthorized: false };

    default:
        return state;
    }
};

export default userReducer;
