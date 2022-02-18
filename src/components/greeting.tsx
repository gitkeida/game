import React from "react";

function UserGreeting() {
    return <h1>Welcome back!</h1>;
}

function GuestGreeting() {
    return <h1>Please sign up.</h1>;
}

export default class Greeting extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }
    render(): React.ReactNode {
        const isLoggedIn = this.props.isLoggedIn;
        if (isLoggedIn) {
            return <UserGreeting></UserGreeting>
        }

        return <GuestGreeting></GuestGreeting>
    }
}