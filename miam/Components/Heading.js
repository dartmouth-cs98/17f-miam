import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient, Font } from "expo";
class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
    this.backFunction = props.backFunction;
    this.headingText = props.text || "MiAM";
    this.createPostButton = props.postButtonVisible || false;
    this.createBackButton = props.backButtonVisible || false;
    this.nav = props.nav || null;

    this.goBack = this.goBack.bind(this);
    this.goToCreatePost = this.goToCreatePost.bind(this);
  }
  async componentDidMount() {
    await Font.loadAsync({
      rancho: require("../assets/fonts/Rancho-Regular.ttf")
    });

    this.setState({ fontLoaded: true });
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
          height: "8%",
          width: "100%",
          backgroundColor: "transparent",
          justifyContent: "center"
        }}
      >
        {this.state.fontLoaded ? (
          <Text style={styles.logo}>{this.headingText}</Text>
        ) : null}
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
            underlayColor="transparent"
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
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "rancho"
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
