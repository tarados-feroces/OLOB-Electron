const electron = require('electron');
const path = require('path');
const {app, BrowserWindow} = electron;

// Let electron reloads by itself when webpack watches changes in ./app/
// require('electron-reload')(__dirname);

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() === 'true') : false;
if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 1920, height: 1080, show: false,
        node: {
            __dirname: false
        }});

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
    // mainWindow.loadURL(`http://130.193.34.42`);
    // mainWindow.loadURL(`http://127.0.0.1:8080`);
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.openDevTools()
    })
});
