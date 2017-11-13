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

import { getUserProfile } from '../api';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;


export default class SearchProfile extends React.Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})

    this.state = {
      isLoading: true,
      empty: false,
      rawData: {},
      note: '',
      error: '',
      text: '',
    }
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.state.text === '') {
      this.fetchData();
    }
  }

  componentWillMount() {

  }

  async getUser() {
    console.log(this.state.text);

    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      if (token && userId === null) {
        getUserProfile(token, async (response, error) => {
          if (response.data) {
              console.log(response.data);
          } else {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  fetchData() {
    if (this.state.text == "") {
      alert("Please enter userID that you want to search for.");
      return;
    }

    // getUserProfile(this.state.text, (response, error) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     this.saveSignUp(response.data.token);
    //   }
    // });

    // getUserProfile(this.state.text, (response, error) => {
    //   if (error) {
    //     console.log("0");
    //     console.log(error);
    //     this.setState({
    //       empty: true,
    //       isLoading: false,
    //     });
    //   } else {
    //     console.log("1");
    //     console.log(response);
    //     this.setState({
    //       dataSource: this.ds.cloneWithRows(data),
    //       isLoading: false,
    //       empty: false,
    //       rawData: data,
    //     });
    //   }
    // });
  }

  filterText(searchText, notes) {
    let text = searchText.toLowerCase();
    return filter(notes, (n) => {
      let note = n.body.toLowerCase();
      return note.search(text) !== -1;
    });
  }


  render() {
    return (
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          //onChange={this.setSearchText.bind(this)}
          onChangeText={text => this.setState({ text })}
          placeholder="Search"
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
    height: "5%",
    paddingTop: "1%",
    flexDirection: "row"
  },
  searchBar: {
    borderWidth: 3,
    width: "85%",
    backgroundColor: "#f2d9e6",
    borderColor: "#d279a6"
  },
  searchBarButton: {
    backgroundColor: "#993366",
    height: "100%",
    width: "15%",
    justifyContent: "center"
  },
});

module.exports = SearchProfile;
