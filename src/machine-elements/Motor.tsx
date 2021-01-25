import React from 'react';

export interface MotorProps {
    isOn: boolean,
    pulse: any
}

class Motor extends React.Component<MotorProps, object>  {
    private timerId: any;

    componentDidUpdate(prevProps: MotorProps) {
        if (prevProps.isOn === this.props.isOn) {
            return;
        }
        
        if (this.props.isOn) {
            this.pulse();
            this.timerId = setInterval(this.pulse.bind(this), 5000);
        } else {
            clearInterval(this.timerId);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    private pulse = () => {
        this.props.pulse();
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