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
      tags: [],
      text: "",
      showCaption: false,
      gifWords: "Sup",
      res: null,
      showText: false,
      token: ""
    };
    this.getImageFromGiphy = this.getImageFromGiphy.bind(this);
    this.createTextObj = this.createTextObj.bind(this);
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
  createMeme() {
    const postObj = { imgURL: this.state.image, hashtags: "" };
    console.log(this.state.token);
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
            <View style={{ height: "80%", marginTop: "2%" }}>
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
            <View style={styles.textInput}>
              <View style={styles.textIcon}>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#cc66cc",
                    textAlign: "center"
                  }}
                >
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
              onPress={this.getImageFromGiphy}
              underlayColor="white"
            >
              <Icon name="gif" color="#ac3973" size={40} />
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
    justifyContent: "center"
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
