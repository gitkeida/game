export const config = {
    statue: 0,      // 游戏状态
    difficuity: 1,  // 难度
    score: 0,       // 积分
    width: 500,     // 窗口宽度
    height: 750,    // 窗口高度
    heroType: 'hero6',  // 英雄飞机选择
}

// 背景配置
export const bgConfig: any = {
    width: config.width,
    height: config.height,
    image: 'bg2.jpg',
    speed: 100,
    y: 0,
}

// 英雄飞机列表
export const heroList: any = {
   default: {name: 'default', width: 105, height: 126, life: 1, image: 'me1.png', bulletType: 'default'},
   hero1: {name: 'hero1', width: 120, height: 79, life: 1, image: 'hero1.png', bulletType: 'default'},
   hero2: {name: 'hero2', width: 128, height: 128, life: 1, image: 'hero2.png', bulletType: 'mini'},
   hero3: {name: 'hero3', width: 128, height: 128, life: 1, image: 'hero3.png', bulletType: 'small'},
   hero4: {name: 'hero4', width: 128, height: 128, life: 1, image: 'hero4.png', bulletType: 'small'},
   hero5: {name: 'hero5', width: 128, height: 128, life: 1, image: 'hero5.png', bulletType: 'large'},
   hero6: {name: 'hero6', width: 117, height: 94, life: 1, image: 'hero6.png', bulletType: 'dot'},
   hero7: {name: 'hero7', width: 100, height: 100, life: 1, image: 'hero7.png', bulletType: 'middle'},
   hero8: {name: 'hero8', width: 95, height: 89, life: 1, image: 'hero8.png', bulletType: 'big'},
   boss2: {name: 'boss2', width: 135, height: 131, life: 1, image: 'boss2.png', bulletType: 'boss'},
}

const currHero = config.heroType;
// 英雄飞机配置
export const heroConfig: any = {
    baseLife: 1,
    life: 0,
    width: heroList[currHero].width,
    height: heroList[currHero].height,
    speed: 10,
    x: (config.width / 2) - 50,
    y: config.height - 100,
    bulletType: heroList[currHero].bulletType,
    image: heroList[currHero].image
}

// 敌机配置
export const enemyConfig: any = {
    mini: {name: '小型', type: 'mini', w: 60, h: 43, life: 1, speed: 300, move: 2, maxMoveSpeed: 10, minMoveSpeed: 1, score: 1, image: 'dj11.png', audio: 'enemy-destroy1.mp3'},
    default: {name: '普通', type: 'default', w: 97, h: 75, life: 1, speed: 2000, move: 2, maxMoveSpeed: 50, minMoveSpeed: 30, score: 2, image: 'dj8.png', audio: 'enemy-destroy1.mp3'},
    middle: {name: '中型', type: 'middle', w: 176, h: 120, life: 5, speed: 4000, move: 2, maxMoveSpeed: 60, minMoveSpeed: 30, score: 5, image: 'dj4.png', audio: 'enemy-destroy1.mp3'},
    large: {name: '大型', type: 'large', w: 180, h: 136, life: 10, speed: 8000, move: 2, maxMoveSpeed: 90, minMoveSpeed: 70, score: 10, image: 'dj10.png', audio: 'enemy-destroy1.mp3'},
    boss: {name: 'boss', type: 'boss', w: 149, h: 86, life: 30, speed: 10000, move: 2, maxMoveSpeed: 300, minMoveSpeed: 200, score: 100, image: 'boss1.png', audio: 'enemy-destroy1.mp3'},
}

// 子弹配置
export const bulletConfig: any = {
   dot: {name: '圆', type: 'dot', w: 18, h: 18, life: 1, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet6.png'},
   mini: {name: '小型', type: 'mini', w: 8, h: 15, life: 1, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet1.png'},
   default: {name: '普通', type: 'default', w: 6, h: 12, life: 1, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: ''},
   small: {name: '中小', type: 'small', w: 6, h: 12, life: 1.5, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet3.png'},
   middle: {name: '中型', type: 'middle', w: 14, h: 38, life: 2, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet7.png'},
   large: {name: '大型', type: 'large', w: 21, h: 59, life: 3, speed: 600, move: 2, audio: 'bullet-default1.mp3', image: 'bullet2.png'},
   big: {name: '大', type: 'big', w: 42, h: 50, life: 4, speed: 500, move: 2, audio: 'bullet-default1.mp3', image: 'bullet5.png'},
   boss: {name: 'boss', type: 'boss', w: 42, h: 50, life: 4, speed: 500, move: 2, audio: 'bullet-default1.mp3', image: 'bullet4.png'},
}

// 销毁动画配置
export const destroyConfig: any = {
    dot: {type: 'dot', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    mini: {type: 'mini', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    default: {type: 'default', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    small: {type: 'small', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    middle: {type: 'middle', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    large: {type: 'large', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    big: {type: 'big', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    boss: {type: 'boss', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
}

// 道具包配置
export const propConfig: any = {
    prop1: {type: 'prop1', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop1.png', audio: 'prop2-use.mp3', bgSize: '300px',},
    prop2: {type: 'prop2', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop2.png', audio: 'prop2-use.mp3', bgSize: '300px',},
    prop3: {type: 'prop3', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop3.png', audio: 'prop2-use.mp3', bgSize: '300px',},
}