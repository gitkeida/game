const { ipcMain } = require('electron');
const { GetScore, SetScore, GetUserInfo, SetUserInfo } = require('./store')


// 主机程处理子进程方法调用
function ipcMainInstall() {
    // 保存排行榜分数
    ipcMain.on('setStore:score', SetScore)

    // 获取排行榜分数
    ipcMain.handle('getStore:score', GetScore)

    // 设置用户信息
    ipcMain.on('setStore:user', SetUserInfo)

    // 获取用户信息
    ipcMain.handle('getStore:user', GetUserInfo)
}

module.exports = ipcMainInstall;