import ws from './WebSocketApi';
import { Figure } from './Figure';
import { FigureType, Side, Navigation } from './typings';

class GameApi {
    private Figures: Figure[];
    private figureTouched: boolean;

    // public initialize(data) {

    // }

    public makeStep(prevCoords: Navigation, newCoords: Navigation): Figure[] {
        this.Figures.forEach((figure) => {
            if (this.checkSimilarCoords(prevCoords, figure)) {
                figure.updateCoords(newCoords);
            }
        });
    }

    public getSteps(coords: Navigation): Navigation[] {
        return this.Figures.reduce((result, figure) => {
            if (this.checkSimilarCoords(coords, figure)) {
                return [ ...result, ...figure.getAccessedAreas() ];
            }
        }, []);
    }

    public getFigures(): Figure[] {
        return { ...this.Figures };
    }

    private checkSimilarCoords(coords: Navigation, figure: Figure): boolean {
        return figure.getCoords().x === coords.x && figure.getCoords().y === coords.y;
    }
}

const gameApi = new GameApi();
export default gameApi;
