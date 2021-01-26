import React from 'react';
import Extruder from "./machine-elements/Extruder";
import Motor from "./machine-elements/Motor";
import Oven from "./machine-elements/Oven";
import Stamper from "./machine-elements/Stamper";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

enum BiscuitState {
    None = 0,
    New = 1,
    Stamped = 2,
    Baking = 3,
    Baked = 4
}

interface BiscuitMachineState {
    switchPosition: SwitchPosition,
    isMotorOn: boolean,
    isHeatingElementOn: boolean,
    pulse: number,
    bakedBiscuits: number,
    conveyor: BiscuitState[] 
}

const MinBakingTemperature: number = 220;
const MaxBakingTemperature: number = 240;
const ConveyorLength: number = 6;
const BakingAreaStartIndex: number = 3;
const BakingAreaEndIndex: number = 4;


export default class BiscuitMachine extends React.Component<object, BiscuitMachineState> {
    constructor(props: object) {
        super(props);
    
        let conveyor: BiscuitState[] = [];
        for (let i = 0; i < ConveyorLength; i++) {
            conveyor.push(BiscuitState.None);
        }

        this.state = {
            switchPosition: SwitchPosition.Off,
            isMotorOn: false,
            isHeatingElementOn: false,
            pulse: 0,
            bakedBiscuits: 0,
            conveyor: conveyor
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
        if (!this.isConveyorEmpty()) {
            this.moveConveyor();
        }
        this.pulse();
    }

    private pulse = () => {
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
        if (this.state.switchPosition === SwitchPosition.Off) {
            return;
        }
        
        let conveyor = this.state.conveyor;

        if (conveyor[0] === BiscuitState.None) {
            conveyor[0] = BiscuitState.New;
        }

        this.setState({
            conveyor
        });
    }

    private onStamperPulsed = () => {
        if (this.state.switchPosition === SwitchPosition.Off) {
            return;
        }

        let conveyor = this.state.conveyor;

        if (conveyor[1] === BiscuitState.New) {
            conveyor[1] = BiscuitState.Stamped;
        }

        this.setState({
            conveyor
        });
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
        let isMotorOn: boolean = false;

        switch (this.state.switchPosition) {
            case SwitchPosition.On: 
                isMotorOn = temperature >= MinBakingTemperature;
                break;
            case SwitchPosition.Off:
                isMotorOn = !this.isConveyorEmpty();
                break;
        }

        this.setState({
            isMotorOn
        });
    }

    private isConveyorEmpty = (): boolean => {
        const conveyor = this.state.conveyor;
        let isEmpty = true;
        isEmpty = !conveyor.some((biscuit, index) => { return biscuit !== BiscuitState.None; });
        return isEmpty;
    }

    private moveConveyor = () => {
        let { bakedBiscuits, conveyor } = this.state;

        if (conveyor[conveyor.length - 1] === BiscuitState.Baked) {
            conveyor[conveyor.length - 1] = BiscuitState.None;
            bakedBiscuits++;
        }

        if (conveyor[BakingAreaEndIndex] === BiscuitState.Baking) {
            conveyor[BakingAreaEndIndex] = BiscuitState.Baked;
        }

        if (conveyor[BakingAreaStartIndex] === BiscuitState.Stamped) {
            conveyor[BakingAreaStartIndex] = BiscuitState.Baking;
        }

        for (let i = conveyor.length - 1; i > 0; i--) {
            conveyor[i] = conveyor[i - 1];
        }

        conveyor[0] = BiscuitState.None;

        this.setState({
            bakedBiscuits: bakedBiscuits,
            conveyor: conveyor
        });
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={7}>
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
                            <td></td>
                            <td colSpan={2}>
                                <Oven isHeatingElementOn={this.state.isHeatingElementOn} onGetTemperature={this.getTemperature} />
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            {this.state.conveyor.map((biscuitState, i) => {
                                const state: string = biscuitState === BiscuitState.None ? '' : BiscuitState[biscuitState];
                                return (
                                    <td key={i} className="conveyor-cell">
                                        {state}
                                    </td>
                                )
                            })}
                            <td>Baked: {this.state.bakedBiscuits}</td>
                        </tr>
                        <tr>
                            <td>
                                <Motor isOn={this.state.isMotorOn} pulse={this.onPulse} />
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <Switch onPositionChanged={this.positionChanged}/>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}