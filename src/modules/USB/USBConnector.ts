import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { BAUD_RATE, PORT_LINE } from '../../constants/USBConstants';
import { throttle } from 'throttle-typescript';

export interface CommandType {
    cls: number;
    msg: string;
}

// Все по пробелам
// Первое число - код ответа, ответ в виде строки

class USBConnector {
    private baudRate: number;
    private port: SerialPort;
    private parser;
    private eventHandlers;

    public async init(baudRate = BAUD_RATE) {
        let connectionStatus = false;
        this.baudRate = baudRate;
        try {
            this.port = await new SerialPort('/dev/tty.usbserial-AH0707R9', { baudRate: this.baudRate });
            connectionStatus = true;
        } catch (e) {
            console.log('error');
            return false;
        }

        this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));
        this.eventHandlers = {};

        this.port.on('open', (() => {
            console.log('Built-in func: serial port open');
        }));

        this.parser.on('data', this.handleMessage || ((data: string) => {
            const parsedData = data.trim().split(' ');

            const keyCode = parseInt(parsedData[0], 16);
        }));

        return connectionStatus;
    }

    public sendMessage(keyCode: string, data: string) {
        console.log(`"${keyCode} ${data} ;"`);
        this.port.write(`${keyCode} ${data} ;`, (err, bytesWritten) => {
            return;
        });
    }

    public handleMessage = throttle((message: string) => {
        console.log('RECEIVED: ', `"${message}"`);
        const parsedData = message.trim().split(' ');

        const keyCode = parseInt(parsedData[0], 16);

        if (this.eventHandlers[keyCode]) {
            this.eventHandlers[keyCode].forEach((callback) => {
                callback(parsedData);
            });
        }
    }, 200);

    public registerHandler = (keyCode: number, callback) => {
        this.eventHandlers[keyCode] ?
            this.eventHandlers[keyCode].push(callback) :
            this.eventHandlers[keyCode] = [ callback ];
    }
}

const Connector = new USBConnector();
export default Connector;
