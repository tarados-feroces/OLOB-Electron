import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import LoginContainer from '../../containers/LoginContainer';
import * as PathConstants from '../../constants/PathsConstants';

interface AuthProps {
    login: string;
    isAuthorized: boolean;
    signoutUser?(): void;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {

    public render() {
        const { login } = this.props;

        if (!this.props.isAuthorized) {
            return (
                <Redirect to={PathConstants.LOGIN} />
            );
        }

        return (
            <div className={b()}>
                <p>{login}</p>
                <div className={b('signout-btn')} onClick={this.props.signoutUser}>Выйти</div>
            </div>
        );
    }
}
