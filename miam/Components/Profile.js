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
import { ImagePicker } from "expo";

import { getUserProfile } from "../api";

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
      postDataSource: ds.cloneWithRows([]),
      loaded: false,
      userName: "Default",
      score: -1,
      followers: -1,
      following: -1,
      battlesWon: -1,
      image: null,
    };

    this.signOut = this.signOut.bind(this);
    this.onChangeProfile = this.onChangeProfile.bind(this);
  }

  componentDidMount() {
    this.getUser();
    this.setState({
      dataSource: lv.cloneWithRows(listData),
      postDataSource: ds.cloneWithRows(customData),
      loaded: true,
    });
  }

  async getUser() {
    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      getUserProfile(token, async (response, error) => {
        if (response.data) {
          this.setState({
            userName: response.data.username,
            followers: response.data.followers.length,
            following: response.data.following.length,
            score: response.data.score,
            battlesWon: response.data.battlesWon.length,
            image: response.data.profileUrl,
          });
          console.log(response.data);
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

  onAdd() {
    console.log("onAdd hasnt been finished!");
  }

  onChangeProfile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      console.log(result);
    }
  };

  onChallenge() {
    console.log("onChallenge hasnt been finished!");
  }

  setEditorRef = editor => (this.editor = editor);

  renderListView(post) {
    var message = "";

    if (post.event == "follow") {
      message = "is now following you.";
    }

    if (post.event == "challenge") {
      message = "challenged you!";
    }

    return (
      <View style={styles.singleListContainer}>
        <Image
          style={styles.audienceProfile}
          source={{ uri: post.userProfile }}
        />
        <View style={styles.audienceBox}>
          <Text style={styles.message}>
            {post.userName} {message}
          </Text>
          <Text style={styles.time}>{post.time}</Text>
        </View>
      </View>
    );
  }

  render() {
    let imageUrl = "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg";
    if (this.state.image != null) {
      imageUrl = this.state.image;
    }
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading text="MiAM Profile" />
        <View style={{ flex: 1 }}>
          <Image
            style={styles.profile}
            source={{
              uri: "http://cdn.pcwallart.com/images/sand-wallpaper-2.jpg"
            }}
          >
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.addButton}
              styleDisabled={{ color: "red" }}
              onPress={() => this.onAdd()}
            >
              Follow
            </Button>
            <View style={styles.profiles}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: imageUrl
                }}
              />
              <Button
                containerStyle={styles.profileButtonContainer}
                style={styles.profileButton}
                onPress={() => this.onChangeProfile()}
              >
                Change Profile
              </Button>
              <Text style={styles.name}> {this.state.userName} </Text>
              <Text style={styles.score}>Score: {this.state.score}</Text>
              <Text style={styles.battlewon}>
                Battle Won: {this.state.battlesWon}
              </Text>
            </View>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.messageButton}
              styleDisabled={{ color: "red" }}
              onPress={() => this.onChallenge()}
            >
              Challenge
            </Button>
          </Image>
          <View style={styles.bodyMiddle}>
            <View style={styles.box}>
              <Text style={styles.fda}>{this.state.followers}</Text>
              <Text style={styles.fda}>Followers</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.fda}>32</Text>
              <Text style={styles.fda}>Post</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.fda}>{this.state.following}</Text>
              <Text style={styles.fda}>Followering</Text>
            </View>
          </View>
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
        <Button onPress={this.signOut}>Sign Out</Button>
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
    alignItems: "center"
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
    top: 20,
    backgroundColor: "rgba(0,0,0,0)"
  },
  score: {
    color: "white",
    fontSize: 15,
    top: 15,
    backgroundColor: "rgba(0,0,0,0)"
  },
  battlewon: {
    color: "white",
    fontSize: 15,
    top: 10,
    backgroundColor: "rgba(0,0,0,0)"
  },
  bodyMiddle: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    borderColor: "#D3D3D3",
    backgroundColor: "#886BEA"
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
    width: 100,
    marginTop: 5,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  profileButton: {
    fontSize: 12,
    color: "grey"
  }
});

module.exports = Profile;
