import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';
import { Player } from '../../typings/GameTypings';
import { Avatar } from '../../ui/Avatar';
import { HistoryStep } from '../../redux/actions/Game';

interface StepHistoryProps {
    history?: HistoryStep[];
}

const b = block('olob-step-history');

export default class StepHistory extends React.Component<StepHistoryProps> {
    public render() {
        const { history } = this.props;

        return (
            <div className={b()}>
                {history.map((step, index) =>
                    (<div className={b('step')} key={index}>
                        <div className={b('index')}>{`${index}.`}</div>
                        <div className={b('figure')}>{step.figure}</div>
                        <div className={b('from')}>{step.from}</div>
                        <div className={b('to')}>{step.to}</div>
                    </div>)
                )}
            </div>
        );
    }
}
