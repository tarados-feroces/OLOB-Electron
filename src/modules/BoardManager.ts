import USBConnector from './USB/USBConnector';
import GameApi from './GameApi';

enum MessageTypes {
    Start = '34',
    End = '35',
    BoardState = 0x36,
    ColorMap = '33',
    Ping = '71'
}

class BoardManager {
    private gameState: number[][];
    private prevPos = null;
    private active = false;

    public async init() {
        this.active = await USBConnector.init();
        USBConnector.registerHandler(MessageTypes.BoardState, this.getStateDiff);
    }

    public start = () => {
        this.active = true;
        USBConnector.sendMessage(MessageTypes.Start, '');
    }

    public end = () => {
        this.active = false;
        USBConnector.sendMessage(MessageTypes.End, '');
    }

    public getConnectedState() {
        return this.active;
    }

    public sendPossibleSteps = (steps: Array<{ x: number, y: number, color: string }>) => {
        if (!this.active) {
            return;
        }

        this.sendColorMap(steps);
    }

    public resetPossibleSteps() {
        this.resetColorMap();
    }

    public sendOpponentStep = (step: { prevPos: { x: number, y: number }, nextPos: { x: number, y: number }}) => {
        if (!this.active) {
            return;
        }

        const startColor = '#8e17bd';
        const endColor = '#51bd3c';

        this.sendColorMap([ { ...step.prevPos, color: startColor }, { ...step.nextPos, color: endColor } ]);
    }

    public sendError() {
        return;
    }

    public getStateDiff = (data: string[]) => {
        const state = this.parseState(data);

        this.countDiff(state);

        return state;
    }

    public resetColorMap() {
        this.sendColorMap([]);
    }

    private sendColorMap(data: Array<{ x: number, y: number, color: string }>) {
        let result = '';

        result += data.length.toString(16) + ' ';

        data.forEach((item) => {
            result += item.x.toString(16) + item.y.toString(16) + item.color + ' ';
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

        this.gameState.forEach((str, yIndex) => {
            str.forEach((element, xIndex) => {
                if (element < newState[yIndex][xIndex]) {
                    result.push({ x: xIndex, y: yIndex , action: 1 });
                } else if (element > newState[yIndex][xIndex]) {
                    result.push({ x: xIndex, y: yIndex, action: 0 });
                    if (!this.prevPos) {
                        this.prevPos = { x: xIndex, y: yIndex };
                    }
                }
            });
        });

        if (!result.length) {
            return;
        }

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
        // console.log('RECIEVED DATA: ', data);
        return data.slice(1).
                    // reverse().
                    map((item) => parseInt(item, 16)).
                    map((item, index) => {
                        const arr = [];
                        for (let i = 0; i < 8; ++i) {
                            arr.unshift((item & (0x80 >> i) ? 1 : 0));
                        }

                        return arr;
                    });
    }
}

const boardManager = new BoardManager();
export default boardManager;
