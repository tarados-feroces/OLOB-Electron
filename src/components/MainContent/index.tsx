import * as React from 'react';

import './index.scss';
import block from 'bem-cn';
import { constructOptions, drawBoard } from '../Game/utils';

const b = block('main-content');

export default class MainContent extends React.PureComponent {
    private boardRef = React.createRef<HTMLCanvasElement>();

    public componentDidMount() {
        const options = constructOptions(this.boardRef.current);
        drawBoard(options);
    }

    public render() {
        return (
            <div className={b('field')}>
                <canvas ref={this.boardRef} className={b('board')} />
                <div  className={b('text')}>Начните партию!</div>
            </div>
        );
    }
}
