import React from 'react';

export enum SwitchPosition {
    Off = 'Off',
    On = 'On',
    Paused = 'Paused'
};
interface SwitchProps {
    onPositionChanged: (newPosition: SwitchPosition) => void
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
                <button className="paused" onClick={() => this.setSwitchPosition(SwitchPosition.Paused)}>{SwitchPosition.Paused}</button>
                <div>
                    <button className="on" onClick={() => this.setSwitchPosition(SwitchPosition.On)}>{SwitchPosition.On}</button>
                    <button className="off" onClick={() => this.setSwitchPosition(SwitchPosition.Off)}>{SwitchPosition.Off}</button>
                </div>
                <div>
                    Position: {this.state.position}
                </div>
            </div>
        );
    }
}

export default Switch;