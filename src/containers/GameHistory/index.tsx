import { connect } from 'react-redux';
import { MapStateToProps } from '../../store/store';

import { HistoryGame } from '../../redux/reducers/User';
import { User } from '../../typings/UserTypings';
import GameHistory from '../../components/GameHistory';

interface StateProps {
    history?: HistoryGame[];
}

interface OwnProps {
    user: User;
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state) => {
    const { gameList } = state.user;

    return {
        history: gameList
    };
};

export default connect(mapStateToProps)(GameHistory);
