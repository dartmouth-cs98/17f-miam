import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions,
  AsyncStorage
} from "react-native";

import AvatarEditor from "react-avatar-editor";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import moment from "moment";

import { getUserNotification } from "../api";

var customData = require("../data/customData.json");
var listData = require("../data/listData.json");

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const lv = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const vw = Dimensions.get("window").width;

export default class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: lv.cloneWithRows(["row 1", "row 2"]),
      loaded: false,
    };
  }

  componentDidMount() {
    if (this.props.navigation.state.params){

    }

    this.setState({
      loaded: true,
    });

    this.getNotification();
  }

  async getNotification() {
    try {
      const token = await AsyncStorage.getItem("@Token:key");
      getUserNotification(token, async (response, error) => {
        if (response.data) {
          this.setState({
            dataSource: lv.cloneWithRows(response.data),
          });
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderListView(post) {
    var target = post.target != null ? post.target.username : "";
    var picture = post.target != null ? post.target.profilePic : "http://sprintresources.com/wp-content/uploads/2016/12/icon-user.png";
    var time = moment(post.createdAt).fromNow();

    var message = "";
    if (post.action == "follow") {
      message = target + " is now following you.";
    } else if (post.action == "like-post") {
      message = target + " likes your post.";
    } else if (post.action == "like-msg") {
      message = target + " likes your messages.";
    } else {
      message = "You won in the battle " + post.action;
    }

    return (
      <View style={styles.singleListContainer}>
        <Image
          style={styles.audienceProfile}
          source={{ uri: picture }}
        />
        <View style={styles.audienceBox}>
          <Text style={styles.message}>
            {message}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="Notification Center" />
        <View style={{ flex: 1 }}>
          <ListView
            style={styles.listviewcontainer}
            initialListSize={5}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={post => {
              return this.renderListView(post);
            }}
            renderSeparator={(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
          />
        </View>
        <NavigationBar navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  },
  listviewcontainer: {
    flex: 2,
    padding: 12,
    flexDirection: "column",
    height: 200
  },
  singleListContainer: {
    flexDirection: "row",
    marginTop: 3,
    height: 40
  },
  audienceProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  message: {
    fontSize: 15
  },
  time: {
    marginTop: 3,
    fontSize: 10,
    color: "grey"
  },
});

module.exports = History;
