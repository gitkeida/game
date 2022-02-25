const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');

function createWindow() {
    const win = new BrowserWindow({
        width: 520,
        height: 810
    })

    const buildUrl = url.format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true
    })

    console.log(isDev)
    const urlLocation = isDev ? 'http://localhost:3000' : buildUrl
    // win.loadFile('./public/index.html')
    win.loadURL(urlLocation);

}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});