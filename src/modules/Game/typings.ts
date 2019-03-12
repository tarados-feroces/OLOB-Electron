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

export interface Navigation {
    x: number;
    y: number;
}
