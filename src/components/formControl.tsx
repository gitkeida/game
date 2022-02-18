import React from "react";

interface IState {
    value: string;
    text: string;
    select: string;
}

export default class FormControl extends React.Component<any,IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: '',
            text: '输入文章',
            select: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: Event|any, type: string) {
        let obj: any = {
            [type]: event.target.value
        }
        this.setState(obj)
    }

    handleSubmit(event: any) {
        console.log(event)
        alert('提交的值：'+(this.state as any)[event.target[1].dataset.type])
        event.preventDefault();
    }

    render() {
        return (
            <div>
            <p>input:</p>
            <form onSubmit={this.handleSubmit}>
                <label>名字：
                    <input type="text" value={this.state.value} onChange={(e) => this.handleChange(e,'value')} />
                </label>
                <input type="submit" data-type="value" value="提交" />
            </form>
            <p>textarea:</p>
            <form onSubmit={this.handleSubmit}>
                <label>
                文章:
                <textarea className="textarea" value={this.state.text} onChange={(e) => this.handleChange(e, 'text')} />
                </label>
                <input type="submit" data-type="text" value="提交" />
            </form>
            <p>select:</p>
            <form onSubmit={this.handleSubmit}>
                <label>
                选择你喜欢的风味:
                <select value={this.state.select} onChange={(e) => this.handleChange(e, 'select')}>
                    <option value="grapefruit">葡萄柚</option>
                    <option value="lime">酸橙</option>
                    <option value="coconut">椰子</option>
                    <option value="mango">芒果</option>
                </select>
                </label>
                <input type="submit" data-type="select" value="提交" />
            </form>
            </div>
        )
    }
}