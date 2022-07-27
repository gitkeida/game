import React, { Ref } from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import './game.css'
import {heroConfig, bgConfig, config, propConfig, heroList} from '../../plugins/config'
import { Hero } from "../../plugins/hero";
import { Bullet } from '../../plugins/bullet'
import { Enemy } from '../../plugins/enemy'
import { Prop } from '../../plugins/prop';
import { useNavigate, Navigate, NavLink  } from 'react-router-dom'

interface IState {
    heroList: Array<any>        // 飞机列表
    enemyList: Array<any>       // 敌机列表
    bulletList: Array<any>      // 子弹列表
    propBagList: Array<any>     // 道具包列表（道具包里装有道具，拾到则propList添加一条数据）
    propList: Array<any>        // 道具生成时的列表
    propView: Array<any>        // 使用道具时的列表
    status: number              // 游戏状态
    score: number               // 得分
    countDown: number           // 倒计时
    hero: any                   // 英雄飞机
    bg: any                     // 背景配置
    timer: any                  // 定时器
    heroName: string            // 所使用的英雄飞机
}

const ref: any = React.createRef();

const START = 0
const READY = 1
const STARTING = 2
const RUNNING = 3
const PAUSE = 4
const END = 5

export default class Game extends React.Component<any, IState> {

    lasttime: number = new Date().getTime()

    hero: any
    bullet: any;
    enemy: any;
    prop: any;
    constructor(props: any) {
        super(props)

        // 初始化实例
        this.hero = new Hero();
        this.bullet = new Bullet();
        this.enemy = new Enemy();
        this.prop = new Prop();
        this.handle = this.handle.bind(this);
        this.audioPlay = this.audioPlay.bind(this);
        this.start = this.start.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        
        // 初始化数据
        this.state = {
            timer: null,
            status: START,
            countDown: 3,
            score: 0,
            hero: this.hero.createHero(),
            heroName: config.heroType,
            bg: bgConfig,
            heroList: Object.keys(heroList).map((key: string) => heroList[key]),
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
        // 为main绑定鼠标移开事件
        main.addEventListener("mouseleave", (ev: any) => {
            if (this.state.status === RUNNING) {
                this.setState({status: PAUSE})
            }
        })
        // 为main绑定鼠标进入事件
        main.addEventListener("mouseenter", (ev: any) => {
            if (this.state.status === PAUSE) {
                this.setState({status: RUNNING})
            }
        })

        // 监听按键，使用道具
        document.body.addEventListener('keyup',(ev: any) => {
            if (this.state.status === RUNNING) {
                if (ev.keyCode === 32) {
                    this.handle('useProp');
                }
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
            bg.speed = status === RUNNING ? 100 - (100 * (Math.acosh(config.score-50 > 0 ? config.score-50 : 1)/10)) : bg.speed;
            console.log(bg.speed)
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

    // 移动组件，子弹、敌人、道具包、道具
    moveComponent() {
        let {bulletList,enemyList,propBagList,propView} = this.state;
        
        for(let i=0;i<bulletList.length;i++) {
            bulletList[i] = this.bullet.moveBullet(bulletList[i])
        }
        for(let i=0;i<enemyList.length;i++) {
            enemyList[i] = this.enemy.moveEnemy(enemyList[i])
        }
        for(let i=0;i<propBagList.length;i++) {
            propBagList[i] = this.prop.movePropBag(propBagList[i])
        }
        for(let i=0;i<propView.length;i++) {
            propView[i] = this.prop.moveProp(propView[i])
        }
        this.setState({bulletList,enemyList,propBagList,propView})
    }

    // 移除组件，子弹、敌人、道具包、道具
    removeComponent() {
        let {bulletList,enemyList,propBagList,propView} = this.state;
        for(let i=0;i<bulletList.length;i++) {
            if (bulletList[i].y < 0 - bulletList[i].h) {
                bulletList.splice(i,1);
            }
        }
        for(let i=0;i<enemyList.length;i++) {
            if (enemyList[i].y > config.height + enemyList[i].h) {
                enemyList.splice(i,1);
            }
        }
        for(let i=0;i<propBagList.length;i++) {
            if (propBagList[i].y > config.height + propBagList[i].h) {
                propBagList.splice(i,1);
            }
        }
        for(let i=0;i<propView.length;i++) {
            if (propView[i].y < 0 - propView[i].h) {
                propView.splice(i,1);
            }
        }
        this.setState({bulletList,enemyList,propBagList,propView})
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
                enemyList[i].life = 0;
                // 如果敌机已经销毁，则移除它
                if (enemyList[i].destroy) {
                    enemyList.splice(i,1);
                }
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

            // 拾取道具包
            if (absY < sumH && absX < sumW && !propBagList[i].get) {
                let isProp = this.prop.getProp(propBagList[i])
                isProp && this.state.propList.push(isProp);
                // 不要马上销毁，要播放音效，让它下次循环销毁或者自动销毁
                propBagList[i].get = true;
            }
    
        }        
        this.setState({propBagList})
    }

    // 检测组件碰撞, 道具和敌人
    checkPropEnemy() {
        let {propView,enemyList} = this.state;
        for(let j=0;j<propView.length;j++) {
            for(let i=0;i<enemyList.length;i++) {
                let enemySite = {x: enemyList[i].x + enemyList[i].w/2, y: enemyList[i].y + enemyList[i].h/2}
                let bulletSite = {x: propView[j].x + propView[j].w/2, y: propView[j].y + propView[j].h/2}

                let absY = Math.abs(enemySite.y - bulletSite.y);
                let absX = Math.abs(enemySite.x - bulletSite.x);
                let sumH = (enemyList[i].h + propView[j].h) / 2;
                let sumW = (enemyList[i].w + propView[j].w) / 2;

                if (absY < sumH && absX < sumW && enemyList[i].destroying === 0) {
                    // 保存子弹的攻击力，如果敌机生命值大于0，则受到子弹的攻击，同时销毁子弹
                    let propLife = propView[j].life;
                    // enemyList[i].life > 0 && propView.splice(j,1);
                    enemyList[i].life > 0 && (enemyList[i].life -= propLife);
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
        this.setState({propView,enemyList})
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
                    this.checkPropEnemy();
                    this.checkHero();
                    this.checkPropBag();
                    break;
                case END:
                    this.moveBg();
                    this.setState({
                        countDown: 3,
                        enemyList: [],
                        bulletList: [],
                        propList: [],
                        propBagList: [],
                        propView: [],
                    })
                    break;
            }
        },5)

        this.setState({timer})
    }

    // 操作
    handle(type: string, value?: any) {
        switch(type) {
            case 'default':
                config.difficuity = 1;
                this.setState({status: READY,countDown: 3})
                break;
            case 'hard':
                config.difficuity = 1.4;
                this.setState({status: READY,countDown: 3})
                break;
            case 'bug':
                config.difficuity = 1.6;
                this.setState({status: READY,countDown: 3})
                break;
            case 'heroSelect':
                config.heroType = this.state.heroList[value].name;
                this.setState({heroName: config.heroType})
                break;
            case 'start':
                this.setState({status: STARTING})
                break;
            case 'restart':
                this.setState({status: START})
                break;
            case 'useProp':
                let prop = this.state.propList.shift();
                if (prop) {
                    prop.x = this.state.hero.x;
                    this.state.propView.push(prop);
                    this.setState({
                        propList: this.state.propList,
                        propView: this.state.propView
                    })
                }
              
                break;
            case 'back':
                // let navigate = useNavigate();
                // navigate('/');
                // Navigate({to: '/'})
                console.log(this.props)
                clearInterval(this.state.timer)
                this.setState({timer: null})
                // this.props.navigate('/')
                break;
        }
    }

    // 设置播放声音
    audioPlay(e: any) {
        // 设置播放声音0~1
        e.target.volume = 0.03;
    }

    // 根据状态渲染菜单
    renderMenu(status: number) {
        switch(status) {
            case START:
                return (
                    <div className="menu">
                        <button className="menu-item" onClick={() => this.handle('default')}>普通</button>
                        <button className="menu-item" onClick={() => this.handle('hard')}>困难</button>
                        <button className="menu-item" onClick={() => this.handle('bug')}>炼狱</button>
                        {/* <NavLink to="/">
                            <button className="menu-item" onClick={() => this.handle('back')}>返回</button>
                        </NavLink> */}
                    </div>
                )
            case READY:
                return (
                    <div className="hero-select">
                        <div className="hero-select-list">
                            <Swiper
                                className="hero-select-swiper"
                                loop={true}
                                effect={'coverflow'}
                                centeredSlides={true}
                                // spaceBetween={50}
                                slidesPerView={3}
                                onSlideChange={(e) => this.handle('heroSelect', e.realIndex)}
                                onSwiper={(e) => this.handle('heroSelect', e.realIndex)}
                                >
                                {this.state.heroList.map((item: any) => 
                                    <SwiperSlide style={{
                                        background: 'url('+require('../../image/'+item.image)+') center no-repeat',
                                    }} key={item.name}></SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                        <p className="hero-name">{config.heroType}</p>
                        <button className="btn" onClick={() => this.handle('start')}>开&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;始</button>
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

                    <div className="prop-box" onClick={() => this.handle('useProp')} style={{
                        background: 'url('+require('../../image/propBag1.png')+') center no-repeat',
                    }}>
                        <span className="prop-box-num">{this.state.propList.length}</span>
                    </div>
                    </>
                )
            case END:
                return (
                    <div className="gameover">
                        <h2 className="title">Game Over</h2>
                        <p className="score">您的分数是：{this.state.score}</p>
                        <div className="gameover-menu">
                            <button className="menu-item" onClick={() => this.handle('start')}>重新开始</button>
                            <button className="menu-item" onClick={() => this.handle('restart')}>返回菜单</button>
                            <button className="menu-item" onClick={() => this.handle('restart')}>退出重来</button>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    // 渲染函数
    render(): React.ReactNode {
        const {status, hero, bg } = this.state

        return (
            <div>
                <div className="container" style={{width: '100%'}}>
                    <div className="main" style={{
                        width: config.width + 'px',
                        height: config.height + 'px',
                        cursor: status === RUNNING ? 'none' : 'default'
                        }} ref={ref}>

                        {/* 背景 */}
                        <div className="bg-box">
                            <div className="bg" style={{bottom: bg.y+'px'}}>
                                <audio src={require('../../audio/bullet-default1.mp3')}></audio>

                                {[0,1].map((i: any) => <div className="bg-item" key={i} style={{
                                    width: config.width + 'px', 
                                    height: config.height + 'px',
                                    background: 'url('+require('../../image/'+bg.image)+') center no-repeat'
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
                                background: 'url('+require('../../image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    {item.destroying > 0 ? 
                                        <audio src={require('../../audio/'+item.audio)} autoPlay></audio>
                                        : null
                                    }
                                </div>)}

                        {/* 道具包 */}
                        {this.state.propBagList.map((item: any) => 
                            <div className={"prop-bag"} style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: 'url('+require('../../image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                display: item.get ? 'none' : 'inline-block',
                                }} key={item.id}>
                                    {item.get ? 
                                        <audio src={require('../../audio/'+item.audio)} autoPlay></audio>
                                        : null
                                    }
                                </div>)}
                        
                        {/* 道具使用 */}
                        {this.state.propView.map((item: any) => 
                            <span className="prop-view" style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: 'url('+require('../../image/'+item.image)+') no-repeat',
                                backgroundSize: item.bgSize || '100%',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    <audio src={require('../../audio/'+item.audio)} autoPlay></audio>
                                </span>)}

                        {/* 子弹 */}
                        {this.state.bulletList.map((item: any) => 
                            <span className="zd" style={{
                                top: item.y + 'px',
                                left: item.x + 'px',
                                width: item.w + 'px',
                                height: item.h + 'px',
                                background: item.type === 'default' ? '#fff' : 'url('+require('../../image/'+item.image)+') no-repeat',
                                backgroundPosition: item.bgPosition,
                                }} key={item.id}>
                                    <audio src={require('../../audio/'+item.audio)} onCanPlay={(e) => this.audioPlay(e)} autoPlay></audio>
                                </span>)}
                        
                        {/* 主机 */}
                        {hero.life > 0 ? 
                            <div className="fj" style={{
                                width: hero.width + 'px',
                                height: hero.height + 'px', 
                                left: hero.x + 'px', 
                                top: hero.y + 'px',
                                background: 'url('+require('../../image/'+hero.image)+') center no-repeat',
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


// function NavigateComponent (Component: any) {
//     let navigate = useNavigate()
//     return (props: any) => <Component {...props} navigate={ navigate }></Component>
// }

//  NavigateComponent(Game)