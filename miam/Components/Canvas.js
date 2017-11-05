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
import Maticon from "react-native-vector-icons/MaterialIcons";

import { createPost } from "../api";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      tags: []
    };

    this.onCreatePost = this.onCreatePost.bind(this);
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

  getImageFromGiphy = async () => {
    this.props.navigation.navigate("Search");
  };
  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM" />
        <View style={styles.canvasContainer}>
          <View style={styles.canvas}>
            <View style={styles.canvasHeading}>
              <Text style={{ fontSize: 25, color: "#cc66cc" }}>Canvas</Text>
            </View>
            {this.state.image && (
              <View>
                <Image
                  source={{ uri: this.state.image }}
                  style={styles.imagePreview}
                />
              </View>
            )}
          </View>
          <View style={styles.tools}>
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
            <Icon name="brush" color="#ac3973" size={30} />
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
    width: "80%",
    height: "80%",
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
    marginBottom: "1%"
  },
  backgroundDeepPurple: {
    backgroundColor: "#695287"
  },
  imagePreview: {
    width: 200,
    height: 200,
    alignSelf: "center",
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});
