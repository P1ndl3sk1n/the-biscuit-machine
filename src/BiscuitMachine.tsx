import React from 'react';
import Motor from "./machine-elements/Motor";
import Oven from "./machine-elements/Oven";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

interface BiscuitMachineState {
    switchPosition: SwitchPosition,
    isMotorOn: boolean,
    isHeatingElementOn: boolean
}

const MinBakingTemperature: number = 220;
const MaxBakingTemperature: number = 240;

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
        this.setState({
            switchPosition
        });
    }

    getTemperature = (temperature: number) => {
        this.updateOven(temperature);
        this.updateMotor(temperature);
    }

    private updateOven(temperature: number): void {
        let isHeatingElementOn: boolean = this.state.isHeatingElementOn;

        if (this.state.switchPosition !== SwitchPosition.Off) {
            if (temperature < MinBakingTemperature) {
                isHeatingElementOn = true
            } else if (temperature >= MaxBakingTemperature) {
                isHeatingElementOn = false;
            }
        } else {
            isHeatingElementOn = false;
        }

        this.setState({
            isHeatingElementOn
        });
    }

    private updateMotor(temperature: number): void {
        const isMotorOn: boolean = this.state.switchPosition == SwitchPosition.On && temperature >= MinBakingTemperature;

        this.setState({
            isMotorOn
        });
    }

    render() {
        return (
            <div>
                BISCUIT MACHINE
                <Switch onPositionChanged={this.positionChanged}/>
                <Motor isOn={this.state.isMotorOn} />
                <Oven isHeatingElementOn={this.state.isHeatingElementOn} onGetTemperature={this.getTemperature} />
            </div>
        )
    }
}

export default BiscuitMachine;