import {
    SET_USER, LOGIN_USER, SIGNUP_USER
} from '../constants/User';

const initialState = {
    isAuthorized: null,
    email: '',
    login: ''
};

export default function user(state = initialState, action) {
    switch (action.type) {
    case SET_USER:

        return { ...state, ...action.payload };
    case LOGIN_USER:

        return { ...state, ...action.payload };
    case SIGNUP_USER:

        return { ...state, ...action.payload };
    default:

        return state;
    }
}
