import * as React from 'react';
import { block } from 'bem-cn';
import './index.scss';
import { Simulate } from 'react-dom/test-utils';
import compositionStart = Simulate.compositionStart;

import { Button } from 'semantic-ui-react';

const b = block('main-page');

export default class LoginContainer extends React.Component {

    public render() {

        return (
            <div>
                <Button color={'teal'} animated={true} size={'large'}>
                    Hello World!
                </Button>

            </div>
        );
    }
}
