const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');



// 创建window窗口
function createWindow() {
    // 主进程的window窗口
    const win = new BrowserWindow({
        width: 520,
        height: 810,
        webPreferences: {
            preload: path.join(__dirname, 'electron/preload.js'),
            sandbox: true
        }
    })

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
    const urlLocation = isDev ? 'http://localhost:3000' : buildUrl
    // win.loadFile('./public/index.html')
    
    win.loadURL(urlLocation);
    // 打开开发工具
    win.webContents.openDevTools()
}

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

    // 创建window窗口
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