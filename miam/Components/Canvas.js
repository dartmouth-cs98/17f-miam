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
import Meme from "./Meme";
import ViewShot from "react-native-view-shot";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { captureRef } from "react-native-view-shot";
import { createPost, saveNewMeme } from "../api";
import { uploadImage } from "../api";
// import { RNS3 } from "react-native-aws3";
import Expo from "expo";

const apiUrl = "http://api.giphy.com/v1/gifs/translate?";
const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      layers: [],
      isLocalPhoto: false,

      tags: [],
      text: "",
      showCaption: false,
      gifWords: "Sup",
      res: null,
      token: ""
    };

    this.goGetImageFromGiphy = this.goGetImageFromGiphy.bind(this);
    this.createTextObj = this.createTextObj.bind(this);

    this.sendPost = this.sendPost.bind(this);
    this.createMeme = this.createMeme.bind(this);
    this.uploadLocalPhoto = this.uploadLocalPhoto.bind(this);
    this.translate = this.translate.bind(this);
    this.retrieveToken = this.retrieveToken.bind(this);

    this.editImage = this.editImage.bind(this);

    this.saveMeme = this.saveMeme.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    this.retrieveToken();
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      if (this.props.navigation.state.params.gifurl) {
        this.setState({
          image: this.props.navigation.state.params.gifurl,
          isLocalPhoto: false
        });
      } else if (this.props.navigation.state.params.imgURL) {
        this.setState({
          image: this.props.navigation.state.params.imgURL,
          layers: this.props.navigation.state.params.layers,
          isLocalPhoto: false
        });
      }
    }
  }

  async retrieveToken() {
    try {
      const savedToken = await AsyncStorage.getItem("@Token:key");
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

  saveMeme(){
    if (this.state.isLocalPhoto) {
      this.uploadLocalPhoto('save');
    }
    else this.save();
  }

  save() {
    if(this.state.image == null){
      alert("Please select an image or gif.");
      return;
    }

    const meme = {
      imgURL: this.state.image,
      layers: this.state.layers
    }

    saveNewMeme(meme, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        this.setState({
          image: null,
          isLocalPhoto: false,
          tags: [],
          text: "",
          showCaption: false,
          res: null,
          layers: []
        });
        alert("Successfully saved your meme!");
        console.log(response.data);
      }
    });
  }

  sendPost() {
    if (this.state.isLocalPhoto) {
      this.uploadLocalPhoto('post');
    }
    else this.createMeme();
  }

  createMeme() {
    // var params = this.props.navigation.state.params;
    // if (params && params.source === "battle") {
    //   console.log(this.state.image);
    //   this.props.navigation.navigate("BattleList", {
    //     gifUrl: this.state.image,
    //     memetext: this.state.text,
    //     battleId: params.battleId
    //   });
    // } else {

    if(this.state.image == null){
      alert("Please select an image or gif.");
      return;
    }

    const postObj = {
      meme: {
        imgURL: this.state.image,
        layers: this.state.layers
      },
      hashtags: "",
      memetext: this.state.text,
      posttext: this.state.text
    };
    console.log(this.state.token);
    createPost(postObj, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        this.setState({
          image: null,
          isLocalPhoto: false,
          tags: [],
          text: "",
          showCaption: false,
          res: null,
          layers: []
        });
        alert("Successfully posted your meme!");
      }
    });
  }

  uploadLocalPhoto(action) {
    pseudoRandomFileName =
      Math.random()
        .toString(36)
        .substr(2) +
      Math.random()
        .toString(36)
        .substr(2);
    typeExtension = this.state.image.substr(this.state.image.length - 3);

    const file = {
      uri: this.state.image,
      name: pseudoRandomFileName + "." + typeExtension,
      type: "image/" + typeExtension
    };

    canvasObj = this;

    // Returning promise
    uploadImage(file)
      .then(function(datum) {
        canvasObj.setState({ image: datum.url });
        if (action === 'post')
          canvasObj.createMeme();
        else if (action === 'save')
          canvasObj.save();
      })
      .catch(function(err) {
        console.log(err);
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
      this.setState({ image: result.uri, isLocalPhoto: true });
      console.log(result);
    }
  };

  goGetImageFromGiphy() {
    this.props.navigation.navigate("Search", {sendImgURLBack: this.receiveGifURL.bind(this)});
  }

  receiveGifURL(gifURL){
    this.setState({
      image: gifURL,
      isLocalPhoto: false
    });
  }

  createTextObj() {
    this.setState(prevState => ({
      text: "",
      texts: [
        ...prevState.texts,
        <TxtCObj key={prevState.texts.length} text={this.state.text} />
      ]
    }));
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

  editImage() {
    if(this.state.image != null){
      var imgURL = this.state.image;
      this.props.navigation.navigate("Editor", { imgURL: this.state.image, layers: this.state.layers });
    }
    else{
      alert("Select an image before entering Editor Mode");
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM" />
        <KeyboardAwareScrollView>
          <View style={styles.canvasContainer}>
            <View style={styles.canvas}>
              <View style={styles.canvasHeading}>
                <View />
                <View>
                  <Text style={{ fontSize: 25, color: "#cc66cc" }}>Canvas</Text>
                </View>
                <View>
                  <TouchableHighlight
                    onPress={this.saveMeme}
                    underlayColor="#ffffff"
                  >
                    <Icon name="save" color="#ac3973" size={28} />
                  </TouchableHighlight>
                </View>
                <View>
                  <TouchableHighlight
                    onPress={this.sendPost}
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
              <View style={{ height: "80%", marginTop: "2%" }}>
                {this.state.image && (
                  <View style={styles.meme}>
                    <Meme imgURL={this.state.image} layers={this.state.layers}/>
                    <View
                      style={{
                        width: "80%",
                        justifyContent: "center",
                        alignSelf: "center"
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
              <View style={styles.textInput}>
                <View style={styles.textIcon}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#cc66cc",
                      textAlign: "center"
                    }}>
                    T
                  </Text>
                </View>
                <TextInput
                  style={{
                    width: "75%",
                    borderColor: "gray",
                    borderWidth: 1,
                    height: "100%"
                  }}
                  maxLength={50}
                  onChangeText={text => this.setState({ text })}
                  value={this.state.text}
                />
              </View>
            </View>

            <View style={styles.mainIcons}>
              <TouchableHighlight
                onPress={this.getImageFromRoll}
                underlayColor="white"
              >
                <Icon name="photo" color="#ac3973" size={40} />
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this.goGetImageFromGiphy}
                underlayColor="white"
              >
                <Icon name="gif" color="#ac3973" size={40} />
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this.editImage}
                underlayColor="white"
              >
                <Icon name="edit" color="#ac3973" size={40} />
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
    height: 370,
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
    height: 50,
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
    height: "70%",
    marginTop: "1%",
    justifyContent: "center"
  },
  mainIcons: {
    flexDirection: "row",
    height: "10%"
  },
  textIcon: {
    width: "5%",
    justifyContent: "center"
  },
  gifTranslate: {
    flexDirection: "row",
    height: "30%"
  }
});
