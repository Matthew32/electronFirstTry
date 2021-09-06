const {app, BrowserWindow, dialog} = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')

// Importing dialog module using remote

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })
})