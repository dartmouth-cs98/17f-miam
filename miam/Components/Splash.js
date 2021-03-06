import React from "react";
import {
  AsyncStorage,
  Image,
  View,
  Animated,
  Easing,
  Dimensions,
  Text,
  StyleSheet
} from "react-native";
import { Font, LinearGradient } from "expo";

const window = Dimensions.get("window");

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sunPic: require('./Assets/Sun.png'),
      mingPic: require('./Assets/Ming.png'),

      nextState: "",
      durationVar: Math.floor(Math.random() * 1500) + 1,

      fontLoaded: false
    };

    this.retrieveToken = this.retrieveToken.bind(this);

    // Animation Values
    this.sunRotateVal  = new Animated.Value(0);
    this.imgScaleVal   = new Animated.Value(0);
    this.imgScaleMax   = 0.4;
    this.textAppearVal = new Animated.Value(0);
    this.disappearVal  = new Animated.Value(0);

    // Animation Methods
    this.spin           = this.spin.bind(this);
    this.elasticBringIn = this.elasticBringIn.bind(this);
    this.appearText     = this.appearText.bind(this);
    this.goToNextState  = this.goToNextState.bind(this);

    this.transitionWaitTime = 1000;
  }

  async retrieveToken() {
    try {
      let savedToken = await AsyncStorage.getItem("@Token:key");
      if (savedToken === null) {
        this.setState({ nextState: "LogIn" });
        this.goToNextState();
      } else {
        this.setState({ nextState: "Feed" });
        this.goToNextState();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    this.spin();

    await Font.loadAsync({
      rancho: require("../assets/fonts/Rancho-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  spin(){
    this.sunRotateVal.setValue(0);
    Animated.timing(
      this.sunRotateVal,
      {
        toValue: 1,
        duration: 3000 + this.state.durationVar,
        easing: Easing.linear
      }
    )
    .start(() => this.spin());
  }

  elasticBringIn(){
    Animated.timing(
      this.imgScaleVal,
      {
        toValue: this.imgScaleMax,
        duration: 500,
        easing: Easing.elastic(3)
      }
    )
    .start(() => this.appearText());
  }

  appearText(){
    Animated.timing(
      this.textAppearVal,
      {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic)
      }
    )
    .start(() => {setTimeout(() => {this.retrieveToken()}, this.transitionWaitTime)});
  }

  goToNextState(){
    Animated.timing(
      this.disappearVal,
      {
        toValue: 1,
        duration: 350,
        easing: Easing.in(Easing.cubic)
      }
    )
    .start(() => {setTimeout(() => {this.props.navigation.navigate(this.state.nextState)}, 250)});
  }

  render() {
    const sunRotateVal = this.sunRotateVal.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    const imgScaleVal = this.imgScaleVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const textSpacing = this.textAppearVal.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0]
    });

    const textOpacity = this.textAppearVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const textScaling = this.textAppearVal.interpolate({
      inputRange: [0, 1],
      outputRange: [1.3, 1]
    });

    const containerOpacity = this.disappearVal.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    const containerScale = this.disappearVal.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3]
    });

    return (
      <Animated.View style={[styles.background, { opacity: containerOpacity, transform:[{scale: containerScale}] }]}>
        <LinearGradient colors={["#6E48AA", "#9D50BB"]} style={styles.background}>
          <Animated.View style={styles.container}>
            <Animated.View style={{ transform:[{scale: imgScaleVal}] }}>
              <Animated.Image source={this.state.sunPic} onLoad={this.elasticBringIn} style={{ position: 'absolute', transform:[{rotate: sunRotateVal}] }}/>
              <Image source={this.state.mingPic}/>
            </Animated.View>
            { this.state.fontLoaded &&
              <Animated.Text style={[styles.miamLogo, { opacity: textOpacity, letterSpacing: textSpacing, transform:[{translateY: 140}, {scale: textScaling}] }]}>
                MiAM
              </Animated.Text>
            }
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  miamLogo: {
    position: 'absolute',
    color: "#FFFFFF", /*"#5A1BE2",*/
    backgroundColor: "#ffffff00",
    fontSize: 70,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "rancho"
  }
});

export default Splash;
