import React from 'react';
import {
    Component,
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native';
import TxtCObj from './CanvasObjects/TextCanvasObj';
import ImgCObj from './CanvasObjects/ImageCanvasObj';
import TestCObj from './CanvasObjects/TestCanvasObj';

class TestCanvas extends React.Component{
	constructor(props){
	    super(props);
		this.state = {
			canvasObjs: []
		};

        this.state.canvasObjs.push(<TxtCObj key={1} text="Nina"/>);
        this.state.canvasObjs.push(<TxtCObj key={2} text="Nicole"/>);
        this.state.canvasObjs.push(<TxtCObj key={3} text="Xinwei"/>);
        this.state.canvasObjs.push(<TxtCObj key={4} text="Weijia"/>);
        this.state.canvasObjs.push(<TxtCObj key={5} text="Edward"/>);
	}

	addImageCanvasObj(result){
		this.state.canvasObjs.push(<ImgCObj imageURI={result.uri}/>);
        console.log(this.state.canvasObjs);
	}

    render(){

        return (
            <View style={styles.container}>
                {this.state.canvasObjs}
	      	</View>
        );
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    width: 100,
    height: 100
  }
});

export default TestCanvas;