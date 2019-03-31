import { PopupTypes } from '../constants/Popup';
import { InfoPopup } from '../../components/InfoPopup';


export function openInfoPopup(props: object) {
    return async (dispatch) => {
        dispatch(openPopup(
            InfoPopup,
            {
                ...props
            }
        ));
    };
}

export function openUserInfoPopup(description: string, props: object) {
    return async (dispatch) => {
        dispatch(openPopup(
            InfoPopup,
            {
                ...props
            }
        ));
    };
}

export function openPopup(component: React.ComponentType, props: object) {
    return {
        type: PopupTypes.OPEN_POPUP,
        payload: {
            component,
            props
        }
    };
}

export function closePopup() {
    return { type: PopupTypes.CLOSE_POPUP };
}
