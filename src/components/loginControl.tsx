import React from "react";
import Greeting from "./greeting";

function LoginButton(props: any) {
    return (
        <button onClick={props.onClick}>Login</button>
    )
}

function LogoutButton(props: any) {
    return (
        <button onClick={props.onClick}>Logout</button>
    )
}

interface IState {
    isLoggedIn: Boolean
}

export default class LoginControl extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn: false};
    }

    handleLoginClick() {
        this.setState({isLoggedIn: true});
    }

    handleLogoutClick() {
        this.setState({isLoggedIn: false});
    }

    render(): React.ReactNode {
        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if (isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick}></LogoutButton>
        } else {
            button = <LoginButton onClick={this.handleLoginClick}></LoginButton>
        }
        return (
            <div>
                <Greeting isLoggedIn={isLoggedIn}></Greeting>
                {button}
            </div>
        )
    }
}