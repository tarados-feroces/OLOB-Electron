import * as React from 'react';
import { block } from 'bem-cn';

import { GameType, Navigation, Side } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';
import { Options, constructOptions, drawFigures, drawPossibleMoves, coordsToIndexes, checkStepInPossible } from './utils';

import PlayerInfo from '../PlayerInfo';

import GameApi from '../../modules/GameApi';

import './index.scss';

interface OwnProps {
    game: GameType;
    user: User;
}

interface ReduxProps {
    opponent?: User;
    isFinished?: boolean;
    winner?: number;
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
            drawPossibleMoves(this.options, game.possibleSteps, game.side === Side.WHITE);
        }
    }

    public render() {
        const { opponent, user, game } = this.props;

        return (
            <div className={b()}>
                <div className={b('user-info')}>
                    {opponent &&  <PlayerInfo {...opponent} active={game.currentUser === opponent.id} />}
                </div>
                <div className={b('board-container')}>
                    <canvas ref={this.boardRef} className={b('board')} />
                    <canvas ref={this.figuresRef} className={b('figures')} onClick={this.handleClick} />
                </div>
                <div className={b('user-info', { reverse: true })}>
                    <PlayerInfo {...user} active={game.currentUser === user.id} />
                </div>
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

        const top = this.options.board.parentElement.offsetTop;
        const left = this.options.board.parentElement.offsetLeft;

        const coords = coordsToIndexes({
            x: event.pageX - left,
            y: Math.abs(Number(top) + Number(this.options.width) - Number(event.pageY))
        },
            game.side === Side.WHITE,
            this.options
        );

        checkStepInPossible(coords, game.possibleSteps) ?
            this.makeStep(this.choosenFigurePos, coords) :
            this.checkPossibleMoves(coords);
    }
}
