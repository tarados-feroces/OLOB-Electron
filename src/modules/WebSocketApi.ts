'use strict';

class WebSocketApi {
    public open(address, onmessage, onclose) {
        self.address = address;
        this.ws = new WebSocket(self.address);
        this.ws.onopen = () => {
            console.log(`WS on ${self.address} is opened`);
            this.ws.onmessage = onmessage;
            this.ws.onclose = onclose;
        };
    }

    public sendMessage(cls, message) {
        message.cls = cls;
        console.log(message);

        if (message !== null && typeof message === 'object') {
            this.ws.send(JSON.stringify(message));
        } else {
            this.ws.send(JSON.stringify({ message }));
        }
    }

    public close(code, reason) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(code, reason);
        }
    }
}

const ws = new WebSocketApi();
export default ws;