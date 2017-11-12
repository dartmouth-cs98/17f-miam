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
  TextInput
} from "react-native";

import { getUserProfile } from '../api';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;


export default class SearchProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: "",
      empty: true,
      isLoading: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    if (this.state.text == "") {
      return;
    }

    getUserProfile(this.state.text, (response, error) => {
      if (error) {
        console.log(error);
        this.setState({
          empty: true,
          isLoading: false,
        });
      } else {
        console.log(response);
        this.setState({
          dataSource: this.ds.cloneWithRows(data),
          isLoading: false,
          empty: false,
          rawData: data,
        });
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  setSearchText(e) {
    let text = e.nativeEvent.text;
    this.setState({text});

    // base.fetch('notes', {
    //   context: this,
    //   asArray: true,
    //   then(data){
    //     let filteredData = this.filterNotes(text, data);
    //     this.setState({
    //       dataSource: this.ds.cloneWithRows(filteredData),
    //       rawData: data,
    //     });
    //   }
    // });
  }

  filterNotes(searchText, notes) {
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
