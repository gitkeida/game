import { propConfig, heroConfig, config, bulletConfig } from "./config";

export class Prop {
    id: number = 0;
    speed: number = 10000
    lastTime: number = new Date().getTime();
    RandomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 生成道具包
    createPropBag() {
        let nowTime = +new Date();
        if (nowTime - this.lastTime > this.speed) {
            this.id++;
            let propBagType = this.getPropBagType();
            // 生成道具包（是道具包，不是道具，要拾到道具包才有道具）
            let propObj = {
                w: 50,
                h: 50,
                type: propBagType.type,   // prop | bullet | life
                name: propBagType.name,
                image: propBagType.image,
                audio: 'bullet-default1.mp3',
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

    getPropBagType() {
        const num = this.RandomNum(1, 100);
        const propKeys = Object.keys(propConfig);
        const bulletKeys = Object.keys(bulletConfig);

        if (num > 95) {
            return {type: 'life', image: 'heart.png', name: 'life'}
        } else if (num > 60) {
            return {type: 'prop', image: 'propBag1.png', name: propKeys[this.RandomNum(0,propKeys.length-1)]}
        } else {
            return {type: 'bullet', image: 'propBag4.png', name: bulletKeys[this.RandomNum(0,bulletKeys.length-1)]}
        }
    }

    // 获取道具
    getProp(propBag: any) {
        switch(propBag.type) {
            case 'prop':
                let prop = propConfig[propBag.name];
                let propObj = {
                    ...prop,
                    id: propBag.id,
                    y: config.height,
                    x: heroConfig.x + (heroConfig.width / 2) - (prop.w / 2),
                    lastTime: propBag.lastTime,
                    bgPosition: 'center',   // 背景定位
                }
                return propObj;
            case 'bullet':
                heroConfig.bulletType = propBag.name;
                break;
            case 'life':
                heroConfig.life++;
                break;
        }
        return null;
    }

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
    
    // 道具移动
    moveProp(prop: any) {
        let nowTime = +new Date();
        if (nowTime - prop.lastTime > prop.moveSpeed)  {
            prop.y -= prop.move;
            prop.lastTime = nowTime
        }
        return prop
    }   
}