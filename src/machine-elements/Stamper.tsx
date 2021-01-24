import React from 'react';
import { ExtruderProps } from "./Extruder";

export default function Stamper(props: ExtruderProps) {    
    React.useEffect(() => {
        if (props.pulse) {
            props.extruderPulsed();
        }
    }, [props.pulse]);

    return (
        <span>Stamper {props.pulse}</span>
    )
}