import React from 'react';
import Motor from "./machine-elements/Motor";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

interface BiscuitMachineState {
    switchPosition: SwitchPosition, // TODO: consider whether to remove this
    isMotorOn: boolean,
    isHeatingElementOn: boolean
}

class BiscuitMachine extends React.Component<{}, BiscuitMachineState> {
    constructor(props: {}) {
        super(props);
    
        this.state = {
            switchPosition: SwitchPosition.Off,
            isMotorOn: false,
            isHeatingElementOn: false
        };
    }

    positionChanged = (switchPosition: SwitchPosition) => {
        const isMotorOn: boolean = switchPosition == SwitchPosition.On ? true : false;

        this.setState({
            switchPosition,
            isMotorOn
        });
    }

    render() {
        return (
            <div>
                BISCUIT MACHINE
                <Switch onPositionChanged={this.positionChanged}/>
                <Motor isOn={this.state.isMotorOn} />
            </div>
        )
    }
}

export default BiscuitMachine;