import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from "react-native";

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: this.props.imgURL,
      text: this.props.text
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ imgURL: nextProps.imgURL, text: nextProps.text });
  }
  render() {
    console.log(this.props.imageURL);
    return (
      <View style={styles.memeContainer}>
        <Image
          source={{ uri: this.props.imageURL }}
          style={styles.memeStyle}
          resizeMode="contain"
        />
        <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
          {this.state.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  memeContainer: {
    marginBottom: "2%"
  },
  memeStyle: {
    width: 300,
    height: 200,
    alignSelf: "center"
  }
});
module.exports = Meme;
