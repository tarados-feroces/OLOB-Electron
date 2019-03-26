import { PopupTypes } from '../constants/Popup';
import { InfoPopup } from '../../components/InfoPopup';

export function openInfoPopup(data: { text: string, buttonText: string }) {
    return async (dispatch) => {
        dispatch(openPopup(
            InfoPopup,
            {
                ...data,
                onClick: dispatch(closePopup())
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
