import * as React from 'react';
import { connect } from 'react-redux';
import { closePopup } from '../../redux/actions/Popup';
import IconButton from '../../ui/IconButton';

import block from 'bem-cn';

import './index.scss';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';

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

        if (!visibility) {
            return (<></>);
        }

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('header')}>
                        <div className={b('header-item')}>
                            <p className={b('description')}>{description}</p>
                        </div>
                        <div className={b('header-item')}>
                            <IconButton className={b('close-icon')} size="xs" icon="cancel" onClick={onClose} />
                        </div>
                    </div>
                    <div className={b('content')}>
                        {component && React.createElement(component, props)}
                    </div>
                </div>
            </div>
        );
    };

export default connect(mapStateToProps, mapDispatchToProps)(PopupWrapper);
