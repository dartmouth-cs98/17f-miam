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
	    	red: 255,
	    	green: 255,
	    	blue: 255,
	    	fontSize: 20,
	    	rotation: 0,
	    	selected: false,
	    	editor: props.editor || null,
	    	text: "Place Text Here",
	    	animatedValue: new Animated.ValueXY({x: 0, y: 0}),
	    	viewScale: 1
	    };

	    if(props.editor)
	    	props.editor.addLayerRef(props.selectionKey, this);

	    this.deselect = this.deselect.bind(this);
	    this.getLayerInfo = this.getLayerInfo.bind(this);
	}

	componentDidMount(){
		if(this.props.layer){
			this._value = {x: this.props.layer.x, y: this.props.layer.y};
			if(this.props.viewScale)
				this.state.animatedValue.setValue({x: this.props.layer.x * this.props.viewScale, y: this.props.layer.y * this.props.viewScale});
			else
				this.state.animatedValue.setValue({x: this.props.layer.x, y: this.props.layer.y});

			this.setState({
				red: this.props.layer.red,
				green: this.props.layer.green,
				blue: this.props.layer.blue,
				fontSize: this.props.layer.fontSize,
				rotation: this.props.layer.rotation,
				text: this.props.layer.text
			});
		}

		if(this.props.viewScale)
			this.setState({viewScale: this.props.viewScale});
	}

	componentWillMount(){
		if(this.state.editor){
		    this._value = {x: 0, y: 0};

		    this.state.animatedValue.addListener((value) => this._value = value);
		    this._panResponder = PanResponder.create({
		    	onStartShouldSetPanResponder: (evt, gestureState) => true,
	      		onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
		        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
		        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
		        onPanResponderStart: (e, gestureState) => {
				  this.state.editor.selectObj(this, this.state.type, this.state.key);
				  this.setState({selected: true});
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

	deselect(){
		this.setState({selected: false});
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
		                bottom: '50%',
	                    borderRadius: this.state.selected ? 5 : 0,
					    borderColor: this.state.selected ? "#ffaa00" : "#ffffff00",
					    borderWidth: 3
		              }} 
		            {...this._panResponder.panHandlers}>
		            <Text style={
		            	{
		            		color: 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')',
		            		fontSize: this.state.fontSize,
		            		fontWeight: 'bold',
		            		textAlign: "center",
		            		shadowColor: "#000000",
		            		shadowOpacity: 255,
		            		shadowRadius: 10
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
		                bottom: '50%',
	                    borderRadius: 0,
					    borderColor: "#ffffff00",
					    borderWidth: 3 * this.state.viewScale
		              }}>
		            <Text style={
		            	{
		            		color: 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')',
		            		fontSize: this.state.fontSize * this.state.viewScale,
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
    	alignItems: 'center',
    	justifyContent: 'center'
  	}
});

export default TextMemeObj;