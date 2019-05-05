import * as React from 'react';
import { block } from 'bem-cn';
import Message from '../Message';

import { MessageHistory } from '../../typings/Chat';

import WebSocketApi from '../../modules/WebSocketApi';

import './index.scss';
import IconButton from '../../ui/IconButton';
import { Player } from '../../typings/GameTypings';
import { GameMessages } from '../../redux/constants/Game';

interface OwnProps {
    onSendMessage(text: string): void;
    active: boolean;
}

interface ReduxProps {
    history?: MessageHistory;
    opponent?: Player;
    onReceiveMessage?(message: Message): void;
}

type ChatProps = OwnProps & ReduxProps;

const b = block('olob-chat');

export default class Chat extends React.Component<ChatProps> {
    private textareaRef = React.createRef<HTMLTextAreaElement>();

    public componentDidMount() {
        WebSocketApi.registerHandler(GameMessages.MESSAGE, this.props.onReceiveMessage);
    }

    public render() {
        const { history, opponent, active } = this.props;

        return (
            <div className={b()}>
                {active &&
                    <div className={b('opponent-card')}>
                        {opponent.login}
                    </div>
                }
                <div className={b('messages-list')}>
                    {active ? history && history.messages.map((item, index) =>
                        <Message key={index} text={item.text} owner={item.author.id !== opponent.id} />
                    ) :
                        <div className={b('disconnect-message')}>Разорвано соединение с противником</div>
                    }
                </div>
                {active &&
                    <div className={b('compose')}>
                        <textarea className={b('input')} ref={this.textareaRef} />
                        <IconButton className={b('submit')} onClick={this.sendMessage} type="button" icon={'arrow-right'} />
                    </div>
                }
            </div>
        );
    }

    private sendMessage = () => {
        const textareaNode = this.textareaRef.current;

        if (textareaNode) {
            this.props.onSendMessage(textareaNode.value);
        }
    }
}
