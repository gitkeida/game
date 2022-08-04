import React, { useState } from "react";

import './login.css'


export default class Login extends React.Component<any, any> {
    constructor(props:any) {
        super(props)

        this.state = {
            username: '',
            password: '123456',
            usernameErr: false,
        }

        this.login = this.login.bind(this)
        this.handle = this.handle.bind(this)
    }

    render(): React.ReactNode {
        return (
            <div>
                <div className="login-box">
                    <h3 className="title">用户登录</h3>
                    <input type="text" className={this.state.usernameErr ? 'input-error' : ''} value={this.state.username} onChange={(e) => this.handle('username', e)} placeholder="请输入用户名" />
                    <br />
                    <input type="password" defaultValue={this.state.password} placeholder="请输入密码" />
                    <br />
                    <button onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
                </div>
            </div>
        )
    }

    login() {
        if (!this.state.username) {
            this.setState({
                usernameErr: true
            })
            return;
        }
        console.log('登录');
        window.electronAPI.createWindow('game', this.state.username)
    }

    handle(type:string, scope?: any) {
        switch(type) {
            case 'username':
                this.setState({
                    username: scope.target.value,
                    usernameErr: false,
                })
                break;
        }
    }
}