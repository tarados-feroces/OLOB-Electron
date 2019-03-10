import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { signoutUser } from '../../redux/actions/User';
// import { LoginData } from '../../modules/HttpApi';
// import { loginUser } from '../../redux/actions/User';

const mapDispatchToProps = (dispatch) => {
    return {
        signoutUser() {
            dispatch(signoutUser());
        }
    };
};

const mapStateToProps = (state) => {
    return {
        login: state.userReducer.login,
        isAuthorized: state.userReducer.isAuthorized
    };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Authorized);
