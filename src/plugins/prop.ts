import { propConfig, heroConfig, config } from "./config";

export class Prop {
    id: number = 0;
    speed: number = propConfig.prop2.speed
    lastTime: number = new Date().getTime();
    RandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 生成道具包
    createPropBag() {
        let nowTime = +new Date();
        if (nowTime - this.lastTime > this.speed) {
            this.id++;
            // 生成道具包（是道具包，不是道具，要拾到道具包才有道具）
            let propObj = {
                w: 50,
                h: 50,
                type: 'prop2',
                image: 'prop1.png',
                y: this.RandomNum(0 - 50, -50 - 50),
                x: this.RandomNum(0, config.width - 50),
                moveSpeed: this.RandomNum(30, 50),
                move: 2,
                id: this.id,
                lastTime: nowTime,
                bgPosition: 'center',   // 背景定位
                get: false,             // 拾到道具
            }
            propObj.moveSpeed = propObj.moveSpeed - (propObj.moveSpeed * (Math.acosh(config.score||1)/10));

            this.lastTime = nowTime;
            return propObj;
        }
        return null;
    }

    // 获取道具
    getProp() {}

    // 使用道具
    useProp() {
        
    }

    // 道具包移动
    movePropBag(propBag: any) {
        let nowTime = +new Date();
        if (nowTime - propBag.lastTime > propBag.moveSpeed)  {
            if (!propBag.get) {
                propBag.y += propBag.move;
            }
            propBag.lastTime = nowTime
        }
        return propBag
    }   
}