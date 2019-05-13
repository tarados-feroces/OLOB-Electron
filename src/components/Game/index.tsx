import * as React from 'react';
import { block } from 'bem-cn';

import { GameType, Navigation, Side } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';
import { checkStepInPossible, constructOptions, coordsToIndexes, drawFigures, drawPossibleMoves, Options } from './utils';

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
    onOpponentDisconnected?(): void;
    onCloseGame?(): void;
    onDisconnect?(handler: () => void): void;
}

type GameProps = OwnProps & ReduxProps;

const b = block('olob-chess');

export default class Game extends React.Component<GameProps> {
    private options: Options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private figuresRef = React.createRef<HTMLCanvasElement>();
    private chosenFigurePos: Navigation | null = null;

    public resizeCanvas = () => {
        this.options = constructOptions(this.boardRef.current, this.figuresRef.current);

        drawFigures(this.options, this.props.game.side === Side.WHITE, this.props.game.state);
    }

    public componentDidMount() {
        const { onSnapshot, onGetPossibleSteps, onOpponentDisconnected, game } = this.props;

        GameApi.init({ onReceiveSnapshot: onSnapshot, onGetPossibleSteps, onOpponentDisconnected });

        this.options = constructOptions(this.boardRef.current, this.figuresRef.current);
        drawFigures(this.options, game.side === Side.WHITE, game.state);
        window.addEventListener('resize', this.resizeCanvas, false);
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
        const { game } = this.props;
        const isWhite = game.side === Side.WHITE;

        const letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
        if (!isWhite) {
            letters.reverse();
        }

        return (
            <div className={b()}>
                <div className={b('board-container')}>
                    <div className={b('signs-bottom')}>
                        {[ ...Array(8).keys() ].map((item: number) => {
                            return (
                                <div key={item} className={b('letter')}>{letters[item]}</div>
                            );
                        })}
                    </div>
                    <div className={b('main')}>
                        <div className={b('signs-left')}>
                            {[ ...Array(8).keys() ].map((item: number) => {
                                return (
                                    <div key={item} className={b('number')}>{!isWhite ? item + 1 : 8 - item}</div>
                                );
                            })}
                        </div>
                        <div className={b('field')}>
                            <canvas ref={this.boardRef} className={b('board')} />
                            <canvas ref={this.figuresRef} className={b('figures')} onClick={this.handleClick} />
                        </div>
                        <div className={b('signs-left')}>
                            {[ ...Array(8).keys() ].map((item: number) => {
                                return (
                                    <div key={item} className={b('number')}>{!isWhite ? item + 1 : 8 - item}</div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={b('signs-bottom')}>
                        {[ ...Array(8).keys() ].map((item: number) => {
                            return (
                                <div key={item} className={b('letter')}>{letters[item]}</div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    private makeStep(prevPos: Navigation, nextPos: Navigation) {
        GameApi.makeStep({ prevPos, nextPos });
        this.chosenFigurePos = null;
    }

    private checkPossibleMoves(pos: Navigation) {
        GameApi.sendPossibleMovesRequest(pos);
        this.chosenFigurePos = pos;
    }

    private handleClick = (event) => {
        const { onResetPossibleSteps, game, opponent } = this.props;
        onResetPossibleSteps();

        if (opponent && opponent.id === game.currentUser) {
            return;
        }

        const parentCoords = this.options.board.parentElement.getBoundingClientRect();

        const top = parentCoords.top;
        const left = parentCoords.left;

        const coords = coordsToIndexes({
            x: event.pageX - left,
            y: Math.abs(Number(top) + Number(this.options.width) - Number(event.pageY))
        },
            game.side === Side.WHITE,
            this.options
        );

        checkStepInPossible(coords, game.possibleSteps) ?
            this.makeStep(this.chosenFigurePos, coords) :
            this.checkPossibleMoves(coords);
    }

    private handleDisconnect = () => {
        GameApi.disconnect();
        this.props.onCloseGame();
    }
}
