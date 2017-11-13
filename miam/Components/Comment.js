import React, { Component } from "react";

import { Text, View, StyleSheet } from "react-native";

const customData = {};
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: ""
    };

    this.del = this.del.bind(this);
    this.getMyId = this.getMyId.bind(this);
  }
  del(commentId) {}
  componentWillMount() {
    this.getMyId();
  }
  async getMyId() {
    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      this.setState({
        userId: userId
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return <View />;
  }
}
module.exports = Comment;
