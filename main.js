const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')

function createWindow() {
    const win = new BrowserWindow({
        width: 520,
        height: 810
    })

    // win.loadFile('./public/index.html')
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true
    }))
    // win.loadURL('http://localhost:3000')
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