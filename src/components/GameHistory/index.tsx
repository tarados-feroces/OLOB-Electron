import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { HistoryGame } from '../../redux/reducers/User';
import { User } from '../../typings/UserTypings';

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
                        <div className={b('item')}>{game.opponent.login}</div>
                        <div className={b('item')}>
                            {!game.winner ? 'Ничья' : game.winner === user.id ? 'Победа' : 'Поражение'}
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
