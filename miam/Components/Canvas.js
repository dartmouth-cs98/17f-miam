import React, { Component } from "react";
import Slider from "react-native-slider";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import StatusBarColor from "./StatusBarColor";
import { ImagePicker } from "expo";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import TxtCObj from "./CanvasObjects/TextCanvasObj";

import { createPost } from "../api";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      selected: null,
      selectedType: null,
      selectedText: "",
      editMode: -1,
      texts: [],
      tags: [],
      createTextMode: false
    };
    this.onCreatePost = this.onCreatePost.bind(this);
    this.getImageFromGiphy = this.getImageFromGiphy.bind(this);
    this.toggleCreateTextMode = this.toggleCreateTextMode.bind(this);
    this.createTextObj = this.createTextObj.bind(this);

    // Functions for editing text
    this.editTextSizeMode = this.editTextSizeMode.bind(this);
    this.editTextRotationMode = this.editTextRotationMode.bind(this);
    this.editTextColorMode = this.editTextColorMode.bind(this);
    this.deleteText = this.deleteText.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      this.setState({ image: this.props.navigation.state.params.gifurl });
    }
  }
  onCreatePost() {
    createPost(this.state.email, this.state.password, (response, error) => {
      if (error) {
        alert(error);
      } else {
        const decoded = jwtDecode(response.token);
        console.log(decoded);
      }
    });
  }

  getImageFromRoll = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  getImageFromGiphy() {
    this.props.navigation.navigate("Search");
  }

  toggleCreateTextMode(){
    if(this.state.selected)
      this.setState({selected: null, selectedType: null, selectedText: "", editMode: -1});
    this.setState(prevState => ({createTextMode: !prevState.createTextMode}));
  }

  createTextObj() {
    this.toggleCreateTextMode();
    this.setState(prevState => ({
      texts: [
        ...prevState.texts,
        <TxtCObj key={prevState.texts.length} text={this.state.text} canvas={this}/>
      ]
    }));
  }

  editTextSizeMode(){
    this.setState({ editMode: 2 });
  }

  editTextRotationMode(){
    this.setState({ editMode: 3 });
  }

  editTextColorMode(){
    this.setState({ editMode: 4 });
  }

  deleteText(){
    this.state.selected.setState({text: ""});
    this.setState({selected: null, selectedType: null, selectedText: "", editMode: -1});
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM" />


        <View style={styles.canvasContainer}>
          <View style={styles.canvas}>
            <View style={styles.canvasHeading}>
              <Text style={{ fontSize: 25, color: "#cc66cc" }}>Canvas</Text>
              <Icon name="send" color="#ac3973" size={20} />
            </View>
            <View style={{ height: "70%", overflow: 'hidden' }}>
              {this.state.image && (
                <View>
                  <Image
                    source={{ uri: this.state.image }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                </View>
              )}
              {this.state.texts}
            </View>
          </View>


          <View style={styles.tools}>
          {
            this.state.createTextMode &&
            <View style={styles.textInput}>
              <TextInput
                style={{
                  width: "75%",
                  borderColor: "gray",
                  borderWidth: 1,
                  height: "100%",
                  left: "20%"
                }}
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
              />
              <TouchableHighlight
                onPress={this.createTextObj}
                underlayColor="white"
                style={{
                  width: "18%",
                  justifyContent: "center",
                  height: "100%"
                }}
              >
                <View
                  style={{
                    backgroundColor: "#9999ff",
                    height: "100%",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#ffffff" }}>
                    add
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          }
          {
            this.state.selected && 
            <View style={styles.editorButtonBox}>
              <View style={{height: '100%', flex: 1, flexDirection: 'column'}}>
                <View style={styles.editorButtonRow}>
                  <TouchableHighlight onPress={this.editTextSizeMode} underlayColor="white">
                    <FIcon name="text-height" color="#ac3973" size={35} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.editTextRotationMode} underlayColor="white">
                    <Icon name="autorenew" color="#ac3973" size={40} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.editTextColorMode} underlayColor="white">
                    <Icon name="color-lens" color="#ac3973" size={40} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.deleteText} underlayColor="white">
                    <Icon name="delete" color="white" size={40} style={{backgroundColor: "red", borderRadius: 50}}/>
                  </TouchableHighlight>
                </View>
                <View style={styles.editorButtonRow}>
                  <TouchableHighlight onPress={() => {}} underlayColor="white">
                    <Icon name="not-interested" color="#ac3973" size={35} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => {}} underlayColor="white">
                    <Icon name="not-interested" color="#ac3973" size={40} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => {}} underlayColor="white">
                    <Icon name="not-interested" color="#ac3973" size={40} />
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => {}} underlayColor="white">
                    <Icon name="not-interested" color="#ac3973" size={40} />
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{height: '100%', flex: 1}}>
              {
                this.state.editMode == 2 &&
                <View style={styles.editorUIBox}>
                  <Text style={{flex: 1}}>TEXT SIZE:</Text>
                  <Slider
                    flex={2}
                    value={this.state.selected.state.fontSize}
                    maximumValue={50}
                    minimumValue={10}
                    step={1}
                    onValueChange={(value) => this.state.selected.setState({fontSize: value})} />
                </View>
              }
              {
                this.state.editMode == 3 &&
                <View style={styles.editorUIBox}>
                  <Text style={{flex: 1}}>ROTATE:</Text>
                  <Slider
                    flex={2}
                    value={this.state.selected.state.rotation}
                    maximumValue={360}
                    minimumValue={0}
                    step={15}
                    onValueChange={(value) => this.state.selected.setState({rotation: value})} />
                </View>
              }
              {
                this.state.editMode == 4 &&
                <View style={styles.editorUIBox}>
                  <Slider
                    flex={1}
                    value={this.state.selected.state.red}
                    maximumValue={255}
                    minimumValue={0}
                    step={1}
                    thumbTintColor="#FF0000"
                    onValueChange={(value) => this.state.selected.setState({red: value})} />
                    <Slider
                    flex={1}
                    value={this.state.selected.state.green}
                    maximumValue={255}
                    minimumValue={0}
                    step={1}
                    thumbTintColor="#00AA00"
                    onValueChange={(value) => this.state.selected.setState({green: value})} />
                    <Slider
                    flex={1}
                    value={this.state.selected.state.blue}
                    maximumValue={255}
                    minimumValue={0}
                    step={1}
                    thumbTintColor="#0000FF"
                    onValueChange={(value) => this.state.selected.setState({blue: value})} />
                </View>
              }
              </View>
            </View>
          }
          </View>


          <View style={styles.mainIcons}>
            <TouchableHighlight
              onPress={this.getImageFromRoll}
              underlayColor="white"
            >
              <Icon name="photo" color="#ac3973" size={40} />
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this.getImageFromGiphy}
              underlayColor="white"
            >
              <Icon name="gif" color="#ac3973" size={40} />
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this.toggleCreateTextMode}
              underlayColor="white"
            >
              <Icon name="text-fields" color="#ac3973" size={40} />
            </TouchableHighlight>
          </View>
        </View>
        <NavigationBar navigation={this.props.navigation} />
      </View>
    );
  }
}

module.exports = Canvas;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  canvasContainer: {
    height: "84%",
    alignItems: "center"
  },
  canvas: {
    width: "90%",
    height: "65%",
    marginTop: "10%",
    borderWidth: 1,
    borderRadius: 3
  },
  canvasHeading: {
    height: "20%",
    alignItems: "center"
  },
  tools: {
    flexDirection: "row",
    marginBottom: "1%",
    height: "15%",
    width: "90%",
    borderWidth: 1,
    borderRadius: 3
  },
  backgroundDeepPurple: {
    backgroundColor: "#695287"
  },
  imagePreview: {
    width: 300,
    height: 200,
    alignSelf: "center",
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  textInput: {
    flexDirection: "row",
    height: "40%",
    marginTop: "1%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  editorButtonRow: {
    width: '100%', 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  editorButtonBox: {
    flexDirection: 'row', 
    width: '100%', 
    height: '100%'
  },
  editorUIBox:{
    width: '90%', 
    flexDirection: 'column', 
    flex: 1, 
    alignSelf: 'center', 
    alignItems: 'stretch', 
    justifyContent: 'center'
  },
  mainIcons: {
    flexDirection: "row"
  },
  textIcon: {
    width: "5%",
    justifyContent: "center"
  }
});
