const { app, Menu, Tray } = require('electron');
const path = require('path')

// 在外部定义一个变量，防止托盘被回收
let tray = null


exports.trayInit = (mainWin) => {
    let timer = null;
    let empty = path.join(__dirname, '../src/image/empty.png')
    let icon = path.join(__dirname, '../src/image/propBag2.png')

    // 托盘初始化
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '消息通知', 
            click() {
                console.log('消息')
                // 启动闪烁窗口
                mainWin.flashFrame(true);
                clearInterval(timer)
                tray.setImage(icon)
            }
        },

    ])
    tray.setToolTip('react app ts.')
    tray.setContextMenu(contextMenu)

    setTimeout(() => {
        tray.displayBalloon({
            title: '气球通知',
            content: '右下角通知：系统托盘图标将持续闪烁！'
        })
        let flag = false;

        // 其实就是不断的切换图标
        timer = setInterval(() => {
            tray.setImage(flag ? empty : icon)
            flag = !flag
        }, 600)

    }, 2000)
}
