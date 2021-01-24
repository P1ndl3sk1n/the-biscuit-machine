import React from 'react';

export interface MotorProps {
    isOn: boolean,
    pulse: any
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

        const output = document.getElementById('motor-output')
        if (output) {
            const div = document.createElement('div');
            div.innerText = `Motor pulse: ${new Date().toLocaleString()}`;
            output.appendChild(div);
        }
    }

    render() {
        return (
            <div>
                Motor: {this.props.isOn ? 'running' : 'not running'}
                <div id="motor-output">
                </div>
            </div>
        );
    }
}

export default Motor;