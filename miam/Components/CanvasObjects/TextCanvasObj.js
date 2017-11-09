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

class TextCanvasObj extends React.Component{
	constructor(props){
	    super(props);
	    this.state = {
	    	type: "text",
	    	red: 0,
	    	green: 0,
	    	blue: 0,
	    	rotation: 0,
	    	fontSize: 20,
	    	canvas: props.canvas || null,
	    	text: props.text || ""
	    };

	    this.id = props.id;
	}

	componentWillMount(){
		this._animatedValue = new Animated.ValueXY()
	    this._value = {x: 0, y: 0}

	    this._animatedValue.addListener((value) => this._value = value);
	    this._panResponder = PanResponder.create({
	    	onStartShouldSetPanResponder: (evt, gestureState) => true,
      		onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
	        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
	        onPanResponderStart: (e, gestureState) => {
			  this.state.canvas.setState({ selected: this, selectedType: this.state.type, selectedText: this.state.text, createTextMode: false});
	        },
	        onPanResponderGrant: (e, gestureState) => {
	          this._animatedValue.setOffset({x: this._value.x, y: this._value.y});
	          this._animatedValue.setValue({x: 0, y: 0});
	        },
	        onPanResponderMove: Animated.event([
	          null, {dx: this._animatedValue.x, dy: this._animatedValue.y}
	        ]), // Creates a function to handle the movement and set offsets
	        onPanResponderRelease: () => {
	          this._animatedValue.flattenOffset(); // Flatten the offset so it resets the default positioning
	        }
	    });
	}

    render(){

        return (
	        <Animated.View 
	          style={
	              {
	                transform: [
	                  {translateX: this._animatedValue.x},
	                  {translateY: this._animatedValue.y},
	                  {rotate: this.state.rotation + 'deg'}
	                ],
	                backgroundColor: '#00000000',
	                position: 'absolute',
	                alignSelf: 'center',
	                bottom: '50%'
	              }} 
	            {...this._panResponder.panHandlers}>
	            <Text style={
	            	{
	            		color: 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')',
	            		fontSize: this.state.fontSize,
	            		fontWeight: 'bold',
	            		textAlign: "center",
	            		borderBottomWidth: 1
	            	}
	            }>
	            	{this.state.text}
	            </Text>
	        </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center'
  	}
});

export default TextCanvasObj;