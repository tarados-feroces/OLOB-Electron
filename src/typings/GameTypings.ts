export const enum FigureType {
    PAWN,     // Пешка
    HORSE,    // Конь
    ELEPHANT, // Слон
    QUEEN,    // Ферзь
    KING,     // Король
    ROOK      // Ладья
}

export const enum Side {
    BLACK,
    WHITE
}

export const enum Situations {
    CHECK = 1,
    MAT = 2
}

export interface Navigation {
    x: number;
    y: number;
}

export interface Figure {
    id: number;
    type: FigureType;
    side: Side;
    position: Navigation;
}

export interface GameType {
    info: GameInfo;
    currentUser: number;
    possibleSteps?: Navigation[];
    state: string[][];
}

export interface Step {
    prevPos: Navigation;
    nextPos: Navigation;
}

export interface GameInfo {
    [status: number]: Navigation;
}
