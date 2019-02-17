import * as React from 'react';
import { connect } from 'react-redux';
import Login from '../../components/Login';
import { loginUser } from '../../redux/actions/User';
import { LoginData } from '../../modules/HttpApi';

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin(data: LoginData) {
            dispatch(loginUser(data));
        }
    };
};

// tslint:disable-next-line:no-empty
export default connect((state: {}) => {}, mapDispatchToProps)(Login);
