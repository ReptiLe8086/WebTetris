import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

export default function MainField() {

    const layerStyle = {
        justifyContent: 'center',
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer style={layerStyle}>
                <Rect
                    x={10}
                    y={10}
                    width={300}
                    height={500}
                    stroke='black'
                    strokeWidth={1}
                    />
            </Layer>
            </Stage>
    );
}