import { timingSafeEqual } from "crypto";
import React, { Component } from 'react';

export interface MotorProps {
    isOn: boolean
}

class Motor extends Component<MotorProps, object>  {
    private timerId: any;

    constructor(props: any) {
        super(props);
    }

    componentDidUpdate(prevProps: MotorProps) {
        if (prevProps.isOn === this.props.isOn) {
            return;
        }
        
        if (this.props.isOn) {
            this.pulse();
            this.timerId = setInterval(this.pulse, 5000);
        } else {
            clearInterval(this.timerId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    private pulse() {
        console.log(new Date().toLocaleString() + ': Motor pulse');
    }

    render() {
        return (
            <div>
                Motor: {this.props.isOn ? 'running' : 'not running'}
            </div>
        );
    }
}

export default Motor;