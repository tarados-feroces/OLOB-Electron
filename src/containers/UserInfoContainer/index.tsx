import { connect } from 'react-redux';

import { updateUser } from '../../redux/actions/User';

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
