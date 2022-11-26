import Konva from "konva";
import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import './MainField.css';

export default class MainField extends React.Component {

    constructor(props) {
        super(props);
        this.state = { color: 'blue', isFieldVisible: false };
    }
    
    

    playFieldParameters = {
        width: 400,
        height: 800,
    };

    buttonStyle = {
        backgroundColor: 'red',
        fontSize: 45,
        color: 'white',
        borderColor: 'white',
        borderWidth: 'medium', 
        justifyContent: 'center',
        alignItems: 'center',
        size: 'lg',
    };

    startClick = () => {
        this.setState({color: 'lightgray', isFieldVisible: true});
    };

    addGrid() {
        const verticalStepsCount = 10;
        const horizontalStepsCount = 20;
        const verticalStepSize = this.playFieldParameters.width / verticalStepsCount;
        const horizontalStepSize = this.playFieldParameters.height / horizontalStepsCount;

        let xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
        let yStart = window.innerHeight/2 - this.playFieldParameters.height/2;
        
        let gridRects = [];

        //vertical
        for(let idx = 0; idx <= horizontalStepsCount; idx ++)
        {
            for(let i = 0; i <= verticalStepsCount; i++) {
            
                gridRects.push(
                    <Rect
                    x={xStart}
                    y={yStart}
                    width={verticalStepSize}
                    height={horizontalStepSize} 
                    stroke='gray'
                    strokeWidth={1}
                    />);
    
                xStart += verticalStepSize;
            }
            xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
            yStart += horizontalStepSize;
    
        }
        
        //horizontal
        // for(let i = 0; i <= horizontalStepsCount; i++) {

        //     gridLines.push(
        //         <Line points={[
        //             xStart,
        //             yStart,
        //             xStart + this.playFieldParameters.width,
        //             yStart,
                    
        //         ]} 
        //         stroke='black'
        //         strokeWidth={1}
        //         />);

        // yStart += horizontalStepSize;    
        // }
        return gridRects;
    };
    


    render() {
        return (
                <div className="MainField" id="container">
                 {this.state.isFieldVisible
                ?
                (<Stage id="mainStage" width={window.innerWidth} height={window.innerHeight} style={{backgroundColor: this.state.color, justifyContent: 'center'}}>
                        <Layer id="fieldLayer" style={{backgroundColor: 'blue'}}>
                            {this.addGrid()}						
                        </Layer>
                </Stage>) 
                : 
                    (<button onClick={this.startClick} style={this.buttonStyle} >
                    СТАРТ
                    </button>)}
                </div>
            );
                
    }
    
}