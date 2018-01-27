import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Slider from "react-native-slider";
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
      selectedObjKey: -1,

      editorMode: "",

      layers: [],
      key: 0
    };

    // Editor methods
    this.unselectObj = this.unselectObj.bind(this);
    this.recenterObj = this.recenterObj.bind(this);
    this.deleteObj   = this.deleteObj.bind(this);

    // Instancing methods
    this.addText = this.addText.bind(this);

    // Editing Modes
    this.editText   = this.editText.bind(this);
    this.editSize   = this.editSize.bind(this);
    this.editRotate = this.editRotate.bind(this);
    this.editColor  = this.editColor.bind(this);
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

  unselectObj(){
    this.setState({
      selectedType: "",
      selectedObj: null,
      selectedObjKey: -1,
      editorMode: ""
    });
  }

  recenterObj(){
    this.state.selectedObj.recenter();
  }

  deleteObj(){
    this.setState(prevState => ({
      layers: prevState.layers.filter((element, i) => element["key"] != prevState.selectedObjKey),
      selectedType: "",
      selectedObj: null,
      selectedObjKey: -1,
      editorMode: ""
    }));
  }

  addText(){
    let newObj = <TextObj key={this.state.key} selectionKey={this.state.key} editor={this} text="Place Text Here"/>;
    this.setState(prevState => ({
      key: prevState.key + 1,
      layers: [...prevState.layers, newObj],
    }));
  }

  editText(){
    this.setState({ editorMode: "text"})
  }

  editSize(){
    this.setState({ editorMode: "size" });
  }

  editRotate(){
    this.setState({ editorMode: "rotate" });
  }

  editColor(){
    this.setState({ editorMode: "color" });
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
        <TouchableWithoutFeedback onPress={this.unselectObj}>
          <Image source={{ uri: this.state.imgURL }} style={styles.memeStyle} resizeMode="contain">
            {this.state.layers}
          </Image>
        </TouchableWithoutFeedback>


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


        {/** ================ TEXT EDITOR DRAWER ================ **/}
        {/* TODO: Look for a scrollable row online */}
        {this.state.selectedType == "text" && 
          <View style={styles.objEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Text Editing Options </Text>

            <TouchableHighlight onPress={this.editText} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <Icon name="mode-edit" color="#FFFFFF" size={25}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editSize} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <Icon name="vertical-align-center" color="#FFFFFF" size={25}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editRotate} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <Icon name="autorenew" color="#FFFFFF" size={25}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editColor} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <Icon name="color-lens" color="#FFFFFF" size={25}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.recenterObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <Icon name="center-focus-strong" color="#FFFFFF" size={25}/>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.deleteObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#FF0000"}]}>
              <Icon name="delete" color="#FFFFFF" size={25}/>
            </TouchableHighlight>
          </View>
        }

        {/* TODO: <BUG> When the text editing mode is selected, the current text value of the selected object resets.*/}
        {/** ================ TEXT EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "text" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Text Edit </Text>
            <TextInput
              onChangeText={text => this.state.selectedObj.setState({ text: text })}
              placeholder="Username"
              value={this.state.selectedObj.text}
              autoCapitalize="none"
              style={styles.textArea}
            />
          </View>
        }

        {/** ================ FONT SIZE EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "size" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Font Size </Text>
            <Slider
              value={this.state.selectedObj.state.fontSize}
              maximumValue={50}
              minimumValue={10}
              step={1}
              onValueChange={(value) => this.state.selectedObj.setState({fontSize: value})} />
          </View>
        }

        {/** ================ ROTATION EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "rotate" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Rotation </Text>
            <Slider
              value={this.state.selectedObj.state.rotation}
              maximumValue={180}
              minimumValue={-180}
              step={5}
              onValueChange={(value) => this.state.selectedObj.setState({rotation: value})} />
          </View>
        }

        {/** ================ COLOR EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "color" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Color </Text>
            <Slider
              value={this.state.selectedObj.state.red}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#FF0000"
              onValueChange={(value) => this.state.selectedObj.setState({red: value})} />
            <Slider
              value={this.state.selectedObj.state.green}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#00AA00"
              onValueChange={(value) => this.state.selectedObj.setState({green: value})} />
            <Slider
              value={this.state.selectedObj.state.blue}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#0000FF"
              onValueChange={(value) => this.state.selectedObj.setState({blue: value})} />
          </View>
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
  objEditorDrawer: {
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    flexDirection: "row",
    marginTop: 25,
    width: "70%",
    justifyContent: 'center'
  },
  objEditorDrawerButton: {
    margin: 3, 
    padding: 5, 
    borderRadius: 3
  },
  sliderEditorDrawer:{
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderTopWidth: 2,
    flexDirection: "column",
    marginTop: 25,
    width: "70%",
    justifyContent: 'center'
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
  },
  textArea: {
    color: "#FFFFFF",
    height: 40,
    width: "80%",
    alignSelf: "center",
    marginTop: 3,
    padding: 5,
    borderColor: "#9C8FC4",
    borderWidth: 1,
    borderRadius: 5
  }
});
