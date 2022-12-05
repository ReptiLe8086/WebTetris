import Konva from "konva";
import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import './MainField.css';
import '../Block/Block.jsx';
import Block from "../Block/Block.jsx";





export default class MainField extends React.Component {

    constructor(props) {
        super(props);
        this.state = { color: 'blue',
                       isFieldVisible: false,
                       dropSpeed: 0,
                       isDropped: false,
                       rowsPassed: 0,
                       horizontalPos: 4,
                       droppedFigures: []
                       };
    }
    
    playFieldParameters = {
        width: 400,
        height: 800,
    };
    

    dropped = [];

    verticalStepsCount = 10;
    horizontalStepsCount = 20;
    verticalStepSize = this.playFieldParameters.width / this.verticalStepsCount;
    horizontalStepSize = this.playFieldParameters.height / this.horizontalStepsCount;
    xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
    yStart = window.innerHeight/2 - this.playFieldParameters.height/2;

    test = [];
    testCount = 0;

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

    componentDidMount() {
        // this.setState({playField: this.addEmptyGrid()});
        window.addEventListener('keydown', this.handleKeyDown);
        this.gridID = setInterval(
            () => this.tick(1),
            1000
        );

    }

    componentWillUnmount() {
        clearInterval(this.gridID);
        window.removeEventListener('keydown', this.handleKeyDown);
    }


    startClick = () => {
        this.setState({color: 'lightgray',
                       isFieldVisible: true});
    }



    handleKeyDown = (event) => {
        if(event.keyCode == 37) {
            if(this.state.horizontalPos > 0){

                this.setState({horizontalPos: --this.state.horizontalPos});
            }
        }
        else if(event.keyCode == 39) {
            if(this.state.horizontalPos < 9){
                this.setState({horizontalPos: ++this.state.horizontalPos});
            }
        }
        else if(event.keyCode == 40) {
            if(true) //TODO
            {
                this.setState({rowsPassed: ++this.state.rowsPassed});
            }
        }
    }

    addEmptyGrid() {

        
        const gridRects = [];
        //const isFilledArray = [];

        for(let idx = 0; idx < this.verticalStepsCount; idx ++)
        {
            const rowArray = [];

            for(let i = 0; i < this.horizontalStepsCount; i++) {
            
                rowArray.push(<Block 
                    x={this.xStart}
                    y={this.yStart}
                    width={this.verticalStepSize}
                    height={this.horizontalStepSize}
                    key={String(this.xStart*100)+String(this.yStart*100)}
                    />);
                
    
                this.yStart += this.verticalStepSize;
            }
            gridRects.push(rowArray);

            this.yStart = window.innerHeight/2 - this.playFieldParameters.height/2;
            this.xStart += this.horizontalStepSize;
    
        }
        this.xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
        //this.setState({playField: gridRects, isFilled: true});
        //this.setState({playField: gridRects})
    


        return gridRects;
    }
       

    //TODO: add shape type
    createFigure(leftBorder, bottomBorder) {
        
        const figure = <Block 
                                x={this.xStart + this.verticalStepSize * (leftBorder)}
                                y={this.yStart + this.horizontalStepSize * (bottomBorder)}
                                color='red'
                                width={this.verticalStepSize}
                                height={this.horizontalStepSize}
                               
                        />;
        
        //this.droppedFigures.push(figure);               
        if(bottomBorder==19) {
            this.dropped.push(figure);
        }
        
        console.log("здесь");

        return figure;
    }

    // dropFigure(bottomBorder, leftBorder) {
    //     let playField = this.addEmptyGrid();
    //     const columnArray = playField[bottomBorder];   
    //     const editColumn = columnArray.splice(leftBorder, 1, 
    //         <Block 
    //             x={this.xStart + this.verticalStepSize * (bottomBorder)}
    //             y={this.yStart + this.horizontalStepSize * (leftBorder)}
    //             color='red'
    //             width={this.verticalStepSize}
    //             height={this.horizontalStepSize}
    //             key={String(this.xStart)+String(this.yStart)}
    //             />);
    //     const editField = playField.splice(bottomBorder, 1, editColumn);
        

    //     return editField;

    // }

 

    tick(placedFigureCount) {        
        if(this.state.isFieldVisible) {
            




            let rows = this.state.rowsPassed;
            if(this.dropped.length==0)
                {
                    console.log("Не добавлено");
                }
            else { 
                console.log("Добавлено", this.dropped.length);
                // console.log(this.droppedFigures[this.testCount]);
                // console.log(this.droppedFigures[this.testCount+1]);
                // this.testCount += 2;
             }
            if(rows == 19) {
                
                this.setState({rowsPassed: 0, horizontalPos: 4, droppedFigures: this.dropped});
                
                
            }
            else {
                this.setState({rowsPassed: ++rows, speed: placedFigureCount});
            }
            
    
    
            // this.setState({playField: grid, speed: placedFigureCount});
        }
        
        
    }



    render() {
        return (
                <div className="MainField" id="container" tabIndex={1} onKeyDown={this.handleKeyDown} autoFocus>
                 {this.state.isFieldVisible
                ?
                (<Stage id="mainStage" width={window.innerWidth} height={window.innerHeight} style={{backgroundColor: this.state.color, justifyContent: 'center'}}>
                        <Layer id="fieldLayer" style={{backgroundColor: 'blue'}}>
                            {this.addEmptyGrid()}
                            
                            {this.createFigure(this.state.horizontalPos, this.state.rowsPassed)}
                            {this.state.droppedFigures}						
                            
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