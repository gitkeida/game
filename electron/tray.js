const { app, Menu, Tray } = require('electron');
const path = require('path')
const { winLiving } = require('./createWindow')

// 在外部定义一个变量，防止托盘被回收
let tray = null
let timer = null;
const empty = path.join(__dirname, '../src/image/empty.png')
const icon = path.join(__dirname, '../src/image/icon.ico')

exports.trayInit = (mainWin) => {

    // 托盘初始化
    tray = new Tray(icon)
    tray.setToolTip('飞机大战')

    // 菜单
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '消息通知', 
            click() {
                // 启动闪烁窗口
                winLiving.curr.flashFrame(true);
            }
        },
        { 
            label: '退出', 
            click() {
                app.exit()
            }
        },

    ])
    tray.setContextMenu(contextMenu)

    // 点击时显示窗口
    tray.on('click', function() {
        winLiving.curr.show()
    })

    // tray.displayBalloon({
    //     title: '气球通知',
    //     content: '右下角通知：系统托盘图标将持续闪烁！'
    // })

}

// 开始闪烁
exports.start = () => {
    // 闪烁任务栏图标
    winLiving.curr.flashFrame(true);

    // 其实就是不断的切换图标
    let flag = false;
    timer = setInterval(() => {
        // 闪烁托盘图标
        tray.setImage(flag ? empty : icon)
        flag = !flag
    }, 600)
}

// 停止托盘图标闪烁
exports.stop = () => {
    clearInterval(timer)
    tray.setImage(icon)
}
