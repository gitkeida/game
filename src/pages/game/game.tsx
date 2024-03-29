import React, { Ref } from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import './game.css'
import {heroConfig, bgConfig, config, bulletConfig, propConfig, heroList} from '../../plugins/config'
import { Hero } from "../../plugins/hero";
import { Bullet } from '../../plugins/bullet'
import { Enemy } from '../../plugins/enemy'
import { Prop } from '../../plugins/prop';
import { useNavigate, Navigate, NavLink, useSearchParams  } from 'react-router-dom'
import {UserNameContext} from '../app/App'

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
    heroType: string            // 所使用的英雄飞机
    rankings: Array<any>        // 排行榜
    username: string            // 用户名称
    userInfo: any               // 用户信息
    saved: boolean              // 保存分数
    type: string                // 游戏类型
}

const ref: any = React.createRef();

const START = 0
const READY = 1
const STARTING = 2
const RUNNING = 3
const PAUSE = 4
const END = 5
const RANKINGS = 6

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
            heroType: config.heroType,
            bg: bgConfig,
            heroList: Object.keys(heroList).map((key: string) => heroList[key]),
            enemyList: [],
            bulletList: [],
            propBagList: [],
            propList: [],
            propView: [],
            rankings: [],
            username: '',
            userInfo: {},
            saved: false,
            type: '',
        }
        console.log(this.state.hero)

    }

    componentDidMount() {
        this.getRouteParams();
        this.getRankings();
        // 开始启动
        this.init();
        this.start();
    }

    // 获取路由参数
    getRouteParams() {
        let params = window.location.hash.split('?')[1]
        if (params) {
            let username = params.split('=')[1];
            username = window.decodeURIComponent(username)
            this.getUserInfo(username)
        }
    }

    // 获取用户信息
    async getUserInfo(username: string) {
        let userInfo = await window.electronAPI.getUser(username);
        if (!userInfo) {
            userInfo = {
                name: username,
                money: 0,
                maxScore: 0,
                createTS: +new Date(),
                heroList: ['1'],
            }
            window.electronAPI.setUser(username, userInfo);
        }
        console.log('获取user',userInfo)
        this.setState({userInfo, username})
    }

    // 获取排行榜分数
    async getRankings() {
        let rankings = await window.electronAPI.getStore('score')
        rankings.sort((a:any, b:any) => b.score - a.score)
        // console.log('分数',rankings.slice(0,10))

        this.setState({rankings: rankings.slice(0,10)})
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
            // console.log(bg.speed)
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

    // 销毁组件，子弹、敌人、道具包、道具
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
            if (absY < sumH && absX < sumW && enemyList[i].destroying === 0 && enemyList[i].life > 0) {
                config.score+= enemyList[i].score;
                hero.life -= 1;
                enemyList[i].life = 0;
                // 如果敌机已经销毁，则移除它
                if (enemyList[i].destroy) {
                    enemyList.splice(i,1);
                }
                this.setState({score: this.state.score + enemyList[i].score, enemyList})
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

    // 检测组件碰撞, 道具和敌人（有bug计算了多次分数）
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
                case RANKINGS:
                    this.moveBg();
                    break;
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
                    this.setState({hero: this.hero.createHero(), score: 0, saved: false})
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
                    this.saveStore()
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
                this.setState({status: READY,countDown: 3, type})
                break;
            case 'hard':
                config.difficuity = 1.4;
                this.setState({status: READY,countDown: 3, type})
                break;
            case 'bug':
                config.difficuity = 1.6;
                this.setState({status: READY,countDown: 3, type})
                break;
            case 'heroSelect':
                config.heroType = this.state.heroList[value].type;
                this.setState({heroType: config.heroType})
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
            case 'rankings':
                this.setState({status: RANKINGS})
                break;
            case 'unlock':
                let heroCurr = this.state.heroList.find((child:any) => child.type === this.state.heroType)
                let userInfo = this.state.userInfo;
                if (this.state.userInfo.money >= heroCurr.price) {
                    // 解锁
                    userInfo.money -= heroCurr.price;
                    userInfo.heroList.push(heroCurr.id);
                    window.electronAPI.setUser(userInfo.name, userInfo)
                    this.getUserInfo(userInfo.name);
                } else {
                    // 金币不足

                }
                break;
        }
    }

    // 保存状态到本地存储
    async saveStore() {
        if (!this.state.saved) {
            this.setState({saved: true})
            // 保存积分
            let scoreData: any = {
                username: this.state.username,
                hero: this.state.hero.name,
                type: this.typeFilter(this.state.type),
                score: this.state.score,
                time: +new Date(),
            }
            console.log(scoreData)
            window.electronAPI.setStore('score', scoreData)
            this.getRankings();

            // 保存用户积分信息
            let userInfo = this.state.userInfo;
            if (userInfo.maxScore < this.state.score) {
                userInfo.maxScore = this.state.score;
            }
            userInfo.money += this.state.score;
            console.log('设置user',userInfo)
            window.electronAPI.setUser(userInfo.name, userInfo)
            this.getUserInfo(userInfo.name);
        }
    }

    // 游戏类型过滤
    typeFilter(type: string) {
        switch(type) {
            case 'default':
                return '普通'
            case 'hard':
                return '困难'
            case 'bug':
                return '炼狱'
            default:
                return '普通'
        }
    }

    // 设置播放声音
    audioPlay(e: any) {
        // 设置播放声音0~1
        e.target.volume = 0.03;
    }

    // 根据状态渲染用户信息
    renderUserInfo(status: number) {
        switch(status) {
            case START:
            case READY:
            case RANKINGS:
            // case END:
                return (
                <div className="menu-bar">
                    <span className="currency-box">{this.state.userInfo.money}</span>
                    {/* <div className="bar-currency">
                        <div className="bar-currency-img">
                            <img src={require('../../image/currency1.png')} alt="" />
                        </div>
                        <span></span>
                    </div> */}
                </div>
                )
            
        }
    }

    // 根据状态渲染菜单
    renderMenu(status: number) {
        switch(status) {
            case START:
                return (
                    <div className="menu-box">
                        <h3 className="menu-title">欢迎用户：{this.state.userInfo.name}</h3>
                        <div className="menu">
                            <button className="menu-item" onClick={() => this.handle('default')}>普通</button>
                            <button className="menu-item" onClick={() => this.handle('hard')}>困难</button>
                            <button className="menu-item" onClick={() => this.handle('bug')}>炼狱</button>
                            <button className="menu-item" onClick={() => this.handle('rankings')}>排行榜</button>
                            {/* <NavLink to="/">
                                <button className="menu-item" onClick={() => this.handle('back')}>返回</button>
                            </NavLink> */}
                        </div>
                    </div>
                )
            case READY:
                let atk = bulletConfig[heroList[config.heroType].bulletType].life,
                    atkSpeed = bulletConfig[heroList[config.heroType].bulletType].speed,
                    heroWidth = heroList[config.heroType].width,
                    heroHeight = heroList[config.heroType].height;
                let haveHero = this.state.userInfo.heroList;
                return (
                    // 飞机选择
                    <div className="hero-select">
                        {/* 飞机属性 */}
                        <div className="hero-progress-box">
                            <div className="progress-item">
                                <span className="label">攻击力</span>
                                <div className="progress">
                                    <p className="value" style={{width: (atk / 8 * 100) + '%'}}></p>
                                </div>
                            </div>
                            <div className="progress-item">
                                <span className="label">攻击速度</span>
                                <div className="progress">
                                    <p className="value" style={{width: ((800 - atkSpeed) / 800 * 100) + '%'}}></p>
                                </div>
                            </div>
                            <div className="progress-item">
                                <span className="label">飞机体积</span>
                                <div className="progress">
                                    <p className="value" style={{width: (heroWidth * heroHeight / 2) / 18000 * 100 + '%'}}></p>
                                </div>
                            </div>
                        </div>
                        {/* 飞机列表 */}
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
                                    <SwiperSlide  key={item.name}>
                                        <div style={{
                                                background: 'url('+require('../../image/'+item.image)+') center no-repeat',
                                            }} className={ haveHero.indexOf(item.id) > -1 ? 'hero-item' : 'filter-gray hero-item'}
                                        ></div>
                                        {haveHero.indexOf(item.id) > -1 ? null : <div className="not-unlock"></div>}
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                        <p className="hero-name">{config.heroType}</p>
                        {haveHero.indexOf(heroList[config.heroType].id) > -1 ? 
                            <button className="btn" onClick={() => this.handle('start')}>开&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;始</button>
                            :
                            <>
                            <button className="btn" onClick={() => this.handle('unlock')}>解&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;锁</button>
                            <div className="hero-price">
                                <span className="currency-box">{heroList[config.heroType].price}</span>
                            </div>
                            </>
                        }
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
                        <span className="currency-box">{this.state.userInfo.money}</span>
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
                        <p className="add-currency"><span className="currency-box"> + {this.state.score}</span></p>
                        <div className="gameover-menu">
                            <button className="menu-item" onClick={() => this.handle('start')}>重新开始</button>
                            <button className="menu-item" onClick={() => this.handle('restart')}>返回菜单</button>
                            <button className="menu-item" onClick={() => this.handle('rankings')}>排行榜</button>
                        </div>
                    </div>
                )
            case RANKINGS:
                const rankingsList = new Array(10).fill(null)
                return (
                    <div className="menu-box">
                        <h3 className="menu-title">积分排行榜</h3>
                        <div className="rankings-box">
                            <div className="rankings-head">
                                <div className="rankings-item">
                                    <span className="name">用户</span>
                                    <span className="type">难度</span>
                                    <span className="score">分数</span>
                                </div>
                            </div>
                            <div className="rankings-list">
                                {rankingsList.map((val:any,idx:number) => {
                                    let item = this.state.rankings[idx]
                                    if (item) {
                                        return (
                                            <div className="rankings-item" key={idx}>
                                                <span className="id">{idx+1}.</span>
                                                <span className="name">{item.username}</span>
                                                <span className="type">{item.type}</span>
                                                <span className="score">{item.score}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="rankings-item"  key={idx}>
                                                <span className="id">{idx+1}.</span>
                                                <span className="name">-</span>
                                                <span className="type">-</span>
                                                <span className="score">-</span>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            <div style={{width: '150px',margin: '0 auto'}}>
                                <button className="menu-item" onClick={() => this.handle('restart')}>返回</button>
                            </div>

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
                        {/* 用户信息 */}
                        {this.renderUserInfo(status)}

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
                                // backgroundSize: `${item.w}px ${item.h}px`,
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