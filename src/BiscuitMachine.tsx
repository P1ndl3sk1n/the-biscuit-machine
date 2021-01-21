import React from 'react';
import Motor from "./machine-elements/Motor";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

interface BiscuitMachineState {
    switchPosition: SwitchPosition
}

class BiscuitMachine extends React.Component<{}, BiscuitMachineState> {
    constructor(props: {}) {
        super(props);
    
        this.state = {
            switchPosition: SwitchPosition.Off
        };
    }

    positionChanged = (switchPosition: SwitchPosition) => {
        this.setState({
            switchPosition: switchPosition
        });
    }

    render() {
        const isMotorOn: boolean = this.state.switchPosition == SwitchPosition.On ? true : false;

        return (
            <div>
                BISCUIT MACHINE
                <Switch onPositionChanged={this.positionChanged}/>
                <Motor isOn={isMotorOn} />
            </div>
        )
    }
}

export default BiscuitMachine;