import ws from '../WebSocketApi';
import { Figure } from './Figure';
import { FigureType, Side, Navigation } from './typings';
import { figureData } from './initState';

class GameApi {
    private Figures: Figure[] = [];
    private figureTouched: boolean = false;

    public initialize(data) {
        this.Figures = [];
        data.forEach((item) => {
            const figure = new Figure(item.id, item.type, item.side, item.coords);
            this.Figures.push(figure);
        });
    }

    public makeStep(prevCoords: Navigation, newCoords: Navigation): Figure[] {
        this.Figures = this.Figures.reduce((result, figure) => {
            if (this.checkSimilarCoords(newCoords, figure)) {
                return result;
            }

            if (this.checkSimilarCoords(prevCoords, figure)) {
                figure.updateCoords(newCoords);
            }

            return [ ...result, figure ];
        }, []);

        ws.sendMessage({
            gameID: 'lol',
            figures: this.Figures
        }, 'game');
    }

    public getSteps(coords: Navigation): Navigation[] {
        return this.Figures.reduce((result, figure) => {
            if (this.checkSimilarCoords(coords, figure)) {
                return [ ...result, ...figure.getAccessedAreas() ];
            }

            return result;
        }, []);
    }

    public getFigures(): Figure[] {
        return [ ...this.Figures ];
    }

    private checkSimilarCoords(coords: Navigation, figure: Figure): boolean {
        return figure.getCoords().x === coords.x && figure.getCoords().y === coords.y;
    }
}

const gameApi = new GameApi();
gameApi.initialize(figureData);
export default gameApi;
