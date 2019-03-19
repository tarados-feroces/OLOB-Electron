import * as React from 'react';
import { connect } from 'react-redux';
import Authorized from '../../components/Authorized';
import { signoutUser } from '../../redux/actions/User';
import { startGame, endGame, receiveNewStep, updateGameState } from '../../redux/actions/Game';

const mapDispatchToProps = (dispatch) => {
    return {
        signoutUser() {
            dispatch(signoutUser());
        },
        onGameStarted(state) {
            dispatch(startGame(state));
        },
        onGameEnd(state) {
            dispatch(endGame(state));
        },
        onNewStep(step) {
            dispatch(receiveNewStep(step));
        },
        onSnapshot(state) {
            dispatch(updateGameState(state));
        }
    };
};

const mapStateToProps = (state) => {
    const { user, isAuthorized } = state.userReducer;
    const { game, opponent, isFinished, winner } = state.gameReducer;

    return {
        user,
        isAuthorized,
        game,
        opponent,
        isFinished,
        winner
    };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Authorized);
