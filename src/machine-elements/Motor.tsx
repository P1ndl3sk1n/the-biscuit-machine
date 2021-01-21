import React from 'react';

export interface MotorProps {
    isOn: boolean
}

class Motor extends React.Component<MotorProps, object>  {
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