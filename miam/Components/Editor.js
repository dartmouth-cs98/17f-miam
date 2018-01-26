import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput,
  AsyncStorage,
  Slider
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
      selectedObj: null,

      layers: [],
      key: 0  // This serves no other purpose other than to suppress a React Native warning
    };

    this.addText = this.addText.bind(this);
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

  addText(){
    this.setState(prevState => ({
      key: prevState.key + 1,
      layers: [...prevState.layers, <TextObj key={prevState.key} editor={this} text="Hello World!"/>]
    }));
  }

  render() {

    // Layer processing

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
          {this.state.layers}
        </Image>


        {/** ================ MAIN EDITOR DRAWER ================ **/}
        <View style={styles.mainEditorDrawer}>
          <Text style={styles.mainEditorDrawerTitleText}> EDITOR DRAWER </Text>

          <View style={styles.mainEditorDrawerRow}>
            <TouchableHighlight onPress={this.addText} underlayColor="#ffffffaa" style={[styles.mainEditorDrawerButton, {backgroundColor: "#007D75"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="text-fields" color="#FFFFFF" size={25}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Text</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="white" style={[styles.mainEditorDrawerButton, {backgroundColor: "#EC6778"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="collections" color="#FFFFFF" size={25}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Image</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.mainEditorDrawerRow}>
            <TouchableHighlight underlayColor="white" style={[styles.mainEditorDrawerButton, {backgroundColor: "#B1D877"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="gif" color="#FFFFFF" size={25}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Gif</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="white" style={[styles.mainEditorDrawerButton, {backgroundColor: "#2A1657"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="layers" color="#FFFFFF" size={25}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Layers</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

        {
          // this.state.selectedType == "text" && 
        }
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
  mainEditorDrawer: {
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    marginTop: 50,
    width: "75%",
    flexDirection: "column",
    paddingTop: 5,
    paddingBottom: 5,
    overflow: "visible"
  },
  mainEditorDrawerTitleText: {
    position: "absolute", 
    top: -20, 
    color: "#FFFFFF", 
    fontWeight: "bold"
  },
  mainEditorDrawerRow: {
    flexDirection: "row",
    alignSelf: "center"
  },
  mainEditorDrawerButton: {
    margin: 3, 
    padding: 5, 
    borderRadius: 3
  },
  mainEditorDrawerButtonView: {
    alignItems: 'center',
    width: 125,
    flexDirection: "row"
  },
  mainEditorDrawerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold"
  },
  editBox: {
    alignSelf: 'center',
    backgroundColor: "#ffffff",
    borderWidth: 1,
    position: 'absolute',
    width: "90%",
    bottom: "2%"
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
