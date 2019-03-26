import { combineReducers } from 'redux';

import userReducer from './reducers/User';
import gameReducer from './reducers/Game';
import popup from './reducers/Popup';

export default combineReducers(
    {
        userReducer,
        gameReducer,
        popup
    }
);
