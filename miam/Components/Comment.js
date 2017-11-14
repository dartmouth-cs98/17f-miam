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
import { fetchComment } from "../api";
import update from "react-addons-update";
import moment from "moment";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      commentDataSource: ds.cloneWithRows([]),
      comments: [],
      comment: "",
      postID: null,
      token: null
    };

    this.del = this.del.bind(this);
    this.getMyId = this.getMyId.bind(this);
    this.renderCommentRow = this.renderCommentRow.bind(this);
    this.comment = this.comment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
  }
  del(commentId) {}
  componentWillMount() {
    this.getMyId();
  }
  componentDidMount() {
    if (this.props.navigation.state.params) {
      this.setState({
        postID: this.props.navigation.state.params.postID
      });
      for (i = 0; i < this.props.navigation.state.params.comments.length; i++) {
        this.getComment(this.props.navigation.state.params.comments[i]);
      }
    }
  }
  sortByNewest(array) {
    return array.sort(function(a, b) {
      return moment(b.createdAt).valueOf() < moment(a.createdAt).valueOf() ?  1 : moment(b.createdAt).valueOf() > moment(a.createdAt).valueOf() ? -1 : 0;
    });
  }
  getComment(commentID) {
    fetchComment(commentID, (response, error) => {
      if (error) {
        alert(error);
      } else {
        var newArray = update(this.state.comments, {
          $push: [response.data]
        });
        sortedComments = this.sortByNewest(newArray)
        this.setState({
          comments: sortedComments
        });
        this.setState({
          commentDataSource: ds.cloneWithRows(this.state.comments)
        });
      }
    });
  }
  comment() {
    postComment(
      this.state.postID,
      this.state.comment,
      this.state.token,
      (response, error) => {
        if (error) {
          alert(error);
        } else {
          this.setState({
            comment: ""
          });
          this.getComment(response.data.comment_id);
        }
      }
    );
  }
  async getMyId() {
    try {
      const savedToken = await AsyncStorage.getItem("@Token:key");
      const userId = await AsyncStorage.getItem("@UserId:key");
      this.setState({
        userId: userId,
        token: savedToken
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderCommentRow(comment) {
    const time = moment(comment.createdAt).fromNow();
    return (
      <View style={styles.commentContainer}>
        <View style={{ marginLeft: "2%", marginTop: "2%" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#000000" }}>
            {comment.user.username}
          </Text>
        </View>
        <View style={{ marginLeft: "2%", marginTop: "2%", marginRight: "2%" }}>
          <Text style={{ fontSize: 15 }}>{comment.commenttext}</Text>
        </View>
        <Text style={{ fontSize: 8, marginLeft: "2%", top: "2%"}}>{time}</Text>
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
              width: "80%",
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
              width: "20%",
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
    flex: 1,
    backgroundColor: "#ffffff"
  },
  commentContainer: {
    flexDirection: "column",
    flex: 1,
    marginTop: "2.5%",
    borderBottomWidth: 0.5,
    paddingBottom: "2.5%",
    borderBottomColor: "#9999ff"
  },
  createCommentContainer: {
    height: "5%",
    flexDirection: "row"
  }
});
module.exports = Comment;
