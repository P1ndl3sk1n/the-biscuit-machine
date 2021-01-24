import React from 'react';
import Extruder from "./machine-elements/Extruder";
import Motor from "./machine-elements/Motor";
import Oven from "./machine-elements/Oven";
import Stamper from "./machine-elements/Stamper";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

interface BiscuitMachineState {
    switchPosition: SwitchPosition,
    isMotorOn: boolean,
    isHeatingElementOn: boolean,
    pulse: number
}

const MinBakingTemperature: number = 220;
const MaxBakingTemperature: number = 240;

export default class BiscuitMachine extends React.Component<{}, BiscuitMachineState> {
    constructor(props: {}) {
        super(props);
    
        this.state = {
            switchPosition: SwitchPosition.Off,
            isMotorOn: false,
            isHeatingElementOn: false,
            pulse: 0
        };
    }

    private positionChanged = (switchPosition: SwitchPosition) => {
        this.setState({
            switchPosition
        });
    }

    private getTemperature = (temperature: number) => {
        this.updateOven(temperature);
        this.updateMotor(temperature);
    }

    private onPulse = () => {
        this.setState({
            pulse: 1
        });
        setTimeout(() => {
            this.setState({
                pulse: 0
            });
        }, 1000);
    }

    private onExtruderPulsed = () => {
    }

    private onStamperPulsed = () => {
    }

    private updateOven = (temperature: number): void => {
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

    private updateMotor = (temperature: number): void => {
        const isMotorOn: boolean = this.state.switchPosition === SwitchPosition.On && temperature >= MinBakingTemperature;

        this.setState({
            isMotorOn
        });
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={3}>
                                BISCUIT MACHINE
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Extruder pulse={this.state.pulse} extruderPulsed={this.onExtruderPulsed} />
                            </td>
                            <td>
                                <Stamper pulse={this.state.pulse} extruderPulsed={this.onStamperPulsed} />
                            </td>
                            <td>
                                <Oven isHeatingElementOn={this.state.isHeatingElementOn} onGetTemperature={this.getTemperature} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <Motor isOn={this.state.isMotorOn} pulse={this.onPulse} />
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <Switch onPositionChanged={this.positionChanged}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}