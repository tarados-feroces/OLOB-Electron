import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { connect } from 'react-redux';

import gameApi from '../../modules/Game/GameApi';
import ws from '../../modules/WebSocketApi';
import { httpApi } from '../../modules/HttpApi';

interface GameProps {
}

const b = block('olob-board');
const g = block('olob-game');

class Game extends React.Component<GameProps> {
    private options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private gameRef = React.createRef<HTMLCanvasElement>();
    private isStep = false;
    private choosenFigure = null;

    public componentDidMount() {
        ws.registerHandler('game', (message) => {
            // console.log(message);
            gameApi.initialize(message.figures);
            this.drawFigures(message.figures);
        });

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

        this.drawFigures(gameApi.getFigures());
    }

    public render() {
        return (
            <div className={'olob-chess'}>
                <canvas ref={this.boardRef} className={b()} />
                <canvas ref={this.gameRef} className={g()} onClick={this.handleClick} />
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

        data.forEach((item) => {
            const img = new Image();
            img.src = `./images/figures/${item.side}_${item.type}.svg`;
            img.width = squareWidth;
            img.height = squareWidth;
            const { x, y } = this.indexesToCoords(item.coords);
            img.onload = () => {
                ctx.drawImage(img, x, y, squareWidth, squareWidth);
            };
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

    private possibleMoves(coords) {
        const possible = gameApi.getSteps(coords);
        this.choosenFigure = coords;
        this.isStep = true;
        const board = this.options.board;
        const ctx = board.getContext('2d');
        const squareWidth = this.options.squareWidth;

        possible.forEach((item) => {
            const { x, y } = this.indexesToCoords(item);

            ctx.beginPath();
            ctx.rect(x, y, squareWidth, squareWidth);
            ctx.fillStyle = this.options.possible;
            ctx.fill();
            ctx.closePath();
        });
    }

    private makeStep(prevCoords, newCoords) {
        gameApi.makeStep(prevCoords, newCoords);
        this.drawFigures(gameApi.getFigures());
        this.choosenFigure = null;
        this.isStep = false;
    }

    private handleClick = (event) => {
        const coords = {
            x: event.pageX - this.options.left,
            y: event.pageY - this.options.top
        };
        this.isStep ?
            this.makeStep(this.choosenFigure, this.coordsToIndexes(coords)) :
            this.possibleMoves(this.coordsToIndexes(coords));
    }

    private clearFigures() {
        const ctx = this.options.figures.getContext('2d');
        ctx.clearRect(0, 0, this.options.width, this.options.width);
    }
}

const mapDispatchToProps = (dispatch) => {
    return {};
};

const mapStateToProps = (state) => {
    return {};
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Game);
