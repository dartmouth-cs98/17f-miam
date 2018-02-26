// SOURCE: https://goshakkk.name/react-native-animated-appearance-disappearance/
import React from "react";
import { 
  Image, 
  View,
  Animated,
  Easing,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sunPic: require('./Assets/Sun.png'),
      mingPic: require('./Assets/Ming.png')
    };

    this.sunRotateVal  = new Animated.Value(0);
    this.spin          = this.spin.bind(this);
  }

  componentDidMount(){
    this.spin();
  }

  spin(){
    this.sunRotateVal.setValue(0);
    Animated.timing(
      this.sunRotateVal,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }
    )
    .start(() => this.spin());
  }

  render() {
    return (
      <Animated.View style={[styles.container, { opacity: containerOpacity, transform:[{translateY: -100}, {scale: containerScale}] }]}>
        <Animated.View style={{ transform:[{scale: imgScaleVal}] }}>
          <Animated.Image source={this.state.sunPic} onLoad={this.elasticBringIn} style={{ position: 'absolute', transform:[{rotate: sunRotateVal}] }}/>
          <Image source={this.state.mingPic}/>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform:[{translateY: -100}]
  },
  miamLogo: {
    position: 'absolute',
    color: "#5A1BE2",
    backgroundColor: "#ffffff00",
    fontSize: 70,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "rancho"
  }
});

module.exports = Loading;
