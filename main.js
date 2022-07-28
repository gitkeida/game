const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, BrowserView, globalShortcut } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
const { trayInit } = require('./electron/tray')
const { createWindow, winLiving } = require('./electron/createWindow')
let win = null

// 创建window窗口
function createWindow2() {
    // 主进程的window窗口
    win = new BrowserWindow({
        title: '飞机大战',
        icon: path.join(__dirname, 'src/image/hero6.png'),
        width: 420,
        height: 410,
        frame: false,            // 无边框窗口
        // transparent: true,  // 窗口透明
        resizable: false,
        titleBarStyle: 'hidden',    // 隐藏默认的窗口栏
        titleBarOverlay: {          // 自定义窗口栏
            color: '#fff',
            symbolColor: '#74b1be'
        },
        webPreferences: {
            preload: path.join(__dirname, 'electron/preload.js'),   // 定义预加载脚本
            sandbox: true                                           // 开启沙盒
        }
    })

    // 图标
    // let appIcon = new Tray(path.join(__dirname, 'src/image/hero4.png'))

    // 小窗口
    // const view = new BrowserView()
    // win.setBrowserView(view)
    // view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
    // view.webContents.loadURL('https://electronjs.org')

    // 设置缩略图工具栏
    win.setThumbarButtons([
        {
            tooltip: 'button1',
            icon: path.join(__dirname, 'src/image/propBag2.png'),
            click () {console.log('button1 clicked')}
        }
    ])

    // win.setOverlayIcon(path.join(__dirname, 'src/image/propBag2.png'), 'Description for overlay')

    // 图标闪烁
    win.once('focus', () => win.flashFrame(false))
    win.flashFrame(true)

    // 配置菜单栏
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => win.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => win.webContents.send('update-counter', -1),
                    label: 'Decrement'
                },
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

    const buildUrl = url.format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true
    })

    // 区分打包环境和开发环境
    const urlLocation = isDev ? 'http://localhost:3000#/' : buildUrl
    // win.loadFile('./public/index.html')
    
    win.loadURL(urlLocation);
    // 打开开发工具
    win.webContents.openDevTools()

    // 注册快捷键
    const openDev = globalShortcut.register('Ctrl+Shift+i', () => {
        win.webContents.openDevTools()
    })
}

// 创建一个右键图标任务栏，
app.setUserTasks([
    {
      program: process.execPath,
      arguments: '--new-window',
      iconPath: process.execPath,
      iconIndex: 0,
      title: 'New Window',
      description: 'Create a new window'
    }
  ])

// app加载完后执行创建window窗口
app.whenReady().then(() => {
    // ipcMain.on 监听渲染进程消息
    ipcMain.on('set-title', handleSetTitle)

    // ipcMain.hanle 监听打开文件
    ipcMain.handle('dialog:openFile', handleFileOpen)

    // 
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value)
    })

    // 创建新窗口
    ipcMain.handle('createWindow:game', createGame)

    // 创建window窗口
    createWindow('login');

    // 托盘
    trayInit(winLiving.curr)

    // 如果没有创建则新建一个
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 如果所有窗口关闭、则退出app程序
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})


// ipc 操作title
function handleSetTitle(event, title) {
    const webContents = event.sender
    const renderWin = BrowserWindow.fromWebContents(webContents)
    renderWin.setTitle(title)
}

// 主进程打开文件并返回路径
async function handleFileOpen() {
    console.log('操作--123')
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}

// 创建游戏窗口
function createGame() {
    app.quit()
    createWindow('game')
    return;
        // 主进程的window窗口
        const win = new BrowserWindow({
            width: 520,
            height: 810,
            frame: false,            // 无边框窗口
            // transparent: true,  // 窗口透明
            titleBarStyle: 'hidden',    // 隐藏默认的窗口栏
            titleBarOverlay: {          // 自定义窗口栏
                color: '#fff',
                symbolColor: '#74b1be'
            },
            webPreferences: {
                preload: path.join(__dirname, 'electron/preload.js'),   // 定义预加载脚本
                sandbox: true                                           // 开启沙盒
            }
        })
    
        const buildUrl = url.format({
            pathname: path.join(__dirname, 'build/index.html'),
            protocol: 'file:',
            slashes: true
        })
    
        console.log(buildUrl)
        // 区分打包环境和开发环境
        const urlLocation = isDev ? 'http://localhost:3000#/game' : buildUrl + '#/game'
        // win.loadFile('./public/index.html')
        
        win.loadURL(urlLocation);
        // 打开开发工具
        win.webContents.openDevTools()
}