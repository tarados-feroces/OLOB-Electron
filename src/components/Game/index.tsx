import * as React from 'react';
import { block } from 'bem-cn';

import { Figure, GameType, Navigation, Side } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';
import { checkStepInPossible, constructOptions, coordsToIndexes, drawFigures, drawPossibleMoves, Options } from './utils';

import GameApi from '../../modules/GameApi';

import './index.scss';
import { Modal } from 'semantic-ui-react';
import Button from '../../ui/Button';
import gameAPI from '../../modules/GameApi';

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
    onFigureChange?(figure): void;
}

type GameProps = OwnProps & ReduxProps;

interface GameState {
    isFigureChoose: boolean;
}

const b = block('olob-chess');
const m = block('game-modal');

export default class Game extends React.Component<GameProps, GameState> {
    private options: Options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private figuresRef = React.createRef<HTMLCanvasElement>();
    private chosenFigurePos: Navigation | null = null;
    public state = {
        isFigureChoose: false
    };

    public resizeCanvas = () => {
        this.options = constructOptions(this.boardRef.current, this.figuresRef.current);

        drawFigures(this.options, this.props.game.side === Side.WHITE, this.props.game.state);
    }

    public componentDidMount() {
        const { onSnapshot, onGetPossibleSteps, onOpponentDisconnected, game } = this.props;

        GameApi.init({
            onReceiveSnapshot: onSnapshot,
            onGetPossibleSteps,
            onOpponentDisconnected,
            onFigureChange: this.onFigureChange
        });

        this.options = constructOptions(this.boardRef.current, this.figuresRef.current);
        drawFigures(this.options, game.side === Side.WHITE, game.state);
        window.addEventListener('resize', this.resizeCanvas, false);
    }

    public componentWillUnmount() {
        gameAPI.clear();
    }

    public componentDidUpdate(prevProps, prevState) {
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
                <Modal open={this.state.isFigureChoose}>
                    <Modal.Header>Изменить фигуру</Modal.Header>
                    <Modal.Content>
                        <div className={m('button-row')}>
                            <Button
                                className={m('button')}
                                onClick={() => { this.setFigureChange({ type: 'q', color: isWhite ? 'w' : 'b' }); }}
                            >
                                Ферзь
                            </Button>
                            <Button
                                className={m('button')}
                                onClick={() => { this.setFigureChange({ type: 'r', color: isWhite ? 'w' : 'b' }); }}
                            >
                                Ладья
                            </Button>
                            <Button
                                className={m('button')}
                                onClick={() => { this.setFigureChange({ type: 'n', color: isWhite ? 'w' : 'b' }); }}
                            >
                                Конь
                            </Button>
                            <Button
                                className={m('button')}
                                onClick={() => { this.setFigureChange({ type: 'b', color: isWhite ? 'w' : 'b' }); }}
                            >
                                Слон
                            </Button>
                        </div>
                    </Modal.Content>
                </Modal>
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

    private setFigureChange(figure: Figure) {
        GameApi.sendFigureChange(figure);
        this.setState({
            isFigureChoose: false
        });
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

    private onFigureChange = () => {
        this.setState({
            isFigureChoose: true
        });
    }
}
