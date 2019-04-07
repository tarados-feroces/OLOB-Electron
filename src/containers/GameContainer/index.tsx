import { connect } from 'react-redux';
import Game from '../../components/Game';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';
import { GameType, Player } from '../../typings/GameTypings';
import {
    receiveSnapshot,
    receivePossibleSteps,
    resetPossibleSteps,
    opponentDisconnected,
    closeGame
} from '../../redux/actions/Game';
import { openInfoPopup, openConfirmPopup, closePopup } from '../../redux/actions/Popup';

import { User } from '../../typings/UserTypings';

interface StateProps {
    opponent?: Player;
    isFinished?: boolean;
    winner?: string;
}

interface DispatchProps {
    onSnapshot(state): void;
    onGetPossibleSteps(steps): void;
    onResetPossibleSteps(): void;
    onOpponentDisconnected(): void;
    onDisconnect(handler: () => void): void;
    onCloseGame(): void;
}

interface OwnProps {
    game: GameType;
    user: User;
}

const disconnectInfoPopupProps = {
    text: 'Вы выиграли! Ваш соперник бесславно покинул игру.',
    buttonText: 'Ок'
};

const disconnectConfirmPopupProps = {
    text: 'Вы точно хотите выйти из игры?',
    confirmButtonText: 'Да',
    declineButtonText: 'Нет'
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch) => {
    return {
        onSnapshot(state) {
            dispatch(receiveSnapshot(state));
        },
        onGetPossibleSteps(steps) {
            dispatch(receivePossibleSteps(steps));
        },
        onResetPossibleSteps() {
            dispatch(resetPossibleSteps());
        },
        onOpponentDisconnected() {
            dispatch(opponentDisconnected());
            dispatch(openInfoPopup('Конец игры', disconnectInfoPopupProps));
        },
        onDisconnect(onAccept: () => void) {
            dispatch(openConfirmPopup('Выход из игры', {
                ...disconnectConfirmPopupProps,
                onAccept: () => {
                    onAccept();
                    dispatch(closePopup());
                },
                onDecline: () => dispatch(closePopup())
            }));
        },
        onCloseGame() {
            dispatch(closeGame());
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    return {
        ...state.game
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
