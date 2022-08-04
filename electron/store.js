
const Store = require('electron-store')

const store = new Store();

// 获取存储目录路径，数据存储在config.json文件里面
// console.log(app.getPath('userData'))

module.exports = store
