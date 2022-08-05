import {config, bulletConfig, heroConfig} from './config'

export class Bullet {
    id: number = 0;
    lastTime: number = new Date().getTime();
    // 生成子弹的时间间距，越小则越快
    speed: number = bulletConfig[heroConfig.bulletType].speed

    // 创建子弹
    createBullet() {
        let nowTime = +new Date();
        if (nowTime - this.lastTime > this.speed) {
            let bullet = bulletConfig[heroConfig.bulletType];
            this.id++;
            this.speed = bullet.speed;
            let bulletObj = {
                ...bullet,
                y: heroConfig.y - bullet.h,
                x: heroConfig.x + (heroConfig.width / 2) - (bullet.w / 2),
                id: this.id,
                lastTime: nowTime,
                moveSpeed: 1,           // 子弹移动时间间距
                bgPosition: 'center',   // 背景定位
            }
            this.lastTime = nowTime;
            return bulletObj;
        }
        return null;
    }

    // 子弹移动
    moveBullet(bullet: any) {
        let nowTime = +new Date();
        if (nowTime - bullet.lastTime > bullet.moveSpeed)  {
            bullet.y -= bullet.move;
            bullet.lastTime = nowTime
        }
        return bullet
    }   

}

