import * as React from 'react';
import { connect } from 'react-redux';
import Signup from '../../components/Signup';
import { signupUser } from '../../redux/actions/User';
import { SignupData } from '../../modules/HttpApi';

const mapDispatchToProps = (dispatch) => {
    return {
        onSignup(data: SignupData) {
            dispatch(signupUser(data));
        }
    };
};

const mapStateToProps = (state) => {
    return { isAuthorized: state.userReducer.isAuthorized };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
