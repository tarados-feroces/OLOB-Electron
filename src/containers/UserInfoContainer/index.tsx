import { connect } from 'react-redux';

import { updateUser, changeUserAvatar } from '../../redux/actions/User';
import { closePopup, openInfoPopup } from '../../redux/actions/Popup';

import UserInfo from '../../components/UserInfo';
import { UpdateUserData, AvatarChangeOptions } from '../../modules/HttpApi';
import { MapStateToProps, MapDispatchToProps } from '../../store/store';

interface StateProps {
    login: string;
    avatar: string;
    error: boolean;
    newAvatar: string;
    loading: boolean;
}

interface DispatchProps {
    onSubmit(data: UpdateUserData): void;
    onChangeAvatar(newAvatar: string, options?: AvatarChangeOptions): void;
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
        },
        onChangeAvatar(newAvatar: string, options?: AvatarChangeOptions) {
            dispatch(changeUserAvatar(newAvatar, options));
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, {}> = (state) => {
    return {
        login: state.user.user.login,
        avatar: state.user.user.avatar,
        newAvatar: state.user.newAvatar,
        error: state.user.error,
        loading: state.user.loading
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
