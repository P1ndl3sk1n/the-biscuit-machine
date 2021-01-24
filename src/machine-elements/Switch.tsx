import React from 'react';

interface SwitchProps {
    onPositionChanged: any
}

interface SwitchState {
    position: SwitchPosition
}

class Switch extends React.Component<SwitchProps, SwitchState>  {
    constructor(props: SwitchProps) {
        super(props);

        this.state = {
            position: SwitchPosition.Off
        };
    }

    private setSwitchPosition = (newPosition: SwitchPosition): void => {
        this.setState({
            position: newPosition
        });

        this.props.onPositionChanged(newPosition);
    }

    render() {
        return (
            <div>
                <div>SWITCH</div>
                <button onClick={() => this.setSwitchPosition(SwitchPosition.Paused)}>{SwitchPosition.Paused}</button>
                <div>
                    <button onClick={() => this.setSwitchPosition(SwitchPosition.On)}>{SwitchPosition.On}</button>
                    <button onClick={() => this.setSwitchPosition(SwitchPosition.Off)}>{SwitchPosition.Off}</button>
                </div>
                <div>
                    Position: {this.state.position}
                </div>
            </div>
        );
    }
}

export enum SwitchPosition {
    Off = 'Off',
    On = 'On',
    Paused = 'Paused'
};

export default Switch;