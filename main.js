const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, Session } = electron;

// Let electron reloads by itself when webpack watches changes in ./app/
// require('electron-reload')(__dirname);

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() === 'true') : false;
if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}

let mainWindow;

app.setName('OnLine On Board');

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 1920, height: 1080, webSecurity: false,
        icon: path.join(__dirname, 'dist/images/icons/main_logo.svg'),
        node: {
            __dirname: false
        }});

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
    // mainWindow.loadURL(`http://127.0.0.1:8080`);
    // mainWindow.webContents.once('dom-ready', () => {
    //     mainWindow.webContents.openDevTools()
    // });

    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['Origin'] = 'electron://olob-app';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    mainWindow.webContents.on('new-window', function(event, url){
        event.preventDefault();
        open(url);
    });
});
