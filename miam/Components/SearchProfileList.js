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
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import SearchProfile from "./SearchProfile";
import Battle from "./Battles/Battle";
import { getTargetUserProfile, createBattle } from "../api";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class SearchProfileList extends React.Component {
  constructor(props) {
    super(props);

    //this.nav = props.nav;

    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      profileList: ds.cloneWithRows([]),
      myId: "",
      token: ""
    };
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      var params = this.props.navigation.state.params;
      this.setState({
        profileList: ds.cloneWithRows(params.profileList),
        token: params.token,
        myId: params.myId
      });
    }
  }

  onChallenge(opponentId) {
    if (opponentId !== this.state.myId) {
      const participants = {
        participant1: this.state.myId,
        participant2: opponentId
      };
      createBattle(participants, this.state.token, (response, error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response.data.battle_id);
          this.props.navigation.navigate("BattleList", {
            battleId: response.data.battle_id
          });
        }
      });
    } else {
      alert("You cannot challenge yourself");
    }
  }

  renderProfile(profile) {
    return (
      <View style={styles.profileContainer}>
        <Text style={styles.emailText}>{profile.email}</Text>
        <TouchableHighlight
          onPress={() => this.onChallenge(profile.id)}
          style={styles.challengeButton}
        >
          <Text style={styles.challengeText}>Challenge</Text>
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

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text="MEME Battles"
          backButtonVisible={true}
          nav={this.props.navigation}
        />
        <SearchProfile />
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
  profileContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 0.9 * vw,
    height: 50,
    margin: 7,
    borderRadius: 10
  },
  emailText: {
    fontSize: 20,
    textAlign: "center"
  },
  challengeText: {
    fontSize: 20,
    textAlign: "center",
    color: "white"
  },
  challengeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#993366",
    height: 30
  },
  headingTabBar: {
    height: 40
  },
  headingText: {
    fontSize: 12
  }
});

module.exports = SearchProfileList;
