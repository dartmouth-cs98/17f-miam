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
      image: null,
      text: ""
    };
    this.retrieveMeme = this.retrieveMeme.bind(this);
  }
  retrieveMeme() {}
  componentWillMount() {}
  render() {}
}

const styles = StyleSheet.create({});
module.exports = Meme;
