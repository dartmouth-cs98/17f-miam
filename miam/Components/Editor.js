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
import Test from "./CanvasObjects/TestCanvasObj.js";
// import { RNS3 } from "react-native-aws3";
import Expo from "expo";


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: "https://icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png",

      layers: []
    };
  }

  componentWillMount() {
    
  }

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
        <View>
        <Image
          source={{ uri: this.state.imgURL }}
          style={styles.memeStyle}
          resizeMode="contain"
        >
          <Text style={styles.testStyle}>
            Hello World!
          </Text>
          <Test/>
        </Image>
        </View>
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
    alignSelf: "center"
  },
  testStyle: {
    position: 'absolute',
    overflow: 'visible',
    color: "#FF0000",
    fontSize: 30,
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
