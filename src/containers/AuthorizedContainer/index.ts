import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { signoutUser } from '../../redux/actions/User';
import { openInfoPopup, closePopup } from '../../redux/actions/Popup';

import {
    startGame,
    endGame,
    closeGame
} from '../../redux/actions/Game';

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
        onGameClose() {
            dispatch(closeGame());
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
