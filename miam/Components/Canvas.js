import React, { Component } from "react";

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
      texts: [],
      tags: [],
      text: "",
      textInput: false
    };
    this.onCreatePost = this.onCreatePost.bind(this);
    this.getImageFromGiphy = this.getImageFromGiphy.bind(this);
    this.createTextObj = this.createTextObj.bind(this);
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

  createTextObj() {
    this.setState(prevState => ({
      text: "",
      texts: [
        ...prevState.texts,
        <TxtCObj key={prevState.texts.length} text={this.state.text} />
      ]
    }));
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
            <View style={{ height: "70%" }}>
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
    marginTop: "1%"
  },
  mainIcons: {
    flexDirection: "row"
  },
  textIcon: {
    width: "5%",
    justifyContent: "center"
  }
});
