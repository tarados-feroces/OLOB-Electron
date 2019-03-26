import { Reducer } from 'redux';

import { PopupTypes } from '../constants/Popup';

export interface PopupState {
    component?: React.ComponentType;
    props?: object;
    visibility: boolean;
}

const initialState: PopupState = {
    visibility: false
};

const popup: Reducer<PopupState> = (state = initialState,  action) => {
    switch (action.type) {
    case PopupTypes.CLOSE_POPUP:
        return {
            visibility: false
        };
    case PopupTypes.OPEN_POPUP:
        return {
            visibility: true,
            ...action.payload
        };
    default:
        return state;
    }
};

export default popup;
