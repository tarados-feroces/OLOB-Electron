import * as React from 'react';
import { connect } from 'react-redux';
import UserCard from '../../components/UserCard';
import { signoutUser } from '../../redux/actions/User';
import { openUserInfoPopup } from '../../redux/actions/Popup';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';

interface StateProps {
    login: string;
}

interface DispatchProps {
    onLogOut(): void;
}

interface OwnProps {

}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => {
    return {
        onLogOut() {
            dispatch(signoutUser());
        },
        onOpenUserInfo(data: object) {
            dispatch(openUserInfoPopup('Настройки', data));
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    return {
        login: state.user.user.login
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
