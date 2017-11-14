import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ListView,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
import { postComment } from "../api";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      commentDataSource: ds.cloneWithRows([]),
      comment: ""
    };

    this.del = this.del.bind(this);
    this.getMyId = this.getMyId.bind(this);
    this.renderCommentRow = this.renderCommentRow.bind(this);
    this.comment = this.comment.bind(this);
  }
  del(commentId) {}
  componentWillMount() {
    this.getMyId();
  }
  comment(postID) {
    postComment(
      postID,
      this.state.comment,
      this.state.token,
      (response, error) => {
        if (error) {
          alert(error);
        } else {
          alert("Successfully posted your comment!");
        }
      }
    );
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
  renderCommentRow(comment) {
    const user = comment.user;
    return (
      <View style={styles.commentContainer}>
        <View style={styles.user} />
        <View style={styles.content} />
        {user == this.state.userId && <View />}
      </View>
    );
  }
  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text="MiAM"
          backButtonVisible={true}
          nav={this.props.navigation}
        />
        <ListView
          initialListSize={5}
          enableEmptySections={true}
          dataSource={this.state.commentDataSource}
          renderRow={comment => {
            return this.renderCommentRow(comment);
          }}
        />
        <View style={styles.createCommentContainer}>
          <TextInput
            style={{
              width: "75%",
              borderColor: "gray",
              borderWidth: 1,
              height: "100%"
            }}
            onChangeText={comment => this.setState({ comment: comment })}
            value={this.state.comment}
          />
          <TouchableHighlight
            onPress={this.comment}
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
                comment
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  commentContainer: {
    flexDirection: "row"
  },
  user: {
    flex: 1
  },
  content: {
    flex: 9
  }
});
module.exports = Comment;
