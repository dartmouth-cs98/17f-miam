import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions
} from "react-native";

import AvatarEditor from 'react-avatar-editor'

import Icon from "react-native-vector-icons/MaterialIcons";
var customData = require("../data/customData.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postDataSource: ds.cloneWithRows([]),
      loaded: false
    };
  }
  componentDidMount() {
    this.setState({
      postDataSource: ds.cloneWithRows(customData),
      loaded: true
    });
  }

  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }

  setEditorRef = (editor) => this.editor = editor

  render() {
    return (
      <View style={styles.body}>
        <View style={styles.heading}>
          <Text style={styles.logo}>MiAM</Text>
        </View>
        <ScrollView>
          <Image
            style={styles.profilePicture}
            source={{uri: 'http://qimg.hxnews.com/2017/0912/1505204920938.jpg'}}
          />
          <Text style={styles.name}>Jasper Chan</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  heading: {
    height: "10%",
    width: "100%",
    backgroundColor: "#886BEA",
    justifyContent: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 40,
    textAlign: "center"
  },
  profilePicture: {
    width: 200,
    height: 200,
    position: "absolute",
    justifyContent: "center",
    borderRadius: 70,
    left: (vw / 2 - 100),
    top: 40,
  },
  name: {
    color: "#372769",
    fontSize: 40,
    textAlign: "center",
    top: 250,
  },
});

module.exports = Profile;
