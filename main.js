const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, BrowserView, globalShortcut } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
const { trayInit } = require('./electron/tray')
const { createWindow, winLiving, gameConfig } = require('./electron/createWindow')
const ipcMainInstall = require('./electron/ipcMain')
console.log(app.getPath('userData'))

// app加载完后执行创建window窗口
app.whenReady().then(() => {
    // 创建新窗口
    ipcMain.handle('createWindow:game', createGame)

    // 主进程通信函数
    ipcMainInstall();

    // 创建window窗口
    createWindow('login');

    // 托盘
    trayInit(winLiving.curr)

    // 如果没有创建则新建一个
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow('login')
    })
})

// 如果所有窗口关闭、则退出app程序
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})


// 创建游戏窗口
function createGame(event, params) {
    app.quit()
    // 如果有参数，则添加进路由参数里
    if (params) {
        gameConfig.url += '?username=' + params;
    }
    createWindow('game')
}