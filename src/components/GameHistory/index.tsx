import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { HistoryGame } from '../../redux/reducers/User';
import { User } from '../../typings/UserTypings';
import { Icon } from '../../ui/Icon';

interface OwnProps {
    user: User;
}

interface ReduxProps {
    history?: HistoryGame[];
}

type StepHistoryProps = ReduxProps & OwnProps;

const b = block('olob-game-history');

export default class GameHistory extends React.Component<StepHistoryProps> {
    public render() {
        const { history, user } = this.props;

        return (
            <div className={b()}>
                {history && history.length ? history.map((game, index) =>
                    (<div className={b('game')} key={index}>
                        <div className={b('nick')}>{game.opponent.login}</div>
                        <div className={b('icon')}>
                            {!game.winner ?
                                <Icon size="m" id="draw_icon" /> :
                                game.winner === user.id ?
                                <Icon size="m" id="finger_up" /> :
                                <Icon size="m" id="finger_dawn" />}
                        </div>
                    </div>)
                ) :
                <div className={b('emty-message-container')}>
                    <div className={b('empty-message')}>Вы пока ни с кем не сыграли</div>
                </div>}
            </div>
        );
    }
}
