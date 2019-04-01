import { Navigation, PossibleSteps } from '../../typings/GameTypings';

export interface Options {
    board: HTMLCanvasElement;
    figures: HTMLCanvasElement;
    top: number;
    left: number;
    width: number;
    size: number;
    light: string;
    dark: string;
    possible: string;
    captured: string;
    squareWidth?: number;
}

export function constructOptions(board: HTMLCanvasElement, figures: HTMLCanvasElement): Options {
    const options: Options = {
        board,
        figures,
        top: board.parentElement.offsetTop,
        left: board.parentElement.offsetLeft,
        width: 600,
        size: 8,
        light: '#F0D8B5',
        dark: '#B58863',
        possible: '#15b905',
        captured: '#b90100'
    };

    options.squareWidth = options.width / options.size;

    options.board.width = options.width;
    options.board.height = options.width;

    options.figures.width = options.width;
    options.figures.height = options.width;

    return options;
}

export function drawBoard(options: Options): void {
    const { squareWidth, size, dark, light } = options;
    const ctx = options.board.getContext('2d');
    const totalSquares = Math.pow(options.size, 2);
    let x = -1;
    let y = -1;

    for (let i = 0; i < totalSquares; i++) {
        x++;
        if (i % size === 0) {
            y++;
            x = 0;
        }

        ctx.beginPath();
        ctx.rect(x * squareWidth, y * squareWidth, squareWidth, squareWidth);
        ctx.fillStyle = (x + y) % 2 ? dark : light;
        ctx.fill();
        ctx.closePath();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';

        roundRect(
            ctx,
            x * squareWidth + 5,
            y * squareWidth + 5,
            squareWidth - 10,
            squareWidth - 10,
            10,
            false,
            true
        );
    }
}

export function drawFigures(options: Options, isWhiteSide: boolean, state: string[][]): void {
    clearFigures(options);
    drawBoard(options);

    const { figures: figuresCanvas, squareWidth } = options;

    const ctx = figuresCanvas.getContext('2d');

    const figures = isWhiteSide ? state.reverse() : state;

    figures.forEach((line, lineKey) => {
        const row = isWhiteSide ? line.reverse() : line;
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

export function drawPossibleMoves(options: Options, possibleSteps: PossibleSteps[]) {
    clearBoard(options);
    drawBoard(options);

    const { board, squareWidth, captured, possible } = options;
    const ctx = board.getContext('2d');

    possibleSteps.forEach((item) => {
        const { x, y } = this.indexesToCoords(item);

        ctx.strokeStyle = item.captured ? captured : possible;
        ctx.lineWidth = 3;

        roundRect(
            ctx,
            Number(x) + 5,
            Number(y) + 5,
            squareWidth - 10,
            squareWidth - 10,
            10,
            false,
            true
        );
    });
}

export function coordsToIndexes(coords: Navigation, isWhiteSide: boolean, options: Options): { x: number, y: number } {
    const { squareWidth } = options;
    const diff = isWhiteSide ? 7 : 0;

    return {
        x: Math.abs(diff - Math.floor(coords.x / squareWidth)),
        y: Math.abs(diff - Math.floor(coords.y / squareWidth))
    };
}

export function indexesToCoords(coords: { x: number, y: number }, isWhiteSide: boolean, options: Options): Navigation {
    const { squareWidth } = options;
    const diffY = isWhiteSide ? 0 : 7;
    const diffX = isWhiteSide ? 7 : 0;

    return {
        x: Math.floor(Math.abs(diffX - coords.x) * squareWidth),
        y: Math.floor(Math.abs(diffY - coords.y) * squareWidth)
    };
}

export function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: boolean,
        stroke: boolean = true
    ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

export function clearFigures(options: Options) {
    const ctx = options.figures.getContext('2d');
    ctx.clearRect(0, 0, options.width, options.width);
}

export function clearBoard(options: Options) {
    const ctx = options.board.getContext('2d');
    ctx.clearRect(0, 0, options.width, options.width);
}

export function checkStepInPossible(coords: Navigation, possibleSteps: PossibleSteps[]): boolean {
    return possibleSteps.some((item) => item.x === coords.x && item.y === coords.y);
}
