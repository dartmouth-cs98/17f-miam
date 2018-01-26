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

class TextMemeObj extends React.Component{
	constructor(props){
	    super(props);
	    this.state = {
	    	type: "text",
	    	color: '#FFFFFF',
	    	fontSize: 20,
	    	editor: props.editor || null,
	    	text: props.text || ""
	    };

	    this.id = props.id;
	    this.key = 0;
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
			  this.state.editor.setState({ selected: this, selectedType: "text" });
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
	                ],
	                backgroundColor: '#00000000',
	                position: 'absolute',
	                alignSelf: 'center',
	                bottom: '50%'
	              }} 
	            {...this._panResponder.panHandlers}>
	            <Text style={
	            	{
	            		color: this.state.color,
	            		fontSize: this.state.fontSize,
	            		fontWeight: 'bold',
	            		textAlign: "center"
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

export default TextMemeObj;