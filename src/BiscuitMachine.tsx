import React from 'react';

interface BiscuitMachineState {

}

class BiscuitMachine extends React.Component<{}, BiscuitMachineState> {
    constructor(props: {}) {
        super(props);
    
        this.state = {};
    }

    render() {
        return (
            <div>
                BISCUIT MACHINE
            </div>
        )
    }
}

export default BiscuitMachine;