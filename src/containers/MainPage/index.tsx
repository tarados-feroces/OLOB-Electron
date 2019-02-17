import * as React from 'react';
import { block } from 'bem-cn';

import Login from '../../components/Login';

const b = block('main-page');

export default class MainPage extends React.Component {
    public render() {
        return (
            <>
                <Login />
            </>
        );
    }
}
