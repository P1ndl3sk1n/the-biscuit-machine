import React from 'react';

export type ExtruderProps = {
    pulse: number,
    extruderPulsed: any
};

export default function Extruder(props: ExtruderProps) {
    const {pulse, extruderPulsed} = props;
    React.useEffect(() => {
        if (pulse) {
            extruderPulsed();
        }
    }, [pulse, extruderPulsed]);

    return (
        <span>Extruder {pulse}</span>
    )
}