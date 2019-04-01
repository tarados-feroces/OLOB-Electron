import * as React from 'react';
import { block } from 'bem-cn';

import { GameType, Navigation, Side } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';
import { Options, constructOptions, drawFigures, drawPossibleMoves, coordsToIndexes, checkStepInPossible } from './utils';

import GameApi from '../../modules/GameApi';

import './index.scss';

interface OwnProps {
    isFinished?: boolean;
    opponent?: User;
    game: GameType;
    winner?: number;
    user: User;
}

interface ReduxProps {
    onSnapshot?(state): void;
    onGetPossibleSteps?(steps): void;
    onResetPossibleSteps?(): void;
}

type GameProps = OwnProps & ReduxProps;

const b = block('olob-chess');

export default class Game extends React.Component<GameProps> {
    private options: Options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private figuresRef = React.createRef<HTMLCanvasElement>();
    private choosenFigurePos: Navigation | null = null;

    public componentDidMount() {
        const { onSnapshot, onGetPossibleSteps, game } = this.props;

        GameApi.init({ onReceiveSnapshot: onSnapshot, onGetPossibleSteps });

        this.options = constructOptions(this.boardRef.current, this.figuresRef.current);
        drawFigures(this.options, game.side === Side.WHITE, game.state);
    }

    public componentDidUpdate(prevProps) {
        const game = this.props.game;

        if (prevProps.game.state !== game.state) {
            drawFigures(this.options, game.side === Side.WHITE, game.state);
        }

        if (prevProps.game.possibleSteps !== game.possibleSteps) {
            drawPossibleMoves(this.options, game.possibleSteps);
        }
    }

    public render() {
        return (
            <div className={b()}>
                <canvas ref={this.boardRef} className={b('board')} />
                <canvas ref={this.figuresRef} className={b('figures')} onClick={this.handleClick} />
            </div>
        );
    }

    private makeStep(prevPos: Navigation, nextPos: Navigation) {
        GameApi.makeStep({ prevPos, nextPos });
        this.choosenFigurePos = null;
    }

    private checkPossibleMoves(pos: Navigation) {
        GameApi.sendPossibleMovesRequest(pos);
        this.choosenFigurePos = pos;
    }

    private handleClick = (event) => {
        const { onResetPossibleSteps, game, opponent } = this.props;
        onResetPossibleSteps();

        if (opponent && opponent.id === game.currentUser) {
            return;
        }

        const coords = coordsToIndexes({
            x: event.pageX - this.options.left,
            y: Math.abs(Number(this.options.top) + Number(this.options.width) - Number(event.pageY))
        },
            game.side === Side.WHITE,
            this.options
        );

        checkStepInPossible(coords, game.possibleSteps) ?
            this.makeStep(this.choosenFigurePos, coords) :
            this.checkPossibleMoves(coords);
    }
}
