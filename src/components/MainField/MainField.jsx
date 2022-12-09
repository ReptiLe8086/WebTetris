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
                       score: 0
                       };
    }
    
    playFieldParameters = {
        width: 400,
        height: 800,
    };
    



    droppedFiguresWithParameters = [];
    currentFigureWithParameters = undefined;

    filledLines = [];

    scoreAddition = 100;

    verticalStepsCount = 10;
    horizontalStepsCount = 20;
    verticalStepSize = this.playFieldParameters.width / this.verticalStepsCount;
    horizontalStepSize = this.playFieldParameters.height / this.horizontalStepsCount;
    xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
    yStart = window.innerHeight/2 - this.playFieldParameters.height/2;

    test = [];
    tickCount = 0;
    keyCount = 0;


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
            this.setState({horizontalPos: (this.state.horizontalPos - 1)})    
            const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed);
            this.setState({currentFigure: figure});
            }
        }
        else if(event.keyCode === 39) {
            if(!this.isOccupiedRight(this.currentFigureWithParameters.x,
                                      this.currentFigureWithParameters.y))
            {
            this.setState({horizontalPos: (this.state.horizontalPos + 1)})    
            const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed);
            this.setState({currentFigure: figure});
            }
        }
        else if(event.keyCode === 40) {
            if(!this.isOccupiedBottom(this.currentFigureWithParameters.x,
                                      this.currentFigureWithParameters.y)) 
            {
                this.setState({rowsPassed: (this.state.rowsPassed + 1)})
                const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed);
                this.setState({currentFigure: figure});
            }
        }
    }

    addScoreBoard() {
        return <Text 
                x={this.xStart - 150}
                y={this.yStart}
                text={`СЧЁТ\n\n ${this.state.score}`}
                fontSize={30}
                fontFamily="Arial, Helvetica, sans-serif"
                fill="black"
                align="center"
                />;
    }

    addEmptyGrid() {

        
        const gridRects = [];

        for(let idx = 0; idx < this.verticalStepsCount; idx ++)
        {
            const rowArray = [];

            for(let i = 0; i < this.horizontalStepsCount; i++) {
            
                rowArray.push(<Block 
                    x={this.xStart}
                    y={this.yStart}
                    width={this.verticalStepSize}
                    height={this.horizontalStepSize}
                    key={String(this.keyCount)}
                    />);
                
                this.keyCount++;    
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
       if(y ===  this.verticalStepSize * 19 + this.yStart) {
            isOccupied = true;
        }
       this.droppedFiguresWithParameters.forEach((item) => {
            if(x === item.x) {
                    if(y + this.verticalStepSize === item.y) {
                        isOccupied = true;
                    }
                }});
       
            
       
       return isOccupied;
    }

    isOccupiedLeft(x, y) {
        let isOccupied = false;
        if(x <= this.xStart) {
            isOccupied = true;
        }
        this.droppedFiguresWithParameters.forEach((item) => {
            if(y === item.y) {
                if(x - this.horizontalStepSize === item.x) {
                    isOccupied = true;
                }
            }
        });
            
        
        return isOccupied;
    }


    isOccupiedRight(x, y) {
        let isOccupied = false;
        if(x >=  this.verticalStepSize * 9 + this.xStart) {
            isOccupied = true;
        }
        this.droppedFiguresWithParameters.forEach((item) => {
            if(y === item.y) {
                if(x + this.horizontalStepSize === item.x) {
                    isOccupied = true;
                }
            }
        }); 
            
        
        return isOccupied;
    }

    isLineFilled() {
        let blockInARowCount = 0;
        let isFilled = false;

        

        for(let i = 0; i < this.horizontalStepsCount; i++) {
            for (let figure of this.droppedFiguresWithParameters) {

                   
                    if(figure.y === this.horizontalStepSize * i + this.yStart) {
                        blockInARowCount++;
                    }
                    
            }
            
            if(blockInARowCount === 10) {
                this.filledLines.push(i);
                isFilled = true;
            }
            blockInARowCount = 0;
        }

        
        return isFilled;
    }


    
    deleteLines() {
        const leftFigures = [];
        this.filledLines.forEach((lineIndex) => {
            this.droppedFiguresWithParameters.forEach((figure) => {
                if(figure.y !== this.verticalStepSize * lineIndex + this.yStart) {
                    if(figure.y < this.verticalStepSize * lineIndex + this.yStart) {
                        figure.y += this.verticalStepSize;
                    
                    }
                    leftFigures.push(figure);
                }
            });
        });
        this.droppedFiguresWithParameters = leftFigures;
        console.log(this.droppedFiguresWithParameters);
        this.refreshBlocks();
    }

    
    refreshBlocks() {

        const newBlocks = [];
        this.setState({droppedFigures: [], score: this.state.score + this.scoreAddition});
        this.droppedFiguresWithParameters.forEach((figure) => {          
            
            const newFigure = this.createFigure((figure.x - this.xStart) / this.horizontalStepSize,
                                                (figure.y - this.yStart) / this.verticalStepSize);
            newBlocks.push(newFigure);             
        });

        this.setState({droppedFigures: newBlocks});
        //console.log(newBlocks);  
    }

    createFigure(leftBorder, bottomBorder) {

        if(bottomBorder > 19){
            bottomBorder = 19;
        }

        let xFigure = this.verticalStepSize * (leftBorder) + this.xStart;
        let yFigure = this.horizontalStepSize * (bottomBorder) + this.yStart;
        let meDie = (1000-7);

        const figure = <Block 
                                x={xFigure}
                                y={yFigure}
                                color='red'
                                width={this.verticalStepSize}
                                height={this.horizontalStepSize}
                                key={String(this.keyCount)}                       
                        />;
        this.keyCount++;
        this.currentFigureWithParameters = {
            x: xFigure,
            y: yFigure
        }
        return figure;
    }

    
    //TODO: add shape type
    dropFigure(figure) {
        
        
     
        this.setState({currentFigure: figure});
        
        //console.log(this.currentFigureWithParameters.y);
        return figure;
    }


    tick(placedFigureCount) {   
       // console.log("tick count", this.tickCount); 
        
            if(this.state.isFieldVisible) {

                    if(this.isLineFilled()) {
                        this.deleteLines();
                    }

                
                    let figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed);
                    //console.log("tick", this.currentFigureWithParameters.y);
                    this.setState({currentFigure: figure});
                    let rows = this.state.rowsPassed;


                    // console.log(this.isOccupiedBottom(this.currentFigureWithParameters.x,
                    //                                   this.currentFigureWithParameters.y));
                    if(this.isOccupiedBottom(this.currentFigureWithParameters.x,
                                             this.currentFigureWithParameters.y)) {
                        
                        this.setState({rowsPassed: 0, horizontalPos: 4, droppedFigures: [...this.state.droppedFigures, figure]});
                        this.droppedFiguresWithParameters.push(this.currentFigureWithParameters);
                        
                    }
                    else {
                        this.setState({rowsPassed: ++rows});
                    }
                
                    
                    
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
                            {this.addScoreBoard()}
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