import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

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
                {history && history.map((step, index) =>
                    (<div className={b('step')} key={index}>
                        <div className={b('item')}>{`${index + 1}.`}</div>
                        <div className={b('info')}>
                            <div className={b('item')}>{step.figure}</div>
                            <div className={b('item')}>{step.from}</div>
                            <div className={b('item')}>{step.to}</div>
                        </div>
                    </div>)
                )}
            </div>
        );
    }
}
