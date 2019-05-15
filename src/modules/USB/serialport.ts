import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { BAUD_RATE, PORT_LINE } from '../../constants/USBConstants';

export interface CommandType {
    cls: number;
    msg: string;
}

// Все по пробелам
// Первое число - код ответа, ответ в виде строки

class USBConnector {
    private portLine: string;
    private baudRate: number;
    private port: SerialPort;
    private parser;
    private handlerCounter: number;
    private eventHandlers;

    // constructor(portLine = PORT_LINE, baudRate = BAUD_RATE) {

    // }

    public init(portLine = PORT_LINE, baudRate = BAUD_RATE) {
        this.portLine = portLine;
        this.baudRate = baudRate;
        this.port = new SerialPort(this.portLine, { baudRate: this.baudRate });
        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));
        this.handlerCounter = 0;
        this.eventHandlers = {};

        this.port.on('open', (() => {
            console.log('Built-in func: serial port open');
        }));

        this.parser.on('data', this.handleMessage || ((data: string) => {
            console.log(data);
            const parsedData = data.trim().split(' ');

            const keyCode = parseInt(parsedData[0], 16);
        }));
    }

    public sendMessage(keyCode: number, data: string) {
        this.port.write(data, (err, bytesWritten) => {
            return;
        });
    }

    public handleMessage = (message: string) => {
        // console.log(message);
        const parsedData = message.trim().split(' ');

        const keyCode = parseInt(parsedData[0], 16);

        if (this.eventHandlers[keyCode]) {
            this.eventHandlers[keyCode].forEach((callback) => {
                callback(parsedData);
            });
        }
    }

    public registerHandler = (keyCode: number, callback) => {
        this.eventHandlers[keyCode] ?
            this.eventHandlers[keyCode].push(callback) :
            this.eventHandlers[keyCode] = [ callback ];
    }
}

const Connector = new USBConnector();
export default Connector;
