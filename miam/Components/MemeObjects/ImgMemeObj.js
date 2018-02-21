import React from 'react';
import {
    Component,
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions,
    Image
} from 'react-native';

class ImgMemeObj extends React.Component{
	constructor(props){
	    super(props);
	    
	    this.state = {
	    	key: props.selectionKey,
	    	imgURL: "https://vignette.wikia.nocookie.net/creation/images/7/7e/Red_x.png/revision/latest?cb=20160323201834",
	    	type: "img",
	    	scaling: 1,
	    	rotation: 0,
	    	editor: props.editor || null,
	    	animatedValue: new Animated.ValueXY({x: 0, y: 0}),
	    	viewScale: 1
	    };

	    this.defaultWidth = 150;
	    this.defaultHeight = 100;

	    if(props.editor)
	    	props.editor.addLayerRef(props.selectionKey, this);

	    this.recenter = this.recenter.bind(this);
	    this.updateImgURL = this.updateImgURL.bind(this);
	}

	componentDidMount(){
		if(this.props.layer){
			this._value = {x: this.props.layer.x, y: this.props.layer.y};
			if(this.props.viewScale)
				this.state.animatedValue.setValue({x: this.props.layer.x * this.props.viewScale, y: this.props.layer.y * this.props.viewScale});
			else
				this.state.animatedValue.setValue({x: this.props.layer.x, y: this.props.layer.y});

			this.setState({
				imgURL: this.props.layer.imgURL,
				scaling: this.props.layer.scaling,
				rotation: this.props.layer.rotation
			});
		}
		else{
			this.setState({
				imgURL: this.props.imgURL
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

	updateImgURL(imgURL){
		this.setState({
			imgURL: imgURL
		});
	}

	recenter(){
		this.state.animatedValue.setValue({x: 0, y: 0});
	}

	getLayerInfo(){
		let coordinates = JSON.parse(JSON.stringify(this.state.animatedValue));

		return {
			type: "img",
			x: coordinates.x,
			y: coordinates.y,
			imgURL: this.state.imgURL,
			scaling: this.state.scaling,
			rotation: this.state.rotation
		}
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
		            <Image source={{ uri: this.state.imgURL }} resizeMode="contain" style={
		            	{
		            		alignSelf: "center",
		            		width: this.defaultWidth * this.state.scaling,
		            		height: this.defaultHeight * this.state.scaling
		            	}
		            }/>
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
		            <Image source={{ uri: this.state.imgURL }} resizeMode="contain" style={
		            	{
		            		alignSelf: "center",
		            		width: this.defaultWidth * this.state.scaling * this.state.viewScale,
		            		height: this.defaultHeight * this.state.scaling * this.state.viewScale
		            	}
		            }/>
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

export default ImgMemeObj;