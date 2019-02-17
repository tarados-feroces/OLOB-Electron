import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';

const mapStateToProps = (state) => {
    return { nickname: state.user.nickname };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, () => {})(Authorized);
