const { contextBridge, ipcRenderer } = require('electron')

// 通过它，可以打通主进程window和客户端window
contextBridge.exposeInMainWorld('myAPI', {
    desktop: true,
    loadPreferences: () => ipcRenderer.invoke('load-prefs')
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
})