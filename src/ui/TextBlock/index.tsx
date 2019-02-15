import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

interface TextBlockProps {
    text: string;
}

const b = block('ui-textblock');

export default class TextBlock extends React.Component<TextBlockProps> {
    public render() {
        const { text } = this.props;

        return (
            <p className={b()}>{text}</p>
        );
    }
}
