import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

export default function Block(props) {
    const {x, y, color, width, height} = props;



    return <Rect 
                x={x}
                y={y}
                width={width}
                height={height}
                stroke='gray'
                strokeWidth={1}
                fill={color || 'white'}
                /> 
}