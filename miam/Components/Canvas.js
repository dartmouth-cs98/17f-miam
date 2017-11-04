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
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
const apiUrl = "http://api.giphy.com/v1/gifs/search?";
const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";
const limit = "10";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: ""
    };
    this.fetchData = this.fetchData.bind(this);
    this.selectMeme = this.selectMeme.bind(this);
  }
  fetchData(offset = 0) {
    if (this.state.text === "") {
      return;
    }
    var query =
      apiUrl +
      "q=" +
      this.state.text +
      "&api_key=" +
      apiKey +
      "&limit=" +
      limit;
    return fetch(query)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.data.length === 0) {
        }
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.data)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    return fetch(
      "http://api.giphy.com/v1/gifs/search?q=cat&api_key=7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx&limit=20"
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.data)
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  selectMeme(url) {}
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View>
        <StatusBarColor />
        <Heading text="Miam Canvas" />
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            onChangeText={text => this.setState({ text })}
            placeholder="Search Memes"
            value={this.state.text}
            onSubmitEditing={this.fetch}
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
        <View>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={rowData => (
              <TouchableHighlight
                onPress={this.selectMeme(rowData.images.original.url)}
              >
                <View style={styles.memeContainer}>
                  <Image
                    source={{ uri: rowData.images.original.url }}
                    style={styles.memeStyle}
                    resizeMode="contain"
                  />
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  memeStyle: {
    width: 300,
    height: 200
  },
  searchBarContainer: {
    height: "5%",
    paddingTop: "1%",
    flexDirection: "row"
  },
  heading: {
    height: "8%",
    width: "100%",
    backgroundColor: "#bf80ff",
    justifyContent: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 40,
    textAlign: "center"
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
  memeContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#d699ff",
    alignItems: "center",
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});
module.exports = Canvas;
