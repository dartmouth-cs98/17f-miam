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
              containerStyle={styles.buttonContainer}
              style={styles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={() => this.onAdd()}>
              +
            </Button>
            <View style={styles.profiles}>
              <Image
                style={styles.profilePicture}
                source={{uri: 'http://qimg.hxnews.com/2017/0912/1505204920938.jpg'}}
              />
              <Text style={styles.name}>Jasper Chan</Text>
              <Text style={styles.score}>Score: 537</Text>
              <Text style={styles.battlewon}>Battle Won: 6</Text>
            </View>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.messageButton}
              styleDisabled={{color: 'red'}}
              onPress={() => this.onMessage()}>
              M
            </Button>
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
  buttonContainer: {
    height:35,
    width: 35,
    overflow:'hidden',
    borderRadius:20,
    backgroundColor: 'white',
  },
  addButton: {
    fontSize: 30,
    color: 'black',
  },
  messageButton: {
    fontSize: 30,
    color: 'black',
  },
  profiles: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginHorizontal: 20,
  },
  name: {
    color: 'white',
    fontSize: 25,
    top: 20,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  score: {
    color: 'white',
    fontSize: 15,
    top: 15,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  battlewon: {
    color: 'white',
    fontSize: 15,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

module.exports = Profile;
