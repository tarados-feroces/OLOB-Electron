import * as React from 'react';
import { block } from 'bem-cn';
import MessageComponent from '../Message';

import { MessageHistory, Message } from '../../typings/Chat';

import WebSocketApi from '../../modules/WebSocketApi';

import './index.scss';
import { Player } from '../../typings/GameTypings';
import { GameMessages } from '../../redux/constants/Game';
import Compose from '../Compose';
import { scrollBottom } from '../../lib/scrollBottom';

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
    private msgList = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        WebSocketApi.registerHandler(GameMessages.MESSAGE, this.onMessage);

        scrollBottom(this.msgList.current);
    }

    public componentWillUnmount() {
        WebSocketApi.deleteHandler(GameMessages.MESSAGE);
    }

    public render() {
        const { history, opponent, active, onSendMessage } = this.props;

        return (
            <div className={b()}>
                <div className={b('messages-list')} ref={this.msgList}>
                    {history && history.messages && history.messages.map((item, index) =>
                        <MessageComponent key={index} text={item.text} owner={item.author !== opponent.id} />
                    )}
                </div>
                {active ?
                    <Compose onSubmit={onSendMessage} /> :
                    <div className={b('disconnect-message')}>Нет соединения с противником</div>}
            </div>
        );
    }

    public onMessage = (message: Message) => {
        const list = this.msgList.current;

        if (!list) {
            return;
        }

        this.props.onReceiveMessage(message);

        window.setTimeout(() => list.scrollTo(0, list.scrollHeight), 100);
    }
}
