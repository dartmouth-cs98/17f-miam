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
import Button from 'react-native-button';

import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from './StatusBarColor';
import Heading from './Heading';

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
        <StatusBarColor/>
        <Heading text="MiAM Profile"/>
        <ScrollView>
          <Image
            style={styles.profile}
            source={{uri: 'http://images.all-free-download.com/images/graphiclarge/blurred_golden_background_192849.jpg'}}
          >
            <Button
              containerStyle={{height:35, width: 35, overflow:'hidden', borderRadius:20, backgroundColor: 'white'}}
              style={styles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={() => this.onAdd()}>
              +
            </Button>
            <Image
              style={styles.profilePicture}
              source={{uri: 'http://qimg.hxnews.com/2017/0912/1505204920938.jpg'}}
            />
            <Button
              containerStyle={{height:35, width: 35, overflow:'hidden', borderRadius:20, backgroundColor: 'white'}}
              style={styles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={() => this.onMessage()}>
              M
            </Button>
            <Text style={styles.name}>Jasper Chan</Text>
          </Image>
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
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 250,
  },
  addButton: {
    fontSize: 30,
    color: 'black',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    color: "#372769",
    fontSize: 25,
    top: 30,
  },
});

module.exports = Profile;
