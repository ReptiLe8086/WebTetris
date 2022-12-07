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
                       droppedFigures: [],
                       currentFigure: undefined,
                       
                       };
    }
    
    playFieldParameters = {
        width: 400,
        height: 800,
        xStart: 175.5,
        yStart: 59,
        xFinish: 535.5,
        yFinish: 819
    };
    

    droppedFiguresWithParameters = [];
    currentFigureWithParameters = undefined;

    filledLines = [];



    verticalStepsCount = 10;
    horizontalStepsCount = 20;
    verticalStepSize = this.playFieldParameters.width / this.verticalStepsCount;
    horizontalStepSize = this.playFieldParameters.height / this.horizontalStepsCount;
    xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
    yStart = window.innerHeight/2 - this.playFieldParameters.height/2;

    test = [];
    tickCount = 0;

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
            100
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
        if(event.keyCode === 37) {
            if(!this.isOccupiedLeft(this.currentFigureWithParameters.x,
                this.currentFigureWithParameters.y))
            {
            const figure = this.createFigure(--this.state.horizontalPos, this.state.rowsPassed);
            }
        }
        else if(event.keyCode === 39) {
            if(!this.isOccupiedRight(this.currentFigureWithParameters.x,
                                      this.currentFigureWithParameters.y))
            {
            const figure = this.createFigure(++this.state.horizontalPos, this.state.rowsPassed);
            }
        }
        else if(event.keyCode === 40) {
            if(!this.isOccupiedBottom(this.currentFigureWithParameters.x,
                                      this.currentFigureWithParameters.y)) 
            {
                const figure = this.createFigure(this.state.horizontalPos, ++this.state.rowsPassed);
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
        return gridRects;
    }
       
    isOccupiedBottom(x, y) {
       let isOccupied = false;
       if(y >= this.playFieldParameters.height) {
            isOccupied = true;
        }
       for(let figure of this.droppedFiguresWithParameters) {
            if(x === figure.x) {
                if(y + this.verticalStepSize === figure.y) {
                    isOccupied = true;
                }
            }
       }
       return isOccupied;
    }

    isOccupiedLeft(x, y) {
        let isOccupied = false;
        if(x <= this.xStart) {
            isOccupied = true;
        }
        for(let figure of this.droppedFiguresWithParameters) {
            if(y === figure.y) {
                if(x - this.horizontalStepSize === figure.x) {
                    isOccupied = true;
                }
            }
        }
        return isOccupied;
    }


    isOccupiedRight(x, y) {
        let isOccupied = false;
        if(x >= this.xStart + this.verticalStepSize * 9) {
            isOccupied = true;
        }
        for(let figure of this.droppedFiguresWithParameters) {
            if(y === figure.y) {
                if(x + this.horizontalStepSize === figure.x) {
                    isOccupied = true;
                }
            }
        }
        return isOccupied;
    }

    isLineFilled() {
        let blockInARowCount = 0;
        let isFilled = false;

        

        for(let i = 0; i < this.horizontalStepsCount; i++) {
            for (let figure of this.droppedFiguresWithParameters) {

                   
                    if(figure.y === this.yStart + this.horizontalStepSize * i) {
                        blockInARowCount++;
                        //console.log("ТУТ", i);
                    }
                    
            }
            
            if(blockInARowCount === 10) {
                this.filledLines.push(i);
                isFilled = true;
                console.log("Линия собралась");
            }
            blockInARowCount=0;
        }
            

            
    

       // console("Блоков в одной линии", blockInARowCount);
        return isFilled;
    }


    //TODO
    deleteLines() {
        for(let row of this.filledLines) {
            for(let figure of this.droppedFiguresWithParameters) {
                if(figure.y === this.yStart + this.verticalStepSize * row) {
                    this.droppedFiguresWithParameters.splice(this.droppedFiguresWithParameters.indexOf(figure), 1);
                    for(let leftFigure of this.droppedFiguresWithParameters) {
                        if(leftFigure.y < figure.y) {
                            leftFigure.y += this.verticalStepSize;
                        }
                    }
                }
            }
        }

        this.refreshBlocks();
    }

    //TODO
    refreshBlocks() {
        let newBlocks = [];
        for(let figure of this.droppedFiguresWithParameters) {
            newBlocks.push(this.createFigure((figure.y - this.yStart) / this.verticalStepSize),
                                            ((figure.x - this.xStart) / this.horizontalStepSize));
        }
        this.setState({droppedFigures: newBlocks});
    }


    //TODO: add shape type
    createFigure(leftBorder, bottomBorder) {
        
        if(bottomBorder > 19){
            bottomBorder = 19;
        }

        let xFigure = this.xStart + this.verticalStepSize * (leftBorder);
        let yFigure = this.yStart + this.horizontalStepSize * (bottomBorder);

        const figure = <Block 
                                x={xFigure}
                                y={yFigure}
                                color='red'
                                width={this.verticalStepSize}
                                height={this.horizontalStepSize}                       
                        />;
              
        this.setState({currentFigure: figure});
        this.currentFigureWithParameters = {
            x: xFigure,
            y: yFigure
        }
        //console.log(this.currentFigureWithParameters.y);
        return figure;
    }


    tick(placedFigureCount) {   
       // console.log("tick count", this.tickCount); 
        
            if(this.state.isFieldVisible) {
                //console.log(this.isLineFilled());
                    this.isLineFilled();
                    let figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed);
                    //console.log("tick", this.currentFigureWithParameters.y);
                    let rows = this.state.rowsPassed;


                    // console.log(this.isOccupiedBottom(this.currentFigureWithParameters.x,
                    //                                   this.currentFigureWithParameters.y));
                    if(this.isOccupiedBottom(this.currentFigureWithParameters.x,
                                             this.currentFigureWithParameters.y)) {
                        
                        this.setState({rowsPassed: 0, horizontalPos: 4, droppedFigures: [...this.state.droppedFigures, figure]});
                        this.droppedFiguresWithParameters.push(this.currentFigureWithParameters);
                        
                    }
                    else {
                        this.setState({rowsPassed: ++rows, speed: placedFigureCount});
                    }
                
                    
                // if(this.isLineFilled()) {
                //     this.deleteLines();
                // }
            
                    //console.log(this.droppedFiguresWithParameters);
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
                            {this.state.currentFigure}
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