import * as React from 'react';
import { connect } from 'react-redux';
import Main from '../../components/Main';

const mapStateToProps = (state) => {
    return { isAuthorized: state.user.isAuthorized, error: state.user.error };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps)(Main);
