import * as React from 'react';
import { connect } from 'react-redux';
import { PopupState } from '../../redux/reducers/Popup';

interface DispatchProps {
    onClick(): void;
}

const mapStateToProps = (state) => {
    return state.popup;
};

const PopupWrapper: React.SFC<PopupState & DispatchProps> = ({ component, props, visibility }) => {
    return (
        visibility && component && React.createElement(component, props)
    );
};

export default connect(mapStateToProps)(PopupWrapper);
