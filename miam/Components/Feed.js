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
  AsyncStorage,
  TextInput
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "./StatusBarColor";
import SearchProfile from "./SearchProfile";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import { fetchPosts, getUserProfile, likePost } from "../api";
import ViewShot from "react-native-view-shot";
import Meme from "./Meme";
import moment from "moment";
var customData = require("../data/customData.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postDataSource: ds.cloneWithRows([]),
      loaded: false,
      headingTabSelected: "new",
      token: ""
    };
    this.nav = props.nav;
    this.like = this.like.bind(this);
    this.setUserId = this.setUserId.bind(this);
  }

  componentDidMount() {
    fetchPosts((response, error) => {
      if (error) {
        alert(error);
      } else {
        if (response.data) {
          this.setState({
            data: response.data,
            postDataSource: ds.cloneWithRows(response.data),
            loaded: true
          });
        }
      }
    });
    this.setUserId();
  }

  async setUserId() {
    try {
      const userId = await AsyncStorage.getItem('@UserId:key');
      const token = await AsyncStorage.getItem('@Token:key');
      if (token && userId === null){
        getUserProfile(token, async (response, error) => {
          if (response.data) {
            try {
              await AsyncStorage.setItem('@UserId:key', response.data.id);
              console.log('Successfully saved user id');
            } catch (error) {
              console.log(`Cannot save userId. ${error}`);
            }
          } else {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  sortPostByNewest(array, key) {
    return array.sort(function(a, b) {
      return b.tempTime < a.tempTime ? 1 : b.tempTime > a.tempTime ? -1 : 0;
    });
  }

  sortPostByHottest(array, key) {
    return array.sort(function(a, b) {
      return b.likes < a.likes ? -1 : b.likes > a.likes ? 1 : 0;
    });
  }

  newHeadingTabPress() {
    sortedPosts = this.sortPostByNewest(this.state.data, "ignore this for now");
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "new"
    });
  }

  hotHeadingTabPress() {
    sortedPosts = this.sortPostByHottest(
      this.state.data,
      "ignore this for now"
    );
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "hot"
    });
  }
  like(postID) {
    likePost(postID, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        alert("succeeded");
      }
    });
  }
  renderHeadingTabs() {
    return (
      <View style={styles.headingTabBar}>
        <TouchableHighlight
          onPress={this.newHeadingTabPress.bind(this)}
          style={[
            styles.headingTabButton,
            this.state.headingTabSelected == "new" &&
              styles.activeHeadingTabView
          ]}
          underlayColor="white"
        >
          <Text
            style={[
              styles.headingTabText,
              this.state.headingTabSelected == "new" &&
                styles.activeHeadingTabText
            ]}
          >
            NEW
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.hotHeadingTabPress.bind(this)}
          style={[
            styles.headingTabButton,
            this.state.headingTabSelected == "hot" &&
              styles.activeHeadingTabView
          ]}
          underlayColor="white"
        >
          <Text
            style={[
              styles.headingTabText,
              this.state.headingTabSelected == "hot" &&
                styles.activeHeadingTabText
            ]}
          >
            HOT
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderPostRow(post) {
    var tempUsrImg =
      "https://dummyimage.com/70x70/886BEA/FFF.png&text=" +
      post.user.username.charAt(0);
    const time = moment(post.createdAt).fromNow();

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeadingContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: tempUsrImg }}
              style={styles.userIconStyle}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: "2%",
                marginTop: "3%"
              }}
            >
              {post.user.username}
            </Text>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text style={{ fontSize: 8 }}>{time}</Text>
          </View>
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postContentContainer}>
          <Text style={{ fontSize: 12, marginLeft: "2%", marginTop: "3%" }}>
            {post.hashtags}
          </Text>
          <Meme imgURL={post.meme.imgURL} text={post.meme.text} />
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postFooterContainer}>
          <View style={styles.postFooterIconContainer}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => this.like(post._id)}
            >
              <Icon name="favorite-border" color="#cc6699" size={25} />
            </TouchableHighlight>
            <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}>
              {post.likes.length}
            </Text>
          </View>
          <View style={styles.postFooterIconContainer}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() =>
                this.props.navigation.navigate("Comment", {
                  postID: post._id,
                  comments: post.comments
                })}
            >
              <Icon name="mode-comment" color="#cc6699" size={25} />
            </TouchableHighlight>
            <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}>
              {post.comments.length}
            </Text>
          </View>
          <View>
            <TouchableHighlight
              underlayColor="white"
              onPress={() =>
                this.props.navigation.navigate("Canvas", {
                  imgURL: post.meme.imgURL
                })}
            >
              <Icon name="subdirectory-arrow-right" color="#cc6699" size={25} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM" />
        <ListView
          initialListSize={5}
          enableEmptySections={true}
          dataSource={this.state.postDataSource}
          contentContainerStyle={styles.listView}
          renderHeader={() => this.renderHeadingTabs()}
          renderRow={post => {
            return this.renderPostRow(post);
          }}
        />
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
  headingTabBar: {
    width: "50%",
    height: 28,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    margin: "3%"
  },
  headingTabButton: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  headingTabText: {
    height: "100%",
    alignSelf: "center",
    fontWeight: "bold",
    backgroundColor: "#00000000",
    top: "18%"
  },
  activeHeadingTabView: {
    backgroundColor: "#886BEA"
  },
  activeHeadingTabText: {
    color: "white"
  },
  listView: {
    alignItems: "center"
  },
  postContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    flexDirection: "column",
    width: 0.9 * vw,
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  postHeadingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: "1%"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userIconStyle: {
    borderRadius: 15,
    width: 30,
    height: 30,
    marginLeft: "2%"
  },
  postFooterContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ecc6ec"
  },
  postFooterIconContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

module.exports = Feed;
