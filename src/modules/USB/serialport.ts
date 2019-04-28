import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { BAUD_RATE, PORT_LINE } from '../../constants/USBConstants';

export default class USBConnector {
    private readonly portLine;
    private readonly baudRate;
    private port;
    private parser;
    private handlerCounter;
    private readonly eventHandlers;

    constructor(portLine = PORT_LINE, baudRate = BAUD_RATE) {
        this.portLine = portLine;
        this.baudRate = baudRate;
        this.port = new SerialPort(this.portLine, { baudRate: this.baudRate });
        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));
        this.handlerCounter = 0;
        this.eventHandlers = {};

        this.port.on('open', (() => {
            // console.log('Built-in func: serial port open');
        }));

        this.parser.on('data', this.handleMessage || ((data) => {
            // console.log('Built-in func: got data', data);
        }));
    }

    public sendMessage(msg) {
        this.port.write(msg, (err, bytesWritten) => {
            // console.error(err);
            // console.log(`Written ${bytesWritten} bytes.`);
        });
    }

    public handleMessage = (event) => {
        const { cls, data } = JSON.parse(event.data);

        if (this.eventHandlers[cls]) {
            this.eventHandlers[cls].forEach(({ callback }) => callback(data));
        }
    }

    public registerHandler(cls, callback) {
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

    public deleteHandler(cls, id) {
        if (!this.eventHandlers[cls]) {
            return;
        } else if (id != null) {
            this.eventHandlers[cls] = this.eventHandlers[cls].filter((handler) => handler.id !== id);
        } else {
            this.eventHandlers[cls] = [];
        }
    }
}
