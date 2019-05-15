import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { HistoryStep } from '../../redux/actions/Game';
import { Icon } from '../../ui/Icon';
import { scrollBottom } from '../../lib/scrollBottom';

interface StepHistoryProps {
    history?: HistoryStep[];
}

const b = block('olob-step-history');

export default class StepHistory extends React.Component<StepHistoryProps> {
    private stepsList = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        scrollBottom(this.stepsList.current);
    }

    public componentDidUpdate() {
        scrollBottom(this.stepsList.current);
    }

    public render() {
        const { history } = this.props;
        console.log(history);

        return (
            <div className={b()} ref={this.stepsList}>
                {history && history.map((step, index) =>
                    (<div className={b('step')} key={index}>
                        <div className={b('item')}>{`${index + 1}.`}</div>
                        <div className={b('info')}>
                            <div className={b('item')}>
                                <Icon size="m" id={`${step.side}${step.figure}`} />
                            </div>
                            <div className={b('item')}>{step.from}</div>
                            <div className={b('item')}>{step.to}</div>
                        </div>
                    </div>)
                )}
            </div>
        );
    }
}
