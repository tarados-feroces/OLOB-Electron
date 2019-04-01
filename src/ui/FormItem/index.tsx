import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface FormItemProps {
    text: string;
}

const b = block('ui-form');

export default class FormItem extends React.Component<FormItemProps> {
    public render() {

        return (
            <div className={b('item')}>
                    {this.props.children}
            </div>
        );
    }
}
