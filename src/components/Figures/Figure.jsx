import React from "react";
import Konva from "konva";
import Block from "../Block/Block.jsx";


export default class Figure extends React.Component {
    constructor(props) {
        super.props;
        this.state = {color: 'white',
                      blocks: [],
                      rowNumber: props.rowNumber,
                      columnNumber: props.columnNumber,
                      width: props.width,
                      height: props.height}
    }

    createOShape() {
        this.setState({color: 'red'});

        let blocksOShape = [];
        this.setState({})

        blocksOShape.push();


    } ;

    createIShape();

    createJShape();

    createLShape();

    createTShape();

    createZShape();

    createSShape();




}