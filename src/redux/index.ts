import { combineReducers } from 'redux';

import popup from './reducers/Popup';
import user from './reducers/User';
import game from './reducers/Game';

export default combineReducers(
    {
        user,
        game,
        popup
    }
);
