import { combineReducers } from 'redux';

import userReducer from './reducers/User';
import gameReducer from './reducers/Game';

export default combineReducers(
    {
        userReducer,
        gameReducer
    }
);
