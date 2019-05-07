import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import IconButton from '../../ui/IconButton';

interface ComposeProps {
    onSubmit(text: string): void;
}

const b = block('olob-compose');

export default class Compose extends React.Component<ComposeProps> {
    private textareaRef = React.createRef<HTMLTextAreaElement>();

    public render() {
        return (
            <div className={b()}>
                <div className={b('input-container')}>
                    <textarea
                        className={b('input')}
                        ref={this.textareaRef}
                        rows={1}
                        placeholder="Напишите сообщение..."
                        onKeyDown={this.handleKeyDown}
                        maxLength={100}
                    />
                </div>
                <div className={b('submit-container')}>
                    <IconButton onClick={this.handleSubmit} icon="arrow-right" size="m" />
                </div>
            </div>
        );
    }

    public handleSubmit = () => {
        const { onSubmit } = this.props;
        const textareaNode = this.textareaRef.current;

        if (textareaNode) {
            onSubmit(textareaNode.value);
            textareaNode.value = '';
            textareaNode.focus();
        }
    }

    public handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSubmit();
        }
    }
}
