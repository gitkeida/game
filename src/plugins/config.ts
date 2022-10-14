export const config = {
    statue: 0,      // 游戏状态
    difficuity: 1,  // 难度
    score: 0,       // 积分
    width: 500,     // 窗口宽度
    height: 750,    // 窗口高度
    heroType: 'default',  // 英雄飞机选择
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
   default: {id: '1', name: 'default', type: 'default', width: 105, height: 126, life: 1, image: 'me1.png', bulletType: 'default', price: 0},
   hero1: {id: '2', name: 'hero1', type: 'hero1', width: 120, height: 79, life: 1, image: 'hero1.png', bulletType: 'default', price: 500},
   hero2: {id: '3', name: 'hero2', type: 'hero2', width: 128, height: 128, life: 1, image: 'hero2.png', bulletType: 'mini', price: 1000},
   hero3: {id: '4', name: 'hero3', type: 'hero3', width: 128, height: 128, life: 1, image: 'hero3.png', bulletType: 'small', price: 1500},
   hero4: {id: '5', name: 'hero4', type: 'hero4', width: 128, height: 128, life: 1, image: 'hero4.png', bulletType: 'hot', price: 1200},
   hero5: {id: '6', name: 'hero5', type: 'hero5', width: 128, height: 128, life: 1, image: 'hero5.png', bulletType: 'large', price: 2000},
   hero6: {id: '7', name: 'hero6', type: 'hero6', width: 117, height: 94, life: 1, image: 'hero6.png', bulletType: 'dot', price: 2500},
   hero7: {id: '8', name: 'hero7', type: 'hero7', width: 100, height: 100, life: 1, image: 'hero7.png', bulletType: 'middle', price: 3000},
   hero8: {id: '9', name: 'hero8', type: 'hero8', width: 95, height: 89, life: 1, image: 'hero8.png', bulletType: 'big', price: 4000},
   hero10: {id: '10', name: 'hero10', type: 'hero10', width: 128, height: 128, life: 1, image: 'hero10.png', bulletType: 'hot', price: 5000},
   hero11: {id: '11', name: 'hero11', type: 'hero11', width: 120, height: 100, life: 1, image: 'hero11.png', bulletType: 'boss', price: 10000},
   mini: {id: '12', name: 'mini', type: 'mini', width: 39, height: 75, life: 1, image: 'hero-mini.png', bulletType: 'violet', price: 20000},
   boss: {id: '13', name: 'boss', type: 'boss', width: 128, height: 128, life: 2, image: 'hero9.png', bulletType: 'violet', price: 25000},
   boss2: {id: '14', name: 'boss2', type: 'boss2', width: 135, height: 131, life: 2, image: 'boss2.png', bulletType: 'large', price: 30000},
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
    image: heroList[currHero].image,
    haveHero: [1]
}

// 敌机配置
export const enemyConfig: any = {
    mini: {name: '小型', type: 'mini', w: 60, h: 43, life: 1, speed: 300, move: 2, maxMoveSpeed: 10, minMoveSpeed: 1, score: 1, image: 'dj11.png', audio: 'enemy-destroy1.mp3'},
    default: {name: '普通', type: 'default', w: 97, h: 75, life: 1, speed: 2000, move: 2, maxMoveSpeed: 50, minMoveSpeed: 30, score: 2, image: 'dj8.png', audio: 'enemy-destroy1.mp3'},
    yellow: {name: '黄色飞机', type: 'yellow', w: 103, h: 74, life: 2, speed: 3000, move: 2, maxMoveSpeed: 50, minMoveSpeed: 30, score: 3, image: 'dj7.png', audio: 'enemy-destroy1.mp3'},
    middle: {name: '中型', type: 'middle', w: 176, h: 120, life: 5, speed: 4000, move: 2, maxMoveSpeed: 60, minMoveSpeed: 30, score: 5, image: 'dj4.png', audio: 'enemy-destroy1.mp3'},
    large: {name: '大型', type: 'large', w: 180, h: 136, life: 10, speed: 8000, move: 2, maxMoveSpeed: 100, minMoveSpeed: 80, score: 10, image: 'dj10.png', audio: 'enemy-destroy1.mp3'},
    guided: {name: '导弹飞机', type: 'guided', w: 135, h: 98, life: 13, speed: 6000, move: 2, maxMoveSpeed: 100, minMoveSpeed: 80, score: 10, image: 'dj12.png', audio: 'enemy-destroy1.mp3'},
    boss: {name: 'boss', type: 'boss', w: 149, h: 86, life: 30, speed: 10000, move: 2, maxMoveSpeed: 350, minMoveSpeed: 250, score: 100, image: 'boss1.png', audio: 'enemy-destroy1.mp3'},
    girl: {name: 'girl', type: 'girl', w: 99, h: 97, life: 30, speed: 10000, move: 2, maxMoveSpeed: 350, minMoveSpeed: 250, score: 100, image: 'boss5.png', audio: 'enemy-destroy1.mp3'},
    copter: {name: '直升机', type: 'copter', w: 164/2, h: 98, life: 15, speed: 8000, move: 2, maxMoveSpeed: 250, minMoveSpeed: 150, score: 90, image: 'copter.png', audio: 'enemy-destroy1.mp3', sport: 1},
}
// 敌机销毁动画配置（须于敌机一起配置）
export const destroyConfig: any = {
    dot: {type: 'dot', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    mini: {type: 'mini', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    default: {type: 'default', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    small: {type: 'small', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    middle: {type: 'middle', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    large: {type: 'large', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    big: {type: 'big', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    boss: {type: 'boss', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    girl: {type: 'girl', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    yellow: {type: 'yellow', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    guided: {type: 'guided', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    copter: {type: 'copter', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
}

// 子弹配置
export const bulletConfig: any = {
   default: {name: '普通', type: 'default', w: 6, h: 12, life: 1, speed: 200, move: 2, audio: 'bullet-default1.mp3', image: ''},
   dot: {name: '圆弹', type: 'dot', w: 18, h: 18, life: 1.5, speed: 250, move: 2, audio: 'bullet-default1.mp3', image: 'bullet6.png'},
   small: {name: '细弹', type: 'small', w: 6, h: 12, life: 1.5, speed: 180, move: 2, audio: 'bullet-default1.mp3', image: 'bullet3.png'},
   mini: {name: '蓝弹', type: 'mini', w: 8, h: 15, life: 2, speed: 200, move: 2, audio: 'bullet-default1.mp3', image: 'bullet1.png'},
   middle: {name: '小火箭', type: 'middle', w: 14, h: 38, life: 2.5, speed: 300, move: 2, audio: 'bullet-default1.mp3', image: 'bullet7.png'},
   large: {name: '大火箭', type: 'large', w: 21, h: 59, life: 6, speed: 650, move: 2, audio: 'bullet-default1.mp3', image: 'bullet2.png'},
   big: {name: '红色双弹', type: 'big', w: 42, h: 50, life: 4, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet5.png'},
   boss: {name: '蓝色双弹', type: 'boss', w: 42, h: 50, life: 4, speed: 400, move: 2, audio: 'bullet-default1.mp3', image: 'bullet4.png'},
   hot: {name: '大火炮', type: 'hot', w: 30, h: 60, life: 5, speed: 500, move: 2, audio: 'bullet-default1.mp3', image: 'bullet8.png'},
   violet: {name: '紫色火炮', type: 'violet', w: 32, h: 64, life: 5, speed: 500, move: 2, audio: 'bullet-default1.mp3', image: 'bullet9.png'},
   violet2: {name: '紫色弹头', type: 'violet2', w: 18, h: 33, life: 3, speed: 300, move: 2, audio: 'bullet-default1.mp3', image: 'bullet10.png'},
   violet3: {name: '紫色三炮', type: 'violet3', w: 50, h: 50, life: 10, speed: 550, move: 2, audio: 'bullet-default1.mp3', image: 'bullet11.png'},
   rocket: {name: '绿色火箭', type: 'rocket', w: 32, h: 64, life: 10, speed: 550, move: 2, audio: 'bullet-default1.mp3', image: 'bullet12.png'},
}



// 道具包配置
export const propConfig: any = {
    prop1: {type: 'prop1', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop1.png', audio: 'prop2-use.mp3', bgSize: '300px',},
    prop2: {type: 'prop2', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop2.png', audio: 'prop2-use.mp3', bgSize: '300px',},
    prop3: {type: 'prop3', w: 150, h: 300, life: 20, speed: 500, move: 2, moveSpeed: 0, image: 'prop3.png', audio: 'prop2-use.mp3', bgSize: '300px',},
}