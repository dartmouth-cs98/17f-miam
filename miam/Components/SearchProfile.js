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
  ActivityIndicator,
  Button,
  TextInput,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTargetUserProfile } from "../api";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class SearchProfile extends React.Component {
  constructor(props) {
    super(props);

    // this.nav = props.nav;
    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      isLoading: true,
      empty: false,
      text: "",
      profiles: [],
      profileList: ds.cloneWithRows([]),
    };
    this.fetchData = this.fetchData.bind(this);
    this.getUser = this.getUser.bind(this);
    this.filterText = this.filterText.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderHeadingTabs = this.renderHeadingTabs.bind(this);
    this.renderList = this.renderList.bind(this);
    this.onInvite = this.onInvite.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.state.text === "") {
      this.fetchData();
    }
  }

  async getUser() {
    try {
      const myId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      getTargetUserProfile(this.state.text, async (response, error) => {
        if (error) {
          console.log(error);
          alert("You've encountered an error.");
        } else if (response.data.length === 0){
          alert("User not found.");
        } else {
          console.log(response.data);
          this.setState({
            profiles: response.data,
            profileList: ds.cloneWithRows(response.data)
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchData() {
    if (this.state.text == "") {
      return;
    }

    this.getUser();
  }

  filterText(searchText, notes) {
    let text = searchText.toLowerCase();
    return filter(notes, n => {
      let note = n.body.toLowerCase();
      return note.search(text) !== -1;
    });
  }

  onInvite(userId) {

    this.props.returnToBattle();
  }

  renderProfile(profile) {
    return (
      <View style={styles.profileContainer}>
        <View>
          <Text style={styles.emailText}>{profile.username}</Text>
        </View>
        <TouchableHighlight
          onPress={() => this.onInvite(profile.id)}
          style={styles.challengeButton}
        >
          <Text style={styles.challengeText}>Invite</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderHeadingTabs() {
    return (
      <View style={styles.headingTabBar}>
        <Text style={styles.headingText}>Users We Found: </Text>
      </View>
    );
  }

  renderList() {
    if (this.state.profiles.length === 0) {
      return <View />;
    } else {
      return(
        <View>
          <ScrollView>
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.profileList}
              contentContainerStyle={styles.listView}
              renderHeader={() => this.renderHeadingTabs()}
              renderRow={profile => {
                return this.renderProfile(profile);
              }}
            />
          </ScrollView>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text={'Inviting a Friend'}
          backButtonVisible={true}
          backFunction={this.props.returnToBattle}
        />
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            onChangeText={text => this.setState({ text })}
            placeholder="Search user to invite to this battle!"
            value={this.state.text}
          />
          <TouchableHighlight
            underlayColor="#d279a6"
            style={styles.searchBarButton}
            onPress={this.fetchData}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center"
              }}
            >
              Search
            </Text>
          </TouchableHighlight>
        </View>
        {this.renderList()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  searchBarContainer: {
    height: "6%",
    paddingTop: "0.5%",
    flexDirection: "row"
  },
  searchBar: {
    borderWidth: 3,
    width: "85%",
    backgroundColor: "#f2d9e6",
    borderColor: "#d27979"
  },
  searchBarButton: {
    backgroundColor: "#993333",
    height: "100%",
    width: "15%",
    justifyContent: "center"
  },
  listView: {
    alignItems: "center"
  },
  profileContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#993366",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 0.9 * vw,
    borderRadius: 6
  },
  emailText: {
    fontSize: 20,
    textAlign: "center"
  },
  challengeText: {
    fontSize: 16,
    textAlign: "center",
    color: "white"
  },
  challengeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#993366",
    height: 30
  },
  headingTabBar: {
    marginTop: 5,
    height: 30
  },
  headingText: {
    fontSize: 25,
    fontWeight: "bold"
  }
});

module.exports = SearchProfile;
