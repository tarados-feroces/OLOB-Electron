type WsEventHandler = (message: PlainMessage) => {};

interface PlainMessage {
    text: string;
}

interface Message {
    cls: string;
    message: PlainMessage;
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

    public deleteHandler(id: number, cls: string) {
        if (!this.eventHandlers[cls]) {
            return;
        } else {
            this.eventHandlers[cls] = this.eventHandlers[cls].filter((handler) => handler.id !== id);
        }
    }

    private handleMessage = (event: MessageEvent) => {
        const { cls, message } = JSON.parse(event.data);

        if (this.eventHandlers[cls]) {
            this.eventHandlers[cls].forEach(({ callback }) => callback(message));
        }
    };

    public open(address: string) {
        this.ws = new WebSocket(address);
        this.ws.onopen = () => {
            this.ws.onmessage = this.handleMessage;
            this.ws.onclose = this.close;
        };
    }

    public sendMessage(message: PlainMessage, cls: string) {
        const msg: Message = {
            cls,
            message
        };

        this.ws.send(JSON.stringify(msg));
    }

    public close(code: number, reason: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(code, reason);
        }
    }
}

const ws = new WebSocketApi();
export default ws;
