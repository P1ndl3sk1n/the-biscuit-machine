import React from 'react';
import { ExtruderProps } from "./Extruder";

export default function Stamper(props: ExtruderProps) {    
    React.useEffect(() => {
        if (props.pulse) {
        }
    }, [props.pulse]);

    return (
        <span>Stamper</span>
    )
}
