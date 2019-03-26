import * as React from 'react';
import { block } from 'bem-cn';

import { GameType, Navigation } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';

import GameApi from '../../modules/GameApi';

import './index.scss';

interface GameProps {
    onSnapshot(state): void;
    onGetPossibleSteps(figurePos: Navigation): void;
    onResetPossibleSteps(): void;
    isFinished: boolean;
    opponent?: User;
    game: GameType;
    winner?: number;
    user: User;
}

const b = block('olob-chess');

export default class Game extends React.Component<GameProps> {
    private options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private gameRef = React.createRef<HTMLCanvasElement>();
    private choosenFigurePos = null;

    public componentDidMount() {
        const { onSnapshot, onGetPossibleSteps } = this.props;

        GameApi.init({ onReceiveSnapshot: onSnapshot, onGetPossibleSteps });

        this.options = {
            top: this.boardRef.current.parentElement.offsetTop,
            left: this.boardRef.current.parentElement.offsetLeft,
            board: this.boardRef.current,
            figures: this.gameRef.current,
            width: 600,
            size: 8,
            light: '#d1eefc',
            dark: '#1f1f21',
            possible: '#15b905',
            captured: '#b90100'
        };

        this.options.squareWidth = this.options.width / this.options.size;

        this.options.board.width = this.options.width;
        this.options.board.height = this.options.width;

        this.options.figures.width = this.options.width;
        this.options.figures.height = this.options.width;

        this.drawFigures();
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.game.state !== this.props.game.state) {
            this.drawFigures();
        }

        if (prevProps.game.possibleSteps !== this.props.game.possibleSteps) {
            this.drawPossibleMoves();
        }
    }

    public render() {
        return (
            <div className={b()}>
                <canvas ref={this.boardRef} className={b('board')} />
                <canvas ref={this.gameRef} className={b('figures')} onClick={this.handleClick} />
            </div>
        );
    }

    private drawBoard() {
        const board = this.options.board;
        const ctx = board.getContext('2d');
        const squareWidth = this.options.squareWidth;
        const totalSquares = Math.pow(this.options.size, 2);
        let x = -1;
        let y = -1;

        for (let i = 0; i < totalSquares; i++) {
            x++;
            if (i % this.options.size === 0) {
                y++;
                x = 0;
            }

            ctx.beginPath();
            ctx.rect(x * squareWidth, y * squareWidth, squareWidth, squareWidth);
            ctx.fillStyle = (x + y) % 2 ? this.options.dark : this.options.light;
            ctx.fill();
        }
    }

    private drawFigures() {
        this.clearFigures();
        this.drawBoard();
        const figuresCanvas = this.options.figures;
        const ctx = figuresCanvas.getContext('2d');
        const squareWidth = this.options.squareWidth;

        const figures = this.props.game.side ? this.props.game.state.reverse() : this.props.game.state;

        figures.forEach((line, lineKey) => {
            const row = this.props.game.side ? line.reverse() : line;
            row.forEach((item, itemKey) => {
                if (isNaN(parseInt(item, 10))) {
                    const img = new Image();
                    img.src = `./images/figures/${item === item.toLowerCase() ? 'b' : 'w'}${item.toLowerCase()}.svg`;
                    img.width = squareWidth;
                    img.height = squareWidth;
                    img.onload = () => {
                        ctx.drawImage(img, itemKey * squareWidth, lineKey * squareWidth, squareWidth, squareWidth);
                    };
                }
            });
        });
    }

    private makeStep(prevPos, nextPos) {
        GameApi.makeStep({ prevPos, nextPos });
        this.choosenFigurePos = null;
    }

    private possibleMoves(pos) {
        GameApi.sendPossibleMovesRequest(pos);
        this.choosenFigurePos = pos;
    }

    private drawPossibleMoves() {
        this.clearBoard();
        this.drawBoard();
        const board = this.options.board;
        const ctx = board.getContext('2d');
        const squareWidth = this.options.squareWidth;

        this.props.game.possibleSteps.forEach((item) => {
            const { x, y } = this.indexesToCoords(item);

            ctx.beginPath();
            ctx.rect(x + 2, y + 2, squareWidth - 4, squareWidth - 4);
            ctx.fillStyle = item.captured ? this.options.captured : this.options.possible;
            ctx.fill();
            ctx.closePath();
        });
    }

    private handleClick = (event) => {
        this.props.onResetPossibleSteps();

        if (this.props.opponent.id === this.props.game.currentUser) {
            return;
        }

        const coords = this.coordsToIndexes({
            x: event.pageX - this.options.left,
            y: Math.abs(Number(this.options.top) + Number(this.options.width) - Number(event.pageY))
        });

        this.checkStepInPossible(coords) ?
            this.makeStep(this.choosenFigurePos, coords) :
            this.possibleMoves(coords);
    }

    private checkStepInPossible = (coords: Navigation) => {
        for (const step of this.props.game.possibleSteps) {
            if (step.x === coords.x && step.y === coords.y) {
                return true;
            }
        }

        return false;
    }

    private coordsToIndexes(coords) {
        const squareWidth = this.options.squareWidth;
        const diff = this.props.game.side ? 7 : 0;

        return {
            x: Math.abs(diff - Math.floor(coords.x / squareWidth)),
            y: Math.abs(diff - Math.floor(coords.y / squareWidth))
        };
    }

    private indexesToCoords(coords) {
        const squareWidth = this.options.squareWidth;
        const diffY = this.props.game.side ? 0 : 7;
        const diffX = this.props.game.side ? 7 : 0;

        return {
            x: Math.floor(Math.abs(diffX - coords.x) * squareWidth),
            y: Math.floor(Math.abs(diffY - coords.y) * squareWidth)
        };
    }

    private clearFigures() {
        const ctx = this.options.figures.getContext('2d');
        ctx.clearRect(0, 0, this.options.width, this.options.width);
    }

    private clearBoard() {
        const ctx = this.options.board.getContext('2d');
        ctx.clearRect(0, 0, this.options.width, this.options.width);
    }
}
