import { Side, FigureType, Navigation } from './typings';

export class Figure {
    public id: number;
    public side: Side;
    public type: FigureType;
    public coords: Navigation;

    constructor(id: number, type: FigureType, side: Side, coords: Navigation) {
        this.id = id;
        this.side = side;
        this.type = type;
        this.coords = coords;
    }

    public getBittenAreas(): Navigation[] {
        return [ { x: 0, y: 0 } ];
    }

    public updateCoords(newCoords: Navigation) {
        this.coords = { ...newCoords };
    }

    public getCoords(): Navigation {
        return this.coords;
    }

    public getAccessedAreas(): Navigation[] {
        switch (this.type) {
        case FigureType.PAWN:
            return this.getPawnAccessedAreas();
        case FigureType.HORSE:
            return this.getHorseAccessedAreas();
        case FigureType.ELEPHANT:
            return this.getElephantAccessedAreas();
        case FigureType.ROOK:
            return this.getRookAccessedAreas();
        case FigureType.QUEEN:
            return this.getQueenAccessedAreas();
        case FigureType.KING:
            return this.getKingAccessedAreas();
        default:
            return [ { x: 0, y: 0 } ];
        }
    }

    private getPawnAccessedAreas(): Navigation[] {
        return [ { x: this.coords.x, y: this.coords.y - 1 } ];
    }

    private getHorseAccessedAreas(): Navigation[] {
        return [
            { x: this.coords.x + 3, y: this.coords.y + 1 },
            { x: this.coords.x + 3, y: this.coords.y - 1 },
            { x: this.coords.x + 1, y: this.coords.y + 3 },
            { x: this.coords.x + 1, y: this.coords.y - 3 },
            { x: this.coords.x - 3, y: this.coords.y + 1 },
            { x: this.coords.x - 3, y: this.coords.y - 1 },
            { x: this.coords.x - 1, y: this.coords.y + 3 },
            { x: this.coords.x - 1, y: this.coords.y - 3 }
        ].filter(this.checkGoodCoords);
    }

    private getElephantAccessedAreas(): Navigation[] {
        const accessedAreas = [];

        let x = this.coords.x;
        let y = this.coords.y;
        while (x <= 7 && y <= 7) {
            accessedAreas.push({ x: x++, y: y++ });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (x >= 0 && y >= 0) {
            accessedAreas.push({ x: x--, y: y-- });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (x <= 7 && y >= 0) {
            accessedAreas.push({ x: x++, y: y-- });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (x >= 0 && y <= 7) {
            accessedAreas.push({ x: x--, y: y++ });
        }

        return accessedAreas.filter(this.checkGoodCoords);
    }

    private getRookAccessedAreas(): Navigation[] {
        const accessedAreas = [];

        let x = this.coords.x;
        let y = this.coords.y;
        while (x <= 7) {
            accessedAreas.push({ x: x++, y });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (x >= 0) {
            accessedAreas.push({ x: x--, y });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (y >= 0) {
            accessedAreas.push({ x, y: y-- });
        }

        x = this.coords.x;
        y = this.coords.y;
        while (y <= 7) {
            accessedAreas.push({ x, y: y++ });
        }

        return accessedAreas.filter(this.checkGoodCoords);
    }

    private getQueenAccessedAreas(): Navigation[] {
        return [
            ...this.getElephantAccessedAreas(),
            ...this.getRookAccessedAreas()
        ];
    }

    private getKingAccessedAreas(): Navigation[] {
        return [
            { x: this.coords.x + 1, y: this.coords.y + 1 },
            { x: this.coords.x + 1, y: this.coords.y - 1 },
            { x: this.coords.x - 1, y: this.coords.y + 1 },
            { x: this.coords.x - 1, y: this.coords.y - 1 },
            { x: this.coords.x, y: this.coords.y + 1 },
            { x: this.coords.x, y: this.coords.y - 1 },
            { x: this.coords.x + 1, y: this.coords.y },
            { x: this.coords.x - 1, y: this.coords.y }
        ].filter(this.checkGoodCoords);
    }

    private checkGoodCoords(item: Navigation): boolean {
        return item.x >= 0 && item.y >= 0 && item.x <= 7 && item.y <= 7;
    }
}
