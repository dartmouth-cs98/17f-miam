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
import { ImagePicker, LinearGradient } from "expo";

import { getUserProfile, getTargetUserProfile, getUserProfileFromID } from "../api";
import { uploadProfile, uploadBackground, followUser, unFollowUser, uploadImage } from "../api";

var customData = require("../data/customData.json");
var listData = require("../data/listData.json");

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const lv = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const vw = Dimensions.get("window").width;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: lv.cloneWithRows(["row 1", "row 2"]),
      loaded: false,
      userId: "",
      userName: "Default",
      score: -1,
      post: [],
      followerlist: [],
      followinglist: [],
      followers: -1,
      following: -1,
      image: null,
      background: null,
      self: true,
      observer: "",
      observerFollowingList: [],
      followed: false,
      tab: "follower",
    };

    this.signOut = this.signOut.bind(this);
    this.onChangeProfile = this.onChangeProfile.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params){
      let username = this.props.navigation.state.params.username;
      let userId = this.props.navigation.state.params.userId || null;

      this.getTargetUser(username);
      this.setState({
        userName: username,
        userId: userId,
        self: false,
      });
      this.getObserver(username);
    } else {
      this.getUser();
    }

    this.setState({
      dataSource: lv.cloneWithRows(this.state.followerlist),
      loaded: true,
    });
  }

  async getUser() {
    try {
      const token = await AsyncStorage.getItem("@Token:key");
      getUserProfile(token, async (response, error) => {
        if (response.data) {
          this.setState({
            userName: response.data.username,
            followerlist: response.data.followers,
            followers: response.data.followers.length,
            followinglist: response.data.following,
            following: response.data.following.length,
            score: response.data.score,
            image: response.data.profilePic,
            background: response.data.backgroundPic,
            observer: response.data.username,
          });
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getObserver(username) {
    try {
      const token = await AsyncStorage.getItem("@Token:key");
      getUserProfile(token, async (response, error) => {
        if (response.data) {
          this.setState({
            observer: response.data.username,
            observerFollowingList: response.data.following,
          });

          let followlist = this.state.observerFollowingList;
          var that = this;

          if (this.state.observer == username){
            that.setState({
              self: true,
            });
          }

          if (followlist !== null){
            followlist.forEach(function(element) {
              if (element.username == username){
                that.setState({
                  followed: true,
                });
              }
            });
          }
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getTargetUser(username) {
    try {
      getTargetUserProfile(username, async (response, error) => {
        if (response.data) {
          this.setState({
            userName: response.data[0].username,
            followerlist: response.data[0].followers,
            followers: response.data[0].followers ? response.data[0].followers.length : 0,
            followinglist: response.data[0].following,
            following: response.data[0].following ? response.data[0].following.length : 0,
            score: response.data[0].score,
            image: response.data[0].profilePic,
            background: response.data[0].backgroundPic,
          });
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async signOut() {
    try {
      await AsyncStorage.removeItem("@Token:key");
      await AsyncStorage.removeItem("@UserId:key");
      console.log("Successfully log out");
      this.props.navigation.navigate("LogIn");
    } catch (error) {
      console.log(`Cannot log out. ${error}`);
    }
  }
  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas();
    }
  };

  onFollowUser = async () => {
    let myUsername = this.state.observer;
    let targetUserId = this.props.navigation.state.params.userId;

    const token = await AsyncStorage.getItem("@Token:key");

    let before = this.state.followers;
    this.setState({ followers: before+1 });

    followUser(
      targetUserId,
      token,
      (response, error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Successfully follow user.");
        }
      }
    );
    this.setState({ followed: true });
  };

  onUnfollowUser = async () => {
    let myUsername = this.state.observer;
    let targetUserId = this.props.navigation.state.params.userId;
    const token = await AsyncStorage.getItem("@Token:key");

    let before = this.state.followers;
    this.setState({ followers: before-1 });
    unFollowUser(
      targetUserId,
      token,
      (response, error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Successfully unfollow user.");
        }
      }
    );

    this.setState({ followed: false });
  }

  onChangeProfile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      if (result.uri !== null) {
        pseudoRandomFileName =
          Math.random()
            .toString(36)
            .substr(2) +
          Math.random()
            .toString(36)
            .substr(2);
        typeExtension = result.uri.substr(result.uri.length - 3);

        const file = {
          uri: result.uri,
          name: pseudoRandomFileName + "." + typeExtension,
          type: "image/" + typeExtension
        };

        let remoteUrl = result.uri;
        const token = await AsyncStorage.getItem("@Token:key");

        var that = this;

        uploadImage(file)
          .then(function(datum) {
            that.setState({ image: datum.url });
            uploadProfile(
              datum.url,
              token,
              (response, error) => {
                if (error) {
                  console.log(error);
                }
              }
            );
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  };

  onChangeBackground = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      if (result.uri !== null) {
        pseudoRandomFileName =
          Math.random()
            .toString(36)
            .substr(2) +
          Math.random()
            .toString(36)
            .substr(2);
        typeExtension = result.uri.substr(result.uri.length - 3);

        const file = {
          uri: result.uri,
          name: pseudoRandomFileName + "." + typeExtension,
          type: "image/" + typeExtension
        };

        let remoteUrl = result.uri;
        const token = await AsyncStorage.getItem("@Token:key");

        var that = this;

        uploadImage(file)
          .then(function(datum) {
            that.setState({ background: datum.url });
            uploadBackground(
              datum.url,
              token,
              (response, error) => {
                if (error) {
                  console.log(error);
                }
              }
            );
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  };

  onPressFollowerTab = () => {
    this.setState({
      tab: "follower",
      dataSource: lv.cloneWithRows(this.state.followerlist),
    });
  };

  onPressFollowingTab = () => {
    this.setState({
      tab: "following",
      dataSource: lv.cloneWithRows(this.state.followinglist),
    });
  };

  setEditorRef = editor => (this.editor = editor);

  async signOut() {
    try {
      await AsyncStorage.removeItem("@Token:key");
      await AsyncStorage.removeItem("@UserId:key");
      console.log("Successfully log out");
      this.props.navigation.navigate("LogIn");
    } catch (error) {
      console.log(`Cannot log out. ${error}`);
    }
  }

  renderListView(post) {
    return (
      <View style={styles.singleListContainer}>
        <Image
          style={styles.audienceProfile}
          source={{ uri: post.profilePic }}
        />
        <View style={styles.audienceBox}>
          <Text style={styles.message}>
            {post.username}
          </Text>
        </View>
      </View>
    );

  }

  render() {
    let imageUrl = "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg";
    let backgroundUrl = "http://cdn.pcwallart.com/images/sand-wallpaper-2.jpg";
    if (this.state.image != null) {
      imageUrl = this.state.image;
    }
    if (this.state.background != null) {
      backgroundUrl = this.state.background;
    }
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM Profile" />
        <View style={{ flex: 1 }}>
          <Image
            style={styles.profile}
            source={{
              uri: backgroundUrl
            }}
          >
            <View style={styles.profiles}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: imageUrl
                }}
              />
              {!this.state.self && !this.state.followed &&
                <Button
                  containerStyle={styles.profileButtonContainer}
                  style={styles.profileButton}
                  onPress={() => this.onFollowUser()}
                >
                  Follow
                </Button>
              }
              {!this.state.self && this.state.followed &&
                <Button
                  containerStyle={styles.profileButtonContainer}
                  style={styles.profileButton}
                  onPress={() => this.onUnfollowUser()}
                >
                  Followed
                </Button>
              }
              {this.state.self &&
                <View>
                  <Button
                    containerStyle={styles.profileButtonContainer}
                    style={styles.profileButton}
                    onPress={() => this.onChangeProfile()}
                  >
                    Change Profile
                  </Button>
                  <Button
                    containerStyle={styles.profileButtonContainer}
                    style={styles.profileButton}
                    onPress={() => this.onChangeBackground()}
                  >
                    Change Background
                  </Button>
                </View>
              }
              <View
                style={styles.nameScore}
              >
                <Text style={styles.name}> {this.state.userName} </Text>
                <Text style={styles.score}>Score: {this.state.score}</Text>
              </View>
            </View>
          </Image>
          <LinearGradient
            colors={["#6a3093", "#a044ff"]}
            style={{
              height: "7%",
              width: "100%",
              backgroundColor: "transparent",
              justifyContent: "center"
            }}
          >
          <View style={styles.bodyMiddle}>
            <TouchableHighlight
              onPress={() => this.onPressFollowerTab()}
              underlayColor="transparent"
            >
              <View style={styles.box}>
                <Text style={styles.fda}>{this.state.followers}</Text>
                <Text style={styles.fda}>Followers</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.onPressFollowingTab()}
              underlayColor="transparent"
            >
              <View style={styles.box}>
                <Text style={styles.fda}>{this.state.following}</Text>
                <Text style={styles.fda}>Following</Text>
              </View>
            </TouchableHighlight>
          </View>
          </LinearGradient>
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
        {this.state.self &&
          <View style={styles.signout}>
            <Button
              onPress={this.signOut}
              style={styles.signoutButton}
            >
              Sign Out
            </Button>
            <TouchableHighlight
              onPress={this.signOut}
              underlayColor="#ffffff"
            >
              <Icon name="exit-to-app" color="grey" size={25} />
            </TouchableHighlight>
          </View>
        }
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
  profile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 200
  },
  buttonContainer: {
    height: 20,
    width: 70,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  addButton: {
    fontSize: 20,
    color: "grey"
  },
  messageButton: {
    fontSize: 20,
    color: "grey"
  },
  profiles: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10%",
    paddingBottom: "5%",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginHorizontal: 20
  },
  name: {
    color: "white",
    fontSize: 25,
    top: 10,
    backgroundColor: "rgba(0,0,0,0)"
  },
  score: {
    color: "white",
    fontSize: 15,
    top: 7,
    marginTop: 4,
    backgroundColor: "rgba(0,0,0,0)"
  },
  battlewon: {
    color: "white",
    fontSize: 15,
    top: 10,
    backgroundColor: "rgba(0,0,0,0)"
  },
  bodyMiddle: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderColor: "#D3D3D3",
    marginHorizontal: 20
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
    fontSize: 10,
    color: "grey"
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  },
  audienceBox: {
    justifyContent: "space-around"
  },
  fda: {
    color: "#ffffff"
  },
  profileButtonContainer: {
    height: 20,
    width: 120,
    marginTop: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  profileButton: {
    fontSize: 12,
    color: "grey"
  },
  signout: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 3,
  },
  signoutButton: {
    paddingRight: 2,
    color: "grey"
  },
  nameScore: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }
});

module.exports = Profile;
