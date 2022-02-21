import {config, enemyConfig, heroConfig, destroyConfig} from './config'

export class Enemy {
    id: number = 0;
    lastTime: number = new Date().getTime();
    speed: number = enemyConfig.default.speed
    RandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    

    createEnemy() {
        let nowTime = +new Date();
        if (nowTime - this.lastTime > this.speed) {
            // 随机获取敌机
            let enemy = enemyConfig[this.getEnemyType()];
            // 下一台飞机生成速度，分数越高速度越快
            this.speed = enemy.speed - (enemy.speed * (Math.acosh(config.score||1)/10));
            this.id++;
            let enemyObj = {
                ...enemy,
                y: this.RandomNum(0 - enemy.h, -enemy.h - 50),
                x: this.RandomNum(0, config.width - enemy.w),
                moveSpeed: this.RandomNum(enemy.minMoveSpeed, enemy.maxMoveSpeed),
                id: this.id,
                lastTime: nowTime,
                destroy: false,     // 是否销毁
                destroying: 0,      // 销毁中
                bgPosition: 'center',   // 背景定位
            }
            // 分数越高速度越快
            enemyObj.moveSpeed = enemyObj.moveSpeed - (enemyObj.moveSpeed * (Math.acosh(config.score||1)/10));
            // 难度
            enemyObj.moveSpeed = config.difficuity === 1 ? enemyObj.moveSpeed : (enemyObj.moveSpeed / config.difficuity - (enemyObj.moveSpeed / config.difficuity * (config.difficuity - 1)))
            enemyObj.life = Math.ceil(enemy.life * config.difficuity);
            
            this.lastTime = nowTime;
            return enemyObj;
        }
        return null;
    }

    moveEnemy(enemy: any) {
        let nowTime = +new Date();
        if (nowTime - enemy.lastTime > enemy.moveSpeed)  {
            if (enemy.life > 0) {
                enemy.y += enemy.move;
            } else {
                let destroyObj = destroyConfig[enemy.type];
                enemy.moveSpeed = destroyObj.speed; 
                if (enemy.destroying < destroyObj.life) {
                    enemy.image = destroyObj.image;
                    enemy.destroying++;
                    let centerSite = this.computeCenter(enemy, destroyObj);
                    enemy.x = enemy.w > destroyObj.w ? enemy.x + centerSite.x : enemy.w < destroyObj.w ? enemy.x - centerSite.x : enemy.x;
                    enemy.y = enemy.h > destroyObj.h ? enemy.y + centerSite.y : enemy.h < destroyObj.h ? enemy.y - centerSite.y : enemy.y;
                    enemy.w = destroyObj.w
                    enemy.h = destroyObj.h
                    enemy.bgPosition = -enemy.w * (enemy.destroying - 1) + 'px 0px';
                } else {
                    enemy.destroy = true;
                }
            }
            enemy.lastTime = nowTime
        }
        return enemy
    }

    // 计算两个box中心点的距离
    computeCenter(box1: any, box2:any) {
        let cx1 = box1.w / 2,
            cy1 = box1.h / 2,
            cx2 = box2.w / 2,
            cy2 = box2.h / 2;
        return {
            x: Math.abs(cx1 - cx2),
            y: Math.abs(cy1 - cy2)
        }
    }

    getEnemyType() {
        const num = this.RandomNum(1, 100);
        if (num < 15) {
            return 'mini'
        } else if (num < 70) {
            return 'default'
        } else if (num < 88) {
            return 'middle'
        } else if (num < 98) {
            return 'large'
        } else if (num <= 100) {
            return 'boss'
        } else {
            return 'default'
        }
    }

    
}

