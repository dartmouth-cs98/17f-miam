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
  TextInput,
  Alert
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "./StatusBarColor";
import SearchProfile from "./SearchProfile";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import {
  fetchPosts,
  getUserProfile,
  likePost,
  getTargetUserProfile,
  saveExistingMeme,
  deletePost
} from "../api";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
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
      data: null,
      postDataSource: ds.cloneWithRows([]),
      loaded: false,
      headingTabSelected: "new",
      token: "",
      userId: "",
      username: "",
      key: 1,
      lastFeedAction: ""
    };
    this.nav = props.nav;
    this.like = this.like.bind(this);
    this.save = this.save.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.popUpMenuAction = this.popUpMenuAction.bind(this);
    this.popUpMenuDeletePost = this.popUpMenuDeletePost.bind(this);
  }

  componentDidMount() {
    fetchPosts((response, error) => {
      if (error) {
        alert(error);
      } else {
        if (response.data) {
          sortedData = this.sortPostByNewest(response.data);
          this.setState({
            data: sortedData,
            postDataSource: ds.cloneWithRows(sortedData),
            loaded: true
          });
        }
      }
    });
    this.setUserId();
  }

  async setUserId() {
    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      const username = await AsyncStorage.getItem("@Username:key");
      this.setState({
        userId: userId,
        token: token,
        username: username
      });
      if ((token && userId && username) === null) {
        getUserProfile(token, async (response, error) => {
          if (response.data) {
            try {
              await AsyncStorage.setItem("@UserId:key", response.data.id);
              await AsyncStorage.setItem("@Username:key", response.data.username);
              this.setState({ userId: response.data.id, username: response.data.username });
              console.log("Successfully saved user id");
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
      return moment(b.createdAt).valueOf() < moment(a.createdAt).valueOf()
        ? -1
        : moment(b.createdAt).valueOf() > moment(a.createdAt).valueOf() ? 1 : 0;
    });
  }

  sortPostByHottest(array, key) {
    return array.sort(function(a, b) {
      return b.likes.length < a.likes.length
        ? -1
        : b.likes.length > a.likes.length ? 1 : 0;
    });
  }

  newHeadingTabPress() {
    sortedPosts = this.sortPostByNewest(this.state.data, "ignore this for now");
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "new",
      lastFeedAction: "sort"
    });
  }

  hotHeadingTabPress() {
    sortedPosts = this.sortPostByHottest(
      this.state.data,
      "ignore this for now"
    );
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "hot",
      lastFeedAction: "sort"
    });
  }

  save(memeId) {
    saveExistingMeme(memeId, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        alert("You have successfully saved this meme!");
      }
    });
  }

  like(postID, action) {
    this.setState({ lastFeedAction: "like" });
    likePost(postID, action, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        // Re-fetching posts
        fetchPosts((response, error) => {
          if (error) {
            alert(error);
          } else {
            if (response.data) {
              var sortedData =
                this.state.headingTabSelected == "new"
                  ? this.sortPostByNewest(response.data)
                  : this.sortPostByHottest(response.data);

              this.setState({
                data: sortedData,
                postDataSource: ds.cloneWithRows(sortedData),
                loaded: true
              });
            }
          }
        });
      }
    });
  }

  popUpMenuAction(action, postID, memeID){
    if(action == "save")
      this.save(memeID);
    else if(action == "flag"){
      Alert.alert(
        'FLAGGING POST',
        'Are you sure you want to flag this post?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: () => alert("This post has been flagged.")},
        ],
        { cancelable: false }
      );
    }
    else if(action == "delete"){
      Alert.alert(
        'DELETING MEME',
        'Are you sure you want to delete this post?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: () => this.popUpMenuDeletePost(postID)}
        ],
        { cancelable: false }
      );
    }
  }

  popUpMenuDeletePost(postID){
    this.setState({ lastFeedAction: "delete" });
    deletePost(postID, this.state.token, (response, error) => {
      if (error)
        alert(error);
      else {
        alert("Post deleted successfully!");

        // Re-fetching posts
        fetchPosts((response, error) => {
          if (error) {
            alert(error);
          } else {
            if (response.data) {
              var sortedData =
                this.state.headingTabSelected == "new"
                  ? this.sortPostByNewest(response.data)
                  : this.sortPostByHottest(response.data);

              this.setState({
                data: sortedData,
                postDataSource: ds.cloneWithRows(sortedData),
                loaded: true
              });
            }
          }
        });
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
    var userId = post.user._id;
    var username = post.anon ? "Anonymous" : post.user.username;

    var tempUsrImg =
      "https://dummyimage.com/70x70/886BEA/FFF.png&text=" + username.charAt(0);
    const time = moment(post.createdAt).fromNow();

    const likeButton = (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.like(post._id, "like")}
      >
        <Icon name="favorite-border" color="#cc6699" size={25} />
      </TouchableHighlight>
    );
    const unlikeButton = (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.like(post._id, "unlike")}
      >
        <Icon name="favorite" color="#cc6699" size={25} />
      </TouchableHighlight>
    );
    var id = this.state.userId;
    var postLiked = post.likes.some(function(likeId) {
      return likeId === id;
    });

    var menuOptionArr = [
      <MenuOption key={1} value={"save"}>
        <View style={styles.popUpMenuButton}>
          <Icon name="save" color="#6a3093" size={18}/>
          <Text style={styles.popUpMenuText}> Save Meme </Text>
        </View>
      </MenuOption>,
      <MenuOption key={2} value={"flag"}>
        <View style={styles.popUpMenuButton}>
          <Icon name="flag" color="#6a3093" size={18}/>
          <Text style={styles.popUpMenuText}> Flag Post </Text>
        </View>
      </MenuOption>
    ];

    if(this.state.username == post.user.username){
      menuOptionArr.push(
        <MenuOption key={3} value={"delete"} style={{backgroundColor: "#FF0000"}}>
          <View style={styles.popUpMenuButton}>
            <Icon name="delete" color="#FFFFFF" size={18}/>
            <Text style={[styles.popUpMenuText, {color: "#FFFFFF"}]}> Delete Post </Text>
          </View>
        </MenuOption>
      );
    }

    let meme = (
      <Meme
        imgURL={post.meme.imgURL}
        text={post.posttext}
        layers={post.meme.layers}
        lastFeedAction={this.state.lastFeedAction}
      />
    );

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeadingContainer}>
          {post.anon ? (
            <View style={styles.iconContainer}>
              <TouchableHighlight>
                <Image
                  source={{ uri: tempUsrImg }}
                  style={styles.userIconStyle}
                  resizeMode="contain"
                />
              </TouchableHighlight>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 5,
                  marginTop: 6,
                  color: "#333342"
                }}
              >
                {username}
              </Text>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    userId: userId,
                    username: username
                  })}
              >
                <Image
                  source={{ uri: tempUsrImg }}
                  style={styles.userIconStyle}
                  resizeMode="contain"
                />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    userId: userId,
                    username: username
                  })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginLeft: 5,
                    marginTop: 6,
                    color: "#333342"
                  }}
                >
                  {username}
                </Text>
              </TouchableHighlight>
            </View>
          )}

          <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
            <Text style={{ fontSize: 9, alignSelf: "flex-end" }}>{time}</Text>

            <Menu onSelect={(value) => this.popUpMenuAction(value, post._id, post.meme._id)}>
              <MenuTrigger>
                <Icon style={{ paddingHorizontal: 5, marginBottom: 2 }} name="more-vert" color="#cc6699" size={25}/>
              </MenuTrigger>
              <MenuOptions>
                {menuOptionArr}
              </MenuOptions>
            </Menu>

          </View>
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postContentContainer}>
          <Text style={{ fontSize: 12, marginLeft: "2%", marginTop: "3%" }}>
            {post.hashtags}
          </Text>
          {meme}
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postFooterContainer}>
          <View style={styles.postFooterIconContainer}>
            {postLiked ? unlikeButton : likeButton}
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
                  imgURL: post.meme.imgURL,
                  layers: post.meme.layers
                })}
            >
              <Icon name="autorenew" color="#cc6699" size={25} />
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
        <MenuProvider>
        <ListView
          key={this.state.key}
          initialListSize={5}
          enableEmptySections={true}
          dataSource={this.state.postDataSource}
          contentContainerStyle={styles.listView}
          renderHeader={() => this.renderHeadingTabs()}
          renderRow={post => {
            return this.renderPostRow(post);
          }}
        />
        </MenuProvider>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    margin: "3%"
  },
  headingTabButton: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#aaaaaa"
  },
  activeHeadingTabView: {
    borderBottomWidth: 2,
    borderBottomColor: "#a044ff"
  },
  headingTabText: {
    height: "100%",
    fontWeight: "bold",
    alignSelf: "center",
    color: "#aaaaaa",
    backgroundColor: "#00000000"
  },
  activeHeadingTabText: {
    color: "#886BEA"
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
    shadowRadius: 3,
    padding: 7
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
  },
  popUpMenuButton: {
    alignItems: "center",
    flexDirection: "row"
  },
  popUpMenuText: {
    color: "#6a3093",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    paddingLeft: 10
  },
});

module.exports = Feed;
