const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');

// 创建window窗口
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

    // 区分打包环境和开发环境
    const urlLocation = isDev ? 'http://localhost:3000' : buildUrl
    // win.loadFile('./public/index.html')
    win.loadURL(urlLocation);

}

// app加载完后执行创建window窗口
app.whenReady().then(() => {
    createWindow();

    // 如果没有创建则新建一个
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 如果所有窗口关闭、则退出app程序
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})
