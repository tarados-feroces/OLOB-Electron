import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface TitleProps {
    text: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const b = block('ui-title');

export default class Title extends React.Component<TitleProps> {
    public render() {
        const { text, size, className } = this.props;

        return (
            <h1 className={b({ size: size || 'medium' }).mix(className)}>{text}</h1>
        );
    }
}
