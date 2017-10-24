import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
var customData = require("../data/customData.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postDataSource: ds.cloneWithRows([]),
      loaded: false
    };
  }
  componentDidMount() {
    this.setState({
      postDataSource: ds.cloneWithRows(customData),
      loaded: true
    });
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Text>abs</Text>
      </View>
    );
  }
}
module.exports = Profile;
