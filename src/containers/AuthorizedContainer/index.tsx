import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { getUser } from '../../redux/actions/User';
// import { LoginData } from '../../modules/HttpApi';
// import { loginUser } from '../../redux/actions/User';

const mapDispatchToProps = (dispatch) => {
    return {
        getUser() {
            dispatch(getUser());
        }
    };
};

const mapStateToProps = (state) => {
    return { login: state.userReducer.login };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Authorized);
