import * as React from 'react';
import { block } from 'bem-cn';
import { Form as SForm } from 'semantic-ui-react';

import './index.scss';

interface FormProps {
    text?: string;
}

const b = block('ui-form');

export default class Form extends React.Component<FormProps> {
    public render() {

        return (
            <SForm className={b()}>
                    {this.props.children}
            </SForm>
        );
    }
}
