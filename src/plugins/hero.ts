import {heroConfig, heroList, config } from "./config";

export class Hero {
    lastTime: number = new Date().getTime();
    heroConfig: any;
    createHero() {
        // 获取飞机
        let hero = heroList[config.heroType];
        const heroObj = {
            ...hero,
            baseLife: 1,
            speed: 10,
            x: (config.width / 2) - 50,
            y: config.height - 100,
        }
        this.heroConfig = Object.assign(heroConfig, heroObj)
        return this.heroConfig
    }
}