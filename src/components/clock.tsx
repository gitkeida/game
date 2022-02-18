import React from 'react';

interface IState {
    date: Date
}

interface IProps {
    timerID: any
}

export default class Clock extends React.Component<any, IState> {
    public timerID: any;

    constructor(props: any) {
        super(props);
        this.state = {date: new Date()};
    }
    // 生命周期-挂载
    componentDidMount() {
        // 该方法会在组件渲染到Dom后运行
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    // 生命周期-卸载
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        // 使用this.setState()来更新组件state
        this.state = {date: new Date}
        this.setState(this.state)
        // this.setState({
        //     date: new Date()
        // })
    }
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>      
            </div>
        );
    }
}