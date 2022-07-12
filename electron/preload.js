const { contextBridge, ipcRenderer } = require('electron')

// 通过它，可以打通主进程window和客户端window
contextBridge.exposeInMainWorld('myAPI', {
    desktop: true,
    loadPreferences: () => ipcRenderer.invoke('load-prefs')
})

// 
contextBridge.exposeInMainWorld('electronAPI', {
    // 渲染器进程 => 主进程 （单向）
    setTitle: (title) => ipcRenderer.send('set-title', title),

    // 渲染器进程 => 主进程 （双向） 在客户端调用openFile后，会在主进程寻找hanle监听的方法并调用，随后返回值到渲染进程
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    // 主进程 => 渲染器进程
    onHandleCounter: (callback) => ipcRenderer.on('update-counter', callback)
})

// 在客户端中输出 window.myAPI
// {desktop: true}


// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

    // 也可以在这里直接调用监听，
    // 但是，与通过 context bridge 暴露预加载 API 相比，此方法的灵活性有限，因为监听器无法直接与渲染器代码交互。
    const counter = document.getElementById('counter')
    ipcRenderer.on('update-counter', (_event, value) => {
        const oldValue = Number(counter.innerText)
        const newValue = oldValue + value
        counter.innerText = newValue
    })
})