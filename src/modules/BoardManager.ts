import USBConnector from './USB/serialport';
import GameApi from './GameApi';

enum MessageTypes {
    Start = 0x34,
    End = 0x35,
    BoardState = 0x36,
    ColorMap = 0x33,
    Ping = 0x71
}

class BoardManager {
    private gameState: number[][];
    private prevPos = null;

    // constructor() {
    //     USBConnector.registerHandler(MessageTypes.BoardState, this.getStateDiff);
    // }

    public init() {
        USBConnector.registerHandler(MessageTypes.BoardState, this.getStateDiff);
    }

    public start = () => {
        USBConnector.sendMessage(MessageTypes.Start, '');
    }

    public end = () => {
        USBConnector.sendMessage(MessageTypes.End, '');
    }

    public sendPossibleSteps = (steps: Array<{ x: number, y: number }>) => {
        this.sendColorMap(steps, '#51bd3c');
    }

    public sendOpponentStep = (step: { x: number, y: number }) => {
        this.sendColorMap([ step ], '#51bd3c');
    }

    public sendError() {
        return;
    }

    // public sendGameSituation() {
    //     return;
    // }

    public getStateDiff = (data: string[]) => {
        const state = this.parseState(data);
        console.log('PARSED_STATE: ', state);

        this.countDiff(state);

        return state;
    }

    private sendColorMap(data: Array<{ x: number, y: number }>, color: string) {
        let result = '';

        result += data.length.toString(16) + ' ';

        data.forEach((item) => {
            result += item.x.toString(16) + item.y.toString(16) + ' ' + color.slice(1) + '';
        });

        USBConnector.sendMessage(MessageTypes.ColorMap, result.slice(0, -1));
    }

    private sendCurrentSide() {
        return;
    }

    private countDiff = (newState: number[][]) => {
        if (!this.gameState) {
            this.gameState = newState;

            return;
        }

        const result = [];

        this.gameState.forEach((str, xIndex) => {
            str.forEach((element, yIndex) => {
                if (element < newState[xIndex][yIndex]) {
                    result.push({ x: xIndex, y: yIndex, action: 1 });
                } else if (element > newState[xIndex][yIndex]) {
                    result.push({ x: xIndex, y: yIndex, action: 0 });
                    this.prevPos = { x: xIndex, y: yIndex };
                }
            });
        });

        if (!result.length) {
            return;
        }

        console.log('RESULT: ', result);

        if (result.length > 1) {
            this.sendError();
        } else if (result.length === 1) {
            if (result[0].action && this.prevPos) {
                GameApi.makeStep({ prevPos: this.prevPos, nextPos: result[0] });
                this.prevPos = null;
            } else if (!result[0].action) {
                GameApi.sendPossibleMovesRequest(result[0]);
            }
        }

        this.gameState = newState;
    }

    private parseState(data: string[]): number[][] {
        return data.slice(1).
                    reverse().
                    map((item) => parseInt(item, 16)).
                    map((item, index) => {
                        const arr = [ 8 - index ];
                        for (let i = 0; i < 8; ++i) {
                            arr.push((item & (0x80 >> i) ? 1 : 0));
                        }

                        return arr;
                    });
    }
}

const boardManager = new BoardManager();
export default boardManager;
