const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
// const parser = port.pipe(new Readline({ delimiter: '\n' }));

export class Connector {
    connector = null;

    constructor(portLine, baudRate, handlers) {
        let port = new SerialPort(portLine, { baudRate: baudRate });

        this.connector = {
            port: port,
            write: msg => port.write(msg, (err, bytesWritten) => {
                console.error(err);
                console.log(`Written ${bytesWritten} bytes.`)
            }),
            parser: port.pipe(new Readline({ delimiter: '\n' })),
        };

        this.connector.port.on('open', handlers.onOpen || (() => {
            console.log('Built-in func: serial port open');
        }));

        this.connector.parser.on('data', handlers.onData || (data => {
            console.log('Built-in func: got data', data);
        }));
    }

}
// usage: makeConnector('/dev/ttyACM0', 9600)

const conn = new Connector('/dev/ttyACM0', 9600, {
    onData: data => {
        // data = `F0 ${k.toString(16)} 0 0 0 0 0 0`;
        data = data.trim().split(' ');
        // console.log(k, k.toString(16));
        if( data.length === 8 ) {

            const line = JSON.stringify(
                data.
                reverse().
                map(val => parseInt(val, 16)).
                map((val, i) => {
                    let arr = [8-i];
                    for( let i = 0; i < 8; ++i ) {
                        arr.push( (val & (0x80 >> i) ? "X" : "0") );
                    }
                    return arr;
                })
            );
            console.log(line);
        }
    },

    onOpen: () => {
        // console.log('OPEN');
    }
});

