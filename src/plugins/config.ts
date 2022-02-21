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
    mini: {name: '小型', type: 'mini', w: 60, h: 43, life: 1, speed: 300, move: 2, maxMoveSpeed: 10, minMoveSpeed: 1, score: 1, image: 'dj11.png', audio: 'enemy-destroy1.mp3'},
    default: {name: '普通', type: 'default', w: 97, h: 75, life: 1, speed: 2000, move: 2, maxMoveSpeed: 50, minMoveSpeed: 30, score: 2, image: 'dj8.png', audio: 'enemy-destroy1.mp3'},
    middle: {name: '中型', type: 'middle', w: 197, h: 134, life: 5, speed: 4000, move: 2, maxMoveSpeed: 60, minMoveSpeed: 30, score: 5, image: 'dj4.png', audio: 'enemy-destroy1.mp3'},
    large: {name: '大型', type: 'large', w: 200, h: 200, life: 10, speed: 8000, move: 2, maxMoveSpeed: 90, minMoveSpeed: 70, score: 10, image: 'dj10.png', audio: 'enemy-destroy1.mp3'},
    boss: {name: 'boss', type: 'boss', w: 149, h: 86, life: 30, speed: 10000, move: 2, maxMoveSpeed: 300, minMoveSpeed: 200, score: 100, image: 'boss1.png', audio: 'enemy-destroy1.mp3'},
}

export const bulletConfig: any = {
   default: {name: '普通', type: 'default', w: 6, h: 12, life: 1, speed: 300, move: 2, audio: 'bullet-default1.mp3'},
   middle: {name: '中型', type: 'middle', w: 10, h: 15, life: 2, speed: 300, move: 2, audio: 'bullet-default1.mp3'},
   large: {name: '大型', type: 'large', w: 15, h: 18, life: 3, speed: 300, move: 2, audio: 'bullet-default1.mp3'},
   boss: {name: 'boss', type: 'boss', w: 30, h: 26, life: 4, speed: 300, move: 2, audio: 'bullet-default1.mp3'},
}

export const destroyConfig: any = {
    mini: {type: 'mini', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    default: {type: 'default', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    middle: {type: 'middle', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    large: {type: 'large', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
    boss: {type: 'boss', w: 97, h: 85, life: 6, speed: 100, image: 'destroy2.png'},
}
