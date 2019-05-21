import USBConnector from './USBConnector';
import GameApi from './GameApi';
import { MessageTypes, LightPosition, Step, Action, ActionTypes } from './typings/boardTypings';
import { stringToDiff, diffToString } from './utils/diffOps';

interface DiffCounter {
    [diffStr: string]: number;
}

const MIN_DIFF_COUNTER = 1;

class BoardManager {
    private gameState: number[][];
    private prevPos = null;
    private active = false;
    private diffCounter: DiffCounter = {};

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

    public sendPossibleSteps = (steps: LightPosition[]) => {
        if (!this.active) {
            return;
        }

        this.sendColorMap(steps);
    }

    public resetPossibleSteps() {
        this.resetColorMap();
    }

    public sendOpponentStep = (step: Step) => {
        if (!this.active) {
            return;
        }

        const startColor = '#8e17bd';
        const endColor = '#8e17bd';

        this.sendColorMap([ { ...step.prevPos, color: startColor }, { ...step.nextPos, color: endColor } ]);
    }

    public resetColorMap() {
        this.sendColorMap([]);
    }

    public sendError() {
        return;
    }

    public getStateDiff = (data: string[]) => {
        if (data.length !== 9) {
            return;
        }
        const state = this.parseState(data);

        if (!this.gameState) {
            this.gameState = state;
        }

        const diff = this.countDiff(state);

        this.updateDiff(diff);
        this.filterDiff(diff);

        this.handleDiff(state);

        return state;
    }

    private sendColorMap(data: LightPosition[]) {
        let result = '';

        result += data.length.toString(16) + ' ';

        data.forEach((item) => {
            result += item.x.toString(16) + item.y.toString(16) + item.color + ' ';
        });

        USBConnector.sendMessage(MessageTypes.ColorMap, result.slice(0, -1));
    }

    private countDiff = (newState: number[][]) => {
        const result = [];

        if (!this.gameState) {
            this.gameState = newState;

            return result;
        }

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

        return result;
    }

    private updateDiff(diff: Action[]) {
        console.log('-----------UPDATE-----------');
        diff.forEach((item) => {
            const diffStr = diffToString(item);
            if (this.diffCounter[diffStr]) {
                this.diffCounter[diffStr]++;
            } else {
                this.diffCounter[diffStr] = 1;
            }
        });
        console.log(this.diffCounter);
        console.log('----------------------------');
    }

    private filterDiff(diff: Action[]) {
        console.log('-----------FILTER-----------');
        const diffStrs = diff.map(diffToString);

        Object.keys(this.diffCounter).forEach((diffStr) => {
            if (this.diffCounter[diffStr] < MIN_DIFF_COUNTER && !diffStrs.includes(diffStr)) {
                console.log(`DELETED FROM COUNTER: ${diffStr}`);

                delete this.diffCounter[diffStr];
            } else {
                console.log(`REMAINS: ${diffStr}`);
            }
        });

        console.log('----------------------------');
    }

    private handleDiff(newState: number[][]) {
        console.log('-----------HANDLE-----------');
        let stateChanged = false;

        Object.keys(this.diffCounter).forEach((diffStr) => {
            if (this.diffCounter[diffStr] < MIN_DIFF_COUNTER) {
                return;
            }

            console.log(`HANDLED: ${diffStr}`);

            const diff = stringToDiff(diffStr);
            this.handleAction(diff);

            delete this.diffCounter[diffStr];

            stateChanged = true;
        });

        if (stateChanged) {
            this.gameState = newState;
        }

        console.log('----------------------------');
    }

    private handleAction(action: Action) {
        switch (action.action) {
        case ActionTypes.FIGURE_DOWN:
            if (this.prevPos) {
                GameApi.makeStep({ prevPos: this.prevPos, nextPos: action });
                this.prevPos = null;
            }

            break;
        case ActionTypes.FIGURE_UP:
            GameApi.sendPossibleMovesRequest(action);
            break;
        default:
            console.log('BOARD_ACTION IS UNDEFINED');

            break;
        }
    }

    private parseState(data: string[]): number[][] {
        // console.log('RECIEVED DATA: ', data);
        return data.slice(1).
                    // reverse().
                    map((item) => parseInt(item, 16)).
                    map((item, index) => {
                        const arr = [];
                        for (let i = 0; i < 8; ++i) {
                            arr.push((item & (0x80 >> i) ? 1 : 0));
                        }

                        return arr;
                    });
    }
}

const boardManager = new BoardManager();
export default boardManager;
