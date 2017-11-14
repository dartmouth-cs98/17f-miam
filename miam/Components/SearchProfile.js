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

import { getTargetUserProfile } from "../api";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class SearchProfile extends React.Component {
  constructor(props) {
    super(props);

    this.nav = props.nav;

    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      isLoading: true,
      empty: false,
      rawData: {},
      error: "",
      text: ""
    };
    this.fetchData = this.fetchData.bind(this);
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
      getTargetUserProfile(this.state.text, token, async (response, error) => {
        if (error) {
          console.log(error);
          alert("You've encountered an error.");
        } else if (response.length == 0){
          alert("User not found.");
        } else {
          console.log(response);
          this.nav.navigate("SearchProfileList", { profileList: response, myId: this.props.myId, token: token });
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

  render() {
    return (
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          onChangeText={text => this.setState({ text })}
          placeholder="Search user to initiate a battle!"
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
            Go
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  }
});

module.exports = SearchProfile;
