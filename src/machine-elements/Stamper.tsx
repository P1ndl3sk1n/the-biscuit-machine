import React from 'react';
import { ExtruderProps } from "./Extruder";

export default function Stamper(props: ExtruderProps) {
    const { pulse, extruderPulsed } = props;  
    React.useEffect(() => {
        if (pulse) {
            extruderPulsed();
        }
    }, [pulse, extruderPulsed]);

    return (
        <span>Stamper {pulse}</span>
    )
}