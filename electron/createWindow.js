const { app, BrowserWindow } = require('electron')
const path = require('path')

const config = {
    title: '飞机大战',
    icon: path.join(__dirname, '../src/image/hero6.png'),
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
    width: 450,
    height: 450,
    frame: false,
    titleBarStyle: 'hidden',
}

const win = {
    main: null,
    login: null,
    game: null,
}

const createWindow = (type) => {
    let options = {}
    let url = ''
    switch(type) {
        case 'login':
            Object.assign(options, config, mainConfig)
            url = options.url
            delete options.url;
            break;
    }
}


module.exports = {
    config,
    mainConfig,
    loginConfig,
    createWindow
}