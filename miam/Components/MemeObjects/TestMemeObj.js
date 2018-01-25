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

var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

// Help from http://browniefed.com/react-native-animation-book/basic/DRAG.html
class TestMemeObj extends React.Component{
	constructor(props){
	    super(props);
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

		var interpolatedColorAnimation = this._animatedValue.y.interpolate({
		      inputRange: [0, deviceHeight - 300],
		      outputRange: ['rgba(229,27,66,1)', 'rgba(28,170,190,1)'],
		      extrapolate: 'clamp'
		    });

	    var interpolatedRotateAnimation = this._animatedValue.x.interpolate({
		      inputRange: [0, deviceWidth/2, deviceWidth],
		      outputRange: ['-360deg', '0deg', '360deg']
		    });

        return (
            <View style={styles.container}>
	        <Animated.View 
	          style={[
	              styles.box, 
	              {
	                transform: [
	                  {translateX: this._animatedValue.x},
	                  {translateY: this._animatedValue.y},
	                  {rotate: interpolatedRotateAnimation}
	                ],
	                backgroundColor: interpolatedColorAnimation
	              }
	            ]} 
	            {...this._panResponder.panHandlers} 
	          >
            	<Text style={styles.testStyle}>
	            	Test :D
	            </Text>
	            </Animated.View>
	      	</View>
        );
    }
}

const CIRCLE_RADIUS = 36;
const Window = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    width: 100,
    height: 100
  },
    testStyle: {
    color: "#000000",
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    backgroundColor: '#00000000',
    alignSelf: 'center',
  }
});

export default TestMemeObj;