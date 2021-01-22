import React from 'react';

interface OvenProps {
    isHeatingElementOn: boolean,
    onGetTemperature: any
}

interface OvenState {
    temperature: number
}

class Oven extends React.Component<OvenProps, OvenState> {
    private timerId: any;
    private heatRate: number = 2;
    private coolRate: number = -1;

    constructor(props: OvenProps) {
        super(props);

        this.state = {
            temperature: 0
        };
    }

    componentDidMount() {
        this.timerId = setInterval(this.updateTemperature.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    getTemperature(): number {
        return this.state.temperature;
    }
    
    private updateTemperature(): void {
        const rate: number = this.props.isHeatingElementOn ? this.heatRate : this.coolRate;

        let temperature = this.state.temperature;
        temperature += rate;

        if (temperature < 0) {
            temperature = 0;
        }

        this.setState({
            temperature: temperature
        });

        this.props.onGetTemperature(temperature);
    }

    render() {
        return (
            <div>
                Oven: {this.state.temperature}
            </div>
        )
    }
}

export default Oven;