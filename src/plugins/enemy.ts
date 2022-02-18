import {config, enemyConfig, heroConfig} from './config'

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
            enemy.y += enemy.move;
            enemy.lastTime = nowTime
        }
        return enemy
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

