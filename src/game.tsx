import React, { Ref } from "react";
// import { clearInterval } from "timers";
import './game.css'
import {heroConfig, bgConfig, config, propConfig} from './plugins/config'
import { Hero } from "./plugins/hero";
import { Bullet } from './plugins/bullet'
import { Enemy } from './plugins/enemy'
import { Prop } from './plugins/prop'

interface IState {
    enemyList: Array<any>       // 敌机列表
    bulletList: Array<any>      // 子弹列表
    propBagList: Array<any>     // 道具包列表（道具包里装有道具，拾到则propList添加一条数据）
    propList: Array<any>        // 道具列表
    propView: Array<any>        // 使用道具时的列表
    status: number
    score: number
    countDown: number
    hero: any
    bg: any
    timer: any
}

const ref: any = React.createRef();

const START = 0
const STARTING = 1
const RUNNING = 2
const PAUSE = 3
const END = 4

export default class Game extends React.Component<any, IState> {

    djID: number = 0;
    zdID: number = 0;
    djType: Array<any> = [
        {name: '普通', type: 'default', w: 80, h: 80, life: 1},
    ]
    zdType: Array<any> = [
        {name: '普通', type: 'default', w: 6, h: 12, atk: 1}
    ]
    timer: any;
    lasttime: number = new Date().getTime()

    hero: any
    bullet: any;
    enemy: any;
    prop: any;
    constructor(props: any) {
        super(props)

        this.hero = new Hero();
        this.bullet = new Bullet();
        this.enemy = new Enemy();
        this.prop = new Prop();
        this.handle = this.handle.bind(this);
        this.audioPlay = this.audioPlay.bind(this);
        this.start = this.start.bind(this);
        this.renderMenu = this.renderMenu.bind(this);


        this.state = {
            timer: null,
            status: 0,
            countDown: 3,
            score: 0,
            hero: this.hero.createHero(),
            bg: bgConfig,
            enemyList: [],
            bulletList: [],
            propBagList: [],
            propList: [],
            propView: []
        }


    }
    
    componentDidMount() {
        // 开始启动
        this.init();
        this.start();
    }

    // 初始化
    init() {
        
        // 为main绑定鼠标移动事件
        let main = ref.current;
        main.addEventListener("mousemove", (ev: any) => {
            if (this.state.status === RUNNING) {
                let x = ev.pageX;
                let y = ev.pageY;
                let hero = this.state.hero;
                hero.x = x - (hero.width / 2) - main.offsetLeft;
                hero.y = y - (hero.height / 2) - main.offsetTop;
                this.setState({hero: hero})
            }
        })
        // 为canvas绑定鼠标移开事件
        main.addEventListener("mouseleave", (ev: any) => {
            if (this.state.status === RUNNING) {
                this.setState({status: PAUSE})
            }
        })
        // 为canvas绑定鼠标进入事件
        main.addEventListener("mouseenter", (ev: any) => {
            if (this.state.status === PAUSE) {
                this.setState({status: RUNNING})
            }
        })

    }

    // 背景移动
    moveBg() {
        const {bg,status} = this.state;
        bg.lastTime = bg.lastTime || +new Date();
        let nowTime = +new Date();
        if (nowTime - bg.lastTime > bg.speed) {
            // 分数越高速度越快
            // bg.speed = status === RUNNING ? bg.speed - (bg.speed * (Math.acosh(config.score||1)/10)) : bg.speed;
            bg.y--;
            if (Math.abs(bg.y) >= config.height) {
                bg.y = 0;
                bg.speed-=1;
            }
            bg.lastTime = nowTime;
            this.setState({bg})
        }
    }

    // 创建组件，子弹、敌机、道具包
    createComponent() {
        let bullet = this.bullet.createBullet();
        if (bullet) {
            this.state.bulletList.push(bullet);
            this.setState({bulletList: this.state.bulletList})
        }
        let enemy = this.enemy.createEnemy();
        if (enemy) {
            this.state.enemyList.push(enemy);
            this.setState({enemyList: this.state.enemyList})
        }
        let propBag = this.prop.createPropBag();
        if (propBag) {
            this.state.propBagList.push(propBag);
            this.setState({propBagList: this.state.propBagList})
        }
    }

    // 移动组件，子弹和敌人
    moveComponent() {
        let {bulletList,enemyList,propBagList} = this.state;
        
        for(let i=0;i<bulletList.length;i++) {
            bulletList[i].y-=bulletList[i].move;
        }
        for(let i=0;i<enemyList.length;i++) {
            enemyList[i] = this.enemy.moveEnemy(enemyList[i])
        }
        for(let i=0;i<propBagList.length;i++) {
            propBagList[i] = this.prop.movePropBag(propBagList[i])
        }
        this.setState({bulletList,enemyList,propBagList})
    }

    // 移除组件，子弹和敌人
    removeComponent() {
        let {bulletList,enemyList} = this.state;
        for(let i=0;i<bulletList.length;i++) {
            if (bulletList[i].y < 0 + bulletList[i].h) {
                bulletList.splice(i,1);
            }
        }
        for(let i=0;i<enemyList.length;i++) {
            if (enemyList[i].y > config.height + enemyList[i].h) {
                enemyList.splice(i,1);
            }
        }
        this.setState({bulletList,enemyList})
    }

    // 检测组件碰撞, 子弹和敌人
    checkComponent() {
        let {bulletList,enemyList} = this.state;
        for(let j=0;j<bulletList.length;j++) {
            for(let i=0;i<enemyList.length;i++) {
                let enemySite = {x: enemyList[i].x + enemyList[i].w/2, y: enemyList[i].y + enemyList[i].h/2}
                let bulletSite = {x: bulletList[j].x + bulletList[j].w/2, y: bulletList[j].y + bulletList[j].h/2}

                let absY = Math.abs(enemySite.y - bulletSite.y);
                let absX = Math.abs(enemySite.x - bulletSite.x);
                let sumH = (enemyList[i].h + bulletList[j].h) / 2;
                let sumW = (enemyList[i].w + bulletList[j].w) / 2;

                if (absY < sumH && absX < sumW) {
                    // 保存子弹的攻击力，如果敌机生命值大于0，则受到子弹的攻击，同时销毁子弹
                    let bulletLife = bulletList[j].life;
                    enemyList[i].life > 0 && bulletList.splice(j,1);
                    enemyList[i].life > 0 && (enemyList[i].life -= bulletLife);
                    // 如果敌机生命值小于等于0，则计算分数（只计算一次）
                    if (enemyList[i].life <= 0) {
                        if (enemyList[i].destroying === 0) {
                            config.score+= enemyList[i].score;
                            this.setState({score: this.state.score + enemyList[i].score})
                        }
                    }
                }
                // 如果敌机已经销毁，则移除它
                if (enemyList[i].destroy) {
                    enemyList.splice(i,1);
                }
            }
        }
        this.setState({bulletList,enemyList})
    }

    // 检测飞机与敌机相撞
    checkHero() {
        let {enemyList, hero} = this.state;
        for(let i=0;i<enemyList.length; i++) {
            let enemySite = {x: enemyList[i].x + enemyList[i].w/2, y: enemyList[i].y + enemyList[i].h/2}
            let bulletSite = {x: hero.x + hero.width/2, y: hero.y + hero.height/2}

            let absY = Math.abs(enemySite.y - bulletSite.y);
            let absX = Math.abs(enemySite.x - bulletSite.x);
            let sumH = (enemyList[i].h + hero.height) / 2;
            let sumW = (enemyList[i].w + hero.width) / 2;

            // 如果敌机没有被销毁，且与我方飞机相撞则扣除我方飞机一滴血，同时销毁敌方飞机
            if (absY < sumH && absX < sumW && enemyList[i].destroying === 0) {
                config.score+= enemyList[i].score;
                this.setState({score: this.state.score + enemyList[i].score})
                hero.life -= 1;
                enemyList.splice(i,1);
                // 我方飞机没有血量，游戏结束
                if (hero.life <= 0) {
                    this.setState({status: END});
                }
            }
    
        }
    }

    // 检测飞机与道具包相碰
    checkPropBag() {
        let {propBagList, hero} = this.state;
        for(let i=0;i<propBagList.length; i++) {
            let enemySite = {x: propBagList[i].x + propBagList[i].w/2, y: propBagList[i].y + propBagList[i].h/2}
            let bulletSite = {x: hero.x + hero.width/2, y: hero.y + hero.height/2}

            let absY = Math.abs(enemySite.y - bulletSite.y);
            let absX = Math.abs(enemySite.x - bulletSite.x);
            let sumH = (propBagList[i].h + hero.height) / 2;
            let sumW = (propBagList[i].w + hero.width) / 2;

            // 如果敌机没有被销毁，且与我方飞机相撞则扣除我方飞机一滴血，同时销毁敌方飞机
            if (absY < sumH && absX < sumW) {
                this.state.propList.push(propBagList[i]);
                propBagList.splice(i,1);
            }
    
        }        
    }

    // 开始
    start() {
        let timer = setInterval(() => {
            switch(this.state.status) {
                case START:
                    this.moveBg();
                    let {hero} = this.state;
                    hero.life = 0;
                    hero.t = config.height - hero.height;
                    hero.x = (config.width / 2) - (hero.width / 2)
                    this.setState({hero})
                    break;
                case STARTING:
                    this.moveBg();
                    config.score = 0;
                    this.setState({hero: this.hero.createHero(), score: 0})
                    // 倒计时
                    const currentTime = new Date().getTime();
                    if((currentTime - this.lasttime) > 1000){
                        this.setState({countDown: this.state.countDown - 1})
                        // 进入运行状态
                        if(this.state.countDown === 0){
                            this.setState({status: RUNNING})
                        }
                        this.lasttime = currentTime;
                    }
                    break;
                case RUNNING:
                    this.moveBg();
                    this.createComponent();
                    this.moveComponent();
                    this.removeComponent();
                    this.checkComponent();
                    this.checkHero();
                    break;
                case END:
                    this.moveBg();
                    this.setState({
                        enemyList: [],
                        bulletList: []
                    })
                    break;
            }
        },10)

        this.setState({timer})
    }

    handle(type: string) {
        switch(type) {
            case 'default':
            case 'hard':
            case 'bug':
                switch(type) {
                    case 'default':
                        config.difficuity = 1;
                        break;
                    case 'hard':
                        config.difficuity = 1.4;
                        break;
                    case 'bug':
                        config.difficuity = 1.6;
                        break;
                }
                this.setState({status: STARTING,countDown: 3})
                break;
            case 'restart':
                this.setState({status: START})
                break;

        }
    }

    // 设置播放声音
    audioPlay(e: any) {
        // 设置播放声音0~1
        e.target.volume = 0.03;
    }

    renderMenu(status: number) {
        switch(status) {
            case START:
                return (
                    <div className="menu">
                        <button className="menu-item" onClick={() => this.handle('default')}>普通</button>
                        <button className="menu-item" onClick={() => this.handle('hard')}>困难</button>
                        <button className="menu-item" onClick={() => this.handle('bug')}>炼狱</button>
                    </div>
                )
            case STARTING:
                return (
                    <div className="countDown">{this.state.countDown}</div>
                )
            case RUNNING:
            case PAUSE:
                return (
                    <>
                    <div className="menu-bar">
                        <span>score: {this.state.score}</span>
                        <span>life: {this.state.hero.life}</span>
                    </div>

                    <div className="prop-box" onClick={() => this.handle('prop')} style={{
                        background: 'url('+require('./image/prop1.png')+') center no-repeat',
                    }}></div>
                    </>
                )
            case END:
                return (
                    <div className="gameover">
                        <h2 className="title">Game Over</h2>
                        <p className="score">您的分数是：{this.state.score}</p>
                        <div className="gameover-menu">
                            <button className="menu-item" onClick={() => this.handle('restart')}>重新开始</button>
                            <button className="menu-item" onClick={() => this.handle('restart')}>返回菜单</button>
                            <button className="menu-item" onClick={() => this.handle('restart')}>退出重来</button>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }


    render(): React.ReactNode {
        const {status, hero, bg } = this.state

        return (
            <div>
                <div className="container" style={{width: '100%'}}>

                    <div className="test">
                        <div className="box"></div>
                    </div>
                    <div className="main" style={{
                        width: config.width + 'px',
                        height: config.height + 'px',
                        cursor: status === RUNNING ? 'none' : 'default'
                        }} ref={ref}>
                        {/* 背景 */}
                        <div className="bg-box">
                            <div className="bg" style={{bottom: bg.y+'px'}}>
                                <audio src={require('./audio/bullet-default1.mp3')}></audio>

                                {[0,1].map((i: any) => <div className="bg-item" key={i} style={{
                                    width: config.width + 'px', 
                                    height: config.height + 'px',
                                    background: 'url('+require('./image/'+bg.image)+') center no-repeat'
                                    }}></div>)}
                            </div>
                        </div>

                        <div className="main-box">
                        {/* 敌机 */}
                        {this.state.enemyList.map((item: any) => 
                            <div className={"dj"} style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: 'url('+require('./image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    {item.destroying > 0 ? 
                                        <audio src={require('./audio/'+item.audio)} autoPlay></audio>
                                        : null
                                    }
                                    {/* {item.life} */}
                                </div>)}

                        {/* 道具包 */}
                        {this.state.propBagList.map((item: any) => 
                            <div className={"prop-bag"} style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: 'url('+require('./image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    {item.destroying > 0 ? 
                                        <audio src={require('./audio/'+item.audio)} autoPlay></audio>
                                        : null
                                    }
                                    {/* {item.life} */}
                                </div>)}

                        {/* 子弹 */}
                        {this.state.bulletList.map((item: any) => 
                            <span className="zd" style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: item.type === 'default' ? '#fff' : 'url('+require('./image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    <audio src={require('./audio/'+item.audio)} onCanPlay={(e) => this.audioPlay(e)} autoPlay></audio>
                                </span>)}
                        
                        {/* 主机 */}
                        {hero.life > 0 ? 
                            <div className="fj" style={{
                                width: hero.width + 'px',
                                height: hero.height + 'px', 
                                left: hero.x + 'px', 
                                top: hero.y + 'px',
                                background: 'url('+require('./image/'+hero.image)+') center no-repeat',
                                }}></div> :
                            ''}


                        
                        {/* 菜单 */}
                        {this.renderMenu(status)}
                        </div>

                    </div>
                </div>

            </div>
        )
    }

}