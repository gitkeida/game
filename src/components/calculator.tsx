import React from "react";

interface IState {
    temperature: number | string
    scale?: string
}

function BoilingVerdict(props: any) {
    if (props.celsius >= 100) {
      return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
  }

  // 摄氏度与华氏度之间相互转换的函数：
function toCelsius(fahrenheit: number) {
    return (fahrenheit - 32) * 5 / 9;
}
// 摄氏度与华氏度之间相互转换的函数：
function toFahrenheit(celsius: number) {
    return (celsius * 9 / 5) + 32;
}
function tryConvert(temperature: any, convert: any) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}


export default class Calculator extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }

    handleCelsiusChange(temperature: number) {
        this.setState({scale: 'c', temperature});
    }

    handleFahrenheitChange(temperature: number) {
        this.setState({scale: 'f', temperature});
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius: string|any = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

        return (
            <div>
                <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
                <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} />
                <BoilingVerdict
                    celsius={parseFloat(celsius)} />
            </div>
        )
    }
}
const scaleNames: any = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component<any,IState> {
    constructor(props: any) {
        super(props);
        this.state = {temperature: ''}

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e: any) {
        // this.setState({temperature: e.target.value})
        this.props.onTemperatureChange(e.target.value)
    }
    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
          <fieldset>
            <legend>Enter temperature in {scaleNames[scale]}:</legend>
            <input value={temperature}
                   onChange={this.handleChange} />
          </fieldset>
        );
      }
}