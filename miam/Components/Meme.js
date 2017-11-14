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

<<<<<<< HEAD
  componentWillReceiveProps(nextProps) {
    this.setState({ imgURL: nextProps.imgURL, text: nextProps.text });
  }
=======
  // componentWillMount() {
  //   this.setState({imgURL: this.props.imgURL, text: this.props.text});
  // }
>>>>>>> a6ceed9bf8476836dbbda1e49532e35076a1c512

  render() {
    console.log(this.props.imageURL);
    return (
      <View style={styles.memeContainer}>
<<<<<<< HEAD
        {this.state.imgURL != "" && (
          <Image
            source={{ uri: this.state.imgURL }}
            style={styles.memeStyle}
            resizeMode="contain"
          />
        )}
=======
        <Image
          source={{ uri: this.props.imageURL }}
          style={styles.memeStyle}
          resizeMode="contain"
        />
>>>>>>> a6ceed9bf8476836dbbda1e49532e35076a1c512
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
