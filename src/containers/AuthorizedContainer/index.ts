import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { signoutUser } from '../../redux/actions/User';
import { openInfoPopup, closePopup, openConfirmPopup } from '../../redux/actions/Popup';

import {
    startGame,
    endGame,
    closeGame,
    opponentDisconnected
} from '../../redux/actions/Game';

const disconnectInfoPopupProps = {
    text: 'Вы выиграли! Ваш соперник бесславно покинул игру.',
    buttonText: 'Ок'
};

const disconnectConfirmPopupProps = {
    text: 'Вы точно хотите выйти из игры?',
    confirmButtonText: 'Да',
    declineButtonText: 'Нет'
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSignoutUser() {
            dispatch(signoutUser());
        },
        onGameEndPopup(data: { text: string, buttonText: string }) {
            dispatch(openInfoPopup(
                'Конец игры',
                {
                    ...data,
                    onClick: () => {
                        dispatch(closeGame());
                        dispatch(closePopup());
                    }
                }
            ));
        },
        onOpenInfoPopup(description: string, data: { text: string, buttonText: string }) {
            dispatch(openInfoPopup(
                description,
                {
                    ...data,
                    onClick: () => {
                        dispatch(closePopup());
                    }
                }
            ));
        },
        onGameStarted(state) {
            dispatch(startGame(state));
        },
        onGameEnd(state) {
            dispatch(endGame(state));
        },
        onCloseGame() {
            dispatch(closeGame());
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
        }
    };
};

const mapStateToProps = (state) => {
    const { user, isAuthorized } = state.user;
    const { game, opponent, isFinished, winner } = state.game;

    return {
        user,
        isAuthorized,
        game,
        opponent,
        isFinished,
        winner
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authorized);
