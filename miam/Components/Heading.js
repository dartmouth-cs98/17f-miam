import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo";
class Heading extends Component {
  constructor(props) {
    super(props);
    this.backFunction = props.backFunction;
    this.headingText = props.text || "MiAM";
    this.createPostButton = props.postButtonVisible || false;
    this.createBackButton = props.backButtonVisible || false;
    this.nav = props.nav || null;

    this.goBack = this.goBack.bind(this);
    this.goToCreatePost = this.goToCreatePost.bind(this);
  }

  goBack() {
    if (this.backFunction) {
      this.backFunction();
    } else {
      this.nav.goBack();
    }
  }

  goToCreatePost() {
    this.nav.navigate("CreatePost");
  }

  render() {
    return (
      <LinearGradient
        colors={["#6a3093", "#a044ff"]}
        style={{
          height: "7%",
          width: "100%",
          backgroundColor: "transparent",
          justifyContent: "center"
        }}
      >
        <Text style={styles.logo}>{this.headingText}</Text>
        {this.createPostButton && (
          <TouchableHighlight
            style={styles.postButton}
            onPress={this.goToCreatePost}
            underlayColor="white"
          >
            <Icon name="ios-add-circle-outline" size={38} color="white" />
          </TouchableHighlight>
        )}
        {this.createBackButton && (
          <TouchableHighlight
            style={styles.backButton}
            onPress={this.goBack}
            underlayColor="#886BEA"
          >
            <Icon name="ios-arrow-back" size={38} color="white" />
          </TouchableHighlight>
        )}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center"
  },
  postButton: {
    position: "absolute",
    top: "15%",
    right: "3%"
  },
  backButton: {
    position: "absolute",
    top: "15%",
    left: "4%"
  }
});

export default Heading;
