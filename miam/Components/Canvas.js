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

      anon: false,

      tags: [],
      text: "",
      showCaption: false,
      gifWords: "Sup",
      res: null,
      token: ""
    };

    this.goGetImageFromGiphy = this.goGetImageFromGiphy.bind(this);
    this.createTextObj = this.createTextObj.bind(this);

    this.toggleAnon = this.toggleAnon.bind(this);
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

  toggleAnon() {
    var newAnonState = !this.state.anon;
    this.setState({
      anon: newAnonState
    });
  }

  saveMeme() {
    if (this.state.isLocalPhoto) {
      this.uploadLocalPhoto("save");
    } else this.save();
  }

  save() {
    if (this.state.image == null) {
      alert("Please select an image or gif.");
      return;
    }

    const meme = {
      imgURL: this.state.image,
      layers: this.state.layers
    };

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
      this.uploadLocalPhoto("post");
    } else this.createMeme();
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

    if (this.state.image == null) {
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
      posttext: this.state.text,
      anon: this.state.anon
    };
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
          layers: [],
          anon: false
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
        if (action === "post") canvasObj.createMeme();
        else if (action === "save") canvasObj.save();
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
    }
  };

  goGetImageFromGiphy() {
    this.props.navigation.navigate("Search", {
      sendImgURLBack: this.receiveGifURL.bind(this)
    });
  }

  receiveGifURL(gifURL) {
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
    if (this.state.image != null) {
      var imgURL = this.state.image;
      this.props.navigation.navigate("Editor", {
        imgURL: this.state.image,
        layers: this.state.layers
      });
    } else {
      alert("Select an image before entering Editor Mode");
    }
  }

  render() {
    // Anonymous Posting Buttons
    var anonOffButton = (
      <TouchableHighlight
        onPress={() => this.toggleAnon()}
        underlayColor="#ffffffaa"
        style={[styles.anonButton, { backgroundColor: "#222222" }]}
      >
        <View style={styles.anonButtonView}>
          <Icon name="lock-open" color="#FFFFFF" size={20} />
          <Text style={styles.anonButtonText}> Anonymous OFF</Text>
        </View>
      </TouchableHighlight>
    );

    var anonOnButton = (
      <TouchableHighlight
        onPress={() => this.toggleAnon()}
        underlayColor="#ffffffaa"
        style={[styles.anonButton, { backgroundColor: "#006400" }]}
      >
        <View style={styles.anonButtonView}>
          <Icon name="lock" color="#FFFFFF" size={20} />
          <Text style={styles.anonButtonText}> Anonymous ON</Text>
        </View>
      </TouchableHighlight>
    );

    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM Editor" />
        <KeyboardAwareScrollView>
          <View style={styles.uploadIcons}>
            <TouchableHighlight
              onPress={this.getImageFromRoll}
              underlayColor="white"
            >
              <View style={styles.uploadContainer}>
                <Icon name="photo" color="#ac3973" size={43} />
                <Text style={styles.uploadContainerText}>Local files</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this.goGetImageFromGiphy}
              underlayColor="white"
            >
              <View style={styles.uploadContainer}>
                <Icon name="gif" color="#ac3973" size={50} />
                <Text style={styles.uploadContainerText}>Search Gif</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.canvasContainer}>
            <View style={styles.canvas}>
              <View style={{ height: "85%", marginTop: "5%" }}>
                {this.state.image && (
                  <View>
                    <Meme
                      imgURL={this.state.image}
                      layers={this.state.layers}
                    />
                  </View>
                )}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  marginBottom: "1%"
                }}
              >
                <TouchableHighlight
                  onPress={this.editImage}
                  underlayColor="white"
                >
                  <View style={styles.mainIcons}>
                    <Text
                      style={{
                        fontSize: 23,
                        color: "#a64dff",
                        textAlign: "center",
                        fontWeight: "bold"
                      }}
                    >
                      Enter Edit Mode
                    </Text>
                    <Icon name="edit" color="#a64dff" size={25} />
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.savePost}>
              <TouchableHighlight
                onPress={this.saveMeme}
                underlayColor="#ffffff"
              >
                <View style={styles.savePostContainer}>
                  <Icon name="save" color="#ac3973" size={30} />
                  <Text style={styles.savePostText}>Save</Text>
                </View>
              </TouchableHighlight>

              {this.state.anon ? anonOnButton : anonOffButton}
              <View style={{ flexDirection: "column", marginRight: "2%" }}>
                <TouchableHighlight
                  onPress={this.sendPost}
                  underlayColor="#ffffff"
                >
                  <View style={styles.savePostContainer}>
                    <Icon name="send" color="#ac3973" size={30} />
                    <Text style={styles.savePostText}>Post</Text>
                  </View>
                </TouchableHighlight>
              </View>
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
    height: "60%",
    alignItems: "center"
  },
  canvas: {
    width: "90%",
    height: 350,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "column",
    borderColor: "#a64dff"
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
    borderWidth: 1,
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
    justifyContent: "center",
    alignItems: "center"
  },
  mainIcons: {
    flexDirection: "row",
    justifyContent: "center"
  },
  textIcon: {
    width: "5%",
    justifyContent: "center"
  },
  gifTranslate: {
    flexDirection: "row",
    height: "30%"
  },
  anonButton: {
    borderRadius: 3,
    borderColor: "#006400",
    borderWidth: 2,
    height: "50%"
  },
  anonButtonView: {
    alignItems: "center",
    flexDirection: "row"
  },
  anonButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold"
  },
  savePost: {
    flexDirection: "row",
    marginTop: "5%",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  savePostText: {
    fontSize: 15,
    color: "#a64dff",
    textAlign: "center",
    fontWeight: "bold"
  },
  savePostContainer: {
    flexDirection: "column"
  },
  uploadIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "1%",
    width: "80%",
    alignSelf: "center"
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadContainerText: {
    fontSize: 15,
    color: "#a64dff",
    fontWeight: "bold"
  }
});
