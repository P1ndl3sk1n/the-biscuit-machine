import React from 'react';

export type ExtruderProps = {
    pulse: number
};

export default function Extruder(props: ExtruderProps) {
    React.useEffect(() => {
        if (props.pulse) {
        }
    }, [props.pulse]);

    return (
        <span>Extruder</span>
    )
}
