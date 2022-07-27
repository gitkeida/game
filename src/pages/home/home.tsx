import React from "react";
import { Link } from 'react-router-dom'

export default class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            title: '',
            filePath: '',
            inform: 'Click it to see the effect in this interface',
            counter: 0
        }


        this.handle.bind(this)
        this.inputChange.bind(this)
        
    }

    render(): React.ReactNode {
        return (
            <div>
                <h1 className="drag">Hello Home</h1>
                <Link to="/game">go to Game</Link>

                <h1>Hello World!</h1>
                We are using Node.js <span id="node-version"></span>,
                Chromium <span id="chrome-version"></span>,
                and Electron <span id="electron-version"></span>.
                <hr />
                Title: <input id="title" value={this.state.title} onChange={ (e) => this.inputChange('title', e)} />
                <button onClick={() => this.handle('setTitle')} >进程通信:设置title</button>
                <hr />
                <button onClick={() => this.handle('openFile')}>Open a File</button>
                File path: <strong>{this.state.filePath}</strong>
                <hr />
                Current value: <strong id="counter">{this.state.counter}</strong>
                <hr />
                <p id="output">{this.state.inform}</p>
                <button onClick={() => this.handle('inform')}>click inform</button>
                <hr />
                新window: game
                <button onClick={() => this.handle('newGame')}>new Window Game</button>
            </div>
        )
    }

    componentDidMount() {
        // 生命周期
        // const _window: any = window;
        console.log('开始执行')
        // console.log(_window['myAPI'])
        // _window.myAPI.loadPreferences()

        // 监听主进程方法
        window.electronAPI.onHandleCounter((event: any,value: any) => {
            const oldValue = Number(this.state.counter)
            const newValue = oldValue + value;
            this.setState({counter: newValue})

            // 告诉主进程，接收到了
            event.sender.send('counter-value', newValue)
        })
    }

    inputChange(type: string, event?: any) {
        switch(type) {
            case 'title':
                this.setState({
                    title: event.target.value
                })
                break;
        }
    }

    async handle(type: string, event?: any) {
        switch(type) {
            case 'setTitle':
                const title = this.state.title;
                window.electronAPI.setTitle(title)
                console.log('setTitle')
                break;
            case 'openFile':
                const filePath = await window.electronAPI.openFile()
                this.setState({filePath: filePath})
                break;
            case 'inform':
                const NOTIFICATION_TITLE = 'Title'
                const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
                const CLICK_MESSAGE = 'Notification clicked!'
                new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
                .onclick = () => this.setState({inform: CLICK_MESSAGE})
                break;
            case 'newGame':
                window.electronAPI.createWindow('game')
                break;
        }
    }
}