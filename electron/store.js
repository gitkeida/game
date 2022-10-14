
const Store = require('electron-store')

const store = new Store();

// 获取存储目录路径，数据存储在config.json文件里面
// console.log(app.getPath('userData'))

// 设置存储分数
function SetScore(event, value) {
    let score = store.get('score') || [];
    score.push(value)
    store.set('score', score)
}

// 获取存储分数
function GetScore() {
    let score = store.get('score') || [];
    return score
}

// 设置用户信息
function SetUserInfo(event, name, value) {
    let userList = store.get('userList') || [];
    let userIndex = userList.findIndex(user => user.name === name)
    if (userIndex > -1) {
        userList[userIndex] = value;
    } else {
        userList.push(value)
    }
    store.set('userList', userList)
}

// 获取用户信息
function GetUserInfo(event, name) {
    let userList = store.get('userList') || [];
    let userInfo = userList.find(user => user.name === name)
    return userInfo || null;
}

module.exports = {
    SetScore,
    GetScore,
    SetUserInfo,
    GetUserInfo,
}
