import { connect } from 'react-redux';
import Game from '../../components/Game';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';
import { GameType } from '../../typings/GameTypings';
import {
    receiveSnapshot,
    receivePossibleSteps,
    resetPossibleSteps
} from '../../redux/actions/Game';

import { User } from '../../typings/UserTypings';

interface StateProps {
    opponent?: User;
    isFinished?: boolean;
    winner?: string;
}

interface DispatchProps {
    onSnapshot(state): void;
    onGetPossibleSteps(steps): void;
    onResetPossibleSteps(): void;
}

interface OwnProps {
    game: GameType;
    user: User;
}

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
        }
    };
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    return {
        ...state.game
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
