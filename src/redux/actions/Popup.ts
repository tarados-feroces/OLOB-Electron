import { PopupTypes } from '../constants/Popup';
import { InfoPopup } from '../../components/InfoPopup';
import UserInfo from '../../containers/UserInfoContainer';

export function openInfoPopup(description: string, props: object) {
    return async (dispatch) => {
        dispatch(openPopup(
            InfoPopup,
            {
                ...props
            },
            description
        ));
    };
}

export function openUserInfoPopup(description: string, props: object) {
    return async (dispatch) => {
        dispatch(openPopup(
            UserInfo,
            {
                props
            },
            description
        ));
    };
}

export function openPopup(component: React.ComponentType, props: object, description: string) {
    return {
        type: PopupTypes.OPEN_POPUP,
        payload: {
            component,
            props,
            description
        }
    };
}

export function closePopup() {
    return { type: PopupTypes.CLOSE_POPUP };
}
