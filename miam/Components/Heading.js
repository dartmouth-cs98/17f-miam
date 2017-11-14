import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

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
      <View style={styles.heading}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    height: "8%",
    width: "100%",
    backgroundColor: "#886BEA",
    justifyContent: "center"
  },
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
