import { connect } from 'react-redux';
import Game from '../../components/Game';
import { MapDispatchToProps, MapStateToProps } from '../../store/store';
import { GameType, Navigation } from '../../typings/GameTypings';
import {
    receiveSnapshot,
    receivePossibleSteps,
    resetPossibleSteps
} from '../../redux/actions/Game';

interface StateProps {
    login: string;
}

interface DispatchProps {
    onSnapshot(state): void;
    onGetPossibleSteps(steps): void;
    onResetPossibleSteps(): void;
}

interface OwnProps {}

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

export default connect(null, mapDispatchToProps)(Game);
