export const config = {
    statue: 0,      // 游戏状态
    difficuity: 1,  // 难度
    score: 0,       // 积分
    width: 500,
    height: 750,
}

export const bgConfig: any = {
    width: config.width,
    height: config.height,
    image: 'bg2.jpg',
    speed: 100,
    y: 0,
}

export const heroList = [
    {width: 105, height: 126, image: 'me1.png'},
    {width: 120, height: 79, image: 'hero1.png'},
]

const currHero = 1;

export const heroConfig = {
    baseLife: 1,
    life: 0,
    width: heroList[currHero].width,
    height: heroList[currHero].height,
    speed: 10,
    x: (config.width / 2) - 50,
    y: config.height - 100,
    bulletType: 'default',
    image: heroList[currHero].image
}

export const enemyConfig: any = {
    mini: {name: '小型', type: 'mini', w: 40, h: 40, life: 1, speed: 300, move: 2, maxMoveSpeed: 10, minMoveSpeed: 1, score: 1, image: 'enemy1.png'},
    default: {name: '普通', type: 'default', w: 57, h: 43, life: 1, speed: 2000, move: 2, maxMoveSpeed: 50, minMoveSpeed: 30, score: 1, image: 'dj1.png'},
    middle: {name: '中型', type: 'middle', w: 69, h: 99, life: 5, speed: 4000, move: 2, maxMoveSpeed: 60, minMoveSpeed: 30, score: 5, image: 'dj2.png'},
    large: {name: '大型', type: 'large', w: 169, h: 258, life: 10, speed: 8000, move: 2, maxMoveSpeed: 90, minMoveSpeed: 70, score: 10, image: 'dj3.png'},
    boss: {name: 'boss', type: 'boss', w: 250, h: 300, life: 30, speed: 10000, move: 2, maxMoveSpeed: 300, minMoveSpeed: 200, score: 100, image: 'enemy3_n2.png'},
}

export const bulletConfig: any = {
   default: {name: '普通', type: 'default', w: 6, h: 12, life: 1, speed: 300, move: 2},
   middle: {name: '中型', type: 'middle', w: 10, h: 15, life: 2, speed: 300, move: 2},
   large: {name: '大型', type: 'large', w: 15, h: 18, life: 3, speed: 300, move: 2},
   boss: {name: 'boss', type: 'boss', w: 30, h: 26, life: 4, speed: 300, move: 2},
}


