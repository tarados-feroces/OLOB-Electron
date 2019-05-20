export enum ActionTypes {
    FIGURE_UP = 0,
    FIGURE_DOWN = 1
}

export enum MessageTypes {
    Start = '34',
    End = '35',
    BoardState = 0x36,
    ColorMap = '33',
    Ping = '71'
}

export interface Action {
    x: number;
    y: number;
    action: ActionTypes;
}

export interface Position {
    x: number;
    y: number;
}

export interface Step {
    prevPos: Position;
    nextPos: Position;
}

export interface LightPosition {
    x: number;
    y: number;
    color: string;
}
