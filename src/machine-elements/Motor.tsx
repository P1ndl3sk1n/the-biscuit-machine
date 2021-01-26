import React from 'react';
import { MotorPulseInterval } from "../BiscuitMachine";

export interface MotorProps {
    isOn: boolean,
    onPulse: () => void
}

class Motor extends React.Component<MotorProps, object>  {
    private timerId: any;

    constructor(props: MotorProps) {
        super(props);
    }

    componentDidUpdate(prevProps: MotorProps) {
        if (prevProps.isOn === this.props.isOn) {
            return;
        }
        
        if (this.props.isOn) {
            this.pulse();
            this.timerId = setInterval(this.pulse.bind(this), MotorPulseInterval * 1000);
        } else {
            clearInterval(this.timerId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    private pulse = () => {
        this.props.onPulse();
    }

    render() {
        return (
            <div>
                Motor: {this.props.isOn ? 'On' : 'Off'}
            </div>
        );
    }
}

export default Motor;