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
                       droppedBlocks: [],
                       currentFigure: [],
                       currentFigureType: 'O',
                       score: 0
                       };
    }
    
    playFieldParameters = {
        width: 400,
        height: 800,
    };
    



    droppedBlocksWithParameters = [];
    currentFigureWithParameters = undefined;

    filledLines = [];

    scoreAddition = 100;
    isGameLost = false;


    verticalStepsCount = 10;
    horizontalStepsCount = 20;
    verticalStepSize = this.playFieldParameters.width / this.verticalStepsCount;
    horizontalStepSize = this.playFieldParameters.height / this.horizontalStepsCount;
    xStart = window.innerWidth/2 - this.playFieldParameters.width/2;
    yStart = window.innerHeight/2 - this.playFieldParameters.height/2;

    test = [];
    tickCount = 0;
    keyCount = 0;

    interval = 500;

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
        window.addEventListener('keydown', this.handleKeyDown);
        this.gridID = setInterval(
            () => this.tick(1),
            this.interval
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
            if(!this.isOccupiedLeft(this.currentFigureWithParameters))
            {
            this.setState({horizontalPos: (this.state.horizontalPos - 1)})    
            const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed, this.state.currentFigureType);
            this.setState({currentFigure: figure});
            }
        }
        else if(event.keyCode === 39) {
            if(!this.isOccupiedRight(this.currentFigureWithParameters))
            {
            this.setState({horizontalPos: (this.state.horizontalPos + 1)})    
            const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed, this.state.currentFigureType);
            this.setState({currentFigure: figure});
            }
        }
        else if(event.keyCode === 40) {
            if(!this.isOccupiedBottom(this.currentFigureWithParameters)) 
            {
                this.setState({rowsPassed: (this.state.rowsPassed + 1)})
                const figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed, this.state.currentFigureType);
                this.setState({currentFigure: figure});

                //this.interval = 10;
            }
            //this.interval = 300;
        }
        else if(event.keyCode === 38) {
            //TODO
            if(!this.isOccupiedBottom(this.currentFigureWithParameters) && !this.isOccupiedRight(this.currentFigureWithParameters) && !this.isOccupiedLeft(this.currentFigureWithParameters))
            {
                this.rotateFigure();
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
    
    isOccupiedBottom(figure) {
        let isOccupied = false;
        figure.forEach((block) => {
            if(block.y === this.verticalStepSize * 19 + this.yStart) {
                isOccupied = true;
            }
            this.droppedBlocksWithParameters.forEach((item) => {
                if(block.x === item.x) {
                    //console.log("проверка");
                    if(block.y + this.verticalStepSize === item.y) {
                        isOccupied = true;
                    }
                }
            });
        });
        return isOccupied;
     }


    isOccupiedLeft(figure) {
        let isOccupied = false;
        figure.forEach((block) => {
            if(block.x <= this.xStart) {
                isOccupied = true;
            }
            this.droppedBlocksWithParameters.forEach((item) => {
                if(block.y === item.y) {
                    if(block.x - this.horizontalStepSize === item.x) {
                        isOccupied = true;
                    }
                }
            });
        });
        return isOccupied;
    }


    isOccupiedRight(figure) {
        let isOccupied = false;
        figure.forEach((block) => {
            if(block.x >= this.verticalStepSize * 9 + this.xStart) {
                isOccupied = true;
            }
            this.droppedBlocksWithParameters.forEach((item) => {
                if(block.y === item.y) {
                    if(block.x + this.horizontalStepSize === item.x) {
                        isOccupied = true;
                    }
                }
            });
        });
        return isOccupied;
    }

    isLineFilled() {
        let blockInARowCount = 0;
        let isFilled = false;

        for(let i = this.horizontalStepsCount - 1; i >= 0; i--) {
            for (let block of this.droppedBlocksWithParameters) {
                    if(block.y === this.horizontalStepSize * i + this.yStart) {
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

    randomizeType() {
        let randomNumber = Math.floor(Math.random() * 7);
        let type;
        switch(randomNumber) {
            case 0:
                type = 'O';
                break;
            case 1:
                type = 'I';
                break;
            case 2:
                type = 'J';
                break;
            case 3:
                type = 'L';
                break;
            case 4:
                type = 'T';
                break;
            case 5:
                type = 'Z';
                break;
            case 6:
                type = 'S';
                break;                                        
            default:
                type = 'error';
                break;    
        }
        return type;
    }

    
    deleteLines() {
        
        //console.log(this.filledLines);
        this.filledLines.forEach((lineIndex) => {
            const leftBlocks = [];
            this.droppedBlocksWithParameters.forEach((block) => {
                if(block.y !== this.verticalStepSize * lineIndex + this.yStart) {
                    if(block.y < this.verticalStepSize * lineIndex + this.yStart) {
                        block.y += this.verticalStepSize;                    
                    }
                    leftBlocks.push(block);
                }
            });
            this.setState({score: this.state.score + this.scoreAddition});
            this.droppedBlocksWithParameters = leftBlocks;
        });
        this.filledLines = [];
        
        //console.log(this.droppedBlocksWithParameters);
        this.refreshBlocks();
    }

    
    refreshBlocks() {
        let newBlocks = [];
        this.setState({droppedBlocks: []});
        this.droppedBlocksWithParameters.forEach((block) => {          
            
            let newBlock = this.createBlock(block.x, block.y, block.color);
            newBlocks.push(newBlock);             
        });
        
        this.setState({droppedBlocks: newBlocks}); 
    }

    rotateFigure() {
        switch(this.state.currentFigureType) {
            case 'I':
                this.setState({currentFigureType: 'I1'});
                break;
            case 'I1':
                this.setState({currentFigureType: 'I'});
                break;
            case 'J':
                this.setState({currentFigureType: 'J1'});
                break;
            case 'J1':
                this.setState({currentFigureType: 'J2'});
                break;
            case 'J2':
                this.setState({currentFigureType: 'J3'});
                break;
            case 'J3':
                this.setState({currentFigureType: 'J'});
                break; 
            case 'L':
                this.setState({currentFigureType: 'L1'});
                break;
            case 'L1':
                this.setState({currentFigureType: 'L2'});
                break;
            case 'L2':
                this.setState({currentFigureType: 'L3'});
                break; 
            case 'L3':
                this.setState({currentFigureType: 'L'});
                break;
            case 'T':
                this.setState({currentFigureType: 'T1'});
                break;
            case 'T1':
                this.setState({currentFigureType: 'T2'});
                break;
            case 'T2':
                this.setState({currentFigureType: 'T3'});
                break;
            case 'T3':
                this.setState({currentFigureType: 'T'});
                break; 
            case 'Z':
                this.setState({currentFigureType: 'Z1'});
                break;
            case 'Z1':
                this.setState({currentFigureType: 'Z'});
                break;
            case 'S':
                this.setState({currentFigureType: 'S1'});
                break;
            case 'S1':
                this.setState({currentFigureType: 'S'});
                break;
            default:
                break;         
        }
    } 

    createBlock(x, y, color) {
        return <Block 
                        x={x}
                        y={y}
                        color={color}
                        width={this.verticalStepSize}
                        height={this.horizontalStepSize}
                        key={String(++this.keyCount)}
                />; 
    } 

    createFigure(column, row, shapeType) {

        const figureArr = [];

        if(column < 0) {
            column = 0;
        }
        else if(column > 9) {
            column = 9;
        }

        if(row > 19){
            row = 19;
        }

        let xFigure = this.verticalStepSize * (column) + this.xStart;
        let yFigure = this.horizontalStepSize * (row) + this.yStart;
        let meDie = (1000-7);

        if(shapeType === 'O') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='lightgreen'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='lightgreen'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='lightgreen'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='lightgreen'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'lightgreen'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'lightgreen'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'lightgreen'},
                {x: xFigure + this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'lightgreen'}]; 
        }
        else if(shapeType === 'I') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='blue'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 3 * this.horizontalStepSize}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'blue'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'blue'},
                {x: xFigure, y: yFigure + 2 * this.horizontalStepSize, color: 'blue'},
                {x: xFigure, y: yFigure + 3 * this.horizontalStepSize, color: 'blue'}];
        }
        else if(shapeType === 'I1') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='blue'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + 2 * this.verticalStepSize}
                                    y={yFigure}
                                    color='blue'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'blue'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'blue'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'blue'},
                {x: xFigure + 2 * this.verticalStepSize, y: yFigure, color: 'blue'}];
        }
        else if(shapeType === 'J') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='red'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'red'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'red'},
                {x: xFigure, y: yFigure + 2 * this.horizontalStepSize, color: 'red'},
                {x: xFigure - this.verticalStepSize, y: yFigure + 2 * this.horizontalStepSize, color: 'red'}];
        }
        else if(shapeType === 'J1') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='red'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + 2 * this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'red'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'red'},
                {x: xFigure + this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'red'},
                {x: xFigure + 2 * this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'red'}];
        }
        else if(shapeType === 'J2') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='red'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'red'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'red'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'red'},
                {x: xFigure, y: yFigure + 2 * this.horizontalStepSize, color: 'red'}];
        }
        else if(shapeType === 'J3') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='red'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='red'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'red'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'red'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'red'},
                {x: xFigure + this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'red'}];
        }
        else if(shapeType === 'L') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='orange'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'orange'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'orange'},
                {x: xFigure, y: yFigure + 2 * this.horizontalStepSize, color: 'orange'},
                {x: xFigure + this.verticalStepSize, y: yFigure + 2 * this.horizontalStepSize, color: 'orange'}];
        }
        else if(shapeType === 'L1') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='orange'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'orange'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'orange'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'orange'},
                {x: xFigure - 2 * this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'orange'}];
        }
        else if(shapeType === 'L2') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='orange'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + 2 * this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'orange'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'orange'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'orange'},
                {x: xFigure, y: yFigure + 2 * this.horizontalStepSize, color: 'orange'}];
        }
        else if(shapeType === 'L3') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='orange'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.horizontalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - 2 * this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='orange'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'orange'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'orange'},
                {x: xFigure - this.horizontalStepSize, y: yFigure + this.horizontalStepSize, color: 'orange'},
                {x: xFigure - 2 * this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'orange'}];
        }
        else if(shapeType === 'T') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='purple'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'purple', type: 'T'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'purple', type: 'T'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'purple', type: 'T'},
                {x: xFigure + this.verticalStepSize + this.verticalStepSize, y: yFigure, color: 'purple', type: 'T'}];
        }
        else if(shapeType === 'T1') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='purple'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure - this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'purple'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'purple'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'purple'},
                {x: xFigure, y: yFigure - this.horizontalStepSize, color: 'purple'}];
        }
        else if(shapeType === 'T2') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='purple'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure - this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'purple'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'purple'},
                {x: xFigure, y: yFigure - this.horizontalStepSize, color: 'purple'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'purple'}];
        }
        else if(shapeType === 'T3') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='purple'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure - this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='purple'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'purple'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'purple'},
                {x: xFigure, y: yFigure - this.horizontalStepSize, color: 'purple'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'purple'}];
        }
        else if(shapeType === 'Z') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='yellow'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'yellow'},
                {x: xFigure - this.verticalStepSize, y: yFigure, color: 'yellow'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'yellow'},
                {x: xFigure + this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'yellow'}];
        }
        else if(shapeType === 'Z1') {
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='yellow'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure - this.horizontalStepSize}
                                    color='yellow'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'yellow'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'yellow'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'yellow'},
                {x: xFigure + this.verticalStepSize, y: yFigure - this.horizontalStepSize, color: 'yellow'}];
        }
        else if(shapeType === 'S'){
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='brown'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure + this.horizontalStepSize}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure - this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'brown'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'brown'},
                {x: xFigure, y: yFigure + this.horizontalStepSize, color: 'brown'},
                {x: xFigure - this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'brown'}];
        }
        else if(shapeType === 'S1'){
            figureArr.push(<Block 
                                   x={xFigure}
                                   y={yFigure}
                                   color='brown'
                                   width={this.verticalStepSize}
                                   height={this.horizontalStepSize}
                                   key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure}
                                    y={yFigure - this.horizontalStepSize}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            figureArr.push(<Block 
                                    x={xFigure + this.verticalStepSize}
                                    y={yFigure + this.horizontalStepSize}
                                    color='brown'
                                    width={this.verticalStepSize}
                                    height={this.horizontalStepSize}
                                    key={String(this.keyCount)}
                            />);
            this.keyCount++;
            this.currentFigureWithParameters = [
                {x: xFigure, y: yFigure, color: 'brown'},
                {x: xFigure + this.verticalStepSize, y: yFigure, color: 'brown'},
                {x: xFigure, y: yFigure - this.horizontalStepSize, color: 'brown'},
                {x: xFigure + this.verticalStepSize, y: yFigure + this.horizontalStepSize, color: 'brown'}];
        }
           
                                                                                                                              
        return figureArr;
    }

    
    dropFigure(figure) {
        
        
     
        this.setState({currentFigure: figure});
        return figure;
    }


    tick(placedFigureCount) {    
            if(this.state.isFieldVisible) {
                //console.log(this.isGameLost);
                    if(this.isGameLost) {
                        this.setState({isFieldVisible: false});
                        alert(`Игра окончена! Счёт: ${this.state.score}`);
                        this.isGameLost = false;
                    }
                    
                    if(this.isLineFilled()) {
                        this.deleteLines();
                    }
                    //this.setState({currentFigureType: this.randomizeType()});
                
                    let figure = this.createFigure(this.state.horizontalPos, this.state.rowsPassed, this.state.currentFigureType);
                    
                    this.setState({currentFigure: [...figure]});
                    //console.log(this.state.currentFigure);
                    let rows = this.state.rowsPassed;
                    //console.log(this.state.currentFigure);
                    if(this.isOccupiedBottom(this.currentFigureWithParameters)) {
                        
                        if(this.state.rowsPassed === 0) {
                            this.isGameLost = true;
                        }

                        this.setState({rowsPassed: 0, horizontalPos: 4, droppedBlocks: [...this.state.droppedBlocks, ...figure]});
                        this.droppedBlocksWithParameters = [...this.droppedBlocksWithParameters,
                                                            ...this.currentFigureWithParameters];
                        
                                                           
                        //console.log(this.currentFigureWithParameters);                                  
                        //console.log(this.droppedBlocksWithParameters);
                        this.setState({currentFigureType: this.randomizeType()});
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
                            {this.state.droppedBlocks}
                           						
                            
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