// Basic init
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

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 1920, height: 1080, show: false});
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // mainWindow.loadURL(`file://${path.join(__dirname, '/dist/index.html')}`);
    mainWindow.loadFile('dist/index.html');
    mainWindow.webContents.openDevTools();
    // mainWindow.loadURL(`http://localhost:8080`);
});
