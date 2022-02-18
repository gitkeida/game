import React from "react";

export default class NumberList extends React.Component<any> {
    render(): React.ReactNode {
        const numbers = this.props.numbers;
        return (
            <ul>
                {numbers.map((number: any) => <li key={number.toString()}>{number}</li>)}
            </ul>
        )
    }
}