export const enum FigureType {
    PAWN,     // Пешка
    HORSE,    // Конь
    ELEPHANT, // Слон
    QUEEN,    // Ферзь
    KING,     // Король
    ROOK      // Ладья
}

export const enum Side {
    BLACK = 'BLACK',
    WHITE = 'WHITE'
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

export interface Figure {
    id: number;
    type: FigureType;
    side: Side;
    position: Navigation;
}

type GameState = string[][];

export interface GameType {
    situation: GameSituations;
    currentUser: string;
    possibleSteps: PossibleSteps[];
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
