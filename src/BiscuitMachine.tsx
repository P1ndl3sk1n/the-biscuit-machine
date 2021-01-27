import React from 'react';
import Extruder from "./machine-elements/Extruder";
import Motor from "./machine-elements/Motor";
import Oven from "./machine-elements/Oven";
import Stamper from "./machine-elements/Stamper";
import Switch, { SwitchPosition } from "./machine-elements/Switch";

enum BiscuitState {
    None = 0,
    Extruded = 1,
    Stamped = 2,
    Baking = 3,
    Baked = 4,
    BurnOut = 5
}

interface BiscuitMachineState {
    switchPosition: SwitchPosition,
    isMotorOn: boolean,
    isHeatingElementOn: boolean,
    pulse: number,
    bakedBiscuits: number,
    conveyor: BiscuitState[],
    displayBurningBiscuitsMessage: boolean,
    displayBurnOutBiscuitsMessage: boolean
}

const MinBakingTemperature: number = 220;
const MaxBakingTemperature: number = 240;
const ConveyorLength: number = 6;
const BakingAreaStartIndex: number = 3;
const BakingAreaEndIndex: number = 4;
export const MotorPulseInterval: number = 5; 

export default class BiscuitMachine extends React.Component<object, BiscuitMachineState> {
    private warningTimeout: any;
    private burnOutTimeout: any;

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
            conveyor: conveyor,
            displayBurningBiscuitsMessage: false,
            displayBurnOutBiscuitsMessage: false
        };
    }

    componentWillUnmount() {
        clearInterval(this.warningTimeout);
        clearInterval(this.burnOutTimeout);
    }

    positionChanged = (switchPosition: SwitchPosition) => {
        this.setState({
            switchPosition
        });

        this.updateMessages(switchPosition);
    }

    getTemperature = (temperature: number) => {
        this.updateOven(temperature);
        this.updateMotor(temperature);
    }

    pulse = () => {
        if (!this.isConveyorEmpty()) {
            this.updateConveyor();
        }
        this.motorPulsed();
    }

    onExtruderPulsed = () => {
        if (this.state.switchPosition === SwitchPosition.Off) {
            return;
        }
        
        let conveyor = this.state.conveyor;

        if (conveyor[0] === BiscuitState.None) {
            conveyor[0] = BiscuitState.Extruded;
        }

        this.setState({
            conveyor
        });
    }

    onStamperPulsed = () => {
        if (this.state.switchPosition === SwitchPosition.Off) {
            return;
        }

        let conveyor = this.state.conveyor;

        if (conveyor[1] === BiscuitState.Extruded) {
            conveyor[1] = BiscuitState.Stamped;
        }

        this.setState({
            conveyor
        });
    }

    private motorPulsed = () => {
        this.setState({
            pulse: 1
        });
        setTimeout(() => {
            this.setState({
                pulse: 0
            });
        }, 1000);
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
        let isMotorOn: boolean = false; // switch is SwitchPosition.Paused

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
        isEmpty = !conveyor.some((biscuit, index) => { 
            return biscuit !== BiscuitState.None; 
        });
        
        return isEmpty;
    }

    private updateConveyor = () => {
        let { bakedBiscuits, conveyor } = this.state;

        if (conveyor[conveyor.length - 1] === BiscuitState.Baked) {
            bakedBiscuits++;
        }

        if (conveyor[BakingAreaEndIndex] === BiscuitState.Baking) {
            conveyor[BakingAreaEndIndex] = BiscuitState.Baked;
        }

        for (let i = conveyor.length - 1; i > 0; i--) {
            conveyor[i] = conveyor[i - 1];
        }

        if (conveyor[BakingAreaStartIndex] === BiscuitState.Stamped) {
            conveyor[BakingAreaStartIndex] = BiscuitState.Baking;
        }

        conveyor[0] = BiscuitState.None;

        this.setState({
            bakedBiscuits: bakedBiscuits,
            conveyor: conveyor
        });
    }

    private hasBakingBiscuits = () => {
        for (let i = BakingAreaStartIndex; i <= BakingAreaEndIndex; i++) {
            if (this.state.conveyor[i] === BiscuitState.Baking) {
                return true;
            }
        }

        return false;
    }

    private updateMessages = (switchPosition: SwitchPosition) => {
        let displayBurningBiscuitsMessage: boolean = false;
        let displayBurnOutBiscuitsMessage: boolean = false;

        if (switchPosition === SwitchPosition[SwitchPosition.Paused] && this.hasBakingBiscuits()) {
            setTimeout(() => {
                if (this.state.switchPosition === SwitchPosition.Paused) {
                    displayBurningBiscuitsMessage = true;
                    this.setState({
                        displayBurningBiscuitsMessage,
                        displayBurnOutBiscuitsMessage
                    });
                }

                clearTimeout(this.warningTimeout);
            }, 2 * MotorPulseInterval * 1000);

            setTimeout(() => {
                if (this.state.switchPosition === SwitchPosition.Paused) {
                    for (let i = BakingAreaStartIndex; i <= BakingAreaEndIndex; i++) {
                        let { conveyor } = this.state;
                        if (conveyor[i] === BiscuitState.Baking) {
                            conveyor[i] = BiscuitState.BurnOut;
                            displayBurnOutBiscuitsMessage = true;
                        }

                        this.setState({
                            conveyor
                        });
                    }
                    displayBurningBiscuitsMessage = false;
                    this.setState({
                        displayBurningBiscuitsMessage,
                        displayBurnOutBiscuitsMessage
                    });
                }
                
                clearTimeout(this.burnOutTimeout);
            }, 3 * MotorPulseInterval * 1000);
        } else {
            clearTimeout(this.warningTimeout);
            clearTimeout(this.burnOutTimeout);
        }

        this.setState({
            displayBurningBiscuitsMessage,
            displayBurnOutBiscuitsMessage
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
                                <Motor isOn={this.state.isMotorOn} onPulse={this.pulse} />
                            </td>
                            <td colSpan={4} className="warning">
                                {this.state.displayBurningBiscuitsMessage &&
                                <div className="warning-msg">
                                    <i className="fa fa-warning"></i>
                                    Biscuits in the oven are going to burn out!
                                </div>
                                }
                                {this.state.displayBurnOutBiscuitsMessage &&
                                <div className="error-msg">
                                    <i className="fa fa-times-circle"></i>
                                    The biscuits in the oven burnt out!
                                </div>
                                }
                            </td>
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