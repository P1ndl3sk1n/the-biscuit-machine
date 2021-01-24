import React from 'react';

export type ExtruderProps = {
    pulse: number,
    extruderPulsed: any
};

export default function Extruder(props: ExtruderProps) {
    React.useEffect(() => {
        if (props.pulse) {
            props.extruderPulsed();
        }
    }, [props.pulse]);

    return (
        <span>Extruder {props.pulse}</span>
    )
}