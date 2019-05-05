import { connect } from 'react-redux';
import Chat from '../../components/Chat';
import { MapStateToProps, MapDispatchToProps } from '../../store/store';

import { MessageHistory, Message } from '../../typings/Chat';
import { Player } from '../../typings/GameTypings';

import { receiveMessage } from '../../redux/actions/Game';

interface StateProps {
    history?: MessageHistory;
    opponent?: Player;
}

interface DispatchProps {
    onReceiveMessage(message: Message): void;
}

interface OwnProps {
    onSendMessage(text: string): void;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => {
    return {
        onReceiveMessage(message: Message) {
            dispatch(receiveMessage(message));
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    const { history, opponent } = state.game;

    return {
        history,
        opponent
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
