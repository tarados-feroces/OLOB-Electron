import { PopupTypes } from '../constants/Popup';
import { InfoPopup } from '../../components/InfoPopup';
import { ConfirmPopup } from '../../components/ConfirmPopup';
import UserInfo from '../../containers/UserInfoContainer';
import { ThunkAction } from '../../store/store';

export function openInfoPopup(description: string, props: object): ThunkAction {
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

export function openConfirmPopup(description: string, props: object): ThunkAction {
    return async (dispatch) => {
        dispatch(openPopup(
            ConfirmPopup,
            {
                ...props
            },
            description
        ));
    };
}

export function openUserInfoPopup(description: string, props: object): ThunkAction {
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
