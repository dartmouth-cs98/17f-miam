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
	    	key: props.selectionKey,
	    	type: "text",
	    	red: props.layer.red || 255,
	    	green: props.layer.green || 255,
	    	blue: props.layer.blue || 255,
	    	fontSize: props.layer.fontSize || 20,
	    	rotation: props.layer.rotation || 0,
	    	editor: props.editor || null,
	    	text: props.layer.text || "Place Text Here",
	    	animatedValue: new Animated.ValueXY({x: props.layer.x || 0, y: props.layer.y || 0})
	    };

	    if(props.editor)
	    	props.editor.addLayerRef(props.selectionKey, this);

	    this.getLayerInfo = this.getLayerInfo.bind(this);
	}

	componentWillMount(){
		if(this.state.editor){
		    this._value = {x: this.props.layer.x || 0, y: this.props.layer.y || 0};

		    this.state.animatedValue.addListener((value) => this._value = value);
		    this._panResponder = PanResponder.create({
		    	onStartShouldSetPanResponder: (evt, gestureState) => true,
	      		onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
		        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
		        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
		        onPanResponderStart: (e, gestureState) => {
				  this.state.editor.setState({ selectedObj: this, selectedType: this.state.type, selectedObjKey: this.state.key });
		        },
		        onPanResponderGrant: (e, gestureState) => {
		          this.state.animatedValue.setOffset({x: this._value.x, y: this._value.y});
		          this.state.animatedValue.setValue({x: 0, y: 0});
		        },
		        onPanResponderMove: Animated.event([
		          null, {dx: this.state.animatedValue.x, dy: this.state.animatedValue.y}
		        ]), // Creates a function to handle the movement and set offsets
		        onPanResponderRelease: () => {
		          this.state.animatedValue.flattenOffset(); // Flatten the offset so it resets the default positioning
		        }
		    });
		}
	}

	getLayerInfo(){
		let coordinates = JSON.parse(JSON.stringify(this.state.animatedValue));

		return {
			type: "text",
			x: coordinates.x,
			y: coordinates.y,
			text: this.state.text,
			fontSize: this.state.fontSize,
			rotation: this.state.rotation,
			red: this.state.red,
			green: this.state.green,
			blue: this.state.blue
		}
	}

	recenter(){
		this.state.animatedValue.setValue({x: 0, y: 0});
	}

    render(){
    	if(this.state.editor){
	        return (
		        <Animated.View 
		          style={
		              {
		                transform: [
		                  {translateX: this.state.animatedValue.x},
		                  {translateY: this.state.animatedValue.y},
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
		            		textAlign: "center"
		            	}
		            }>
		            	{this.state.text}
		            </Text>
		        </Animated.View>
	        );
	    }

	    else{
	    	return (
		        <Animated.View 
		          style={
		              {
		                transform: [
		                  {translateX: this.state.animatedValue.x},
		                  {translateY: this.state.animatedValue.y},
		                  {rotate: this.state.rotation + 'deg'}
		                ],
		                backgroundColor: '#00000000',
		                position: 'absolute',
		                alignSelf: 'center',
		                bottom: '50%'
		              }}>
		            <Text style={
		            	{
		            		color: 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')',
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
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center'
  	}
});

export default TextMemeObj;