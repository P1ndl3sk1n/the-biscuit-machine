import React, { Component } from 'react';
import Motor from "./Motor";

interface SwitchState {
    position: SwitchPosition
}

class Switch extends Component<{}, SwitchState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            position: SwitchPosition.Off
        };
    }
    
    getSwitchPosition(): SwitchPosition {
        if (this.state) {
            return this.state.position;
        }

        return SwitchPosition.Off;
    }

    setSwitchPosition(newPosition: SwitchPosition) {
        this.setState({
            position: newPosition
        });
    }

    render() {
        const motorShouldRun: boolean = this.state.position == SwitchPosition.On ? true : false;

        return (
            <div>
                <button onClick={() => this.setSwitchPosition(SwitchPosition.Paused)}>{SwitchPosition.Paused}</button>
                <div>
                    <button onClick={() => this.setSwitchPosition(SwitchPosition.On)}>{SwitchPosition.On}</button>
                    <button onClick={() => this.setSwitchPosition(SwitchPosition.Off)}>{SwitchPosition.Off}</button>
                </div>
                <div>
                    Switch: {this.getSwitchPosition()}
                </div>

                <Motor isRunning={motorShouldRun} />
            </div>
        );
    }
}

enum SwitchPosition {
    Off = 'Off',
    On = 'On',
    Paused = 'Paused'
};

export default Switch;