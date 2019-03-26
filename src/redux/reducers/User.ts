import { Reducer } from 'redux';

import { UserTypes } from '../constants/User';
import { User } from '../../typings/UserTypings';

export interface UserState {
    isAuthorized: boolean | null;
    user?: User;
}

const initialState: UserState = {
    isAuthorized: null
};

const user: Reducer<UserState> = (state = initialState, action) => {
    switch (action.type) {
    case UserTypes.SET_USER:
        return {
            ...state,
            user: action.payload
        };

    case UserTypes.SET_USER_AUTHORIZED:
        return { ...state, isAuthorized: true };

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
