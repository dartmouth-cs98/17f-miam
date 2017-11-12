import React, { Component } from "react";
import Slider from "react-native-slider";

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
import FIcon from "react-native-vector-icons/FontAwesome";
import { Isao } from "react-native-textinput-effects";
import StatusBarColor from "./StatusBarColor";
import { ImagePicker } from "expo";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import TxtCObj from "./CanvasObjects/TextCanvasObj";
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import { createPost } from "../api";
import { RNS3 } from "react-native-aws3";
import Expo from "expo";

const apiUrl = "http://api.giphy.com/v1/gifs/translate?";
const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,

      editMode: -1,
      selected: null,
      selectedType: null,
      selectedText: "",

      canvasTexts: [],
      createTextMode: false,

      tags: [],
      text: "",

      showCaption: false,
      gifWords: "Sup",
      res: null,
      showText: false,
      token: ""
    };

    this.getImageFromGiphy = this.getImageFromGiphy.bind(this);
    this.toggleCreateTextMode = this.toggleCreateTextMode.bind(this);
    this.createTextObj = this.createTextObj.bind(this);

    // Functions for editing text
    this.editTextSizeMode = this.editTextSizeMode.bind(this);
    this.editTextRotationMode = this.editTextRotationMode.bind(this);
    this.editTextColorMode = this.editTextColorMode.bind(this);
    this.deleteText = this.deleteText.bind(this);

    this.createMeme = this.createMeme.bind(this);
    this.uploadLocalPhoto = this.uploadLocalPhoto.bind(this);
    this.translate = this.translate.bind(this);
    this.retrieveToken = this.retrieveToken.bind(this);
  }

  componentWillMount() {
    this.retrieveToken();
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      this.setState({ image: this.props.navigation.state.params.gifurl });
    }
  }

  async retrieveToken() {
    try {
      let savedToken = await AsyncStorage.getItem("@Token:key");
      if (savedToken === null) {
        this.props.navigation.navigate("LogIn");
      } else {
        this.setState({
          token: savedToken
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  createMeme() {
    const postObj = { imgURL: this.state.image };
    createPost(postObj, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        console.log("succeeded");
        console.log(response);
      }
    });
  }

  uploadLocalPhoto() {
    console.log(this.state.image);

    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: this.state.image,
      name: "image.jpg",
      type: "image/jpg"
    };

    const options = {
      keyPrefix: "uploads/",
      bucket: "miam-assests",
      region: "us-east-ohio",
      accessKey: "AKIAIXEGKQ623CZ4T4OQ",
      secretKey: "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",
      successActionStatus: 201
    };

    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.log(response.body);
        throw new Error("Failed to upload image to S3");
      }

      console.log(response.body);
      /**
   * {
   *   postResponse: {
   *     bucket: "your-bucket",
   *     etag : "9f620878e06d28774406017480a59fd4",
   *     key: "uploads/image.png",
   *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
   *   }
   * }
   */
    });
  }

  translate() {
    const apiUrl = "http://api.giphy.com/v1/gifs/translate?";
    const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";
    var query = apiUrl + "s=" + this.state.gifWords + "&api_key=" + apiKey;
    return fetch(query)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          image: responseJson.data.images.original.url,
          gifWords: "",
          text: ""
        });
      })
      .catch(error => {
        console.log(error);
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
      canvasTexts: [
        ...prevState.canvasTexts,
        <TxtCObj key={prevState.canvasTexts.length} text={this.state.text} canvas={this}/>
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

  snapShot() {
    if (this.meme) {
      Expo.takeSnapshotAsync(this.meme, options).then(res =>
        this.setState({ res: res })
      );
    } else {
      console.log("Reference is null");
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM" />


        <View style={styles.canvasContainer}>
          <View style={styles.canvas}>
            <View style={styles.canvasHeading}>
              <View />
              <View>
                <Text style={{ fontSize: 25, color: "#cc66cc" }}>Canvas</Text>
              </View>
              <View>
                <TouchableHighlight
                  onPress={this.createMeme}
                  underlayColor="#ffffff"
                >
                  <Icon name="send" color="#ac3973" size={28} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ height: "20%" }}>
              <Isao
                label={"Translate words to a Gif!"}
                // this is applied as active border and label color
                activeColor={"#da7071"}
                // this is applied as passive border and label color
                passiveColor={"#e6b3cc"}
                onChangeText={text => this.setState({ gifWords: text })}
                onSubmitEditing={this.translate}
                value={this.state.gifWords}
                defaultValue="Sup"
              />
            </View>
            <View style={{ height: "80%", marginTop: "2%", overflow: 'hidden'}}>
              {this.state.image && (
                <View style={styles.meme}>
                  <Image
                    source={{ uri: this.state.image }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                    ref={ref => (this.meme = ref)}
                  />

                  <View
                    style={{
                      width: 300,
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>
                      {this.state.text}
                    </Text>
                  </View>
                </View>
              )}

              {this.state.res && (
                <View>
                  <Image
                    source={{ uri: this.state.res }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      width: 300,
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>
                      {this.state.text}
                    </Text>
                  </View>
                </View>
              )}
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
                maxLength={50}
                onChangeText={text => this.setState({ text })}
              />
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
    height: "60%",
    marginTop: "10%",
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: "column"
  },
  canvasHeading: {
    height: "5%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tools: {
    flexDirection: "column",
    marginTop: "2%",
    marginBottom: "1%",
    height: "10%",
    width: "90%",
    borderWidth: 0.5,
    borderRadius: 1,
    borderColor: "#a64dff",
    justifyContent: "center"
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
    height: "50%",
    marginTop: "1%",
    alignSelf: "center",  // EXTRA
    justifyContent: "center",
    alignItems: "center"  // EXTRA
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
  },
  gifTranslate: {
    flexDirection: "row",
    height: "30%"
  },
  meme: {}
});
