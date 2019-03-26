import * as React from 'react';
import { block } from 'bem-cn';

import { GameType, Navigation } from '../../typings/GameTypings';
import { User } from '../../typings/UserTypings';

import GameApi from '../../modules/GameApi';

import './index.scss';

interface GameProps {
    onSnapshot(state): void;
    onGetPossibleSteps(figurePos: Navigation): void;
    onResetPossibleSteps(state): void;
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
    private isStep = false;
    private choosenFigure = null;

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
            possible: '#15b905'
        };

        this.options.squareWidth = this.options.width / this.options.size;

        this.options.board.width = this.options.width;
        this.options.board.height = this.options.width;

        this.options.figures.width = this.options.width;
        this.options.figures.height = this.options.width;

        this.drawFigures(this.props.game.state);
    }

    public render() {
        return (
            <div className={b()}>
                <canvas ref={this.boardRef} className={b('board')} />
                <canvas ref={this.gameRef} className={b('figures')} />
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

    private drawFigures(data) {
        this.clearFigures();
        this.drawBoard();
        const figures = this.options.figures;
        const ctx = figures.getContext('2d');
        const squareWidth = this.options.squareWidth;

        data.forEach((line) => {
            line.forEach((item) => {
                const img = new Image();
                img.src = `./images/figures/${item === item.toUpperCase() ? 'w' : 'b'}${item}.svg`;
                img.width = squareWidth;
                img.height = squareWidth;
                const { x, y } = this.indexesToCoords({ x: data.indexOf(line), y: line.indexOf(item) });
                img.onload = () => {
                    ctx.drawImage(img, x, y, squareWidth, squareWidth);
                };
            });
        });
    }

    private coordsToIndexes(coords) {
        const squareWidth = this.options.squareWidth;

        return {
            x: Math.floor(coords.x / squareWidth),
            y: Math.floor(coords.y / squareWidth)
        };
    }

    private indexesToCoords(coords) {
        const squareWidth = this.options.squareWidth;

        return {
            x: Math.floor(coords.x * squareWidth),
            y: Math.floor(coords.y * squareWidth)
        };
    }

    private clearFigures() {
        const ctx = this.options.figures.getContext('2d');
        ctx.clearRect(0, 0, this.options.width, this.options.width);
    }
}
