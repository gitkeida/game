import {config, bulletConfig, heroConfig} from './config'

export class Bullet {
    id: number = 0;
    lastTime: number = new Date().getTime();
    speed: number = bulletConfig[heroConfig.bulletType].speed

    createBullet() {
        let nowTime = +new Date();
        if (nowTime - this.lastTime > this.speed) {
            this.id++;
            let bullet = bulletConfig[heroConfig.bulletType];
            let bulletObj = {
                ...bullet,
                y: heroConfig.y - bullet.h,
                x: heroConfig.x + (heroConfig.width / 2) - (bullet.w / 2),
                id: this.id,
            }
            this.lastTime = nowTime;
            return bulletObj;
        }
        return null;
    }

}

