import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Isao } from "react-native-textinput-effects";
import StatusBarColor from "./StatusBarColor";
import { ImagePicker } from "expo";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import ViewShot from "react-native-view-shot";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { captureRef } from "react-native-view-shot";
import { createPost } from "../api";
import { uploadImage } from "../api";
import Test from "./MemeObjects/TestMemeObj.js";
import TextObj from "./MemeObjects/TextMemeObj.js";
// import { RNS3 } from "react-native-aws3";
import Expo from "expo";


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: "https://icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png",
      selectedType: "",

      layers: []
    };
  }

  componentWillMount() {
    
  }

  // TODO: ADD A RECENTER BUTTON TO RECENTER LAYER

  componentDidMount() {
    if (this.props.navigation.state.params.imgURL) {
      this.setState({
        imgURL: this.props.navigation.state.params.imgURL || "https://icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png"
      });
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text="MiAM Editor"
          backButtonVisible={true}
          nav={this.props.navigation}
        />
        <Image
          source={{ uri: this.state.imgURL }}
          style={styles.memeStyle}
          resizeMode="contain"
        >
          {this.state.selectedType == "text" && 
            <Text style={styles.testStyle}> Text.obj was selected! </Text>
          }
          <Test/>
          <TextObj editor={this} text="Hello World!"/>
        </Image>
      </View>
    );
  }
}

module.exports = Editor;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#000000"
  },
  memeStyle: {
    width: 300,
    height: 200,
    alignSelf: "center",
    borderWidth: 2.5,
    borderRadius: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#222222",
    top: 20
  },
  testStyle: {
    position: 'absolute',
    overflow: 'visible',
    color: "#FF0000",
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center",
    backgroundColor: '#00000000',
    transform: [
          {translateX: 0},
          {translateY: 0},
          {rotate: '0deg'}
    ]
  }
});
