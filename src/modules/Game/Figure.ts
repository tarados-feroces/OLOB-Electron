import { Side, FigureType, Coords } from './typings';

export class Figure {
    private id: number;
    private side: Side;
    private type: FigureType;

    constructor(id: number, type: FigureType, side: Side) {
        this.id = id;
        this.side = side;
        this.type = type;
    }

    public getAccessedAreas(): Coords[] {
        return [ { x: 0, y: 0 } ];
    }

    public getBittenAreas(): Coords[] {
        return [ { x: 0, y: 0 } ];
    }
}
