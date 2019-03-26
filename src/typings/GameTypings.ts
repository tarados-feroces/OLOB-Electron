export const enum Side {
    WHITE,
    BLACK
}

export const enum Situations {
    CHECK = 'CHECK',
    MATE = 'MATE'
}

export interface Navigation {
    x: number;
    y: number;
}

export interface PossibleSteps {
    x: number;
    y: number;
    captured: boolean;
}

type GameState = string[][];

export interface GameType {
    situation: GameSituations;
    currentUser: string;
    possibleSteps: PossibleSteps[];
    side: Side;
    state: GameState;
}

export interface Step {
    prevPos: Navigation;
    nextPos: Navigation;
}

export interface GameSituations {
    type: Situations;
    position: Navigation;
}
