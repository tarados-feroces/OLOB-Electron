import * as React from 'react';
import { block } from 'bem-cn';

import { History } from 'history';
import * as PathConstants from '../../constants/PathsConstants';

import './index.scss';
import { Dimmer, Loader } from 'semantic-ui-react';

const b = block('olob-main');

interface Props {
    history?: History;
    isAuthorized?: boolean;
}

export default class Main extends React.Component<Props> {
    public render() {
        if (this.props.isAuthorized) {
            this.props.history.push(PathConstants.AUTH);
        } else if (this.props.isAuthorized === false) {
            this.props.history.push(PathConstants.LOGIN);
        }

        return (
            <div className={b()}>
                <Dimmer active={true}>
                    <Loader content="Loading" />
                </Dimmer>
            </div>
        );
    }
}
