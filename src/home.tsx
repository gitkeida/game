import React from "react";
import { Link } from 'react-router-dom'

export default class Home extends React.Component<any, any> {
    render(): React.ReactNode {
        return (
            <div>
                <h1>Hello Home</h1>
                <Link to="/game">go to Game</Link>

                <h1>Hello World!</h1>
                We are using Node.js <span id="node-version"></span>,
                Chromium <span id="chrome-version"></span>,
                and Electron <span id="electron-version"></span>.
            </div>
        )
    }

    componentDidMount() {
        // 生命周期
        const _window: any = window;
        console.log('开始执行')
        console.log(_window['myAPI'])
        _window.myAPI.loadPreferences()
    }
}