import React from 'react';

interface OvenProps {
    isHeatingElementOn: boolean
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

        this.timerId = setInterval(this.updateTemperature, 1000);
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

        this.setState({
            temperature: temperature
        });
    }

    render() {
        return (
            <div>
                Oven: {this.state.temperature}
            </div>
        )
    }
}