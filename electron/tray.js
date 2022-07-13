const { app, Menu, Tray } = require('electron');
const path = require('path')

// 在外部定义一个变量，防止托盘被回收
let tray = null
exports.trayInit = () => {
    // 托盘初始化
    tray = new Tray(path.join(__dirname, '../src/image/propBag2.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('react app ts.')
    tray.setContextMenu(contextMenu)

    setTimeout(() => {
        tray.displayBalloon({
            title: '气球通知',
            content: '通知：系统托盘图标将持续闪烁！'
        })
        let flag = false;
        let empty = path.join(__dirname, '../src/image/empty.png')
        let icon = path.join(__dirname, '../src/image/propBag2.png')
        // 其实就是不断的切换图标
        setInterval(() => {
            tray.setImage(flag ? empty : icon)
            flag = !flag
        }, 600)

    }, 2000)
}
