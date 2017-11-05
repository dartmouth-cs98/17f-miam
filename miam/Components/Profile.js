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
var customData = require("../data/customData.json");
var listData = require("../data/listData.json");

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const lv = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const vw = Dimensions.get("window").width;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: lv.cloneWithRows(['row 1', 'row 2']),
      postDataSource: ds.cloneWithRows([]),
      loaded: false,
    };

    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    this.setState({
      dataSource: lv.cloneWithRows(listData),
      postDataSource: ds.cloneWithRows(customData),
      loaded: true,
    });
  }
  async signOut(){
    try {
      await AsyncStorage.removeItem('@Token:key');
      await AsyncStorage.removeItem('@UserId:key');
      console.log('Successfully log out');
      this.props.navigation.navigate('LogIn');
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

  setEditorRef = editor => (this.editor = editor);

  renderListView(post) {
    var message = "";

    if (post.event == "follow"){
      message = "is now following you.";
    }

    if (post.event == "challenge"){
      message = "challenged you!";
    }

    return (
      <View style={styles.singleListContainer}>
        <Image
          style={styles.audienceProfile}
          source={{uri: post.userProfile}}
        />
        <View style={styles.audienceBox}>
          <Text style={styles.message}>
            {post.userName} {message}
          </Text>
          <Text style={styles.time}>
            {post.time}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor/>
        <Heading text="MiAM Profile"/>
        <View style={{flex: 1}}>
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
              +
            </Button>
            <View style={styles.profiles}>
              <Image
                style={styles.profilePicture}
                source={{
                  uri: "http://qimg.hxnews.com/2017/0912/1505204920938.jpg"
                }}
              />
              <Text style={styles.name}>Jasper Chan</Text>
              <Text style={styles.score}>Score: 537</Text>
              <Text style={styles.battlewon}>Battle Won: 6</Text>
            </View>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.messageButton}
              styleDisabled={{ color: "red" }}
              onPress={() => this.onMessage()}
            >
              M
            </Button>
          </Image>
          <View style={styles.bodyMiddle}>
            <View style={styles.box}>
              <Text style={styles.fda}>120</Text>
              <Text style={styles.fda}>Followers</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.fda}>32</Text>
              <Text style={styles.fda}>Post</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.fda}>1</Text>
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
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </View>
        <Button
          onPress={this.signOut}
        >
          Sign Out
        </Button>
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 200,
  },
  buttonContainer: {
    height: 35,
    width: 35,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "white"
  },
  addButton: {
    fontSize: 30,
    color: "black"
  },
  messageButton: {
    fontSize: 30,
    color: "black"
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
    borderColor: "#D3D3D3"
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderColor:'#D3D3D3',
    marginHorizontal: 20,
  },
  listviewcontainer: {
    flex: 2,
    padding: 12,
    flexDirection: 'column',
    height: 200,
  },
  singleListContainer: {
    flexDirection: 'row',
    marginTop: 3,
    height: 40,
  },
  audienceProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  message: {
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    color: "grey",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  audienceBox: {
    justifyContent: 'space-around',
  }
});

module.exports = Profile;
