// tslint:disable-next-line:no-any
type WsEventHandler = (data: object) => any;

interface Message {
    cls: string;
    data: object;
}

interface WsEventHandlers {
    [cls: string]: Array<{
        id: number;
        callback: WsEventHandler;
    }>;
}

class WebSocketApi {
    private handlerCounter = 0;
    private eventHandlers: WsEventHandlers = {};
    private ws: WebSocket;

    public registerHandler(cls: string, callback: WsEventHandler): number {
        if (!this.eventHandlers[cls]) {
            this.eventHandlers[cls] = [ {
                id: this.handlerCounter,
                callback
            } ];
        } else {
            this.eventHandlers[cls].push({
                id: this.handlerCounter,
                callback
            });
        }

        return this.handlerCounter++;
    }

    public deleteHandler(cls: string, id?: number) {
        if (!this.eventHandlers[cls]) {
            return;
        } else if (id != null) {
            this.eventHandlers[cls] = this.eventHandlers[cls].filter((handler) => handler.id !== id);
        } else {
            this.eventHandlers[cls] = [];
        }
    }

    private handleMessage = (event: MessageEvent) => {
        const { cls, data } = JSON.parse(event.data);

        if (this.eventHandlers[cls]) {
            this.eventHandlers[cls].forEach(({ callback }) => callback(data));
        }
    }

    public open(address: string) {
        this.ws = new WebSocket(address);
        this.ws.onopen = () => {
            this.ws.onmessage = this.handleMessage;
            this.ws.onclose = this.close;
        };
    }

    public sendMessage = (data: object, cls: string) => {
        const msg: Message = {
            cls,
            data
        };

        this.ws.send(JSON.stringify(msg));
    }

    public close(this: WebSocket, ev: CloseEvent) {
        if (this && this.readyState === WebSocket.OPEN) {
            this.close(ev.code, ev.reason);
        }
    }
}

const ws = new WebSocketApi();
export default ws;
