import * as React from 'react';
import { connect } from 'react-redux';
import { closePopup } from '../../redux/actions/Popup';

import block from 'bem-cn';

import './index.scss';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';
import { Modal } from 'semantic-ui-react';

interface StateProps {
    component?: React.ComponentType;
    props?: object;
    visibility?: boolean;
    description?: string;
}

interface DispatchProps {
    onClose?(): void;
}

interface OwnProps {}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => {
    return {
        onClose() {
            dispatch(closePopup());
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    return state.popup;
};

const b = block('olob-popup');

const PopupWrapper: React.FunctionComponent<StateProps & OwnProps & DispatchProps> =
    ({ component, props, visibility, description, onClose }) => {

        return (
            <Modal open={visibility} onClose={onClose} className={b().toString()}>
                <Modal.Header>
                    {description}
                </Modal.Header>
                <Modal.Content>
                    {component && React.createElement(component, props)}
                </Modal.Content>
            </Modal>
        );
    };

export default connect(mapStateToProps, mapDispatchToProps)(PopupWrapper);
