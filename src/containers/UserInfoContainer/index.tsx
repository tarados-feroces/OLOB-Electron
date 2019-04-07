import { connect } from 'react-redux';

import { updateUser } from '../../redux/actions/User';
import { closePopup, openInfoPopup } from '../../redux/actions/Popup';

import UserInfo from '../../components/UserInfo';
import { UpdateUserData } from '../../modules/HttpApi';
import { MapStateToProps, MapDispatchToProps } from '../../store/store';

interface StateProps {
    login: string;
    avatar: string;
}

interface DispatchProps {
    onSubmit(data: UpdateUserData): void;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        onSubmit(data: UpdateUserData) {
            dispatch(updateUser(data));
            dispatch(closePopup());
        },
        onOpenInfoPopup(description: string, data: { text: string, buttonText: string }) {
            dispatch(openInfoPopup(
                description,
                {
                    ...data,
                    onClick: () => {
                        dispatch(closePopup());
                    }
                }
            ));
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, {}> = (state) => {
    return {
        login: state.user.user.login,
        avatar: state.user.user.avatar,
        error: state.user.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
