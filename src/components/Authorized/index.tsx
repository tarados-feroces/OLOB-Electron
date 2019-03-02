import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Redirect } from 'react-router';
import LoginContainer from '../../containers/LoginContainer';

interface AuthProps {
    login: string;
}

const b = block('olob-auth');

export default class Authorized extends React.Component<AuthProps> {

    public render() {
        const { login } = this.props;

        return (
            <div className={b()}>
                <p>{login}</p>
            </div>
        );
    }
}
