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

export default class Feed extends React.Component {
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

  renderPostRow(post) {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeadingContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: post.userImg }}
              style={styles.userIconStyle}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 12, marginLeft: "2%", marginTop: "3%" }}>
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
            <Icon name="mode-comment" color="#cc6699" size={25} />
            <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}>
              {post.comments.length}
            </Text>
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
        <View style={styles.heading}>
          <Text style={styles.logo}>MiAM</Text>
        </View>
        <ScrollView>
          <ListView
            initialListSize={5}
            enableEmptySections={true}
            dataSource={this.state.postDataSource}
            renderRow={post => {
              return this.renderPostRow(post);
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  heading: {
    height: "10%",
    width: "100%",
    backgroundColor: "#886BEA",
    justifyContent: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 40,
    textAlign: "center"
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
});

module.exports = Feed;
