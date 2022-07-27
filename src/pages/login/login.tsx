import React from "react";
import './login.css'

export default class Login extends React.Component<any, any> {
    constructor(props:any) {
        super(props)


    }

    render() {
        return (
            <div>
                <div className="login-box">
                    <h3 className="title">用户登录</h3>
                    <input type="text" placeholder="请输入用户名" />
                    <br />
                    <input type="password" placeholder="请输入密码" />
                    <br />
                    <button onClick={this.login}>登录</button>
                </div>
            </div>
        )
    }

    login() {
        console.log('登录');
        window.electronAPI.createWindow('game')
    }
}