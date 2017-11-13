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
import { fetchPosts } from "../api";
import ViewShot from "react-native-view-shot";
var customData = require("../data/customData.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: require("../data/customData.json"),
      postDataSource: ds.cloneWithRows([]),
      loaded: false,
      headingTabSelected: "new"
    };

    this.nav = props.nav;
  }

  async setUserId() {
    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      if (token && userId === null) {
        getUserProfile(token, async (response, error) => {
          if (response.data) {
            try {
              await AsyncStorage.setItem("@UserId:key", response.data.id);
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

  // componentWillMount() {
  //   fetchPosts((response, error) => {
  //     if (error) {
  //       alert(error);
  //     } else {
  //       console.log(response);
  //       this.setState({
  //         postDataSource: ds.cloneWithRows(response),
  //         loaded: true
  //       });
  //     }
  //   });
  //   this.setUserId();
  // }

  componentDidMount() {
    fetchPosts((response, error) => {
      if (error) {
        alert(error);
      } else {
        console.log("I work :)");
        // this.setState({
        //   postDataSource: ds.cloneWithRows(response),
        //   loaded: true
        // });
      }
    });
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
    sortedPosts = this.sortPostByNewest(this.state.data, "no key");
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "new"
    });
  }

  hotHeadingTabPress() {
    sortedPosts = this.sortPostByHottest(this.state.data, "no key");
    this.setState({
      postDataSource: ds.cloneWithRows(sortedPosts),
      headingTabSelected: "hot"
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
      post.userName.charAt(0);
    console.log(post);
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeadingContainer}>
          <View style={styles.iconContainer}>
            <Image
              // source={{ uri: post.meme.imgURL }}
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
              {post.userName}
            </Text>
          </View>
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postContentContainer}>
          <Text style={{ fontSize: 12, marginLeft: "2%", marginTop: "3%" }}>
            {post.hashtags}
          </Text>
          <Image
            source={{ uri: post.imgURL }}
            style={styles.memeStyle}
            resizeMode="contain"
          />
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postFooterContainer}>
          <View style={styles.postFooterIconContainer}>
            <Icon name="favorite-border" color="#cc6699" size={25} />
            <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}>
              {post.likes}
            </Text>
          </View>
          <View style={styles.postFooterIconContainer}>
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("Comment", { postId: post.id })}
            >
              <Icon name="mode-comment" color="#cc6699" size={25} />
            </TouchableHighlight>
            <Text
              style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}
            />
          </View>
          <View>
            <Icon name="subdirectory-arrow-right" color="#cc6699" size={25} />
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
    height: "3%",
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
  memeStyle: {
    width: 300,
    height: 200
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
  // searchBar: {
  //   borderWidth: 3,
  //   width: "85%",
  //   backgroundColor: "#f2d9e6",
  //   borderColor: "#d279a6"
  // },
  // searchBarContainer: {
  //   height: "5%",
  //   paddingTop: "1%",
  //   flexDirection: "row"
  // },
  // searchBarButton: {
  //   backgroundColor: "#993366",
  //   height: "100%",
  //   width: "15%",
  //   justifyContent: "center"
  // },
});

module.exports = Feed;
