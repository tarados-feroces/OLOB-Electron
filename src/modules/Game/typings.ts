export const enum FigureType {
    PAWN,     // Пешка
    HORSE,    // Конь
    ELEPHANT, // Слон
    QUEEN = 'QUEEN',    // Ферзь
    KING = 'KING',     // Король
    ROOK = 'ROOK'      // Ладья
}

export const enum Side {
    BLACK = 'BLACK',
    WHITE = 'WHITE'
}

export interface Navigation {
    x: number;
    y: number;
}
