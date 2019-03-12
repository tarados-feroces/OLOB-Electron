import * as React from 'react';
import { block } from 'bem-cn';

import './index.scss';

import { connect } from 'react-redux';

interface GameProps {
}

const b = block('olob-board');
const g = block('olob-game');

class Game extends React.Component<GameProps> {
    private options;
    private boardRef = React.createRef<HTMLCanvasElement>();
    private gameRef = React.createRef<HTMLCanvasElement>();
    private isStep = false;

    public componentDidMount() {
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
        this.drawBoard();
        // this.drawFigures();
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
        const squareWidth = this.options.width / this.options.size;
        const totalSquares = Math.pow(this.options.size, 2);
        let x = -1;
        let y = -1;

        board.width = this.options.width;
        board.height = this.options.width;

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
        const el = this.options.figures;
        const ctx = el.getContext('2d');
        const squareWidth = this.options.width / this.options.size;

        // gameApi.getFigures().forEach((item) => {
        //     // ctx.beginPath();
        //     // ctx.rect(item.x, item.y, squareWidth, squareWidth);
        //     const img = new Image();
        //     img.src = item.image;
        //     ctx.fillStyle = ctx.createPattern(img, 'repeat');
        //     ctx.fillRect(item.x, item.y, squareWidth, squareWidth);
        // });

    }

    private coordsToIndexes(x: number, y: number) {
        const squareWidth = this.options.width / this.options.size;

        return {
            y: Math.floor(y / squareWidth),
            x: Math.floor(x / squareWidth)
        };
    }

    private indexesToCoords(x: number, y: number) {
        const squareWidth = this.options.width / this.options.size;

        return {
            x: Math.floor(x * squareWidth),
            y: Math.floor(y * squareWidth)
        };
    }

    private possibleMoves() {
        //gameApi get possible indexes
        const possible = [ { x: 0, y: 0 }, { x: 1, y: 3 } ];
        const board = this.options.board;
        const ctx = board.getContext('2d');
        const squareWidth = this.options.width / this.options.size;

        possible.forEach((item) => {
            const { x, y } = this.indexesToCoords(item.x, item.y);
            console.log(x, y);

            ctx.beginPath();
            ctx.rect(x * squareWidth, y * squareWidth, squareWidth, squareWidth);
            ctx.fillStyle = this.options.possible;
            ctx.fill();
            ctx.closePath();
        });
    }

    private handleClick = (event) => {
        this.isStep ? this.possibleMoves() : this.possibleMoves();
        console.log('indexes: ', this.coordsToIndexes(event.pageX - this.options.left, event.pageY - this.options.top));
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const mapStateToProps = (state) => {
    return {
    };
};

// tslint:disable-next-line:no-empty
export default connect(mapStateToProps, mapDispatchToProps)(Game);
