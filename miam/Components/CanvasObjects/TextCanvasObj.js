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
	    this.text = props.text;
	}

	componentWillMount(){
		this._animatedValue = new Animated.ValueXY()
	    this._value = {x: 0, y: 0}

	    this._animatedValue.addListener((value) => this._value = value);
	    this._panResponder = PanResponder.create({
	        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
	        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
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
            <View style={styles.container}>
	        <Animated.View 
	          style={
	              {
	                transform: [
	                  {translateX: this._animatedValue.x},
	                  {translateY: this._animatedValue.y},
	                ],
	                backgroundColor: '#00000000'
	              }} 
	            {...this._panResponder.panHandlers}>
	            <Text style={styles.textStyle}>{this.text}</Text>
	        </Animated.View>
	      	</View>
        );
    }
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center'
  	},
	textStyle: {
	    color: "#000000",
	    fontSize: 20,
	    fontWeight: 'bold',
	    textAlign: "center"
	},
});

export default TextCanvasObj;