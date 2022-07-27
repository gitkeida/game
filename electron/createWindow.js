const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');

let openDirTools = null;

const config = {
    title: '飞机大战',
    icon: path.join(__dirname, '../src/image/icon.ico'),
    // frame: false,            // 无边框窗口
    titleBarStyle: 'hidden',    // 隐藏默认的窗口栏
    titleBarOverlay: {          // 自定义窗口栏
        color: '#fff',
        symbolColor: '#74b1be'
    },
    webPreferences: {
        preload: path.join(__dirname, './preload.js'),      // 定义预加载脚本
        sandbox: true                                       // 开启沙盒
    }
}

const mainConfig = {
    url: '',
    width: 400,
    height: 400,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',    // 隐藏默认的窗口栏
    // titleBarOverlay: {          // 自定义窗口栏
    //     color: '#fff',
    //     symbolColor: '#74b1be'
    // },
}

const loginConfig = {
    url: 'login',
    width: 400,
    height: 331,
    resizable: false,
}

const gameConfig = {
    url: 'game',
    width: 500,
    height: 781,
    resizable: false,
}

const win = {
    main: null,
    login: null,
    game: null,
}

// 创建窗口
const createWindow = (type) => {
    let options = {}
    let src = ''
    switch(type) {
        case 'login':
            Object.assign(options, config, loginConfig)
            src = options.url
            delete options.url;
            break;
        case 'game':
            Object.assign(options, config, gameConfig)
            src = options.url
            delete options.url;
            break;
    }

    console.log(options, src)
    win[type] = new BrowserWindow(options)

    // 打包地址
    const buildUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
    })

    // 区分打包环境和开发环境
    const urlLocation = isDev ? 'http://localhost:3000#/' : buildUrl + '#/'
    win[type].loadURL(urlLocation + src);


    // 注册快捷键，打开调试工具
    // if (!openDirTools) {
        // openDirTools = globalShortcut.register('Ctrl+Shift+i', () => {
        //     win[type].webContents.openDevTools()
        // })
    // }

}


module.exports = {
    win,
    config,
    mainConfig,
    loginConfig,
    gameConfig,
    createWindow
}