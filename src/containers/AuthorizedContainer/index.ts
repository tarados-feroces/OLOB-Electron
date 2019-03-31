import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { signoutUser } from '../../redux/actions/User';
import { openInfoPopup, openUserInfoPopup } from '../../redux/actions/Popup';

import {
    startGame,
    endGame,
    receiveSnapshot,
    receivePossibleSteps,
    resetPossibleSteps,
    closeGame
} from '../../redux/actions/Game';

const mapDispatchToProps = (dispatch) => {
    return {
        signoutUser() {
            dispatch(signoutUser());
        },
        onOpenPopup(data: { text: string, buttonText: string }) {
            dispatch(openInfoPopup('Info', data));
        },
        onGameStarted(state) {
            dispatch(startGame(state));
        },
        onGameEnd(state) {
            dispatch(endGame(state));
        },
        onGetPossibleSteps(steps) {
            dispatch(receivePossibleSteps(steps));
        },
        onResetPossibleSteps() {
            dispatch(resetPossibleSteps());
        },
        onGameClose() {
            dispatch(closeGame());
        },
        onSnapshot(state) {
            dispatch(receiveSnapshot(state));
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
