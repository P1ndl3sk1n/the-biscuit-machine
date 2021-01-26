import React from 'react';

interface OvenProps {
    isHeatingElementOn: boolean,
    onGetTemperature: (temperature: number) => void
}

interface OvenState {
    temperature: number,
    ovenClass: string;
}

class Oven extends React.Component<OvenProps, OvenState> {
    private timerId: any;
    private heatRate: number = 10;
    private coolRate: number = -1;

    constructor(props: OvenProps) {
        super(props);

        this.state = {
            temperature: 0,
            ovenClass: "oven cold"
        };
    }

    componentDidMount() {
        this.timerId = setInterval(this.updateTemperature.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    private updateTemperature = (): void => {
        const rate: number = this.props.isHeatingElementOn ? this.heatRate : this.coolRate;

        let temperature = this.state.temperature;
        temperature += rate;

        if (temperature < 0) {
            temperature = 0;
        }

        this.setState({
            temperature: temperature,
            ovenClass: this.getOvenClass(temperature)
        });

        this.props.onGetTemperature(temperature);
    }

    private getOvenClass = (temp: number) => {
        let ovenClass = "oven";

        if (temp < 50) {
            ovenClass += " cold";
        } else if (temp < 150) {
            ovenClass += " warm";
        } else {
            ovenClass += " hot";
        }

        return ovenClass;
    }

    render() {
        return (
            <div className={this.state.ovenClass}>
                Oven: {this.state.temperature } &deg;
            </div>
        )
    }
}

export default Oven;