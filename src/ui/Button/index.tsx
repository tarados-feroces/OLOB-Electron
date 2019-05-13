import * as React from 'react';
import { block } from 'bem-cn';
import { Button as SButton, ButtonProps } from 'semantic-ui-react';

import './index.scss';

const b = block('ui-button');

export default class Button extends React.Component<ButtonProps> {
    public render() {
        const className = this.props.className || '';

        // const newProps = { ...this.props };
        // newProps.className = '';

        return (
            <SButton {...this.props} className={b.mix(className).toString()}>{this.props.children}</SButton>
        );
    }
}
