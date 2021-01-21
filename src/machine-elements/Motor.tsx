import { timingSafeEqual } from "crypto";
import React, { Component } from 'react';

export interface MotorProps {
    isRunning: boolean
}

class Motor extends Component<MotorProps, object>  {
    private timerID: any;

    constructor(props: any) {
        super(props);
    }

    componentDidUpdate(prevProps: MotorProps) {
        if (prevProps.isRunning === this.props.isRunning) {
            return;
        }
        
        if (this.props.isRunning) {
            this.pulse();
            this.timerID = setInterval(this.pulse, 5000);
        } else {
            clearInterval(this.timerID);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    private pulse() {
        console.log(new Date().toLocaleString() + ': Motor pulse');
    }

    render() {
        return (
            <div>
                Motor: {this.props.isRunning ? 'running' : 'not running'}
            </div>
        );
    }
}

export default Motor;